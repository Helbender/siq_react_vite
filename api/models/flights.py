from __future__ import annotations  # noqa: D100, INP001

from datetime import date
from typing import TYPE_CHECKING, List, Optional

from models.users import Base
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

if TYPE_CHECKING:
    from crew import Crew
    from pilots import Pilot


class Flight(Base):
    """Flight Model.

    Basic flight parameters and estabilish relations.

    :param Flight Pilots for the FlightPilot Table with each Pilot flight data (One-To-Many)
    :param Flight Crew for the FlightCrew Table with each Crew flight data (One-To-Many)

    """

    __tablename__: str = "flights_table"

    fid: Mapped[int] = mapped_column(primary_key=True)
    airtask: Mapped[str] = mapped_column(String(7), nullable=False)
    flight_type: Mapped[str] = mapped_column(String(4))
    flight_action: Mapped[str] = mapped_column(String(4))
    tailnumber: Mapped[int]
    date: Mapped[date]
    origin: Mapped[str] = mapped_column(String(4))
    destination: Mapped[str] = mapped_column(String(4))
    departure_time: Mapped[str] = mapped_column(String(5))
    arrival_time: Mapped[str] = mapped_column(String(5))
    total_time: Mapped[str] = mapped_column(String(5))
    atr: Mapped[int]
    passengers: Mapped[int]
    doe: Mapped[int]
    cargo: Mapped[int]
    number_of_crew: Mapped[int]
    orm: Mapped[int]
    fuel: Mapped[int]
    flight_pilots: Mapped[List[FlightPilots]] = relationship(  # noqa: UP006
        back_populates="flight",
        cascade="all, delete",
        passive_deletes=True,
    )
    flight_crew: Mapped[List[FlightCrew]] = relationship(  # noqa: UP006
        back_populates="flight",
        cascade="all, delete",
        passive_deletes=True,
    )

    def __repr__(self):
        # repr = self.to_json()
        return self.to_json()

    def to_json(self):
        return {
            "id": self.fid,
            "airtask": self.airtask,
            "date": self.date,
            "origin": self.origin,
            "destination": self.destination,
            "ATD": self.departure_time,
            "ATA": self.arrival_time,
            "ATE": self.total_time,
            "flightType": self.flight_type,
            "flightAction": self.flight_action,
            "tailNumber": self.tailnumber,
            "totalLandings": self.atr,
            "passengers": self.passengers,
            "doe": self.doe,
            "cargo": self.cargo,
            "numberOfCrew": self.number_of_crew,
            "orm": self.orm,
            "fuel": self.fuel,
        }


class FlightPilots(Base):
    __tablename__ = "flight_pilots"

    flight_id: Mapped[int] = mapped_column(
        ForeignKey("flights_table.fid"),
        primary_key=True,
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

    def to_json(self) -> dict:
        """Return all model data in JSON format."""
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


class FlightCrew(Base):
    __tablename__ = "flight_crew"

    flight_id: Mapped[int] = mapped_column(
        ForeignKey("flights_table.fid"),
        primary_key=True,
    )

    crew_id: Mapped[int] = mapped_column(ForeignKey("crew.nip"), primary_key=True)

    bsoc: Mapped[Optional[bool]]

    crew: Mapped[Crew] = relationship(back_populates="flight_crew")
    flight: Mapped[Flight] = relationship(back_populates="flight_crew")
