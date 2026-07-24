from sqlalchemy import or_
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.equipment import Equipment
from app.models.booking import Booking
from app.models.enums import BookingStatus
from app.models.user import User
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate
from app.utils.pagination import paginate_params, total_pages


def create_equipment(db: Session, owner: User, data: EquipmentCreate) -> Equipment:
    equipment = Equipment(owner_id=owner.id, **data.model_dump())
    db.add(equipment)
    db.commit()
    db.refresh(equipment)
    return equipment


def get_equipment_or_404(db: Session, equipment_id: int) -> Equipment:
    equipment = db.get(Equipment, equipment_id)
    if not equipment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found")
    return equipment


def update_equipment(db: Session, equipment_id: int, owner: User, data: EquipmentUpdate) -> Equipment:
    equipment = get_equipment_or_404(db, equipment_id)
    if equipment.owner_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your equipment")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(equipment, field, value)

    db.commit()
    db.refresh(equipment)
    return equipment


def delete_equipment(db: Session, equipment_id: int, owner: User) -> None:
    equipment = get_equipment_or_404(db, equipment_id)
    if equipment.owner_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your equipment")

    active_booking = (
        db.query(Booking)
        .filter(
            Booking.equipment_id == equipment_id,
            Booking.status.in_([BookingStatus.PENDING, BookingStatus.APPROVED]),
        )
        .first()
    )
    if active_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete equipment with active or pending bookings",
        )

    db.delete(equipment)
    db.commit()


def list_equipment(
    db: Session,
    search: str | None,
    category: str | None,
    location: str | None,
    sort: str | None,
    page: int,
    page_size: int,
    owner_id: int | None = None,
):
    query = db.query(Equipment)

    if owner_id is not None:
        query = query.filter(Equipment.owner_id == owner_id)
    else:
        query = query.filter(Equipment.availability == True)  # noqa: E712

    if search:
        query = query.filter(Equipment.title.ilike(f"%{search}%"))

    if category:
        query = query.filter(Equipment.category == category)

    if location:
        query = query.filter(Equipment.location.ilike(f"%{location}%"))

    if sort == "price_asc":
        query = query.order_by(Equipment.price_per_day.asc())
    elif sort == "price_desc":
        query = query.order_by(Equipment.price_per_day.desc())
    else:
        query = query.order_by(Equipment.created_at.desc())

    total = query.count()
    offset, limit = paginate_params(page, page_size)
    items = query.offset(offset).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages(total, page_size),
    }
