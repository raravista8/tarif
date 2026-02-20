from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_admin_user
from app.models.operator import Operator
from app.models.user import User
from app.schemas.operator import OperatorOut, OperatorCreate, OperatorUpdate

router = APIRouter(prefix="/operators", tags=["operators"])


@router.get("", response_model=list[OperatorOut])
async def list_operators(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Operator).where(Operator.is_active.is_(True)).order_by(Operator.name))
    operators = result.scalars().all()
    return [OperatorOut.model_validate(o) for o in operators]


@router.get("/{slug}", response_model=OperatorOut)
async def get_operator(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Operator).where(Operator.slug == slug))
    operator = result.scalars().first()
    if not operator:
        raise HTTPException(status_code=404, detail="Operator not found")
    return OperatorOut.model_validate(operator)


@router.post("", response_model=OperatorOut, status_code=201)
async def create_operator(
    data: OperatorCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    operator = Operator(**data.model_dump())
    db.add(operator)
    await db.commit()
    await db.refresh(operator)
    return OperatorOut.model_validate(operator)


@router.patch("/{slug}", response_model=OperatorOut)
async def update_operator(
    slug: str,
    data: OperatorUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    result = await db.execute(select(Operator).where(Operator.slug == slug))
    operator = result.scalars().first()
    if not operator:
        raise HTTPException(status_code=404, detail="Operator not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(operator, field, value)

    await db.commit()
    await db.refresh(operator)
    return OperatorOut.model_validate(operator)
