from __future__ import annotations  # noqa: D100, INP001

import json
import os
from datetime import UTC, datetime, timedelta, timezone

from config import engine
from flask import Flask, Response, jsonify, request
from flask.cli import load_dotenv
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    unset_jwt_cookies,
)
from models import Flight, FlightPilots, Pilot, Qualification
from sendemail import main
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

load_dotenv(path="./.env")
JWT_KEY: str = os.environ.get("JWT_KEY", "")
app = Flask(__name__)  # , static_folder="../frontend/dist", static_url_path="/")
# CORS(app)
app.config["JWT_SECRET_KEY"] = JWT_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)
jwt = JWTManager(app)


# apli login routes
@app.after_request
def refresh_expiring_jwts(response: Response) -> Response:
    """Handle Token Expiration."""
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(hours=6))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response  # noqa: TRY300
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


@app.route("/api/token", methods=["POST"])
def create_token() -> tuple[Response | dict[str, str], int]:
    """Recebe os dados de logins e trata da autorização."""
    login_data: dict = request.get_json()
    nip: int = login_data["nip"]
    password: str = login_data["password"]

    # if nip != "teste" or password != "teste":
    # return {"message": "Wrong nip or password"}, 401

    with Session(engine) as session:
        pilot = session.execute(select(Pilot).where(Pilot.nip == nip)).scalar_one_or_none()
        if pilot != None:
            if password != pilot.password:
                return {"message": "Wrong password"}, 401

            access_token = create_access_token(identity=nip)
            response = {"access_token": access_token}
            return response, 200
        else:
            return {"message": f"No user with NIP {nip}"}, 404
    return {"message": "Something went wrong in the server"}, 500


@app.route("/api/profile")
@jwt_required()  # new line
def my_profile() -> Response:
    """Handle Authorization test endpoint."""
    response_body = {
        "name": "Nagato",
        "about": "Hello! I'm a full stack developer that loves python and javascript",
    }

    return response_body  # type: ignore  # noqa: PGH003, RET504


@app.route("/api/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout sucessful"})
    unset_jwt_cookies(response)
    return response, 200


@app.route("/api/recovery", methods=["POST"])
def recover_process():
    """API endpoint to check token validity"""
    email = request.json.get("email")
    token = request.json.get("token")
    with Session(engine) as session:
        tripulante = session.execute(select(Pilot).where(Pilot.email == email)).scalar_one_or_none()
        try:
            recover_data = json.loads(tripulante.recover)
        except json.JSONDecodeError:
            return jsonify({"message": "Token already was used"}), 403

        if token == recover_data["token"]:
            now = datetime.now(timezone.utc)
            token_timestamp = datetime.fromisoformat(recover_data["timestamp"])
            exp_timestamp = now + timedelta(hours=12)
            if exp_timestamp > token_timestamp:
                # tripulante.recover = ""
                # session.commit()
                return jsonify({"message": "Token Valid", "nip": tripulante.nip}), 200

    return jsonify({"message": "Token Expired"}), 408


@app.route("/api/recover/<email>", methods=["POST"])
def recover_pass(email) -> tuple[Response, int]:
    with Session(engine) as session:
        tripulante = session.execute(select(Pilot).where(Pilot.email == email)).scalar_one_or_none()

        if tripulante is None:
            return jsonify({"message": "User not found"}), 404

        json_data = main(email)
        tripulante.recover = json_data
        session.commit()
        return jsonify({"message": "Recovery email sent"}), 200

    return jsonify({"message": "Internal Error"}), 500


@app.route("/api/storenewpass/<nip>", methods=["PATCH"])
def storeNewPassord(nip: int) -> tuple[Response, int]:
    if request.method == "PATCH":
        piloto: dict = request.get_json()
        with Session(engine) as session:
            modified_pilot = session.execute(select(Pilot).where(Pilot.nip == nip)).scalar_one()
            for k, v in piloto.items():
                setattr(modified_pilot, k, v)
            modified_pilot.recover = ""
            session.commit()

            return jsonify(modified_pilot.to_json()), 200
    return jsonify({"message": "Internal Error"}), 500


# api DATABASE routes
@app.route("/api/flights", methods=["GET", "POST"])
@jwt_required()  # new line
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


@app.route("/api/pilots", methods=["GET", "POST"])
@jwt_required()  # new line
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
@jwt_required()  # new line
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
        piloto: dict = request.get_json()
        with Session(engine) as session:
            modified_pilot = session.execute(select(Pilot).where(Pilot.nip == nip)).scalar_one()
            for k, v in piloto.items():
                setattr(modified_pilot, k, v)

            session.commit()
            return jsonify(modified_pilot.to_json()), 200

    return jsonify({"message": "Bad Manual Request"}), 403


@app.route("/api/flights/<flight_id>", methods=["DELETE", "PATCH"])
@jwt_required()  # new line
def handle_flights(flight_id: int) -> tuple[Response, int]:
    if request.method == "DELETE":
        with Session(engine) as session:
            result = session.execute(delete(Flight).where(Flight.fid == flight_id))
            if result.rowcount == 1:
                session.commit()
                return jsonify({"deleted_id": f"Flight {flight_id}"}), 200

    return jsonify({"message": "Bad Manual Request"}), 403


if __name__ == "__main__":
    app.run(port=5051, debug=True)  # noqa: S201
