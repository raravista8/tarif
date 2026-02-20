from pydantic import BaseModel


class RegionOut(BaseModel):
    id: int
    slug: str
    name: str
    federal_district: str | None = None

    class Config:
        from_attributes = True


class RegionCreate(BaseModel):
    slug: str
    name: str
    federal_district: str | None = None
    timezone: str | None = None
