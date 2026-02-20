"""
MegaFon tariff parser.

Source: megafon.ru/tariffs
Notes:
- Regional selector with dynamic rendering
- May need Playwright for JS-rendered content
- Tariffs vary by region
"""

from app.parsers.base import BaseParser, ParsedTariff


class MegafonParser(BaseParser):
    operator_slug = "megafon"
    operator_name = "МегаФон"
    base_url = "https://megafon.ru"

    async def parse_tariffs(self, region_slug: str | None = None) -> list[ParsedTariff]:
        """
        Parse MegaFon tariffs.

        Implementation notes:
        - MegaFon uses dynamic JS rendering for tariffs
        - Region is selected via a dropdown that triggers API calls
        - Tariff pages: https://megafon.ru/tariffs/all/
        - Internal API endpoints may be available for direct data fetch
        """
        self.logger.info("MegaFon parser: starting tariff parse (region=%s)", region_slug)

        # TODO: Implement actual parsing with Playwright
        # For MVP, return sample data structure
        tariffs = [
            ParsedTariff(
                name="МегаФон Включайся!",
                operator_slug=self.operator_slug,
                price=550,
                source_url=f"{self.base_url}/tariffs/all/vklyuchajsya_obshchajsya/",
                internet_gb=15,
                minutes=500,
                sms=500,
                unlimited_messengers=True,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="МегаФон Без переплат",
                operator_slug=self.operator_slug,
                price=750,
                source_url=f"{self.base_url}/tariffs/all/bez_pereplat/",
                internet_gb=30,
                internet_unlimited=False,
                minutes=800,
                sms=500,
                unlimited_socials=True,
                unlimited_messengers=True,
                unlimited_music=True,
                tethering=True,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="МегаФон Premium",
                operator_slug=self.operator_slug,
                price=2500,
                source_url=f"{self.base_url}/tariffs/all/premium/",
                internet_unlimited=True,
                minutes_unlimited=True,
                sms_unlimited=True,
                unlimited_socials=True,
                unlimited_messengers=True,
                unlimited_music=True,
                unlimited_video=True,
                tethering=True,
                esim=True,
                regions=["moscow"],
            ),
        ]

        return tariffs
