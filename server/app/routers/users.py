from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.equipment import PaginatedEquipment
from app.services import equipment_service
from app.auth.dependencies import require_role
from app.models.user import User
from app.models.enums import UserRole

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me/equipment", response_model=PaginatedEquipment)
def get_my_equipment(
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
    owner: User = Depends(require_role(UserRole.OWNER)),
):
    return equipment_service.list_equipment(
        db, None, None, None, None, page, page_size, owner_id=owner.id
    )
