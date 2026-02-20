from datetime import datetime

from pydantic import BaseModel

from app.models.benefit import BenefitType
from app.schemas.tariff import OperatorShort


class BenefitOut(BaseModel):
    id: int
    operator: OperatorShort
    benefit_type: BenefitType
    title: str
    description: str | None = None
    conditions: str | None = None
    source_url: str | None = None
    is_active: bool
    end_date: datetime | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BenefitCreate(BaseModel):
    operator_id: int
    benefit_type: BenefitType
    title: str
    description: str | None = None
    conditions: str | None = None
    source_url: str | None = None
    end_date: datetime | None = None


class BenefitUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    conditions: str | None = None
    is_active: bool | None = None
    end_date: datetime | None = None
