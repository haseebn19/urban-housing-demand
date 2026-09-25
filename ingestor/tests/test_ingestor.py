"""
Unit tests for the Urban Housing Demand data ingestor.
"""

import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pymysql
import pytest

# The modules under test sit in the folder above, not in an installed package
sys.path.insert(0, str(Path(__file__).parent.parent.resolve()))

# Database() refuses to start without a password
os.environ.setdefault("DB_PASSWORD", "test_password")

from database import CONNECT_ATTEMPTS, TABLES, Database, safe_float, safe_int
from ingestor import run_ingestor


@pytest.fixture
def db():
    return Database()


class TestDatabaseUtilityMethods:
    def test_safe_int_with_valid_number(self):
        assert safe_int("123") == 123

    def test_safe_int_with_comma(self):
        assert safe_int("1,234") == 1234

    def test_safe_int_with_none(self):
        assert safe_int(None) == 0

    def test_safe_int_with_empty_string(self):
        assert safe_int("") == 0

    def test_safe_int_with_invalid_string(self):
        assert safe_int("abc") == 0

    def test_safe_float_with_valid_number(self):
        assert safe_float("123.45") == 123.45

    def test_safe_float_with_comma(self):
        assert safe_float("1,234.56") == 1234.56

    def test_safe_float_with_none(self):
        assert safe_float(None) == 0.0


class TestAPIFetching:
    @patch("database.requests.get")
    def test_fetch_data_success(self, mock_get, db):
        mock_response = MagicMock()
        mock_response.json.return_value = [
            {"Year": 2024, "Month": 1, "CMA": "Toronto", "Total_starts": 500}
        ]
        mock_response.status_code = 200
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response
        db.api_key = "test-key"

        result = db.fetch_data("housing_starts_completions")

        assert isinstance(result, list)
        assert len(result) > 0
        assert result[0]["Year"] == 2024
        assert result[0]["CMA"] == "Toronto"

    @patch("database.requests.get")
    def test_fetch_data_api_failure(self, mock_get, db):
        import requests as req

        mock_get.side_effect = req.exceptions.RequestException("API Error")
        db.api_key = "test-key"

        result = db.fetch_data("housing_starts_completions")

        assert result == []

    def test_fetch_data_no_api_key(self, db):
        db.api_key = ""
        result = db.fetch_data("housing_starts_completions")
        assert result == []


class TestDatabaseConnection:
    @patch("pymysql.connect")
    def test_connect_to_db(self, mock_connect, db):
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn

        conn = db.connect()

        assert conn == mock_conn
        mock_connect.assert_called_once()

    @patch("database.RETRY_DELAY_SECONDS", 0)
    @patch("pymysql.connect")
    def test_connect_to_db_failure(self, mock_connect, db):
        mock_connect.side_effect = pymysql.MySQLError("Connection Failed")

        with pytest.raises(pymysql.MySQLError) as exc_info:
            db.connect()

        assert "Connection Failed" in str(exc_info.value)
        assert mock_connect.call_count == CONNECT_ATTEMPTS

    @patch("pymysql.connect")
    def test_close_connection(self, mock_connect, db):
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn

        db.connect()
        db.close()

        mock_conn.close.assert_called_once()
        assert db.connection is None


class TestDataInsertion:
    @patch("pymysql.connect")
    def test_insert_housing_starts_completions(self, mock_connect, db):
        fake_data = [
            {
                "Year": 2024,
                "Month": 1,
                "CMA": "Toronto",
                "Singles_starts": 10,
                "Semis_starts": 5,
                "Row_starts": 3,
                "Apt_Other_starts": 2,
                "Total_starts": 20,
                "Singles_complete": 8,
                "Semis_complete": 4,
                "Row_complete": 2,
                "Apt_other_complete": 1,
                "Total_complete": 15,
            }
        ]

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        count = db.insert("housing_starts_completions", fake_data)

        assert mock_cursor.executemany.called
        assert mock_conn.commit.called
        assert count == 1

    @patch("pymysql.connect")
    def test_insert_filters_invalid_cities(self, mock_connect, db):
        fake_data = [
            {"Year": 2024, "Month": 1, "CMA": "Toronto", "Total_starts": 100},
            {"Year": 2024, "Month": 1, "CMA": "InvalidCity", "Total_starts": 50},
            {"Year": 2024, "Month": 1, "CMA": "Hamilton", "Total_starts": 75},
        ]

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        count = db.insert("housing_starts_completions", fake_data)

        # Should only insert Toronto and Hamilton, not InvalidCity
        assert count == 2

    @patch("pymysql.connect")
    def test_insert_empty_data(self, mock_connect, db):
        count = db.insert("housing_starts_completions", [])

        assert count == 0
        mock_connect.assert_not_called()


class TestDataRetrieval:
    @patch("pymysql.connect")
    def test_get_record_count(self, mock_connect, db):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = [{"count": 42}]
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        count = db.get_record_count("housing_starts_completions")

        assert count == 42

    def test_get_record_count_invalid_table(self, db):
        with pytest.raises(ValueError) as exc_info:
            db.get_record_count("invalid_table; DROP TABLE users;")

        assert "Invalid table name" in str(exc_info.value)

    @patch("pymysql.connect")
    def test_get_sample_reads_only_the_first_records(self, mock_connect, db):
        """The preview asks the database for a few rows instead of the whole table."""
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = [{"rec_num": 1}]
        mock_connect.return_value.cursor.return_value = mock_cursor

        assert db.get_sample("labour_market", 3) == [{"rec_num": 1}]
        mock_cursor.execute.assert_called_once_with("SELECT * FROM labour_market LIMIT %s", (3,))

    def test_get_sample_invalid_table(self, db):
        """Only known tables can be read."""
        with pytest.raises(ValueError, match="Invalid table name"):
            db.get_sample("users; DROP TABLE users", 3)


class TestIngestor:
    @patch("database.Database.fetch_data")
    @patch("database.Database.insert")
    @patch("database.Database.get_record_count")
    @patch("database.Database.close")
    def test_run_ingestor(self, mock_close, mock_count, mock_insert, mock_fetch):
        mock_fetch.return_value = [
            {"Year": 2024, "Month": 1, "CMA": "Toronto", "Total_starts": 500}
        ]
        mock_insert.return_value = 1
        mock_count.return_value = 10

        run_ingestor()

        assert mock_close.called

    @patch("database.Database.fetch_data")
    @patch("database.Database.insert")
    @patch("database.Database.close")
    def test_run_ingestor_handles_missing_table(self, mock_close, mock_insert, mock_fetch, capsys):
        """A missing table is reported, and the other tables are still processed."""
        mock_fetch.return_value = [
            {"Year": 2024, "Month": 1, "CMA": "Toronto", "Total_starts": 500}
        ]
        mock_insert.side_effect = pymysql.err.ProgrammingError(
            "Table 'template_db.test' doesn't exist"
        )

        run_ingestor()

        output = capsys.readouterr().out
        assert "Table `housing_starts_completions` does not exist" in output
        assert f"Errors encountered ({len(TABLES)})" in output
        assert mock_insert.call_count == len(TABLES)
        assert mock_close.called

    @patch("ingestor._ingest", side_effect=RuntimeError("boom"))
    @patch("database.Database.close")
    def test_run_ingestor_closes_the_connection_after_an_error(self, mock_close, mock_ingest):
        """The connection is closed even when the run stops with an error."""
        with pytest.raises(RuntimeError):
            run_ingestor()

        assert mock_ingest.called
        assert mock_close.called


class TestTableDeclarations:
    def test_upsert_quotes_columns_and_never_updates_the_key(self):
        query = TABLES["labour_market"].upsert_query()

        assert query.startswith("INSERT INTO labour_market (`rec_num`, `survyear`")
        assert "`UNION` = VALUES(`UNION`)" in query
        assert "`rec_num` = VALUES" not in query
        assert query.endswith("last_updated = CURRENT_TIMESTAMP")

    def test_monthly_tables_are_keyed_by_year_month_and_city(self):
        query = TABLES["apartment_starts"].upsert_query()

        for key in ("year", "month", "city"):
            assert f"`{key}` = VALUES" not in query
        assert "`units_200_plus` = VALUES(`units_200_plus`)" in query

    def test_field_names_with_stray_spaces_are_read(self):
        record = {"Year": "2024", " CMA": " Hamilton ", "Month": 3, "Total": "1,200"}

        values = TABLES["housing_under_construction"].row_values(record)

        assert values == (2024, 3, "Hamilton", 0, 0, 0, 0, 1200)

    def test_records_for_other_cities_are_skipped(self):
        assert TABLES["apartment_completions"].row_values({"CMA": "Ottawa"}) is None

    def test_labour_market_records_keep_every_city(self):
        values = TABLES["labour_market"].row_values({"rec_num": 7, "cma": 505, "FINALWT": "12.5"})

        assert values[0] == 7
        assert values[-1] == 12.5
