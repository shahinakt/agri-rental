from datetime import date, datetime
from pydantic import BaseModel, Field, model_validator

from app.models.enums import BookingStatus


class BookingCreate(BaseModel):
    equipment_id: int
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date must be on or after start_date")
        return self


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


class BookingOut(BaseModel):
    id: int
    equipment_id: int
    farmer_id: int
    start_date: date
    end_date: date
    status: BookingStatus
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True
