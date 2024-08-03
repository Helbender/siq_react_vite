from __future__ import annotations  # noqa: D100, INP001

from datetime import UTC, datetime

from config import engine
from flask import Flask, Response, jsonify, request
from models import Flight, FlightPilots, Pilot, Qualification
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

app = Flask(__name__)  # , static_folder="../frontend/dist", static_url_path="/")
# CORS(app)

# frontend_folder = os.path.join(os.getcwd(), "..", "frontend", "dist")


# Serve Frontend
# @app.route("/", defaults={"filename": ""})
# @app.route("/<path:filename>")
# def index(filename):
#     if not filename:
#         filename = "index.html"
#     return send_from_directory(frontend_folder, filename)


# api routes
@app.route("/api/flights", methods=["GET", "POST"])
def retrieve_flights() -> tuple[Response, int]:
    """Retrieve all flights from the db and sends to frontend.

    Method POST:
    -   Saves a flight to the db
    """
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
        )

        with Session(engine, autoflush=False) as session:
            session.add(flight)
            pilot: dict

            for pilot in f["pilots"]:
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


@app.route("/api/pilots", methods=["GET", "POST"])
def retrieve_pilots() -> tuple[Response, int]:
    """Placehold."""
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


@app.route("/api/pilots/<nip>", methods=["DELETE", "PATCH"])
def handle_pilots(nip: int) -> tuple[Response, int]:
    """Placehold."""
    if request.method == "DELETE":
        with Session(engine) as session:
            session.execute(delete(Pilot).where(Pilot.nip == nip))
            result = session.execute(
                delete(Qualification).where(Qualification.pilot_id == nip),
            )

            if result.rowcount == 1:
                session.commit()
                return jsonify({"deleted_id": f"{nip}"}), 200
            else:  # noqa: RET505
                return jsonify({"message": "Failed to delete"}), 304

    if request.method == "PATCH":
        piloto = request.get_json()
        with Session(engine) as session:
            modified_pilot = session.execute(select(Pilot).where(Pilot.nip == nip)).scalar_one()
            modified_pilot.name = piloto["name"]
            modified_pilot.rank = piloto["rank"]
            modified_pilot.position = piloto["position"]

            session.commit()
            return jsonify(modified_pilot.to_json()), 200

    return jsonify({"message": "Bad Manual Request"}), 403


@app.route("/api/flights/<flight_id>", methods=["DELETE", "PATCH"])
def handle_flights(flight_id: int) -> tuple[Response, int]:
    if request.method == "DELETE":
        with Session(engine) as session:
            result = session.execute(delete(Flight).where(Flight.fid == flight_id))
            if result.rowcount == 1:
                return jsonify({"deleted_id": f"Flight {flight_id}"}), 200

    return jsonify({"message": "Bad Manual Request"}), 403


if __name__ == "__main__":
    app.run(port=5051, debug=True)  # noqa: S201
