from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from sqlalchemy import select
from models import Flight, Pilot, FlightPilots
from config import engine
from sqlalchemy.orm import Session

app = Flask(__name__)
CORS(app)


@app.route("/flights", methods=["GET", "POST"])
def retrieve_flights() -> tuple[Response, int]:
    """Method GET:
    -   Retrieves all flights from the db and sends to frontend

    Method POST:
    -   Saves a flight to the db"""

    if request.method == "GET":
        flights = {}

        # Retrieve all flights from db
        with Session(engine) as session:
            stmt = select(Flight)
            result = session.execute(stmt).scalars()

            for row in result:
                flights[row.fid] = row.to_json()
                stmt2 = select(FlightPilots).where(FlightPilots.flight_id == row.fid)
                pilots = session.execute(stmt2).scalars()

                for pilot in pilots:
                    flights[row.fid][str(pilot.pilot_id)] = pilot.to_json()

            return jsonify(flights), 200
    return jsonify({"message": "Bad Manual Request"}), 403


@app.route("/pilots", methods=["GET", "POST"])
def retrieve_pilots() -> tuple[Response, int]:
    if request.method == "GET":
        pilots = {}
        # Retrieve all pilots from db
        with Session(engine) as session:
            stmt = select(Pilot)
            result = session.execute(stmt).scalars()
            for row in result:
                pilots[row.nip] = row.to_json()

            return jsonify(pilots), 200

    return jsonify({"message": "Bad Manual Request"}), 403


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5051, debug=True)
