from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.region import Region


async def get_all_regions(db: AsyncSession) -> list[Region]:
    result = await db.execute(select(Region).order_by(Region.name))
    return list(result.scalars().all())


async def get_region_by_slug(db: AsyncSession, slug: str) -> Region | None:
    result = await db.execute(select(Region).where(Region.slug == slug))
    return result.scalars().first()
