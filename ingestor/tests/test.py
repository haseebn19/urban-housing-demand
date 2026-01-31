"""
Unit tests for the Urban Housing Demand data ingestor.
"""

import os
import sys
from unittest.mock import MagicMock, patch

import pymysql
import pytest

# Ensure the parent directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Set required environment variable for tests before importing Database
os.environ.setdefault("DB_PASSWORD", "test_password")

from database import Database
from ingestor import run_ingestor


@pytest.fixture
def db():
    """Fixture to create a Database instance for testing."""
    return Database()


class TestDatabaseUtilityMethods:
    """Tests for utility methods."""

    def test_safe_int_with_valid_number(self, db):
        """Test safe_int with a valid integer string."""
        assert db.safe_int("123") == 123

    def test_safe_int_with_comma(self, db):
        """Test safe_int handles commas in numbers."""
        assert db.safe_int("1,234") == 1234

    def test_safe_int_with_none(self, db):
        """Test safe_int returns 0 for None."""
        assert db.safe_int(None) == 0

    def test_safe_int_with_empty_string(self, db):
        """Test safe_int returns 0 for empty string."""
        assert db.safe_int("") == 0

    def test_safe_int_with_invalid_string(self, db):
        """Test safe_int returns 0 for invalid string."""
        assert db.safe_int("abc") == 0

    def test_safe_float_with_valid_number(self, db):
        """Test safe_float with a valid float string."""
        assert db.safe_float("123.45") == 123.45

    def test_safe_float_with_comma(self, db):
        """Test safe_float handles commas in numbers."""
        assert db.safe_float("1,234.56") == 1234.56

    def test_safe_float_with_none(self, db):
        """Test safe_float returns 0.0 for None."""
        assert db.safe_float(None) == 0.0


class TestAPIFetching:
    """Tests for API data fetching."""

    @patch("database.requests.get")
    def test_fetch_data_success(self, mock_get, db):
        """Test API call success with a mock response."""
        mock_response = MagicMock()
        mock_response.json.return_value = [
            {"Year": 2024, "Month": 1, "CMA": "Toronto", "Total_starts": 500}
        ]
        mock_response.status_code = 200
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        # Set API key for test
        db.api_key = "test-key"

        result = db.fetch_data("housing_starts_completions")

        assert isinstance(result, list)
        assert len(result) > 0
        assert result[0]["Year"] == 2024
        assert result[0]["CMA"] == "Toronto"

    @patch("database.requests.get")
    def test_fetch_data_api_failure(self, mock_get, db):
        """Test API call failure handling."""
        import requests as req
        mock_get.side_effect = req.exceptions.RequestException("API Error")
        db.api_key = "test-key"

        result = db.fetch_data("housing_starts_completions")

        assert result == []

    def test_fetch_data_no_api_key(self, db):
        """Test fetch_data returns empty list when no API key."""
        db.api_key = ""
        result = db.fetch_data("housing_starts_completions")
        assert result == []

    def test_fetch_data_invalid_key(self, db):
        """Test fetch_data returns empty list for unknown data key."""
        db.api_key = "test-key"
        result = db.fetch_data("invalid_table_name")
        assert result == []


class TestDatabaseConnection:
    """Tests for database connection."""

    @patch("pymysql.connect")
    def test_connect_to_db(self, mock_connect, db):
        """Test if database connection is established (mocked)."""
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn

        conn = db.connect()

        assert conn == mock_conn
        mock_connect.assert_called_once()

    @patch("pymysql.connect")
    def test_connect_to_db_failure(self, mock_connect, db):
        """Test database connection failure handling."""
        mock_connect.side_effect = pymysql.MySQLError("Connection Failed")

        with pytest.raises(pymysql.MySQLError) as exc_info:
            db.connect()

        assert "Connection Failed" in str(exc_info.value)

    @patch("pymysql.connect")
    def test_close_connection(self, mock_connect, db):
        """Test database connection closing."""
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn

        db.connect()
        db.close()

        mock_conn.close.assert_called_once()
        assert db.connection is None


class TestDataInsertion:
    """Tests for data insertion methods."""

    @patch("pymysql.connect")
    def test_insert_housing_starts_completions(self, mock_connect, db):
        """Test data insertion using a mock database connection."""
        fake_data = [{
            "Year": 2024, "Month": 1, "CMA": "Toronto",
            "Singles_starts": 10, "Semis_starts": 5, "Row_starts": 3,
            "Apt_Other_starts": 2, "Total_starts": 20,
            "Singles_complete": 8, "Semis_complete": 4, "Row_complete": 2,
            "Apt_other_complete": 1, "Total_complete": 15
        }]

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        count = db.insert_housing_starts_completions(fake_data)

        assert mock_cursor.execute.called
        assert mock_conn.commit.called
        assert count == 1

    @patch("pymysql.connect")
    def test_insert_filters_invalid_cities(self, mock_connect, db):
        """Test that insertion filters out invalid cities."""
        fake_data = [
            {"Year": 2024, "Month": 1, "CMA": "Toronto", "Total_starts": 100},
            {"Year": 2024, "Month": 1, "CMA": "InvalidCity", "Total_starts": 50},
            {"Year": 2024, "Month": 1, "CMA": "Hamilton", "Total_starts": 75}
        ]

        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        count = db.insert_housing_starts_completions(fake_data)

        # Should only insert Toronto and Hamilton, not InvalidCity
        assert count == 2

    @patch("pymysql.connect")
    def test_insert_empty_data(self, mock_connect, db):
        """Test insertion with empty data list."""
        count = db.insert_housing_starts_completions([])

        assert count == 0
        mock_connect.assert_not_called()


class TestDataRetrieval:
    """Tests for data retrieval methods."""

    @patch("pymysql.connect")
    def test_get_record_count(self, mock_connect, db):
        """Test getting record count from a table."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = {"count": 42}
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        count = db.get_record_count("housing_starts_completions")

        assert count == 42

    def test_get_record_count_invalid_table(self, db):
        """Test get_record_count raises error for invalid table name."""
        with pytest.raises(ValueError) as exc_info:
            db.get_record_count("invalid_table; DROP TABLE users;")

        assert "Invalid table name" in str(exc_info.value)

    @patch("pymysql.connect")
    def test_get_all_data_empty(self, mock_connect, db):
        """Test fetching data when database table is empty."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        result = db.get_all_data("housing_starts_completions")

        assert result == []
        mock_cursor.execute.assert_called_once()


class TestIngestor:
    """Tests for the main ingestor workflow."""

    @patch("database.Database.fetch_data")
    @patch("database.Database.insert_housing_starts_completions")
    @patch("database.Database.get_record_count")
    @patch("database.Database.close")
    def test_run_ingestor(self, mock_close, mock_count, mock_insert, mock_fetch):
        """Test the full ingestor workflow with mocked API and DB."""
        mock_fetch.return_value = [
            {"Year": 2024, "Month": 1, "CMA": "Toronto", "Total_starts": 500}
        ]
        mock_insert.return_value = 1
        mock_count.return_value = 10

        # Should complete without errors
        run_ingestor()

        assert mock_close.called

    @patch("database.Database.fetch_data")
    @patch("database.Database.insert_housing_starts_completions")
    @patch("database.Database.get_record_count")
    @patch("database.Database.close")
    def test_run_ingestor_handles_missing_table(
        self, mock_close, mock_count, mock_insert, mock_fetch
    ):
        """Test ingestor handles missing table gracefully."""
        mock_fetch.return_value = []
        mock_insert.side_effect = pymysql.err.ProgrammingError(
            "Table 'template_db.test' doesn't exist"
        )
        mock_count.return_value = 0

        # Should complete without raising exception
        run_ingestor()

        assert mock_close.called
