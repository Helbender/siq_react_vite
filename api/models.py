from datetime import date, datetime
from typing import List, Optional
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)


class Base(DeclarativeBase):
    """subclasses will be converted to dataclasses"""

    pass


class People:
    # __tablename__: str = ""

    nip: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    rank: Mapped[str]
    position: Mapped[str]

    def __repr__(self):
        return f"{self.rank} {self.nip} {self.name}. I'm a {self.position}"

    def to_json(self):
        return {
            "nip": self.nip,
            "name": self.name,
            "rank": self.rank,
            "position": self.position,
        }


class Flight(Base):
    __tablename__ = "flights_table"

    fid: Mapped[int] = mapped_column(primary_key=True)
    airtask: Mapped[str] = mapped_column(nullable=False)
    date: Mapped[date]
    origin: Mapped[str] = mapped_column(String(4))
    destination: Mapped[str] = mapped_column(String(4))
    departure_time: Mapped[str]
    arrival_time: Mapped[str]
    flight_pilots: Mapped[List["FlightPilots"]] = relationship(back_populates="flight")

    def __repr__(self):
        return f"{self.__class__}\nid: {self.fid} airtask: {self.airtask} Data: {self.date}\nDe {self.origin} para {self.destination}\nATD: {self.departure_time}\tATA: {self.arrival_time}"

    def to_json(self):
        return {
            "id": self.fid,
            "airtask": self.airtask,
            "date": self.date,
            "origin": self.origin,
            "destination": self.destination,
            "ATD": self.departure_time,
            "ATA": self.arrival_time,
        }


class FlightPilots(Base):
    __tablename__ = "flight_pilots"

    flight_id: Mapped[int] = mapped_column(
        ForeignKey("flights_table.fid"), primary_key=True
    )
    pilot_id: Mapped[int] = mapped_column(ForeignKey("pilots.nip"), primary_key=True)

    day_landings: Mapped[Optional[str]]
    night_landings: Mapped[Optional[str]]
    prec_app: Mapped[Optional[str]]
    nprec_app: Mapped[Optional[str]]
    qa1: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    qa2: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    bsp1: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    bsp2: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    ta: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    vrp1: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    vrp2: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)

    pilot: Mapped["Pilot"] = relationship(back_populates="flight_pilots")
    flight: Mapped["Flight"] = relationship(back_populates="flight_pilots")

    def __repr__(self):
        rep = f"Piloto: {self.pilot.name} Aterragens={self.day_landings} no airtask {self.flight.airtask} "
        if self.qa1:
            rep += "QA1"
        return rep

    def to_json(self):
        response = {
            "pilotName": self.pilot.name,
            "ATR": self.day_landings,
            "ATN": self.night_landings,
            "P": self.prec_app,
            "NP": self.nprec_app,
        }
        if self.qa1:
            response["QA1"] = self.qa1
        if self.qa2:
            response["QA2"] = self.qa2
        if self.bsp1:
            response["BSP1"] = self.bsp1
        if self.bsp2:
            response["BSP2"] = self.bsp2
        if self.ta:
            response["TA"] = self.ta
        if self.vrp1:
            response["VRP1"] = self.vrp1
        if self.vrp2:
            response["VRP2"] = self.vrp2

        return response


class Pilot(People, Base):
    __tablename__ = "pilots"

    qualification: Mapped["Qualification"] = relationship(
        "Qualification", back_populates="pilot"
    )
    flight_pilots: Mapped[List[FlightPilots]] = relationship(back_populates="pilot")


class Qualification(Base):
    __tablename__ = "qualifications"

    pilot_id: Mapped[int] = mapped_column(ForeignKey("pilots.nip"), primary_key=True)
    pilot: Mapped["Pilot"] = relationship(back_populates="qualification")
    last_day_landings: Mapped[Optional[datetime]]
    last_night_landings: Mapped[Optional[datetime]]
    last_qa1_date: Mapped[Optional[datetime]]
    last_qa2_date: Mapped[Optional[datetime]]
    last_bsp1_date: Mapped[Optional[datetime]]
    last_bsp2_date: Mapped[Optional[datetime]]
    last_ta_date: Mapped[Optional[datetime]]
    last_vrp1_date: Mapped[Optional[datetime]]
    last_vrp2_date: Mapped[Optional[datetime]]


# class Crew(People):
#     __tablename__ = "crew"

#     def __init__(self, nip, name, rank, position):
#         super().__init__(nip, name, rank, position)
