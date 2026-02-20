import enum
from datetime import datetime, timezone

from sqlalchemy import (
    String,
    Boolean,
    Text,
    DateTime,
    Float,
    Integer,
    ForeignKey,
    Enum as SAEnum,
    Table,
    Column,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


tariff_regions = Table(
    "tariff_regions",
    Base.metadata,
    Column("tariff_id", Integer, ForeignKey("tariffs.id", ondelete="CASCADE"), primary_key=True),
    Column("region_id", Integer, ForeignKey("regions.id", ondelete="CASCADE"), primary_key=True),
)


class TariffStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ConnectionType(str, enum.Enum):
    ALL = "all"
    NEW = "new"
    MNP = "mnp"


class Tariff(Base):
    __tablename__ = "tariffs"

    id: Mapped[int] = mapped_column(primary_key=True)
    operator_id: Mapped[int] = mapped_column(ForeignKey("operators.id"))
    name: Mapped[str] = mapped_column(String(300))
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True)
    price: Mapped[float] = mapped_column(Float)

    internet_gb: Mapped[float | None] = mapped_column(Float, nullable=True)
    internet_unlimited: Mapped[bool] = mapped_column(Boolean, default=False)
    minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    minutes_unlimited: Mapped[bool] = mapped_column(Boolean, default=False)
    sms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sms_unlimited: Mapped[bool] = mapped_column(Boolean, default=False)

    unlimited_socials: Mapped[bool] = mapped_column(Boolean, default=False)
    unlimited_messengers: Mapped[bool] = mapped_column(Boolean, default=False)
    unlimited_music: Mapped[bool] = mapped_column(Boolean, default=False)
    unlimited_video: Mapped[bool] = mapped_column(Boolean, default=False)
    family_tariff: Mapped[bool] = mapped_column(Boolean, default=False)
    esim: Mapped[bool] = mapped_column(Boolean, default=False)
    tethering: Mapped[bool] = mapped_column(Boolean, default=False)

    connection_type: Mapped[ConnectionType] = mapped_column(SAEnum(ConnectionType), default=ConnectionType.ALL)
    description: Mapped[str | None] = mapped_column(Text)
    features: Mapped[str | None] = mapped_column(Text)
    source_url: Mapped[str] = mapped_column(String(1000))

    status: Mapped[TariffStatus] = mapped_column(SAEnum(TariffStatus), default=TariffStatus.PENDING, index=True)
    is_promo: Mapped[bool] = mapped_column(Boolean, default=False)
    promo_end_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    page_hash: Mapped[str | None] = mapped_column(String(64))
    parsed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    operator: Mapped["Operator"] = relationship(back_populates="tariffs", lazy="selectin")  # noqa: F821
    regions: Mapped[list["Region"]] = relationship(secondary=tariff_regions, lazy="selectin")  # noqa: F821
    options: Mapped[list["TariffOption"]] = relationship(back_populates="tariff", lazy="selectin")


class TariffOption(Base):
    __tablename__ = "tariff_options"

    id: Mapped[int] = mapped_column(primary_key=True)
    tariff_id: Mapped[int] = mapped_column(ForeignKey("tariffs.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(200))
    value: Mapped[str] = mapped_column(String(500))

    tariff: Mapped["Tariff"] = relationship(back_populates="options")
