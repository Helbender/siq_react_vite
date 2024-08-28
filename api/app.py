from __future__ import annotations  # noqa: D100, INP001

import json
import os
from datetime import datetime, timedelta, timezone

from config import engine
from dotenv import load_dotenv
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    unset_jwt_cookies,
)
from models.crew import Crew
from models.pilots import Pilot
from models.users import User
from routes.api import api
from sendemail import hash_code, main
from sqlalchemy import select, union_all
from sqlalchemy.orm import Session

# logging.basicConfig(filename="record.log", level=logging.DEBUG)
load_dotenv(dotenv_path="./.env")
JWT_KEY: str = os.environ.get("JWT_KEY", "")
APPLY_CORS: bool = bool(os.environ.get("CORS", "False"))
print(APPLY_CORS)

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)
if APPLY_CORS:
    CORS(
        app,
        # origins="http://locahost:5173",
        allow_headers=[
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Credentials",
            #    "Access-Control-Allow-Origin"
        ],
        supports_credentials=True,
    )


application = app  # to work with CPANEL PYTHON APPS


# Main api resgistration
app.register_blueprint(api, url_prefix="/api")


# @app.before_request
# def authorize_token():
#     print(request.headers.get("Authorization"))
#     if request.endpoint == "api/flights":
#         try:
#             if request.method != "OPTIONS":  # <-- required
#                 auth_header = request.headers.get("Authorization")
#                 if "Bearer" in auth_header:
#                     token = auth_header.split(" ")[1]
#                     return token
#         except Exception as e:
#             return f"401 Unauthorized\n{e}\n\n", 401


# apli login routes
@app.after_request
def refresh_expiring_jwts(response: Response) -> Response:
    """Handle Token Expiration."""
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
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
            if hash_code(password) != pilot.password:
                # if password != pilot.password:
                return {"message": "Wrong password"}, 401

            access_token = create_access_token(
                identity=nip,
                additional_claims={"admin": pilot.admin, "name": pilot.name},
            )
            response = {"access_token": access_token}
            return response, 200
        return {"message": f"No user with NIP {nip}"}, 404
    return {"message": "Something went wrong in the server"}, 500


@app.route("/api/logout", methods=["POST"])
def logout():
    """Clear the login token on server side."""
    response = jsonify({"msg": "logout sucessful"})
    unset_jwt_cookies(response)
    return response, 200


@app.route("/api/recovery", methods=["POST"])
def recover_process():
    """Check token validity."""
    email = request.json.get("email")
    token = request.json.get("token")
    with Session(engine) as session:
        stmt = union_all(
            select(Pilot).where(Pilot.email == email),
            select(Crew).where(Crew.email == email),
            select(User).where(User.email == email),
        )

        stmt2 = select(Pilot, Crew, User).from_statement(stmt)
        tripulante = session.execute(stmt2).scalar_one_or_none()
        try:
            recover_data = json.loads(tripulante.recover)
            print(recover_data)
        except json.JSONDecodeError:
            return jsonify({"message": "Token already was used"}), 403

        if token == recover_data["token"]:
            now = datetime.now(timezone.utc)
            token_timestamp = datetime.fromisoformat(recover_data["timestamp"])
            exp_timestamp = now + timedelta(hours=12)
            if exp_timestamp > token_timestamp:
                tripulante.recover = ""
                session.commit()
                return jsonify({"message": "Token Valid", "nip": tripulante.nip}), 200

    return jsonify({"message": "Token Expired"}), 408


@app.route("/api/recover/<email>", methods=["POST"])
def recover_pass(email: str) -> tuple[Response, int]:
    with Session(engine) as session:
        stmt = union_all(
            select(Pilot).where(Pilot.email == email),
            select(Crew).where(Crew.email == email),
            select(User).where(User.email == email),
        )

        stmt2 = select(Pilot, Crew, User).from_statement(stmt)
        tripulante = session.execute(stmt2).scalar_one_or_none()
        if tripulante is None:
            return jsonify({"message": "User not found"}), 404
        json_data = main(email)
        tripulante.recover = json_data
        print(tripulante.recover)
        session.commit()
        return jsonify({"message": "Recovery email sent"}), 200

    return jsonify({"message": "Internal Error"}), 500


@app.route("/api/storenewpass/<nip>", methods=["PATCH"])
def store_new_passord(nip: int) -> tuple[Response, int]:
    if request.method == "PATCH":
        user: dict = request.get_json()
        if user["password"] == "":
            return jsonify({"msg": "Password can not be empty"}), 403
        with Session(engine) as session:
            stmt = union_all(
                select(Pilot).where(Pilot.nip == nip),
                select(Crew).where(Crew.nip == nip),
                select(User).where(User.nip == nip),
            )

            stmt2 = select(Pilot, Crew, User).from_statement(stmt)
            modified_user = session.execute(stmt2).scalar_one_or_none()
            print(type(modified_user))
            print(user["password"])
            print(hash_code(user["password"]))
            modified_user.password = hash_code(user["password"])
            # for k, v in user.items():
            #     setattr(modified_user, k, v)
            modified_user.recover = ""
            session.commit()
            return jsonify(modified_user.to_json()), 200
    return jsonify({"message": "Internal Error"}), 500


@app.route("/api/pilots/<position>", methods=["GET"])
@jwt_required()  # new line
def retrieve_pilots(position: str) -> tuple[Response, int]:
    """Placehold."""
    if request.method == "GET":
        # Retrieve all pilots from db
        with Session(engine) as session:
            stmt = select(Pilot).where(Pilot.position == position).order_by(Pilot.nip)
            result = session.execute(stmt).scalars().all()
            return jsonify([row.to_json(qualification_data=True) for row in result]), 200

    return jsonify({"message": "Bad Manual Request"}), 403


@app.route("/api/crew", methods=["GET"])
@jwt_required()  # new line
def retrieve_crew() -> tuple[Response, int]:
    """Placehold."""
    if request.method == "GET":
        # Retrieve all crew from db
        with Session(engine) as session:
            stmt = select(Crew).order_by(Crew.nip)
            result = session.execute(stmt).scalars().all()
            print(result)
            return jsonify([row.to_json(qualification_data=True) for row in result]), 200

    return jsonify({"message": "Bad Manual Request"}), 403


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5051, debug=True)  # noqa: S201
