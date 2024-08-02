from __future__ import annotations  # noqa: D100, INP001

from datetime import date
from typing import List, Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)

date_init = "2000-01-01"
year_init = 2000


class Base(DeclarativeBase):
    """subclasses will be converted to dataclasses."""


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
    flight_pilots: Mapped[List[FlightPilots]] = relationship(
        back_populates="flight",
        cascade="all, delete",
        passive_deletes=True,
    )

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
        ForeignKey("flights_table.fid"),
        primary_key=True,
        # ondelete="CASCADE",
    )
    pilot_id: Mapped[int] = mapped_column(ForeignKey("pilots.nip"), primary_key=True)

    day_landings: Mapped[int]
    night_landings: Mapped[int]
    prec_app: Mapped[int]
    nprec_app: Mapped[int]
    qa1: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    qa2: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    bsp1: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    bsp2: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    ta: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    vrp1: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)
    vrp2: Mapped[Optional[bool]]  # = mapped_column(nullable=True, default=False)

    pilot: Mapped[Pilot] = relationship(back_populates="flight_pilots")
    flight: Mapped[Flight] = relationship(back_populates="flight_pilots")

    def __repr__(self):
        rep = f"Piloto: {self.pilot.name} Aterragens={self.day_landings} no airtask {self.flight.airtask} "
        if self.qa1:
            rep += "QA1"
        return rep

    def to_json(self):
        response = {
            "pilotName": self.pilot.name,
            "nip": self.pilot.nip,
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

    qualification: Mapped[Qualification] = relationship(
        "Qualification",
        back_populates="pilot",
    )
    flight_pilots: Mapped[List[FlightPilots]] = relationship(back_populates="pilot")

    def __repr__(self):
        return super().__repr__() + self.qualification.__repr__()

    def to_json(self) -> dict:
        result = super().to_json()
        result["qualification"] = self.qualification.to_json()
        return result


class Qualification(Base):
    __tablename__ = "qualifications"

    pilot_id: Mapped[int] = mapped_column(ForeignKey("pilots.nip"), primary_key=True)
    pilot: Mapped[Pilot] = relationship(back_populates="qualification")
    last_day_landings: Mapped[str] = mapped_column(default=date_init)
    last_night_landings: Mapped[str] = mapped_column(default=date_init)
    last_prec_app: Mapped[str] = mapped_column(default=date_init)
    last_nprec_app: Mapped[str] = mapped_column(default=date_init)
    last_qa1_date: Mapped[date] = mapped_column(insert_default=date(year_init, 1, 1))
    last_qa2_date: Mapped[date] = mapped_column(insert_default=date(year_init, 1, 1))
    last_bsp1_date: Mapped[date] = mapped_column(insert_default=date(year_init, 1, 1))
    last_bsp2_date: Mapped[date] = mapped_column(insert_default=date(year_init, 1, 1))
    last_ta_date: Mapped[date] = mapped_column(insert_default=date(year_init, 1, 1))
    last_vrp1_date: Mapped[date] = mapped_column(insert_default=date(year_init, 1, 1))
    last_vrp2_date: Mapped[date] = mapped_column(insert_default=date(year_init, 1, 1))

    def update(self, data: FlightPilots, date: date):
        if data.qa1 and date > self.last_qa1_date:
            self.last_qa1_date = date

        if data.qa2 and date > self.last_qa2_date:
            self.last_qa2_date = date

        if data.bsp1 and date > self.last_bsp1_date:
            self.last_bsp1_date = date

        if data.bsp2 and date > self.last_qa2_date:
            self.last_qa2_date = date
        if data.ta and date > self.last_ta_date:
            self.last_ta_date = date
        if data.vrp1 and date > self.last_vrp1_date:
            self.last_vrp1_date = date
        if data.ta and date > self.last_vrp2_date:
            self.last_vrp2_date = date

        self.last_day_landings = Qualification.get_last_five(
            self.last_day_landings.split(),
            data.day_landings,
            date.strftime("%Y-%m-%d"),
        )
        self.last_night_landings = Qualification.get_last_five(
            self.last_night_landings.split(),
            data.night_landings,
            date.strftime("%Y-%m-%d"),
        )
        self.last_prec_app = Qualification.get_last_five(
            self.last_prec_app.split(),
            data.prec_app,
            date.strftime("%Y-%m-%d"),
        )
        self.last_nprec_app = Qualification.get_last_five(
            self.last_nprec_app.split(),
            data.nprec_app,
            date.strftime("%Y-%m-%d"),
        )
        return self

    def __repr__(self) -> str:
        return f"\nATR:{self.last_day_landings} QA1: {self.last_qa1_date}\n"

    def to_json(self) -> dict:
        return {
            "lastDayLandings": [date for date in self.last_day_landings.split()],
            "lastNightLandings": [date for date in self.last_night_landings.split()],
            "lastPrecApp": [date for date in self.last_prec_app.split()],
            "lastNprecApp": [date for date in self.last_nprec_app.split()],
            "lastQA1": self.last_qa1_date.strftime("%Y-%m-%d"),
            "lastQA2": self.last_qa2_date.strftime("%Y-%m-%d"),
            "lastBSP1": self.last_bsp1_date.strftime("%Y-%m-%d"),
            "lastBSP2": self.last_bsp2_date.strftime("%Y-%m-%d"),
            "lastTA": self.last_ta_date.strftime("%Y-%m-%d"),
            "lastVRP1": self.last_vrp1_date.strftime("%Y-%m-%d"),
            "lastVRP2": self.last_vrp2_date.strftime("%Y-%m-%d"),
        }

    @staticmethod
    def get_last_five(last: list, number: int, date: str) -> str:
        for n in range(number):
            last.append(date)
            if len(last) > 5:
                last.sort()
                last.pop(0)
        string = " ".join(last)
        return string


# class Crew(People):
#     __tablename__ = "crew"

#     def __init__(self, nip, name, rank, position):
#         super().__init__(nip, name, rank, position)
