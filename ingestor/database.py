"""
Database module for Urban Housing Demand data ingestion.
Handles connections to MySQL database and data operations.
"""

from __future__ import annotations

import os
import time
from typing import Any

import pymysql
import requests


class Database:
    """Database connection and operations handler."""

    # CMA codes for filtering
    VALID_CMAS = ["Toronto", "Hamilton"]

    def __init__(self):
        """Initialize database connection settings from environment variables."""
        self.host = os.getenv("DB_HOST", "localhost")
        self.port = int(os.getenv("DB_PORT", "3306"))
        self.user = os.getenv("DB_USER", "root")
        # Password required - no insecure defaults
        self.password = os.getenv("DB_PASSWORD")
        if not self.password:
            raise ValueError("DB_PASSWORD environment variable is required")
        self.database = os.getenv("DB_DATABASE", "urban_housing_demand")
        self.connection: pymysql.Connection | None = None

        # API Config - key should be in environment variable
        self.api_key = os.getenv("API_KEY", "")
        self.api_urls = {
            "housing_starts_completions": (
                "https://cis-data-service.socs.uoguelph.ca/data/housing_starts_completions"
            ),
            "housing_under_construction": (
                "https://cis-data-service.socs.uoguelph.ca/data/housing_under_construction"
            ),
            "apartment_starts": (
                "https://cis-data-service.socs.uoguelph.ca/data/apartment_starts"
            ),
            "apartment_completions": (
                "https://cis-data-service.socs.uoguelph.ca/data/apartment_completions"
            ),
            "labour_market": (
                "https://cis-data-service.socs.uoguelph.ca/data/labour_market"
            ),
        }

        # Retry configuration
        self.max_retries = 3
        self.retry_delay = 5

    @staticmethod
    def safe_int(value: Any) -> int:
        """Convert a value to int after removing commas. Return 0 if invalid."""
        try:
            if value is None or str(value).strip() == "":
                return 0
            return int(str(value).replace(",", "").strip())
        except ValueError:
            return 0

    @staticmethod
    def safe_float(value: Any) -> float:
        """Convert a value to float after removing commas. Return 0.0 if invalid."""
        try:
            if value is None or str(value).strip() == "":
                return 0.0
            return float(str(value).replace(",", "").strip())
        except ValueError:
            return 0.0

    def connect(self) -> pymysql.Connection:
        """Establish and return a database connection with retry logic."""
        if self.connection is not None:
            try:
                self.connection.ping(reconnect=True)
                return self.connection
            except pymysql.MySQLError:
                self.connection = None

        for attempt in range(self.max_retries):
            try:
                self.connection = pymysql.connect(
                    host=self.host,
                    port=self.port,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    charset="utf8mb4",
                    cursorclass=pymysql.cursors.DictCursor,
                    connect_timeout=30
                )
                return self.connection
            except pymysql.MySQLError as e:
                if attempt < self.max_retries - 1:
                    print(
                        f"Connection attempt {attempt + 1} failed: {e}. "
                        f"Retrying in {self.retry_delay}s..."
                    )
                    time.sleep(self.retry_delay)
                else:
                    raise

    def close(self) -> None:
        """Close the database connection."""
        if self.connection is not None:
            try:
                self.connection.close()
            except pymysql.MySQLError:
                pass
            finally:
                self.connection = None

    def fetch_data(self, key: str) -> list[dict[str, Any]]:
        """Fetch data from API endpoint with error handling."""
        if not self.api_key:
            print(f"Warning: No API key configured. Skipping API fetch for {key}.")
            return []

        if key not in self.api_urls:
            print(f"Unknown data key: {key}")
            return []

        try:
            response = requests.get(
                self.api_urls[key],
                headers={"Apikey": self.api_key},
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            return data if isinstance(data, list) else []
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {key} data: {e}")
            return []

    def insert_housing_starts_completions(self, data: list[dict[str, Any]]) -> int:
        """Insert housing starts & completions data. Returns number of rows inserted."""
        if not data:
            return 0

        conn = self.connect()
        cursor = conn.cursor()
        inserted = 0

        query = """
            INSERT INTO housing_starts_completions
                (year, month, city, singles_starts, semis_starts, row_starts,
                 apt_other_starts, total_starts, singles_complete, semis_complete,
                 row_complete, apt_other_complete, total_complete)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                singles_starts = VALUES(singles_starts),
                semis_starts = VALUES(semis_starts),
                row_starts = VALUES(row_starts),
                apt_other_starts = VALUES(apt_other_starts),
                total_starts = VALUES(total_starts),
                singles_complete = VALUES(singles_complete),
                semis_complete = VALUES(semis_complete),
                row_complete = VALUES(row_complete),
                apt_other_complete = VALUES(apt_other_complete),
                total_complete = VALUES(total_complete),
                last_updated = CURRENT_TIMESTAMP
        """

        try:
            for entry in data:
                city = entry.get("CMA", "")
                if city not in self.VALID_CMAS:
                    continue

                cursor.execute(query, (
                    self.safe_int(entry.get("Year", 0)),
                    self.safe_int(entry.get("Month", 0)),
                    city,
                    self.safe_int(entry.get("Singles_starts", 0)),
                    self.safe_int(entry.get("Semis_starts", 0)),
                    self.safe_int(entry.get("Row_starts", 0)),
                    self.safe_int(entry.get("Apt_Other_starts", 0)),
                    self.safe_int(entry.get("Total_starts", 0)),
                    self.safe_int(entry.get("Singles_complete", 0)),
                    self.safe_int(entry.get("Semis_complete", 0)),
                    self.safe_int(entry.get("Row_complete", 0)),
                    self.safe_int(entry.get("Apt_other_complete", 0)),
                    self.safe_int(entry.get("Total_complete", 0))
                ))
                inserted += 1

            conn.commit()
        finally:
            cursor.close()

        return inserted

    def insert_apartment_starts(self, data: list[dict[str, Any]]) -> int:
        """Insert apartment starts data. Returns number of rows inserted."""
        if not data:
            return 0

        conn = self.connect()
        cursor = conn.cursor()
        inserted = 0

        query = """
            INSERT INTO apartment_starts (
                year, month, city, struct_15, units_15, struct_619, units_619,
                struct_2049, units_2049, struct_5099, units_5099, struct_100199,
                units_100199, struct_200_plus, units_200_plus, total_structure, total_units
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                struct_15 = VALUES(struct_15), units_15 = VALUES(units_15),
                struct_619 = VALUES(struct_619), units_619 = VALUES(units_619),
                struct_2049 = VALUES(struct_2049), units_2049 = VALUES(units_2049),
                struct_5099 = VALUES(struct_5099), units_5099 = VALUES(units_5099),
                struct_100199 = VALUES(struct_100199), units_100199 = VALUES(units_100199),
                struct_200_plus = VALUES(struct_200_plus),
                units_200_plus = VALUES(units_200_plus),
                total_structure = VALUES(total_structure), total_units = VALUES(total_units),
                last_updated = CURRENT_TIMESTAMP
        """

        try:
            for entry in data:
                city = entry.get("CMA", "")
                if city not in self.VALID_CMAS:
                    continue

                cursor.execute(query, (
                    self.safe_int(entry.get("Year", 0)),
                    self.safe_int(entry.get("Month", 0)),
                    city,
                    self.safe_int(entry.get("15 Structure", 0)),
                    self.safe_int(entry.get("15 Units", 0)),
                    self.safe_int(entry.get("619 Structure", 0)),
                    self.safe_int(entry.get("619 Units", 0)),
                    self.safe_int(entry.get("2049 Structure", 0)),
                    self.safe_int(entry.get("2049 Units", 0)),
                    self.safe_int(entry.get("5099 Structure", 0)),
                    self.safe_int(entry.get("5099 Units", 0)),
                    self.safe_int(entry.get("100199 Structure", 0)),
                    self.safe_int(entry.get("100199 Units", 0)),
                    self.safe_int(entry.get("200+ Structure", 0)),
                    self.safe_int(entry.get("200+ Units", 0)),
                    self.safe_int(entry.get("Total Structure", 0)),
                    self.safe_int(entry.get("Total Units", 0))
                ))
                inserted += 1

            conn.commit()
        finally:
            cursor.close()

        return inserted

    def insert_apartment_completions(self, data: list[dict[str, Any]]) -> int:
        """Insert apartment completions data. Returns number of rows inserted."""
        if not data:
            return 0

        conn = self.connect()
        cursor = conn.cursor()
        inserted = 0

        query = """
            INSERT INTO apartment_completions
                (year, month, city, struct_15, units_15, struct_619, units_619,
                 struct_2049, units_2049, struct_5099, units_5099, struct_100199,
                 units_100199, struct_200_plus, units_200_plus,
                 total_structure, total_units)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                struct_15 = VALUES(struct_15), units_15 = VALUES(units_15),
                struct_619 = VALUES(struct_619), units_619 = VALUES(units_619),
                struct_2049 = VALUES(struct_2049), units_2049 = VALUES(units_2049),
                struct_5099 = VALUES(struct_5099), units_5099 = VALUES(units_5099),
                struct_100199 = VALUES(struct_100199), units_100199 = VALUES(units_100199),
                struct_200_plus = VALUES(struct_200_plus),
                units_200_plus = VALUES(units_200_plus),
                total_structure = VALUES(total_structure), total_units = VALUES(total_units),
                last_updated = CURRENT_TIMESTAMP
        """

        try:
            for entry in data:
                city = entry.get("CMA", "")
                if city not in self.VALID_CMAS:
                    continue

                cursor.execute(query, (
                    self.safe_int(entry.get("Year", 0)),
                    self.safe_int(entry.get("Month", 0)),
                    city,
                    self.safe_int(entry.get("15 Structure", 0)),
                    self.safe_int(entry.get("15 Units", 0)),
                    self.safe_int(entry.get("619 Structure", 0)),
                    self.safe_int(entry.get("619 Units", 0)),
                    self.safe_int(entry.get("2049 Structure", 0)),
                    self.safe_int(entry.get("2049 Units", 0)),
                    self.safe_int(entry.get("5099 Structure", 0)),
                    self.safe_int(entry.get("5099 Units", 0)),
                    self.safe_int(entry.get("100199 Structure", 0)),
                    self.safe_int(entry.get("100199 Units", 0)),
                    self.safe_int(entry.get("200+ Structure", 0)),
                    self.safe_int(entry.get("200+ Units", 0)),
                    self.safe_int(entry.get("Total Structure", 0)),
                    self.safe_int(entry.get("Total Units", 0))
                ))
                inserted += 1

            conn.commit()
        finally:
            cursor.close()

        return inserted

    def insert_housing_under_construction(self, data: list[dict[str, Any]]) -> int:
        """Insert housing under construction data. Returns number of rows inserted."""
        if not data:
            return 0

        conn = self.connect()
        cursor = conn.cursor()
        inserted = 0

        query = """
            INSERT INTO housing_under_construction
                (year, month, city, singles_starts, semis_starts, row_starts,
                 apt_other_starts, total_starts)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                singles_starts = VALUES(singles_starts),
                semis_starts = VALUES(semis_starts),
                row_starts = VALUES(row_starts),
                apt_other_starts = VALUES(apt_other_starts),
                total_starts = VALUES(total_starts),
                last_updated = CURRENT_TIMESTAMP
        """

        try:
            for entry in data:
                # Handle potential whitespace in key names
                city = entry.get("CMA", entry.get(" CMA", "")).strip()
                if city not in self.VALID_CMAS:
                    continue

                cursor.execute(query, (
                    self.safe_int(entry.get("Year", 0)),
                    self.safe_int(entry.get("Month", 0)),
                    city,
                    self.safe_int(entry.get("Singles", 0)),
                    self.safe_int(entry.get("Semis", 0)),
                    self.safe_int(entry.get("Row", 0)),
                    self.safe_int(entry.get("Apt. and Other", 0)),
                    self.safe_int(entry.get("Total", 0))
                ))
                inserted += 1

            conn.commit()
        finally:
            cursor.close()

        return inserted

    def insert_labour_market(self, data: list[dict[str, Any]]) -> int:
        """Insert labour market data. Returns number of rows inserted."""
        if not data:
            return 0

        conn = self.connect()
        cursor = conn.cursor()
        inserted = 0

        query = """
            INSERT INTO labour_market (
                rec_num, survyear, survmnth, lfsstat, prov, cma, age_12, age_6,
                sex, marstat, educ, mjh, everwork, ftptlast, cowmain, immig,
                NAICS_21, NOC_10, NOC_43, HRLYEARN, `UNION`, PERMTEMP, ESTSIZE,
                FIRMSIZE, DURUNEMP, FLOWUNEM, SCHOOLN, EFAMTYPE, FINALWT
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            ON DUPLICATE KEY UPDATE
                survyear = VALUES(survyear),
                survmnth = VALUES(survmnth),
                lfsstat = VALUES(lfsstat),
                prov = VALUES(prov),
                cma = VALUES(cma),
                age_12 = VALUES(age_12),
                age_6 = VALUES(age_6),
                sex = VALUES(sex),
                marstat = VALUES(marstat),
                educ = VALUES(educ),
                mjh = VALUES(mjh),
                everwork = VALUES(everwork),
                ftptlast = VALUES(ftptlast),
                cowmain = VALUES(cowmain),
                immig = VALUES(immig),
                NAICS_21 = VALUES(NAICS_21),
                NOC_10 = VALUES(NOC_10),
                NOC_43 = VALUES(NOC_43),
                HRLYEARN = VALUES(HRLYEARN),
                `UNION` = VALUES(`UNION`),
                PERMTEMP = VALUES(PERMTEMP),
                ESTSIZE = VALUES(ESTSIZE),
                FIRMSIZE = VALUES(FIRMSIZE),
                DURUNEMP = VALUES(DURUNEMP),
                FLOWUNEM = VALUES(FLOWUNEM),
                SCHOOLN = VALUES(SCHOOLN),
                EFAMTYPE = VALUES(EFAMTYPE),
                FINALWT = VALUES(FINALWT),
                last_updated = CURRENT_TIMESTAMP
        """

        try:
            for entry in data:
                cursor.execute(query, (
                    self.safe_int(entry.get("rec_num", 0)),
                    self.safe_int(entry.get("survyear", 0)),
                    self.safe_int(entry.get("survmnth", 0)),
                    self.safe_int(entry.get("lfsstat", 0)),
                    self.safe_int(entry.get("prov", 0)),
                    self.safe_int(entry.get("cma", 0)),
                    self.safe_int(entry.get("age_12", 0)),
                    self.safe_int(entry.get("age_6", 0)),
                    self.safe_int(entry.get("sex", 0)),
                    self.safe_int(entry.get("marstat", 0)),
                    self.safe_int(entry.get("educ", 0)),
                    self.safe_int(entry.get("mjh", 0)),
                    self.safe_int(entry.get("everwork", 0)),
                    self.safe_int(entry.get("ftptlast", 0)),
                    self.safe_int(entry.get("cowmain", 0)),
                    self.safe_int(entry.get("immig", 0)),
                    self.safe_int(entry.get("NAICS_21", 0)),
                    self.safe_int(entry.get("NOC_10", 0)),
                    self.safe_int(entry.get("NOC_43", 0)),
                    self.safe_float(entry.get("HRLYEARN", 0.0)),
                    self.safe_int(entry.get("UNION", 0)),
                    self.safe_int(entry.get("PERMTEMP", 0)),
                    self.safe_int(entry.get("ESTSIZE", 0)),
                    self.safe_int(entry.get("FIRMSIZE", 0)),
                    self.safe_int(entry.get("DURUNEMP", 0)),
                    self.safe_int(entry.get("FLOWUNEM", 0)),
                    self.safe_int(entry.get("SCHOOLN", 0)),
                    self.safe_int(entry.get("EFAMTYPE", 0)),
                    self.safe_float(entry.get("FINALWT", 0.0))
                ))
                inserted += 1

            conn.commit()
        finally:
            cursor.close()

        return inserted

    def get_record_count(self, table: str) -> int:
        """Get the number of records in a table."""
        # Use parameterized approach to prevent SQL injection
        valid_tables = [
            "housing_starts_completions",
            "housing_under_construction",
            "apartment_starts",
            "apartment_completions",
            "labour_market"
        ]

        if table not in valid_tables:
            raise ValueError(f"Invalid table name: {table}")

        conn = self.connect()
        cursor = conn.cursor()

        try:
            cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
            result = cursor.fetchone()
            return result["count"] if result else 0
        finally:
            cursor.close()

    def get_all_data(self, table: str) -> list[dict[str, Any]]:
        """Retrieve all records from a table for Toronto and Hamilton."""
        # Validate table name to prevent SQL injection
        valid_tables = [
            "housing_starts_completions",
            "housing_under_construction",
            "apartment_starts",
            "apartment_completions",
            "labour_market"
        ]

        if table not in valid_tables:
            raise ValueError(f"Invalid table name: {table}")

        conn = self.connect()
        cursor = conn.cursor()

        # Use appropriate column for filtering
        if table == "labour_market":
            # Labour market uses CMA codes: 535=Toronto, 537=Hamilton
            query = f"SELECT * FROM {table} WHERE cma IN (535, 537)"
        else:
            query = f"SELECT * FROM {table} WHERE city IN ('Toronto', 'Hamilton')"

        try:
            cursor.execute(query)
            return cursor.fetchall()
        except pymysql.MySQLError as e:
            print(f"Error fetching data from {table}: {e}")
            return []
        finally:
            cursor.close()
