from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_admin_user
from app.models.moderation import ModerationQueue, ModerationStatus, ModerationAction
from app.models.tariff import Tariff, TariffStatus
from app.models.user import User
from app.schemas.moderation import ModerationQueueOut, ModerationReview

router = APIRouter(prefix="/moderation", tags=["moderation"])


@router.get("", response_model=list[ModerationQueueOut])
async def list_moderation_queue(
    status: ModerationStatus | None = ModerationStatus.PENDING,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    query = select(ModerationQueue)
    if status:
        query = query.where(ModerationQueue.status == status)
    query = query.order_by(ModerationQueue.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return [ModerationQueueOut.model_validate(item) for item in items]


@router.get("/stats")
async def moderation_stats(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    pending = (
        await db.execute(
            select(func.count()).select_from(ModerationQueue).where(
                ModerationQueue.status == ModerationStatus.PENDING
            )
        )
    ).scalar() or 0
    approved_today = (
        await db.execute(
            select(func.count())
            .select_from(ModerationQueue)
            .where(
                ModerationQueue.status == ModerationStatus.APPROVED,
                ModerationQueue.reviewed_at >= datetime.now(timezone.utc).replace(
                    hour=0, minute=0, second=0, microsecond=0
                ),
            )
        )
    ).scalar() or 0
    return {"pending": pending, "approved_today": approved_today}


@router.post("/{item_id}/review", response_model=ModerationQueueOut)
async def review_item(
    item_id: int,
    review: ModerationReview,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    result = await db.execute(select(ModerationQueue).where(ModerationQueue.id == item_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Moderation item not found")
    if item.status != ModerationStatus.PENDING:
        raise HTTPException(status_code=400, detail="Item already reviewed")

    item.status = review.status
    item.reviewed_by = admin.id
    item.reviewed_at = datetime.now(timezone.utc)

    if review.status == ModerationStatus.APPROVED:
        if item.action == ModerationAction.NEW_TARIFF and item.tariff_id:
            tariff_result = await db.execute(select(Tariff).where(Tariff.id == item.tariff_id))
            tariff = tariff_result.scalars().first()
            if tariff:
                tariff.status = TariffStatus.PUBLISHED
        elif item.action == ModerationAction.REMOVE_TARIFF and item.tariff_id:
            tariff_result = await db.execute(select(Tariff).where(Tariff.id == item.tariff_id))
            tariff = tariff_result.scalars().first()
            if tariff:
                tariff.status = TariffStatus.ARCHIVED

    await db.commit()
    await db.refresh(item)
    return ModerationQueueOut.model_validate(item)
