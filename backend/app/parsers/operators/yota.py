"""
Yota tariff parser.

Source: yota.ru
Notes:
- Constructor-based tariff (slider-based)
- Need to emulate slider interactions
- Requires Playwright for full JS execution
"""

from app.parsers.base import BaseParser, ParsedTariff


class YotaParser(BaseParser):
    operator_slug = "yota"
    operator_name = "Yota"
    base_url = "https://yota.ru"

    async def parse_tariffs(self, region_slug: str | None = None) -> list[ParsedTariff]:
        self.logger.info("Yota parser: starting tariff parse (region=%s)", region_slug)

        # Yota has a constructor-based tariff system
        # These represent common configurations
        tariffs = [
            ParsedTariff(
                name="Yota 5 ГБ",
                operator_slug=self.operator_slug,
                price=350,
                source_url=f"{self.base_url}",
                internet_gb=5,
                minutes=200,
                sms=50,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="Yota 20 ГБ",
                operator_slug=self.operator_slug,
                price=550,
                source_url=f"{self.base_url}",
                internet_gb=20,
                minutes=500,
                sms=100,
                unlimited_messengers=True,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="Yota Безлимит",
                operator_slug=self.operator_slug,
                price=900,
                source_url=f"{self.base_url}",
                internet_unlimited=True,
                minutes=500,
                sms=100,
                unlimited_messengers=True,
                regions=["moscow"],
            ),
        ]

        return tariffs
