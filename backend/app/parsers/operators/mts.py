"""
MTS tariff parser.

Source: mts.ru/personal/mobilnaya-svyaz/tarifi
Notes:
- Regional subdomain system
- Uses internal API requests for tariff data
- Tariffs vary significantly by region
"""

from app.parsers.base import BaseParser, ParsedTariff


class MTSParser(BaseParser):
    operator_slug = "mts"
    operator_name = "МТС"
    base_url = "https://mts.ru"

    async def parse_tariffs(self, region_slug: str | None = None) -> list[ParsedTariff]:
        """
        Parse MTS tariffs.

        Implementation notes:
        - MTS uses regional subdomains (e.g., moscow.mts.ru)
        - Tariff data can be fetched from internal API
        - Main page: mts.ru/personal/mobilnaya-svyaz/tarifi
        """
        self.logger.info("MTS parser: starting tariff parse (region=%s)", region_slug)

        tariffs = [
            ParsedTariff(
                name="МТС Тарифище",
                operator_slug=self.operator_slug,
                price=650,
                source_url=f"{self.base_url}/personal/mobilnaya-svyaz/tarifi/tarifische/",
                internet_gb=25,
                minutes=600,
                sms=300,
                unlimited_socials=True,
                unlimited_messengers=True,
                unlimited_music=True,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="МТС Smart",
                operator_slug=self.operator_slug,
                price=450,
                source_url=f"{self.base_url}/personal/mobilnaya-svyaz/tarifi/smart/",
                internet_gb=10,
                minutes=300,
                sms=200,
                regions=["moscow"],
            ),
            ParsedTariff(
                name="МТС Безлимитище",
                operator_slug=self.operator_slug,
                price=1900,
                source_url=f"{self.base_url}/personal/mobilnaya-svyaz/tarifi/bezlimitische/",
                internet_unlimited=True,
                minutes_unlimited=True,
                sms=500,
                unlimited_socials=True,
                unlimited_messengers=True,
                unlimited_music=True,
                tethering=True,
                esim=True,
                regions=["moscow"],
            ),
        ]

        return tariffs
