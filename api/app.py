from __future__ import annotations

from datetime import datetime

from config import engine
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from models import Flight, FlightPilots, Pilot, Qualification
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

app = Flask(__name__)
CORS(app)


@app.route("/flights", methods=["GET", "POST"])
def retrieve_flights() -> tuple[Response, int]:
    """Method GET:
    -   Retrieves all flights from the db and sends to frontend

    Method POST:
    -   Saves a flight to the db
    """
    if request.method == "GET":
        flights = {}

        # Retrieve all flights from db
        with Session(engine) as session:
            stmt = select(Flight)
            flights_obj = session.execute(stmt).scalars()

            for row in flights_obj:
                flights[row.fid] = row.to_json()
                stmt2 = select(FlightPilots).where(FlightPilots.flight_id == row.fid)
                flight_pilots = session.execute(stmt2).scalars()

                for flight_pilot in flight_pilots:
                    flights[row.fid][str(flight_pilot.pilot_id)] = flight_pilot.to_json()

            return jsonify(flights), 200

    if request.method == "POST":
        f: dict = request.get_json()

        flight = Flight(
            airtask=f["airtask"],
            date=datetime.strptime(f["date"], "%Y-%m-%d").date(),
            origin=f["origin"],
            destination=f["destination"],
            departure_time=f["ATD"],
            arrival_time=f["ATA"],
        )

        with Session(engine, autoflush=False) as session:
            session.add(flight)
            pilot: dict

            for pilot in f["pilots"]:
                pilot_obj: Pilot = session.get(Pilot, pilot["nip"])  # type: ignore
                print(pilot_obj)
                qual: Qualification = session.get(Qualification, pilot["nip"])  # type: ignore

                fp = FlightPilots(
                    day_landings=pilot["ATR"],
                    night_landings=pilot["ATN"],
                    prec_app=pilot["P"],
                    nprec_app=pilot["NP"],
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
                print(pilot_obj)
                flight.flight_pilots.append(fp)
            session.commit()

        return jsonify({"message": "Flight Inserted"}), 201
    return jsonify({"message": "Bad Manual Request"}), 403


@app.route("/pilots", methods=["GET", "POST"])
def retrieve_pilots() -> tuple[Response, int]:
    if request.method == "GET":
        # Retrieve all pilots from db
        with Session(engine) as session:
            stmt = select(Pilot)
            result = session.execute(stmt).scalars().all()
            return jsonify([row.to_json() for row in result]), 200

    if request.method == "POST":
        piloto = request.get_json()
        with Session(engine) as session:
            new_pilot = Pilot(
                nip=int(piloto["nip"]),
                name=piloto["name"],
                rank=piloto["rank"],
                position=piloto["position"],
                qualification=Qualification(),
            )
            session.add(new_pilot)
            session.commit()
            response = new_pilot.to_json()
        return jsonify(response), 201
    return jsonify({"message": "Bad Manual Request"}), 403


@app.route("/pilots/<nip>", methods=["DELETE", "PATCH"])
def handle_pilots(nip: int) -> tuple[Response, int]:
    if request.method == "DELETE":
        with Session(engine) as session:
            session.execute(delete(Pilot).where(Pilot.nip == nip))
            result = session.execute(
                delete(Qualification).where(Qualification.pilot_id == nip),
            )
            session.commit()
        return jsonify({"deleted_id": f"{nip} deleted"}), 200
    return jsonify({"message": "Bad Manual Request"}), 403


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5051, debug=True)  # noqa: S104, S201
