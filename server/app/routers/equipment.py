from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentOut, PaginatedEquipment
from app.services import equipment_service
from app.auth.dependencies import get_current_user, require_role
from app.models.user import User
from app.models.enums import UserRole

router = APIRouter(prefix="/api/equipment", tags=["equipment"])


@router.get("", response_model=PaginatedEquipment)
def list_equipment(
    search: str | None = None,
    category: str | None = None,
    location: str | None = None,
    sort: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return equipment_service.list_equipment(
        db, search, category, location, sort, page, page_size
    )


@router.get("/{equipment_id}", response_model=EquipmentOut)
def get_equipment(equipment_id: int, db: Session = Depends(get_db)):
    return equipment_service.get_equipment_or_404(db, equipment_id)


@router.post("", response_model=EquipmentOut, status_code=201)
def create_equipment(
    data: EquipmentCreate,
    db: Session = Depends(get_db),
    owner: User = Depends(require_role(UserRole.OWNER)),
):
    return equipment_service.create_equipment(db, owner, data)


@router.put("/{equipment_id}", response_model=EquipmentOut)
def update_equipment(
    equipment_id: int,
    data: EquipmentUpdate,
    db: Session = Depends(get_db),
    owner: User = Depends(require_role(UserRole.OWNER)),
):
    return equipment_service.update_equipment(db, equipment_id, owner, data)


@router.delete("/{equipment_id}", status_code=204)
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    owner: User = Depends(require_role(UserRole.OWNER)),
):
    equipment_service.delete_equipment(db, equipment_id, owner)
