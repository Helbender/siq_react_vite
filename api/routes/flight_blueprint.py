from __future__ import annotations  # noqa: D100, INP001

from datetime import UTC, date, datetime

from config import CREW_USER, PILOT_USER, engine
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import (
    jwt_required,
)
from models.crew import Crew, QualificationCrew
from models.flights import Flight, FlightCrew, FlightPilots
from models.pilots import Pilot, Qualification
from models.users import year_init
from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session

flights = Blueprint("flights", __name__)


# FLight ROUTES
@jwt_required()
@flights.route("/", methods=["GET", "POST"], strict_slashes=False)
def retrieve_flights() -> tuple[Response, int]:
    """Retrieve all flights from the db and sends to frontend.

    Method POST:
    -   Saves a flight to the db
    """
    # Retrieve all flights from db
    if request.method == "GET":
        flights: list = []
        i = 0

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
            return jsonify(flights), 200

    if request.method == "POST":
        f: dict = request.get_json()
        for k, v in f.items():
            print(f"{k}: {v}")
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
                add_crew_and_pilots(session, flight, pilot)
            session.commit()

        return jsonify({"message": "Flight Inserted"}), 201
    return jsonify({"message": "Bad Manual Request"}), 403


@jwt_required()  # new line
@flights.route("/<int:flight_id>", methods=["DELETE", "PATCH"], strict_slashes=False)
def handle_flights(flight_id: int) -> tuple[Response, int]:
    """Handle modifications to the Flights database."""
    if request.method == "DELETE":
        with Session(engine, autoflush=False) as session:
            flight = session.execute(select(Flight).where(Flight.fid == flight_id)).scalar_one_or_none()
            if not flight:
                return jsonify({"msg": "Flight not found"}), 404

                # Iterate over each pilot in the flight
            for pilot in flight.flight_pilots:
                update_qualifications(flight_id, session, flight, pilot)
            for crew in flight.flight_crew:
                update_qualifications(flight_id, session, flight, crew)

            # Commit the updates
            session.commit()
            # Now delete the flight
            session.delete(flight)
            session.commit()
            return jsonify({"deleted_id": f"Flight {flight_id}"}), 200

    return jsonify({"message": "Bad Manual Request"}), 403


def update_qualifications(
    flight_id: int,
    session: Session,
    flight: Flight,
    tripulante: FlightPilots | FlightCrew,
) -> None:
    """Update qualification of all crew before flight delete."""
    if isinstance(tripulante, FlightPilots):
        # pilot_qualification = session.query(Qualification).filter_by(pilot_id=tripulante.pilot_id).first()  # noqa: ERA001
        pilot_qualification: Qualification = session.execute(
            select(Qualification).filter_by(pilot_id=tripulante.pilot_id),
        ).scalar_one()

        # Process day landings
        day_landings_dates = pilot_qualification.last_day_landings.split() if pilot_qualification.last_day_landings else []
        if flight.date in day_landings_dates:
            day_landings_dates.remove(flight.date.strftime("%Y-%m-%d"))

            # Query the most recent dates for day landings from other flights
        recent_day_landings = (
            session.query(Flight.date)
            .filter(
                and_(
                    Flight.flight_pilots.any(id=tripulante.pilot_id),
                    Flight.fid != flight_id,
                    FlightPilots.day_landings > 0,
                ),
            )
            .order_by(Flight.date.desc())
            .limit(5 - len(day_landings_dates))
            .all()
        )

        day_landings_dates.extend([date[0].strftime("%Y-%m-%d") for date in recent_day_landings])
        day_landings_dates.sort(reverse=True)
        pilot_qualification.last_day_landings = " ".join(day_landings_dates[:5])

        # Process night landings
        night_landings_dates = pilot_qualification.last_night_landings.split() if pilot_qualification.last_night_landings else []
        if flight.date in night_landings_dates:
            night_landings_dates.remove(flight.date.strftime("%Y-%m-%d"))

            # Query the most recent dates for day landings from other flights
        recent_night_landings = (
            session.query(Flight.date)
            .filter(
                and_(
                    Flight.flight_pilots.any(id=tripulante.pilot_id),
                    Flight.fid != flight_id,
                    FlightPilots.night_landings > 0,
                ),
            )
            .order_by(Flight.date.desc())
            .limit(5 - len(night_landings_dates))
            .all()
        )

        night_landings_dates.extend([date[0].strftime("%Y-%m-%d") for date in recent_night_landings])
        night_landings_dates.sort(reverse=True)
        pilot_qualification.last_night_landings = " ".join(night_landings_dates[:5])

        # For each qualification type, find the last relevant flight before the one being deleted
        qualification_fields = [
            "qa1",
            "qa2",
            "bsp1",
            "bsp2",
            "ta",
            "vrp1",
            "vrp2",
        ]

        for field in qualification_fields:
            last_qualification_date = (
                session.query(func.max(getattr(FlightPilots, field)))
                .filter(
                    and_(
                        Flight.flight_pilots.any(pilot_id=tripulante.pilot_id),
                        Flight.fid != flight_id,
                        getattr(FlightPilots, field) != None,  # noqa: E711
                    ),
                )
                .scalar()
            )
            print(f"\n\nLast Qualification: {last_qualification_date}\n\n")
            # Check if Date is None so to set a base Date
            if last_qualification_date is None:
                last_qualification_date = date(year_init, 1, 1)

                # Update the tripulante's qualifications table
            setattr(pilot_qualification, f"last_{field}_date", last_qualification_date)

    elif isinstance(tripulante, FlightCrew):
        crew_qualification = session.query(QualificationCrew).filter_by(crew_id=tripulante.crew_id).first()

        # For each qualification type, find the last relevant flight before the one being deleted
        qualification_fields = [
            "bsoc",
        ]

        for field in qualification_fields:
            last_qualification_date = (
                session.query(func.max(getattr(FlightCrew, field)))
                .filter(
                    and_(
                        Flight.flight_pilots.any(crew_id=tripulante.crew_id),
                        Flight.fid != flight_id,
                        (getattr(FlightCrew, field) != None),  # noqa: E711
                    ),
                )
                .scalar()
            )
            print(f"\n\nLast Qualification: {last_qualification_date}\n\n")
            # Check if Date is None so to set a base Date
            if last_qualification_date is None:
                last_qualification_date = date(year_init, 1, 1)
            # Update the tripulante's qualifications table
            setattr(crew_qualification, f"last_{field}_date", last_qualification_date)


def add_crew_and_pilots(session: Session, flight: Flight, pilot: dict) -> None:
    """Check type of crew and add it to respective Model Object."""
    if pilot["position"] in PILOT_USER:
        pilot_obj: Pilot = session.get(Pilot, pilot["nip"])  # type: ignore  # noqa: PGH003
        qual_p: Qualification = session.get(Qualification, pilot["nip"])  # type: ignore  # noqa: PGH003
        print(pilot_obj)
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
        qual_p.update(fp, flight.date)

        pilot_obj.flight_pilots.append(fp)
        flight.flight_pilots.append(fp)

    elif pilot["position"] in CREW_USER:
        crew_obj: Crew = session.get(Crew, pilot["nip"])  # type: ignore  # noqa: PGH003
        qual_c: QualificationCrew = session.get(QualificationCrew, pilot["nip"])  # type: ignore  # noqa: PGH003
        print(crew_obj)
        fp = FlightCrew(
            bsoc=pilot["BSOC"],
        )
        qual_c.update(fp, flight.date)

        crew_obj.flight_crew.append(fp)
        flight.flight_crew.append(fp)
    else:
        print("Not a valid Crew Member")
