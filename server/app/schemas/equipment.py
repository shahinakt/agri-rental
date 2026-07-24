from datetime import datetime
from pydantic import BaseModel, Field

from app.models.enums import EquipmentCategory


class EquipmentBase(BaseModel):
    title: str = Field(min_length=3, max_length=150)
    description: str = Field(min_length=10)
    category: EquipmentCategory
    location: str = Field(min_length=2, max_length=100)
    price_per_day: float = Field(gt=0)
    image: str
    availability: bool = True


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=150)
    description: str | None = Field(default=None, min_length=10)
    category: EquipmentCategory | None = None
    location: str | None = Field(default=None, min_length=2, max_length=100)
    price_per_day: float | None = Field(default=None, gt=0)
    image: str | None = None
    availability: bool | None = None


class EquipmentOut(EquipmentBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedEquipment(BaseModel):
    items: list[EquipmentOut]
    total: int
    page: int
    page_size: int
    total_pages: int
