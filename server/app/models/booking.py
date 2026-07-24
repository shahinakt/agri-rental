from datetime import date
from sqlalchemy import Float, ForeignKey, Enum, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.mixins import TimestampMixin
from app.models.enums import BookingStatus


class Booking(Base, TimestampMixin):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    equipment_id: Mapped[int] = mapped_column(ForeignKey("equipment.id"), nullable=False)
    farmer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False
    )
    total_price: Mapped[float] = mapped_column(Float, nullable=False)

    equipment: Mapped["Equipment"] = relationship(back_populates="bookings")
    farmer: Mapped["User"] = relationship(back_populates="bookings")
