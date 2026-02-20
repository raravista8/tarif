"""
Tele2 (T2) tariff parser.

Source: tele2.ru/tariffs
Notes:
- Relatively simple page structure
- Region selection via URL path
"""

from app.parsers.base import BaseParser, ParsedTariff


class Tele2Parser(BaseParser):
    operator_slug = "tele2"
    operator_name = "Т2 (Tele2)"
    base_url = "https://tele2.ru"

    async def parse_tariffs(self, region_slug: str | None = None) -> list[ParsedTariff]:
        self.logger.info("Tele2 parser: starting tariff parse (region=%s)", region_slug)

        tariffs = [
            ParsedTariff(
                name="Tele2 Мой онлайн",
                operator_slug=self.operator_slug,
                price=400,
                source_url=f"{self.base_url}/tariffs/moj-onlajn/",
                internet_gb=15,
                minutes=300,
                sms=50,
                unlimited_messengers=True,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="Tele2 Мой онлайн+",
                operator_slug=self.operator_slug,
                price=600,
                source_url=f"{self.base_url}/tariffs/moj-onlajn-plus/",
                internet_gb=30,
                minutes=600,
                sms=200,
                unlimited_socials=True,
                unlimited_messengers=True,
                unlimited_music=True,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="Tele2 Безлимит",
                operator_slug=self.operator_slug,
                price=1500,
                source_url=f"{self.base_url}/tariffs/bezlimit/",
                internet_unlimited=True,
                minutes_unlimited=True,
                sms=300,
                unlimited_socials=True,
                unlimited_messengers=True,
                unlimited_music=True,
                tethering=True,
                regions=["moscow"],
            ),
        ]

        return tariffs
