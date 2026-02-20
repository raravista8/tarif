from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_admin_user
from app.models.user import User
from app.schemas.tariff import (
    TariffOut,
    TariffListOut,
    TariffFilter,
    TariffCreate,
    TariffUpdate,
)
from app.services.tariff_service import (
    get_tariffs,
    get_tariff_by_slug,
    get_best_tariffs,
    create_tariff,
    update_tariff,
)

router = APIRouter(prefix="/tariffs", tags=["tariffs"])


@router.get("", response_model=TariffListOut)
async def list_tariffs(
    region_slug: str | None = None,
    max_price: float | None = None,
    min_internet_gb: float | None = None,
    internet_unlimited: bool | None = None,
    min_minutes: int | None = None,
    minutes_unlimited: bool | None = None,
    min_sms: int | None = None,
    sms_unlimited: bool | None = None,
    unlimited_socials: bool | None = None,
    unlimited_messengers: bool | None = None,
    unlimited_music: bool | None = None,
    family_tariff: bool | None = None,
    esim: bool | None = None,
    tethering: bool | None = None,
    operator_slug: str | None = None,
    sort_by: str = "price",
    sort_order: str = "asc",
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    filters = TariffFilter(
        region_slug=region_slug,
        max_price=max_price,
        min_internet_gb=min_internet_gb,
        internet_unlimited=internet_unlimited,
        min_minutes=min_minutes,
        minutes_unlimited=minutes_unlimited,
        min_sms=min_sms,
        sms_unlimited=sms_unlimited,
        unlimited_socials=unlimited_socials,
        unlimited_messengers=unlimited_messengers,
        unlimited_music=unlimited_music,
        family_tariff=family_tariff,
        esim=esim,
        tethering=tethering,
        operator_slug=operator_slug,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        per_page=per_page,
    )
    tariffs, total = await get_tariffs(db, filters)
    return TariffListOut(
        items=[TariffOut.model_validate(t) for t in tariffs],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/best", response_model=list[TariffOut])
async def list_best_tariffs(
    region_slug: str | None = None,
    limit: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    tariffs = await get_best_tariffs(db, region_slug=region_slug, limit=limit)
    return [TariffOut.model_validate(t) for t in tariffs]


@router.get("/{slug}", response_model=TariffOut)
async def get_tariff(slug: str, db: AsyncSession = Depends(get_db)):
    tariff = await get_tariff_by_slug(db, slug)
    if not tariff:
        raise HTTPException(status_code=404, detail="Tariff not found")
    return TariffOut.model_validate(tariff)


@router.post("", response_model=TariffOut, status_code=201)
async def create_tariff_endpoint(
    data: TariffCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    tariff = await create_tariff(db, data)
    return TariffOut.model_validate(tariff)


@router.patch("/{slug}", response_model=TariffOut)
async def update_tariff_endpoint(
    slug: str,
    data: TariffUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    tariff = await get_tariff_by_slug(db, slug)
    if not tariff:
        raise HTTPException(status_code=404, detail="Tariff not found")
    tariff = await update_tariff(db, tariff, data)
    return TariffOut.model_validate(tariff)
