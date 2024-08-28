from __future__ import annotations  # noqa: D100, INP001

from datetime import date
from typing import TYPE_CHECKING, List

from models.users import Base, People, date_init, year_init
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

if TYPE_CHECKING:
    from flights import FlightPilots


class Pilot(People, Base):
    __tablename__ = "pilots"

    qualification: Mapped[Qualification] = relationship(
        "Qualification",
        back_populates="pilot",
        cascade="all, delete",
        passive_deletes=True,
    )
    flight_pilots: Mapped[List[FlightPilots]] = relationship(back_populates="pilot")

    def __repr__(self):
        repr = super().__repr__()
        repr["qualification"] = self.qualification.__repr__()
        return repr

    def to_json(self, qualification_data=False) -> dict:
        """Return all model data in JSON format."""
        result = super().to_json()
        if qualification_data:
            result["qualification"] = self.qualification.to_json()
        return result


class Qualification(Base):
    __tablename__ = "qualifications"

    pilot_id: Mapped[int] = mapped_column(ForeignKey("pilots.nip"), primary_key=True)
    pilot: Mapped[Pilot] = relationship(back_populates="qualification")

    last_day_landings: Mapped[str] = mapped_column(String(55), default=date_init)
    last_night_landings: Mapped[str] = mapped_column(String(55), default=date_init)
    last_prec_app: Mapped[str] = mapped_column(String(55), default=date_init)
    last_nprec_app: Mapped[str] = mapped_column(String(55), default=date_init)
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

        self.last_day_landings = Qualification._get_last_five(
            self.last_day_landings.split(),
            data.day_landings,
            date.strftime("%Y-%m-%d"),
        )
        self.last_night_landings = Qualification._get_last_five(
            self.last_night_landings.split(),
            data.night_landings,
            date.strftime("%Y-%m-%d"),
        )
        self.last_prec_app = Qualification._get_last_five(
            self.last_prec_app.split(),
            data.prec_app,
            date.strftime("%Y-%m-%d"),
        )
        self.last_nprec_app = Qualification._get_last_five(
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
    def _get_last_five(last: list, number: int, date: str) -> str:
        for n in range(number):
            last.append(date)
            if len(last) > 5:
                last.sort()
                last.pop(0)
        return " ".join(last)
