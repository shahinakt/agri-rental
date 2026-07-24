from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.booking import BookingCreate, BookingStatusUpdate, BookingOut
from app.services import booking_service
from app.auth.dependencies import get_current_user, require_role
from app.models.user import User
from app.models.enums import UserRole

router = APIRouter(prefix="/api", tags=["booking"])


@router.post("/booking", response_model=BookingOut, status_code=201)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    farmer: User = Depends(require_role(UserRole.FARMER)),
):
    return booking_service.create_booking(db, farmer, data)


@router.get("/bookings", response_model=list[BookingOut])
def list_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == UserRole.FARMER:
        return booking_service.list_bookings_for_farmer(db, current_user.id)
    return booking_service.list_bookings_for_owner(db, current_user.id)


@router.patch("/booking/{booking_id}", response_model=BookingOut)
def update_booking(
    booking_id: int,
    data: BookingStatusUpdate,
    db: Session = Depends(get_db),
    owner: User = Depends(require_role(UserRole.OWNER)),
):
    return booking_service.update_booking_status(db, booking_id, owner, data.status)
