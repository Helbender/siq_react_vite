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

            # Iterates through flights and creates JSON response
            for row in flights_obj:
                flights.append(row.to_json())  # Flight main data to JSON

                # Retrieves the Pilots from the DB
                stmt2 = select(FlightPilots).where(FlightPilots.flight_id == row.fid)
                flight_pilots = session.execute(stmt2).scalars()

                # Creates Empty list of pilots and crew to append to JSON
                flights[i]["flight_pilots"] = []  # "flight_pilots" key used for compatability with the FRONTEND

                for flight_pilot in flight_pilots:
                    result = session.execute(
                        select(Pilot).where(Pilot.nip == flight_pilot.pilot_id),
                    ).scalar_one_or_none()
                    if result is None:
                        flights[i]["flight_pilots"].append({"pilotName": "Not found, maybe deleted"})
                    else:
                        flights[i]["flight_pilots"].append(flight_pilot.to_json())

                stmt3 = select(FlightCrew).where(FlightCrew.flight_id == row.fid)
                flight_crews = session.execute(stmt3).scalars()

                for flight_crew in flight_crews:
                    result = session.execute(
                        select(Crew).where(Crew.nip == flight_crew.crew_id),
                    ).scalar_one_or_none()
                    if result is None:
                        flights[i]["flight_pilots"].append({"pilotName": "Not found, maybe deleted"})
                    else:
                        flights[i]["flight_pilots"].append(flight_crew.to_json())
                i += 1
            return jsonify(flights), 200

    # Retrieves flight from Frontend and saves is to DB
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

            # for i in range(6):
            for pilot in f["flight_pilots"]:
                print("\n", pilot)
                # try:
                add_crew_and_pilots(session, flight, pilot)
                # except KeyError:
                # pass
            session.commit()
            session.refresh(flight)
            print(flight.fid)

        return jsonify({"message": flight.fid}), 201
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
                print(pilot.pilot_id)
                update_qualifications(flight_id, session, pilot)

            # Iterate over each crew in the flight
            for crew in flight.flight_crew:
                update_qualifications(flight_id, session, crew)

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
    tripulante: FlightPilots | FlightCrew,
) -> None:
    """Update qualification of all crew before flight delete."""
    if isinstance(tripulante, FlightPilots):
        # pilot_qualification = session.query(Qualification).filter_by(pilot_id=tripulante.pilot_id).first()  # noqa: ERA001
        pilot_qualification: Qualification = session.execute(
            select(Qualification).filter_by(pilot_id=tripulante.pilot_id),
        ).scalar_one()
        print(pilot_qualification)
        # Process repetion Qualifications
        qualification_fields = ["day_landings", "night_landings", "prec_app", "nprec_app"]
        # Query the most recent dates for day landings from other flights
        for i in range(len(qualification_fields)):
            process_repetion_qual(session, flight_id, tripulante, pilot_qualification, qualification_fields[i])

        # # Process night landings
        # # Query the most recent dates for day landings from other flights
        # recent_night_landings = session.execute(
        #     select(Flight.date, FlightPilots.night_landings)
        #     .join(FlightPilots)
        #     .where(Flight.flight_pilots.any(pilot_id=tripulante.pilot_id))
        #     .where(Flight.fid != flight_id)
        #     .where(FlightPilots.night_landings > 0)
        #     .order_by(Flight.date.desc()),
        #     # .limit(5 - len(night_landings_dates)),
        # ).all()

        # print(f"\nRecent night:\t{recent_night_landings}\n")

        # # Ensure there are no more than 5 entries
        # night_landings_dates = [date[0].strftime("%Y-%m-%d") for date in recent_night_landings]

        # # Sort the dates in reverse chronological order
        # night_landings_dates.sort(reverse=True)

        # # Update the qualification record
        # pilot_qualification.last_night_landings = " ".join(night_landings_dates[:5])

        # print(f"After Qual ATR:\t{pilot_qualification.last_night_landings}\n")

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
                session.query(func.max(Flight.date))
                .filter(
                    and_(
                        Flight.flight_pilots.any(pilot_id=tripulante.pilot_id),
                        Flight.fid != flight_id,
                        (getattr(FlightPilots, field) != None),
                    ),
                )
                .scalar()
            )
            # print(f"\n{tripulante.pilot_id}\nLast Qualification {field}: {last_qualification_date}\n\n")

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
                session.query(func.max(Flight.date))
                .filter(
                    and_(
                        Flight.flight_crew.any(crew_id=tripulante.crew_id),
                        Flight.fid != flight_id,
                        (getattr(FlightCrew, field) != None),  # noqa: E711
                    ),
                )
                .scalar()
            )
            print(f"\n{tripulante.crew_id}\nLast Qualification {field}: {last_qualification_date}\n\n")
            # Check if Date is None so to set a base Date
            if last_qualification_date is None:
                last_qualification_date = date(year_init, 1, 1)
            # Update the tripulante's qualifications table
            setattr(crew_qualification, f"last_{field}_date", last_qualification_date)


def process_repetion_qual(
    session: Session,
    flight_id: int,
    tripulante: FlightPilots,
    pilot_qualification: Qualification,
    qualification_field: str,
) -> None:
    """Update Qualification table with data from other flights when deleting flights.

    Used for repetion based qualifications
    """
    print(f"\nProcessing { qualification_field}")
    recent_qualications = session.execute(
        select(Flight.date, getattr(FlightPilots, qualification_field))  # FlightPilots.day_landings)
        .join(FlightPilots)
        .where(Flight.flight_pilots.any(pilot_id=tripulante.pilot_id))
        .where(Flight.fid != flight_id)
        .where(getattr(FlightPilots, qualification_field) > 0)
        .order_by(Flight.date.desc()),
        # .limit(5 - len(day_landings_dates)),
    ).all()

    print(f"\nRecent { qualification_field}:\t{recent_qualications}\n")

    # Ensure there are no more than 5 entries
    qualification_dates = [date[0].strftime("%Y-%m-%d") for date in recent_qualications]

    # Sort the dates in reverse chronological order
    qualification_dates.sort(reverse=True)

    # Update the qualification record
    setattr(pilot_qualification, f"last_{qualification_field}", " ".join(qualification_dates[:5]))
    # qualification_attr = " ".join(qualification_dates[:5])
    # pilot_qualification.last_day_landings = " ".join(qualification_dates[:5])

    print(f"After Qual { qualification_field}:\t{getattr(pilot_qualification, f"last_{qualification_field}")}\n")


def add_crew_and_pilots(session: Session, flight: Flight, pilot: dict) -> None:
    """Check type of crew and add it to respective Model Object."""
    # Garanties data integrety while introducing several flights
    pilot["ATR"] = 0 if pilot["ATR"] == "" else pilot["ATR"]
    pilot["ATN"] = 0 if pilot["ATN"] == "" else pilot["ATN"]
    pilot["precapp"] = 0 if pilot["precapp"] == "" else pilot["precapp"]
    pilot["nprecapp"] = 0 if pilot["nprecapp"] == "" else pilot["nprecapp"]

    if "QUAL1" in pilot and pilot["QUAL1"] != "":
        pilot[pilot["QUAL1"]] = True
    if "QUAL2" in pilot and pilot["QUAL2"] != "":
        pilot[pilot["QUAL1"]] = True
    if pilot["position"] in PILOT_USER:
        pilot_obj: Pilot = session.get(Pilot, pilot["nip"])  # type: ignore  # noqa: PGH003
        qual_p: Qualification = session.get(Qualification, pilot["nip"])  # type: ignore  # noqa: PGH003

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
        fp = FlightCrew(
            bsoc=pilot["BSOC"],
        )
        qual_c.update(fp, flight.date)

        crew_obj.flight_crew.append(fp)
        flight.flight_crew.append(fp)
    else:
        print("Not a valid Crew Member")
