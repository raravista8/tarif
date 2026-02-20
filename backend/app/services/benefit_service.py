from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.benefit import Benefit, BenefitType


async def get_benefits(
    db: AsyncSession,
    benefit_type: BenefitType | None = None,
    operator_slug: str | None = None,
) -> list[Benefit]:
    query = select(Benefit).options(selectinload(Benefit.operator)).where(Benefit.is_active.is_(True))

    if benefit_type:
        query = query.where(Benefit.benefit_type == benefit_type)

    if operator_slug:
        from app.models.operator import Operator

        query = query.join(Benefit.operator).where(Operator.slug == operator_slug)

    query = query.order_by(Benefit.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_benefit_by_id(db: AsyncSession, benefit_id: int) -> Benefit | None:
    query = select(Benefit).options(selectinload(Benefit.operator)).where(Benefit.id == benefit_id)
    result = await db.execute(query)
    return result.scalars().first()
