from datetime import date

from config import engine
from models import Base, Flight, FlightPilots, Pilot, Qualification
from sqlalchemy.orm import Session

today = date.today()


# engine = create_engine("sqlite:///mydb.db", echo=False)
Base.metadata.create_all(bind=engine)


a = []
pilot1 = Pilot(
    nip=135885,
    name="Tiago",
    rank="CAP",
    position="PC",
    email="tfp.branco@gmail.com",
    password="12345",
    admin=1,
    qualification=Qualification(),
)
a.append(pilot1)
pilot2 = Pilot(
    nip=131464,
    name="Pedro Andrade",
    rank="MAJ",
    position="CP",
    email="pedro.miguel.rosa.andrade@gmail.com",
    password="123745",
    admin=1,
    qualification=Qualification(),
)
a.append(pilot2)

with Session(engine) as session:
    session.add_all(a)
    session.commit()


f: dict = {
    "airtask": "65A0020",
    "date": today,
    "origin": "LPMT",
    "destination": "LPMT",
    "ATD": "10:00",
    "ATA": "11:00",
    "pilots": [
        {
            "nip": 135885,
            "ATR": 1,
            "ATN": 5,
            "P": 0,
            "NP": 0,
            "QA1": True,
            "QA2": False,
            "BSP1": False,
            "BSP2": False,
            "TA": False,
            "VRP1": False,
            "VRP2": False,
        },
        {
            "nip": 135887,
            "ATR": 6,
            "ATN": 3,
            "P": 1,
            "NP": 1,
            "QA1": False,
            "QA2": False,
            "BSP1": False,
            "BSP2": False,
            "TA": False,
            "VRP1": False,
            "VRP2": False,
        },
    ],
}


def insert_flight(f: dict):
    flight = Flight(
        airtask=f["airtask"],
        date=f["date"],
        origin=f["origin"],
        destination=f["destination"],
        departure_time=f["ATD"],
        arrival_time=f["ATA"],
    )

    with Session(engine, autoflush=False) as session:
        session.add(flight)
        for pilot in f["pilots"]:
            pilot_obj = session.get(Pilot, pilot["nip"])
            qual = session.get(Qualification, pilot["nip"])

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


# insert_flight(f)
