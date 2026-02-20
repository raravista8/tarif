import enum
from datetime import datetime, timezone

from sqlalchemy import String, Boolean, Text, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class OperatorType(str, enum.Enum):
    MNO = "mno"
    MVNO = "mvno"
    REGIONAL = "regional"


class Operator(Base):
    __tablename__ = "operators"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    logo_url: Mapped[str | None] = mapped_column(String(500))
    website: Mapped[str] = mapped_column(String(500))
    operator_type: Mapped[OperatorType] = mapped_column(SAEnum(OperatorType), default=OperatorType.MNO)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    description: Mapped[str | None] = mapped_column(Text)
    parser_status: Mapped[str] = mapped_column(String(20), default="ok")
    auto_publish: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    tariffs: Mapped[list["Tariff"]] = relationship(back_populates="operator", lazy="selectin")  # noqa: F821
    benefits: Mapped[list["Benefit"]] = relationship(back_populates="operator", lazy="selectin")  # noqa: F821
