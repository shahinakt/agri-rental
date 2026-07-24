from datetime import date

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.booking import Booking
from app.models.equipment import Equipment
from app.models.enums import BookingStatus
from app.models.user import User
from app.schemas.booking import BookingCreate


def _has_overlap(db: Session, equipment_id: int, start: date, end: date) -> bool:
    overlapping = (
        db.query(Booking)
        .filter(
            Booking.equipment_id == equipment_id,
            Booking.status.in_([BookingStatus.PENDING, BookingStatus.APPROVED]),
            Booking.start_date <= end,
            Booking.end_date >= start,
        )
        .first()
    )
    return overlapping is not None


def create_booking(db: Session, farmer: User, data: BookingCreate) -> Booking:
    equipment = db.get(Equipment, data.equipment_id)
    if not equipment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found")

    if equipment.owner_id == farmer.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot book your own equipment",
        )

    if not equipment.availability:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This equipment is currently unavailable",
        )

    if _has_overlap(db, data.equipment_id, data.start_date, data.end_date):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Equipment is already booked for the selected dates",
        )

    days = (data.end_date - data.start_date).days + 1
    total_price = round(days * equipment.price_per_day, 2)

    booking = Booking(
        equipment_id=data.equipment_id,
        farmer_id=farmer.id,
        start_date=data.start_date,
        end_date=data.end_date,
        total_price=total_price,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def list_bookings_for_farmer(db: Session, farmer_id: int) -> list[Booking]:
    return (
        db.query(Booking)
        .filter(Booking.farmer_id == farmer_id)
        .order_by(Booking.created_at.desc())
        .all()
    )


def list_bookings_for_owner(db: Session, owner_id: int) -> list[Booking]:
    return (
        db.query(Booking)
        .join(Equipment, Booking.equipment_id == Equipment.id)
        .filter(Equipment.owner_id == owner_id)
        .order_by(Booking.created_at.desc())
        .all()
    )


def update_booking_status(
    db: Session, booking_id: int, owner: User, new_status: BookingStatus
) -> Booking:
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    equipment = db.get(Equipment, booking.equipment_id)
    if equipment.owner_id != owner.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the equipment owner can update this booking",
        )

    if booking.status != BookingStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending bookings can be updated",
        )

    booking.status = new_status
    db.commit()
    db.refresh(booking)
    return booking
