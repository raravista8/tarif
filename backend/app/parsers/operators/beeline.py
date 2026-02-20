"""
Beeline tariff parser.

Source: beeline.ru/customers/products/mobile/tariffs
Notes:
- SPA application, data loaded from internal API
- May need to reverse-engineer API endpoints
"""

from app.parsers.base import BaseParser, ParsedTariff


class BeelineParser(BaseParser):
    operator_slug = "beeline"
    operator_name = "Билайн"
    base_url = "https://beeline.ru"

    async def parse_tariffs(self, region_slug: str | None = None) -> list[ParsedTariff]:
        self.logger.info("Beeline parser: starting tariff parse (region=%s)", region_slug)

        tariffs = [
            ParsedTariff(
                name="Билайн UP",
                operator_slug=self.operator_slug,
                price=600,
                source_url=f"{self.base_url}/customers/products/mobile/tariffs/up/",
                internet_gb=20,
                minutes=500,
                sms=200,
                unlimited_messengers=True,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="Билайн Близкие люди",
                operator_slug=self.operator_slug,
                price=1200,
                source_url=f"{self.base_url}/customers/products/mobile/tariffs/blizkie-lyudi/",
                internet_gb=50,
                minutes=1000,
                sms=500,
                family_tariff=True,
                unlimited_socials=True,
                unlimited_messengers=True,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="Билайн Анлим",
                operator_slug=self.operator_slug,
                price=2200,
                source_url=f"{self.base_url}/customers/products/mobile/tariffs/unlim/",
                internet_unlimited=True,
                minutes_unlimited=True,
                sms_unlimited=True,
                unlimited_socials=True,
                unlimited_messengers=True,
                unlimited_music=True,
                tethering=True,
                esim=True,
                regions=["moscow"],
            ),
        ]

        return tariffs
