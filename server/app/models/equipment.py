from sqlalchemy import String, Float, Boolean, ForeignKey, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.mixins import TimestampMixin
from app.models.enums import EquipmentCategory


class Equipment(Base, TimestampMixin):
    __tablename__ = "equipment"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[EquipmentCategory] = mapped_column(Enum(EquipmentCategory), nullable=False, index=True)
    location: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    price_per_day: Mapped[float] = mapped_column(Float, nullable=False)
    availability: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    image: Mapped[str] = mapped_column(String(500), nullable=False)

    owner: Mapped["User"] = relationship(back_populates="equipment")
    bookings: Mapped[list["Booking"]] = relationship(
        back_populates="equipment", cascade="all, delete-orphan"
    )
