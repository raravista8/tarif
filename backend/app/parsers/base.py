import hashlib
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


@dataclass
class ParsedTariff:
    name: str
    operator_slug: str
    price: float
    source_url: str
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
    connection_type: str = "all"
    description: str | None = None
    features: str | None = None
    regions: list[str] = field(default_factory=list)
    is_promo: bool = False
    promo_end_date: datetime | None = None
    page_hash: str | None = None

    def compute_slug(self) -> str:
        base = f"{self.operator_slug}-{self.name}".lower()
        base = base.replace(" ", "-").replace("/", "-")
        # Remove non-ascii characters for slug
        slug = "".join(c for c in base if c.isascii() and (c.isalnum() or c == "-"))
        return slug[:300]


@dataclass
class ParsedBenefit:
    operator_slug: str
    benefit_type: str  # mnp, cashback, loyalty, promo
    title: str
    description: str | None = None
    conditions: str | None = None
    source_url: str | None = None
    end_date: datetime | None = None


class BaseParser(ABC):
    operator_slug: str
    operator_name: str
    base_url: str

    def __init__(self):
        self.logger = logging.getLogger(f"parser.{self.operator_slug}")

    @abstractmethod
    async def parse_tariffs(self, region_slug: str | None = None) -> list[ParsedTariff]:
        """Parse all tariffs from this operator."""
        pass

    async def parse_benefits(self) -> list[ParsedBenefit]:
        """Parse benefits (MNP offers, cashback, etc.). Optional."""
        return []

    async def check_page_changed(self, url: str, content: str) -> tuple[bool, str]:
        """Check if page content changed by comparing hashes."""
        new_hash = hashlib.sha256(content.encode()).hexdigest()
        return True, new_hash  # Always return True for now; implement DB comparison later

    async def run(self, region_slug: str | None = None) -> dict:
        """Run the full parser pipeline."""
        self.logger.info("Starting parse for %s", self.operator_name)
        try:
            tariffs = await self.parse_tariffs(region_slug)
            benefits = await self.parse_benefits()
            self.logger.info(
                "Parsed %d tariffs, %d benefits for %s",
                len(tariffs),
                len(benefits),
                self.operator_name,
            )
            return {
                "operator": self.operator_slug,
                "tariffs_count": len(tariffs),
                "benefits_count": len(benefits),
                "tariffs": tariffs,
                "benefits": benefits,
                "status": "ok",
                "parsed_at": datetime.now(timezone.utc).isoformat(),
            }
        except Exception as e:
            self.logger.error("Parse failed for %s: %s", self.operator_name, e)
            return {
                "operator": self.operator_slug,
                "status": "error",
                "error": str(e),
                "parsed_at": datetime.now(timezone.utc).isoformat(),
            }
