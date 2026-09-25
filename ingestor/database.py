"""
Database module for Urban Housing Demand data ingestion.
Describes how each dataset is stored, fetches it from the API, and writes it to MySQL.
"""

from __future__ import annotations

import os
import time
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

import pymysql
import requests

if TYPE_CHECKING:
    from collections.abc import Callable

API_BASE_URL = "https://cis-data-service.socs.uoguelph.ca/data"

# The database may still be starting when the ingestor runs
CONNECT_ATTEMPTS = 3
RETRY_DELAY_SECONDS = 5

# Only these cities are stored from the housing datasets
CITIES = ("Toronto", "Hamilton")


def safe_int(value: Any) -> int:
    """Convert a value to int after removing commas. Return 0 if invalid."""
    try:
        if value is None or str(value).strip() == "":
            return 0
        return int(str(value).replace(",", "").strip())
    except ValueError:
        return 0


def safe_float(value: Any) -> float:
    """Convert a value to float after removing commas. Return 0.0 if invalid."""
    try:
        if value is None or str(value).strip() == "":
            return 0.0
        return float(str(value).replace(",", "").strip())
    except ValueError:
        return 0.0


def safe_text(value: Any) -> str:
    """Convert a value to a string without surrounding spaces. Return "" for None."""
    return "" if value is None else str(value).strip()


@dataclass(frozen=True)
class Column:
    """A database column and the API field it is filled from."""

    name: str
    field: str
    convert: Callable[[Any], Any] = safe_int


@dataclass(frozen=True)
class Table:
    """How one API dataset is stored.

    A record whose `key` columns match an existing row updates that row's other columns. When
    `city_column` is set, only records for one of CITIES are stored.
    """

    name: str
    key: tuple[str, ...]
    columns: tuple[Column, ...]
    city_column: str | None = None

    def upsert_query(self) -> str:
        """An INSERT that updates the existing row when the key is already present."""
        # Backticks, because some survey column names, such as UNION, are SQL keywords
        quoted = [f"`{column.name}`" for column in self.columns]
        updates = [
            f"{name} = VALUES({name})"
            for name, column in zip(quoted, self.columns, strict=True)
            if column.name not in self.key
        ]
        return (
            f"INSERT INTO {self.name} ({', '.join(quoted)}) "
            f"VALUES ({', '.join(['%s'] * len(quoted))}) "
            f"ON DUPLICATE KEY UPDATE {', '.join([*updates, 'last_updated = CURRENT_TIMESTAMP'])}"
        )

    def row_values(self, record: dict[str, Any]) -> tuple[Any, ...] | None:
        """The values to store for an API record, or None if it is for another city."""
        # Some datasets have stray spaces in their field names, such as " CMA"
        fields = {key.strip(): value for key, value in record.items()}
        values = {column.name: column.convert(fields.get(column.field)) for column in self.columns}
        if self.city_column and values[self.city_column] not in CITIES:
            return None
        return tuple(values.values())


def _monthly(*columns: Column) -> tuple[Column, ...]:
    """Columns of a monthly housing dataset, which are keyed by year, month and city."""
    return (
        Column("year", "Year"),
        Column("month", "Month"),
        Column("city", "CMA", safe_text),
        *columns,
    )


_MONTHLY_KEY = ("year", "month", "city")

# Apartment starts and completions share a layout: the structures and units in buildings of
# 1 to 5 units ("15"), 6 to 19 ("619"), 20 to 49, 50 to 99, 100 to 199, and 200 or more.
# Maps each size in the API field names to the suffix of its database columns.
_APARTMENT_SIZES = {
    "15": "15",
    "619": "619",
    "2049": "2049",
    "5099": "5099",
    "100199": "100199",
    "200+": "200_plus",
}
_APARTMENT_COLUMNS = (
    *(
        column
        for size, suffix in _APARTMENT_SIZES.items()
        for column in (
            Column(f"struct_{suffix}", f"{size} Structure"),
            Column(f"units_{suffix}", f"{size} Units"),
        )
    ),
    Column("total_structure", "Total Structure"),
    Column("total_units", "Total Units"),
)

# Labour Force Survey fields are stored under their own names
_LABOUR_MARKET_COLUMNS = tuple(
    Column(name, name, safe_float if name in ("HRLYEARN", "FINALWT") else safe_int)
    for name in [
        "rec_num", "survyear", "survmnth", "lfsstat", "prov", "cma", "age_12", "age_6", "sex",
        "marstat", "educ", "mjh", "everwork", "ftptlast", "cowmain", "immig", "NAICS_21",
        "NOC_10", "NOC_43", "HRLYEARN", "UNION", "PERMTEMP", "ESTSIZE", "FIRMSIZE", "DURUNEMP",
        "FLOWUNEM", "SCHOOLN", "EFAMTYPE", "FINALWT",
    ]
)  # fmt: skip

TABLES: dict[str, Table] = {
    table.name: table
    for table in [
        Table(
            "housing_starts_completions",
            _MONTHLY_KEY,
            _monthly(
                Column("singles_starts", "Singles_starts"),
                Column("semis_starts", "Semis_starts"),
                Column("row_starts", "Row_starts"),
                Column("apt_other_starts", "Apt_Other_starts"),
                Column("total_starts", "Total_starts"),
                Column("singles_complete", "Singles_complete"),
                Column("semis_complete", "Semis_complete"),
                Column("row_complete", "Row_complete"),
                Column("apt_other_complete", "Apt_other_complete"),
                Column("total_complete", "Total_complete"),
            ),
            city_column="city",
        ),
        Table(
            "housing_under_construction",
            _MONTHLY_KEY,
            _monthly(
                Column("singles_starts", "Singles"),
                Column("semis_starts", "Semis"),
                Column("row_starts", "Row"),
                Column("apt_other_starts", "Apt. and Other"),
                Column("total_starts", "Total"),
            ),
            city_column="city",
        ),
        Table("apartment_starts", _MONTHLY_KEY, _monthly(*_APARTMENT_COLUMNS), "city"),
        Table("apartment_completions", _MONTHLY_KEY, _monthly(*_APARTMENT_COLUMNS), "city"),
        Table("labour_market", ("rec_num",), _LABOUR_MARKET_COLUMNS),
    ]
}


class Database:
    """Database connection and operations handler."""

    def __init__(self):
        """Initialize database connection settings from environment variables."""
        self.host = os.getenv("DB_HOST", "localhost")
        self.port = int(os.getenv("DB_PORT", "3306"))
        self.user = os.getenv("DB_USER", "root")
        # There is no default password, so an insecure one is never used
        self.password = os.getenv("DB_PASSWORD")
        if not self.password:
            raise ValueError("DB_PASSWORD environment variable is required")
        self.database = os.getenv("DB_DATABASE", "urban_housing_demand")
        self.connection: pymysql.Connection | None = None

        # API key for the data service; without it, the seed data in setup.sql is used
        self.api_key = os.getenv("API_KEY", "")

    def connect(self) -> pymysql.Connection:
        """Return the open connection, or connect, retrying while the database starts up."""
        if self.connection is not None:
            try:
                self.connection.ping(reconnect=True)
                return self.connection
            except pymysql.MySQLError:
                self.connection = None

        for attempt in range(1, CONNECT_ATTEMPTS):
            try:
                self.connection = self._open_connection()
                return self.connection
            except pymysql.MySQLError as e:
                print(
                    f"Connection attempt {attempt} failed: {e}. Retrying in {RETRY_DELAY_SECONDS}s..."
                )
                time.sleep(RETRY_DELAY_SECONDS)
        self.connection = self._open_connection()
        return self.connection

    def _open_connection(self) -> pymysql.Connection:
        return pymysql.connect(
            host=self.host,
            port=self.port,
            user=self.user,
            password=self.password,
            database=self.database,
            charset="utf8mb4",
            cursorclass=pymysql.cursors.DictCursor,
            connect_timeout=30,
        )

    def close(self) -> None:
        """Close the database connection."""
        if self.connection is not None:
            try:
                self.connection.close()
            except pymysql.MySQLError:
                pass
            finally:
                self.connection = None

    def fetch_data(self, table: str) -> list[dict[str, Any]]:
        """Fetch a dataset from the API. Returns [] if it cannot be fetched."""
        if not self.api_key:
            return []

        try:
            response = requests.get(
                f"{API_BASE_URL}/{table}", headers={"Apikey": self.api_key}, timeout=30
            )
            response.raise_for_status()
            data = response.json()
            return data if isinstance(data, list) else []
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {table} data: {e}")
            return []

    def insert(self, table: str, records: list[dict[str, Any]]) -> int:
        """Insert or update API records in a table. Returns the number of records stored."""
        spec = TABLES[table]
        rows = [values for record in records if (values := spec.row_values(record)) is not None]
        if not rows:
            return 0

        conn = self.connect()
        cursor = conn.cursor()
        try:
            cursor.executemany(spec.upsert_query(), rows)
            conn.commit()
        finally:
            cursor.close()
        return len(rows)

    def get_record_count(self, table: str) -> int:
        """Get the number of records in a table."""
        return self._query(table, f"SELECT COUNT(*) AS count FROM {table}")[0]["count"]

    def get_sample(self, table: str, limit: int) -> list[dict[str, Any]]:
        """The first `limit` records of a table."""
        return self._query(table, f"SELECT * FROM {table} LIMIT %s", (limit,))

    def _query(self, table: str, sql: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
        # Table names cannot be query parameters, so only known tables are allowed
        if table not in TABLES:
            raise ValueError(f"Invalid table name: {table}")

        cursor = self.connect().cursor()
        try:
            cursor.execute(sql, params)
            return list(cursor.fetchall())
        finally:
            cursor.close()
