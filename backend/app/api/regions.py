from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.region import RegionOut
from app.services.region_service import get_all_regions, get_region_by_slug

router = APIRouter(prefix="/regions", tags=["regions"])


@router.get("", response_model=list[RegionOut])
async def list_regions(db: AsyncSession = Depends(get_db)):
    regions = await get_all_regions(db)
    return [RegionOut.model_validate(r) for r in regions]


@router.get("/detect", response_model=RegionOut)
async def detect_region(request: Request, db: AsyncSession = Depends(get_db)):
    # Simplified: in production, use GeoIP2 database
    # For MVP, default to Moscow
    region = await get_region_by_slug(db, "moscow")
    if not region:
        raise HTTPException(status_code=404, detail="Default region not found")
    return RegionOut.model_validate(region)


@router.get("/{slug}", response_model=RegionOut)
async def get_region(slug: str, db: AsyncSession = Depends(get_db)):
    region = await get_region_by_slug(db, slug)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return RegionOut.model_validate(region)
