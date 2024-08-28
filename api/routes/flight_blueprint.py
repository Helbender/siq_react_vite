from __future__ import annotations  # noqa: D100, INP001

from datetime import UTC, datetime

from config import engine
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import (
    jwt_required,
)
from models.flights import Flight, FlightPilots
from models.pilots import Pilot, Qualification
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

flights = Blueprint("flights", __name__)


# FLight ROUTES
@jwt_required()
@flights.route("/", methods=["GET", "POST"])
def retrieve_flights() -> tuple[Response, int]:
    """Retrieve all flights from the db and sends to frontend.

    Method POST:
    -   Saves a flight to the db
    """
    print(request.method)
    if request.method == "GET":
        flights = []
        i = 0

        # Retrieve all flights from db
        with Session(engine) as session:
            stmt = select(Flight)
            flights_obj = session.execute(stmt).scalars()
            for row in flights_obj:
                flights.append(row.to_json())
                stmt2 = select(FlightPilots).where(FlightPilots.flight_id == row.fid)
                flight_pilots = session.execute(stmt2).scalars()

                flights[i]["flight_pilots"] = []
                for flight_pilot in flight_pilots:
                    result = session.execute(
                        select(Pilot).where(Pilot.nip == flight_pilot.pilot_id),
                    ).scalar_one_or_none()
                    if result is None:
                        flights[i]["flight_pilots"].append({"pilotName": "Not found, maybe deleted"})
                    else:
                        flights[i]["flight_pilots"].append(flight_pilot.to_json())
                i += 1
            print("\n", "\n", flights, "\n", "\n")
            return jsonify(flights), 200

    if request.method == "POST":
        f: dict = request.get_json()
        print(f)
        flight = Flight(
            airtask=f["airtask"],
            date=datetime.strptime(f["date"], "%Y-%m-%d").replace(tzinfo=UTC).date(),
            origin=f["origin"],
            destination=f["destination"],
            departure_time=f["ATD"],
            arrival_time=f["ATA"],
            flight_type=f["flightType"],
            flight_action=f["flightAction"],
            tailnumber=f["tailNumber"],
            total_time=f["ATE"],
            atr=f["totalLandings"],
            passengers=f["passengers"],
            doe=f["doe"],
            cargo=f["cargo"],
            number_of_crew=f["numberOfCrew"],
            orm=f["orm"],
            fuel=f["fuel"],
        )

        with Session(engine, autoflush=False) as session:
            session.add(flight)
            pilot: dict

            for pilot in f["flight_pilots"]:
                pilot_obj: Pilot = session.get(Pilot, pilot["nip"])  # type: ignore  # noqa: PGH003
                qual: Qualification = session.get(Qualification, pilot["nip"])  # type: ignore  # noqa: PGH003

                fp = FlightPilots(
                    day_landings=int(pilot["ATR"]),
                    night_landings=int(pilot["ATN"]),
                    prec_app=int(pilot["precapp"]),
                    nprec_app=int(pilot["nprecapp"]),
                    qa1=pilot["QA1"],
                    qa2=pilot["QA2"],
                    bsp1=pilot["BSP1"],
                    bsp2=pilot["BSP2"],
                    ta=pilot["TA"],
                    vrp1=pilot["VRP1"],
                    vrp2=pilot["VRP2"],
                )
                qual.update(fp, flight.date)

                pilot_obj.flight_pilots.append(fp)
                flight.flight_pilots.append(fp)
            session.commit()

        return jsonify({"message": "Flight Inserted"}), 201
    return jsonify({"message": "Bad Manual Request"}), 403


@flights.route("/<int:flight_id>", methods=["DELETE", "PATCH"])
@jwt_required()  # new line
def handle_flights(flight_id: int) -> tuple[Response, int]:
    """Handle modifications to the Flights database."""
    if request.method == "DELETE":
        with Session(engine) as session:
            result = session.execute(delete(Flight).where(Flight.fid == flight_id))
            if result.rowcount == 1:
                session.commit()
                return jsonify({"deleted_id": f"Flight {flight_id}"}), 200

    return jsonify({"message": "Bad Manual Request"}), 403
