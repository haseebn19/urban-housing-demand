"""
Data Ingestor for Urban Housing Demand application.
Fetches data from external APIs and populates the database.

Note: If API_KEY environment variable is not set, the ingestor will skip
API fetching. The database will be populated from the seed data in setup.sql.
"""

from __future__ import annotations

import json
import os
from collections.abc import Callable
from typing import Any

import pymysql

from database import Database


def run_ingestor() -> None:
    """Run the ingestor to fetch and store data in the database."""
    db = Database()

    print("=" * 60)
    print("Urban Housing Demand - Data Ingestor")
    print("=" * 60)

    # Check if API key is configured
    api_key = os.getenv("API_KEY", "")
    if not api_key:
        print("\nNote: No API_KEY environment variable set.")
        print("The database will use seed data from setup.sql.")
        print("To enable API fetching, set the API_KEY environment variable.\n")

    # List of tables to process
    tables: list[tuple[str, Callable[[list[dict[str, Any]]], int]]] = [
        ("housing_starts_completions", db.insert_housing_starts_completions),
        ("housing_under_construction", db.insert_housing_under_construction),
        ("apartment_starts", db.insert_apartment_starts),
        ("apartment_completions", db.insert_apartment_completions),
        ("labour_market", db.insert_labour_market),
    ]

    total_inserted = 0
    errors = []

    for table_name, insert_function in tables:
        try:
            print(f"\nProcessing {table_name}...")

            # Try to fetch from API
            data = db.fetch_data(table_name)

            if data:
                count = insert_function(data)
                total_inserted += count
                print(f"  -> Inserted/updated {count} records from API")
            else:
                # Check existing data in database
                existing = db.get_record_count(table_name)
                print(f"  -> No API data available. Database has {existing} existing records.")

        except pymysql.err.ProgrammingError as e:
            if "doesn't exist" in str(e):
                errors.append(f"{table_name}: Table missing")
                print(f"  -> Warning: Table `{table_name}` does not exist. Run setup.sql first.")
            else:
                errors.append(f"{table_name}: {str(e)}")
                print(f"  -> Error: {e}")
        except Exception as e:
            errors.append(f"{table_name}: {str(e)}")
            print(f"  -> Error: {e}")

    # Summary
    print("\n" + "=" * 60)
    print("Ingestion Summary")
    print("=" * 60)
    print(f"Total records inserted/updated: {total_inserted}")

    if errors:
        print(f"\nErrors encountered ({len(errors)}):")
        for error in errors:
            print(f"  - {error}")
    else:
        print("\nNo errors encountered.")

    # Close database connection
    db.close()
    print("\nData ingestion completed.")


def show_sample_data() -> None:
    """Display sample data from each table."""
    db = Database()

    tables = [
        "housing_starts_completions",
        "housing_under_construction",
        "apartment_starts",
        "apartment_completions",
        "labour_market"
    ]

    print("\n" + "=" * 60)
    print("Sample Data Preview")
    print("=" * 60)

    for table in tables:
        try:
            count = db.get_record_count(table)
            print(f"\n{table}: {count} total records")

            if count > 0:
                data = db.get_all_data(table)[:3]  # Get first 3 records
                for i, record in enumerate(data, 1):
                    # Show simplified view
                    if table == "labour_market":
                        preview = {
                            "rec_num": record.get("rec_num"),
                            "cma": record.get("cma"),
                            "survyear": record.get("survyear"),
                            "NOC_43": record.get("NOC_43")
                        }
                    else:
                        preview = {
                            "city": record.get("city"),
                            "year": record.get("year"),
                            "month": record.get("month")
                        }
                    print(f"  Record {i}: {json.dumps(preview, default=str)}")

        except Exception as e:
            print(f"  Error reading {table}: {e}")

    db.close()


if __name__ == "__main__":
    run_ingestor()
    show_sample_data()
