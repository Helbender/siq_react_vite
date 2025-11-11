#!/usr/bin/env python3
"""Script to process all flights from the database and send them to Google Drive.

This script retrieves all flights from the database, converts them to JSON format,
and uses the tarefa_enviar_para_drive function to upload each flight to Google Drive.
"""

import os
import sys
from datetime import datetime

from sqlalchemy import func
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

# Add the parent directory (api/) to Python path to import local modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import engine
from functions.gdrive import tarefa_enviar_para_drive
from models.crew import Crew
from models.flights import Flight
from models.flights import FlightCrew
from models.flights import FlightPilots
from models.pilots import Pilot


def get_all_flights():
    """Retrieve all flights from the database with their associated pilots and crew.

    Returns:
        list: List of flight objects with all related data loaded

    """
    with Session(engine) as session:
        stmt = (
            select(Flight)
            .order_by(Flight.date.desc())
            .options(
                joinedload(Flight.flight_pilots).joinedload(FlightPilots.pilot).joinedload(Pilot.qualification),
                joinedload(Flight.flight_crew).joinedload(FlightCrew.crew).joinedload(Crew.qualification),
            )
        )
        flights_obj = session.execute(stmt).unique().scalars()
        return list(flights_obj)


def get_flights_batch(offset=0, limit=100):
    """Retrieve flights in batches to avoid memory issues with large datasets.

    Args:
        offset (int): Number of flights to skip
        limit (int): Maximum number of flights to retrieve

    Returns:
        list: List of flight objects with all related data loaded

    """
    with Session(engine) as session:
        stmt = (
            select(Flight)
            .order_by(Flight.date.desc())
            .offset(offset)
            .limit(limit)
            .options(
                joinedload(Flight.flight_pilots).joinedload(FlightPilots.pilot).joinedload(Pilot.qualification),
                joinedload(Flight.flight_crew).joinedload(FlightCrew.crew).joinedload(Crew.qualification),
            )
        )
        flights_obj = session.execute(stmt).unique().scalars()
        return list(flights_obj)


def process_flight_to_drive(flight):
    """Process a single flight and send it to Google Drive.

    Args:
        flight: Flight object from the database

    """
    try:
        # Convert flight to JSON format (same as used in the API)
        flight_data = flight.to_json()

        # Generate file names (same logic as in flight_blueprint.py)
        nome_arquivo_voo = flight.get_file_name()
        nome_pdf = nome_arquivo_voo.replace(".1m", ".pdf")

        print(f"Processing flight {flight.fid} ({flight.airtask}) - {flight.date}")
        print(f"  Files: {nome_arquivo_voo}, {nome_pdf}")

        # Send to Google Drive using the same function as the API
        tarefa_enviar_para_drive(dados=flight_data, nome_arquivo_drive=nome_arquivo_voo, nome_pdf=nome_pdf)

        print(f"  ✅ Successfully processed flight {flight.fid}")

    except Exception as e:
        print(f"  ❌ Error processing flight {flight.fid}: {e}")


def main():
    """Main function to process all flights."""
    print("🚀 Starting flight processing to Google Drive...")
    print(f"📅 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 60)

    try:
        # First, get total count
        print("📊 Counting flights in database...")
        with Session(engine) as session:
            total_count = session.execute(select(func.count(Flight.fid))).scalar()

        if total_count == 0:
            print("⚠️  No flights found in the database.")
            return

        print(f"📋 Found {total_count} flights to process")
        print("-" * 60)

        # Process flights in batches
        batch_size = 50  # Process 50 flights at a time
        successful = 0
        failed = 0
        processed = 0

        for offset in range(0, total_count, batch_size):
            print(
                f"\n📦 Processing batch {offset // batch_size + 1} (flights {offset + 1}-{min(offset + batch_size, total_count)})..."
            )

            flights = get_flights_batch(offset, batch_size)

            for flight in flights:
                processed += 1
                print(f"\n[{processed}/{total_count}] Processing flight {flight.fid}...")

                try:
                    process_flight_to_drive(flight)
                    successful += 1
                except Exception as e:
                    print(f"  ❌ Failed to process flight {flight.fid}: {e}")
                    failed += 1

        # Summary
        print("\n" + "=" * 60)
        print("📊 PROCESSING SUMMARY")
        print("=" * 60)
        print(f"✅ Successfully processed: {successful} flights")
        print(f"❌ Failed: {failed} flights")
        print(f"📅 Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        if failed > 0:
            print(f"\n⚠️  {failed} flights failed to process. Check the error messages above.")
            sys.exit(1)
        else:
            print("\n🎉 All flights processed successfully!")

    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
