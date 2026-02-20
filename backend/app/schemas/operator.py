from datetime import datetime

from pydantic import BaseModel

from app.models.operator import OperatorType


class OperatorOut(BaseModel):
    id: int
    slug: str
    name: str
    logo_url: str | None = None
    website: str
    operator_type: OperatorType
    is_active: bool
    description: str | None = None
    parser_status: str
    auto_publish: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OperatorCreate(BaseModel):
    slug: str
    name: str
    logo_url: str | None = None
    website: str
    operator_type: OperatorType = OperatorType.MNO
    description: str | None = None


class OperatorUpdate(BaseModel):
    name: str | None = None
    logo_url: str | None = None
    website: str | None = None
    is_active: bool | None = None
    description: str | None = None
    auto_publish: bool | None = None
