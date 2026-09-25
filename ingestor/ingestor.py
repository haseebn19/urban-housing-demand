"""
Data Ingestor for Urban Housing Demand application.
Fetches data from external APIs and populates the database.

Note: If API_KEY environment variable is not set, the ingestor will skip
API fetching. The database will be populated from the seed data in setup.sql.
"""

from __future__ import annotations

import json

import pymysql

from database import TABLES, Database


def run_ingestor() -> None:
    """Run the ingestor to fetch and store data in the database."""
    db = Database()
    try:
        _ingest(db)
    finally:
        db.close()
    print("\nData ingestion completed.")


def _ingest(db: Database) -> None:
    """Fetch every dataset and store it, then print a summary."""
    print("=" * 60)
    print("Urban Housing Demand Data Ingestor")
    print("=" * 60)

    if not db.api_key:
        print("\nNote: No API_KEY environment variable set.")
        print("The database will use seed data from setup.sql.")
        print("To enable API fetching, set the API_KEY environment variable.\n")

    total_inserted = 0
    errors = []

    for table_name in TABLES:
        try:
            print(f"\nProcessing {table_name}...")
            data = db.fetch_data(table_name)
            if data:
                count = db.insert(table_name, data)
                total_inserted += count
                print(f"  -> Inserted/updated {count} records from API")
            else:
                existing = db.get_record_count(table_name)
                print(f"  -> No API data available. Database has {existing} existing records.")

        except pymysql.err.ProgrammingError as e:
            if "doesn't exist" in str(e):
                errors.append(f"{table_name}: Table missing")
                print(f"  -> Warning: Table `{table_name}` does not exist. Run setup.sql first.")
            else:
                errors.append(f"{table_name}: {e!s}")
                print(f"  -> Error: {e}")
        except Exception as e:
            errors.append(f"{table_name}: {e!s}")
            print(f"  -> Error: {e}")

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


def show_sample_data() -> None:
    """Display sample data from each table."""
    db = Database()
    try:
        _print_samples(db)
    finally:
        db.close()


def _print_samples(db: Database) -> None:
    """Print the record count and the first few records of each table."""
    print("\n" + "=" * 60)
    print("Sample Data Preview")
    print("=" * 60)

    for table in TABLES:
        try:
            count = db.get_record_count(table)
            print(f"\n{table}: {count} total records")

            if count > 0:
                for i, record in enumerate(db.get_sample(table, 3), 1):
                    if table == "labour_market":
                        preview = {
                            "rec_num": record.get("rec_num"),
                            "cma": record.get("cma"),
                            "survyear": record.get("survyear"),
                            "NOC_43": record.get("NOC_43"),
                        }
                    else:
                        preview = {
                            "city": record.get("city"),
                            "year": record.get("year"),
                            "month": record.get("month"),
                        }
                    print(f"  Record {i}: {json.dumps(preview, default=str)}")

        except Exception as e:
            print(f"  Error reading {table}: {e}")


if __name__ == "__main__":
    run_ingestor()
    show_sample_data()
