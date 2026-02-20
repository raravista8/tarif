from datetime import datetime

from pydantic import BaseModel

from app.models.tariff import TariffStatus, ConnectionType


class OperatorShort(BaseModel):
    id: int
    slug: str
    name: str
    logo_url: str | None = None

    class Config:
        from_attributes = True


class RegionShort(BaseModel):
    id: int
    slug: str
    name: str

    class Config:
        from_attributes = True


class TariffOptionOut(BaseModel):
    id: int
    name: str
    value: str

    class Config:
        from_attributes = True


class TariffOut(BaseModel):
    id: int
    name: str
    slug: str
    price: float
    internet_gb: float | None = None
    internet_unlimited: bool = False
    minutes: int | None = None
    minutes_unlimited: bool = False
    sms: int | None = None
    sms_unlimited: bool = False
    unlimited_socials: bool = False
    unlimited_messengers: bool = False
    unlimited_music: bool = False
    unlimited_video: bool = False
    family_tariff: bool = False
    esim: bool = False
    tethering: bool = False
    connection_type: ConnectionType = ConnectionType.ALL
    description: str | None = None
    features: str | None = None
    source_url: str
    status: TariffStatus
    is_promo: bool = False
    promo_end_date: datetime | None = None
    operator: OperatorShort
    regions: list[RegionShort] = []
    options: list[TariffOptionOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TariffListOut(BaseModel):
    items: list[TariffOut]
    total: int
    page: int
    per_page: int


class TariffFilter(BaseModel):
    region_slug: str | None = None
    max_price: float | None = None
    min_internet_gb: float | None = None
    internet_unlimited: bool | None = None
    min_minutes: int | None = None
    minutes_unlimited: bool | None = None
    min_sms: int | None = None
    sms_unlimited: bool | None = None
    unlimited_socials: bool | None = None
    unlimited_messengers: bool | None = None
    unlimited_music: bool | None = None
    family_tariff: bool | None = None
    esim: bool | None = None
    tethering: bool | None = None
    operator_slug: str | None = None
    sort_by: str = "price"
    sort_order: str = "asc"
    page: int = 1
    per_page: int = 20


class TariffCreate(BaseModel):
    operator_id: int
    name: str
    slug: str
    price: float
    internet_gb: float | None = None
    internet_unlimited: bool = False
    minutes: int | None = None
    minutes_unlimited: bool = False
    sms: int | None = None
    sms_unlimited: bool = False
    unlimited_socials: bool = False
    unlimited_messengers: bool = False
    unlimited_music: bool = False
    unlimited_video: bool = False
    family_tariff: bool = False
    esim: bool = False
    tethering: bool = False
    connection_type: ConnectionType = ConnectionType.ALL
    description: str | None = None
    features: str | None = None
    source_url: str
    region_ids: list[int] = []


class TariffUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    internet_gb: float | None = None
    internet_unlimited: bool | None = None
    minutes: int | None = None
    minutes_unlimited: bool | None = None
    sms: int | None = None
    sms_unlimited: bool | None = None
    unlimited_socials: bool | None = None
    unlimited_messengers: bool | None = None
    unlimited_music: bool | None = None
    unlimited_video: bool | None = None
    family_tariff: bool | None = None
    esim: bool | None = None
    tethering: bool | None = None
    description: str | None = None
    features: str | None = None
    source_url: str | None = None
    status: TariffStatus | None = None
    region_ids: list[int] | None = None
