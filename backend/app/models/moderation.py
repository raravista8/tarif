import enum
from datetime import datetime, timezone

from sqlalchemy import String, Text, DateTime, Integer, ForeignKey, Enum as SAEnum, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ModerationAction(str, enum.Enum):
    NEW_TARIFF = "new_tariff"
    UPDATE_TARIFF = "update_tariff"
    REMOVE_TARIFF = "remove_tariff"
    NEW_BENEFIT = "new_benefit"
    UPDATE_BENEFIT = "update_benefit"


class ModerationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ModerationQueue(Base):
    __tablename__ = "moderation_queue"

    id: Mapped[int] = mapped_column(primary_key=True)
    action: Mapped[ModerationAction] = mapped_column(SAEnum(ModerationAction))
    status: Mapped[ModerationStatus] = mapped_column(
        SAEnum(ModerationStatus), default=ModerationStatus.PENDING, index=True
    )
    tariff_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("tariffs.id"), nullable=True)
    benefit_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("benefits.id"), nullable=True)
    old_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    new_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    diff_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    reviewed_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
