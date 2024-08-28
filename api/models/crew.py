from __future__ import annotations  # noqa: D100, INP001

from datetime import date
from typing import TYPE_CHECKING, List

from models.users import Base, People, year_init
from sqlalchemy import ForeignKey
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

if TYPE_CHECKING:
    from flights import FlightCrew


class Crew(People, Base):
    __tablename__ = "crew"

    qualification: Mapped[QualificationCrew] = relationship(
        "QualificationCrew",
        back_populates="crew",
        cascade="all, delete",
        passive_deletes=True,
    )
    flight_crew: Mapped[List[FlightCrew]] = relationship(back_populates="crew")

    def to_json(self, qualification_data: bool = False) -> dict:
        """Return all model data in JSON format."""
        result = super().to_json()
        if qualification_data:
            result["qualification"] = self.qualification.to_json()
        return result


class QualificationCrew(Base):
    __tablename__ = "qualifications_crew"

    crew_id: Mapped[int] = mapped_column(ForeignKey("crew.nip"), primary_key=True)
    crew: Mapped[Crew] = relationship(back_populates="qualification")
    last_bsoc_date: Mapped[date] = mapped_column(insert_default=date(year_init, 1, 1))

    def to_json(self) -> dict:
        """Return all model data in JSON format."""
        return {
            "lastBSOC": self.last_bsoc_date.strftime("%Y-%m-%d"),
        }

    def update(self, data: FlightCrew, date: date) -> QualificationCrew:
        """Update with Last qualification date."""
        if data.bsoc and date > self.last_bsoc_date:
            self.last_bsoc_date = date

        return self
