from sqlalchemy import select, func, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.tariff import Tariff, TariffStatus, tariff_regions
from app.models.region import Region
from app.schemas.tariff import TariffFilter, TariffCreate, TariffUpdate


async def get_tariffs(db: AsyncSession, filters: TariffFilter) -> tuple[list[Tariff], int]:
    query = (
        select(Tariff)
        .options(selectinload(Tariff.operator), selectinload(Tariff.regions), selectinload(Tariff.options))
        .where(Tariff.status == TariffStatus.PUBLISHED)
    )

    if filters.region_slug:
        query = query.join(tariff_regions).join(Region).where(Region.slug == filters.region_slug)

    if filters.max_price is not None:
        query = query.where(Tariff.price <= filters.max_price)

    if filters.operator_slug:
        from app.models.operator import Operator

        query = query.join(Tariff.operator).where(Operator.slug == filters.operator_slug)

    if filters.min_internet_gb is not None:
        query = query.where(
            or_(Tariff.internet_unlimited.is_(True), Tariff.internet_gb >= filters.min_internet_gb)
        )

    if filters.internet_unlimited:
        query = query.where(Tariff.internet_unlimited.is_(True))

    if filters.min_minutes is not None:
        query = query.where(or_(Tariff.minutes_unlimited.is_(True), Tariff.minutes >= filters.min_minutes))

    if filters.minutes_unlimited:
        query = query.where(Tariff.minutes_unlimited.is_(True))

    if filters.min_sms is not None:
        query = query.where(or_(Tariff.sms_unlimited.is_(True), Tariff.sms >= filters.min_sms))

    if filters.sms_unlimited:
        query = query.where(Tariff.sms_unlimited.is_(True))

    for attr in [
        "unlimited_socials",
        "unlimited_messengers",
        "unlimited_music",
        "family_tariff",
        "esim",
        "tethering",
    ]:
        val = getattr(filters, attr, None)
        if val:
            query = query.where(getattr(Tariff, attr).is_(True))

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    sort_col = getattr(Tariff, filters.sort_by, Tariff.price)
    if filters.sort_order == "desc":
        query = query.order_by(sort_col.desc())
    else:
        query = query.order_by(sort_col.asc())

    offset = (filters.page - 1) * filters.per_page
    query = query.offset(offset).limit(filters.per_page)

    result = await db.execute(query)
    tariffs = list(result.scalars().unique().all())
    return tariffs, total


async def get_tariff_by_slug(db: AsyncSession, slug: str) -> Tariff | None:
    query = (
        select(Tariff)
        .options(selectinload(Tariff.operator), selectinload(Tariff.regions), selectinload(Tariff.options))
        .where(Tariff.slug == slug)
    )
    result = await db.execute(query)
    return result.scalars().first()


async def get_best_tariffs(db: AsyncSession, region_slug: str | None = None, limit: int = 5) -> list[Tariff]:
    query = (
        select(Tariff)
        .options(selectinload(Tariff.operator), selectinload(Tariff.regions), selectinload(Tariff.options))
        .where(Tariff.status == TariffStatus.PUBLISHED)
    )

    if region_slug:
        query = query.join(tariff_regions).join(Region).where(Region.slug == region_slug)

    query = query.order_by(Tariff.price.asc()).limit(limit)
    result = await db.execute(query)
    return list(result.scalars().unique().all())


async def create_tariff(db: AsyncSession, data: TariffCreate) -> Tariff:
    tariff = Tariff(
        operator_id=data.operator_id,
        name=data.name,
        slug=data.slug,
        price=data.price,
        internet_gb=data.internet_gb,
        internet_unlimited=data.internet_unlimited,
        minutes=data.minutes,
        minutes_unlimited=data.minutes_unlimited,
        sms=data.sms,
        sms_unlimited=data.sms_unlimited,
        unlimited_socials=data.unlimited_socials,
        unlimited_messengers=data.unlimited_messengers,
        unlimited_music=data.unlimited_music,
        unlimited_video=data.unlimited_video,
        family_tariff=data.family_tariff,
        esim=data.esim,
        tethering=data.tethering,
        connection_type=data.connection_type,
        description=data.description,
        features=data.features,
        source_url=data.source_url,
    )
    if data.region_ids:
        regions = (await db.execute(select(Region).where(Region.id.in_(data.region_ids)))).scalars().all()
        tariff.regions = list(regions)

    db.add(tariff)
    await db.commit()
    await db.refresh(tariff)
    return tariff


async def update_tariff(db: AsyncSession, tariff: Tariff, data: TariffUpdate) -> Tariff:
    update_data = data.model_dump(exclude_unset=True)
    region_ids = update_data.pop("region_ids", None)

    for field, value in update_data.items():
        setattr(tariff, field, value)

    if region_ids is not None:
        regions = (await db.execute(select(Region).where(Region.id.in_(region_ids)))).scalars().all()
        tariff.regions = list(regions)

    await db.commit()
    await db.refresh(tariff)
    return tariff
