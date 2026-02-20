from datetime import datetime

from pydantic import BaseModel

from app.models.moderation import ModerationAction, ModerationStatus


class ModerationQueueOut(BaseModel):
    id: int
    action: ModerationAction
    status: ModerationStatus
    tariff_id: int | None = None
    benefit_id: int | None = None
    old_data: dict | None = None
    new_data: dict | None = None
    diff_summary: str | None = None
    reviewed_by: int | None = None
    reviewed_at: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ModerationReview(BaseModel):
    status: ModerationStatus
