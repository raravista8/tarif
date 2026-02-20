from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_admin_user
from app.models.benefit import Benefit, BenefitType
from app.models.user import User
from app.schemas.benefit import BenefitOut, BenefitCreate, BenefitUpdate
from app.services.benefit_service import get_benefits, get_benefit_by_id

router = APIRouter(prefix="/benefits", tags=["benefits"])


@router.get("", response_model=list[BenefitOut])
async def list_benefits(
    benefit_type: BenefitType | None = None,
    operator_slug: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    benefits = await get_benefits(db, benefit_type=benefit_type, operator_slug=operator_slug)
    return [BenefitOut.model_validate(b) for b in benefits]


@router.get("/{benefit_id}", response_model=BenefitOut)
async def get_benefit(benefit_id: int, db: AsyncSession = Depends(get_db)):
    benefit = await get_benefit_by_id(db, benefit_id)
    if not benefit:
        raise HTTPException(status_code=404, detail="Benefit not found")
    return BenefitOut.model_validate(benefit)


@router.post("", response_model=BenefitOut, status_code=201)
async def create_benefit(
    data: BenefitCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    benefit = Benefit(**data.model_dump())
    db.add(benefit)
    await db.commit()
    await db.refresh(benefit)
    return BenefitOut.model_validate(benefit)


@router.patch("/{benefit_id}", response_model=BenefitOut)
async def update_benefit(
    benefit_id: int,
    data: BenefitUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    benefit = await get_benefit_by_id(db, benefit_id)
    if not benefit:
        raise HTTPException(status_code=404, detail="Benefit not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(benefit, field, value)
    await db.commit()
    await db.refresh(benefit)
    return BenefitOut.model_validate(benefit)
