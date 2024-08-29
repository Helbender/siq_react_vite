from __future__ import annotations  # noqa: D100, INP001

import json

from config import engine
from models.crew import Crew, QualificationCrew
from models.pilots import Pilot, Qualification
from models.users import User
from sendemail import hash_code
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


def download():
    with Session(engine) as session:
        lista = session.execute(select(Pilot)).scalars()
        lista2 = session.execute(select(Crew)).scalars()
        lista3 = session.execute(select(User)).scalars()

        with open("user_base.json", "w") as file:
            d = {"pilots": [], "crew": [], "users": []}
            for a in lista:
                d["pilots"].append(a.to_json())

            for b in lista2:
                d["crew"].append(b.to_json())
            for c in lista3:
                d["users"].append(c.to_json())
            json.dump(d, file, indent=4)


def upload():
    with open("user_base.json") as file:
        lista = json.load(file)
        with Session(engine) as session:
            for item in lista["pilots"]:
                obj = Pilot(qualification=Qualification())
                for k, v in item.items():
                    if k == "qualification":
                        continue
                    setattr(obj, k, v)
                obj.password = hash_code("12345")
                # print(obj.to_json())
                session.add(obj)
            for item in lista["crew"]:
                obj = Crew(qualification=QualificationCrew())
                for k, v in item.items():
                    if k == "qualification":
                        continue
                    setattr(obj, k, v)
                obj.password = hash_code("12345")
                # print(obj.to_json())
                session.add(obj)
            for item in lista["users"]:
                obj = User()
                for k, v in item.items():
                    if k == "qualification":
                        continue
                    setattr(obj, k, v)
                obj.password = hash_code("12345")
                # print(obj.to_json())
                session.add(obj)
            try:
                session.commit()
            except IntegrityError as e:
                print(e)


if __name__ == "__main__":
    # download()
    upload()
