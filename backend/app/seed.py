"""Seed script to populate database with initial data."""

import asyncio

from sqlalchemy import select

from app.core.database import engine, async_session, Base
from app.core.security import get_password_hash
from app.models.operator import Operator, OperatorType
from app.models.region import Region
from app.models.user import User
from app.models.tariff import Tariff, TariffStatus, tariff_regions
from app.models.benefit import Benefit, BenefitType


OPERATORS = [
    {"slug": "megafon", "name": "МегаФон", "website": "https://megafon.ru", "operator_type": OperatorType.MNO, "logo_url": "/images/operators/megafon.svg"},
    {"slug": "mts", "name": "МТС", "website": "https://mts.ru", "operator_type": OperatorType.MNO, "logo_url": "/images/operators/mts.svg"},
    {"slug": "beeline", "name": "Билайн", "website": "https://beeline.ru", "operator_type": OperatorType.MNO, "logo_url": "/images/operators/beeline.svg"},
    {"slug": "tele2", "name": "Т2 (Tele2)", "website": "https://tele2.ru", "operator_type": OperatorType.MNO, "logo_url": "/images/operators/tele2.svg"},
    {"slug": "yota", "name": "Yota", "website": "https://yota.ru", "operator_type": OperatorType.MVNO, "logo_url": "/images/operators/yota.svg"},
    {"slug": "sbermobile", "name": "СберМобайл", "website": "https://sberbank.ru/sms", "operator_type": OperatorType.MVNO, "logo_url": "/images/operators/sbermobile.svg"},
    {"slug": "t-mobile", "name": "Т-Мобайл", "website": "https://t-mobile.ru", "operator_type": OperatorType.MVNO, "logo_url": "/images/operators/t-mobile.svg"},
]

REGIONS = [
    {"slug": "moscow", "name": "Москва и МО", "federal_district": "Центральный", "timezone": "Europe/Moscow"},
    {"slug": "spb", "name": "Санкт-Петербург и ЛО", "federal_district": "Северо-Западный", "timezone": "Europe/Moscow"},
    {"slug": "novosibirsk", "name": "Новосибирская область", "federal_district": "Сибирский", "timezone": "Asia/Novosibirsk"},
    {"slug": "ekaterinburg", "name": "Свердловская область", "federal_district": "Уральский", "timezone": "Asia/Yekaterinburg"},
    {"slug": "kazan", "name": "Республика Татарстан", "federal_district": "Приволжский", "timezone": "Europe/Moscow"},
    {"slug": "krasnodar", "name": "Краснодарский край", "federal_district": "Южный", "timezone": "Europe/Moscow"},
    {"slug": "nizhny-novgorod", "name": "Нижегородская область", "federal_district": "Приволжский", "timezone": "Europe/Moscow"},
    {"slug": "samara", "name": "Самарская область", "federal_district": "Приволжский", "timezone": "Europe/Samara"},
    {"slug": "rostov", "name": "Ростовская область", "federal_district": "Южный", "timezone": "Europe/Moscow"},
    {"slug": "voronezh", "name": "Воронежская область", "federal_district": "Центральный", "timezone": "Europe/Moscow"},
]

SAMPLE_TARIFFS = [
    # МегаФон
    {"operator_slug": "megafon", "name": "Включайся! Общайся", "price": 550, "internet_gb": 15, "minutes": 500, "sms": 500, "unlimited_messengers": True, "source_url": "https://megafon.ru/tariffs/all/vklyuchajsya_obshchajsya/"},
    {"operator_slug": "megafon", "name": "Без переплат", "price": 750, "internet_gb": 30, "minutes": 800, "sms": 500, "unlimited_socials": True, "unlimited_messengers": True, "unlimited_music": True, "tethering": True, "source_url": "https://megafon.ru/tariffs/all/bez_pereplat/"},
    {"operator_slug": "megafon", "name": "Premium", "price": 2500, "internet_unlimited": True, "minutes_unlimited": True, "sms_unlimited": True, "unlimited_socials": True, "unlimited_messengers": True, "unlimited_music": True, "unlimited_video": True, "tethering": True, "esim": True, "source_url": "https://megafon.ru/tariffs/all/premium/"},
    {"operator_slug": "megafon", "name": "Включайся! Смотри", "price": 650, "internet_gb": 20, "minutes": 600, "sms": 300, "unlimited_video": True, "unlimited_messengers": True, "source_url": "https://megafon.ru/tariffs/all/vklyuchajsya_smotri/"},
    # МТС
    {"operator_slug": "mts", "name": "Тарифище", "price": 650, "internet_gb": 25, "minutes": 600, "sms": 300, "unlimited_socials": True, "unlimited_messengers": True, "unlimited_music": True, "source_url": "https://mts.ru/personal/mobilnaya-svyaz/tarifi/tarifische/"},
    {"operator_slug": "mts", "name": "Smart", "price": 450, "internet_gb": 10, "minutes": 300, "sms": 200, "source_url": "https://mts.ru/personal/mobilnaya-svyaz/tarifi/smart/"},
    {"operator_slug": "mts", "name": "Безлимитище", "price": 1900, "internet_unlimited": True, "minutes_unlimited": True, "sms": 500, "unlimited_socials": True, "unlimited_messengers": True, "unlimited_music": True, "tethering": True, "esim": True, "source_url": "https://mts.ru/personal/mobilnaya-svyaz/tarifi/bezlimitische/"},
    {"operator_slug": "mts", "name": "Smart Забугорище", "price": 800, "internet_gb": 20, "minutes": 500, "sms": 200, "tethering": True, "source_url": "https://mts.ru/personal/mobilnaya-svyaz/tarifi/smart-zabugorische/"},
    # Билайн
    {"operator_slug": "beeline", "name": "UP", "price": 600, "internet_gb": 20, "minutes": 500, "sms": 200, "unlimited_messengers": True, "source_url": "https://beeline.ru/customers/products/mobile/tariffs/up/"},
    {"operator_slug": "beeline", "name": "Близкие люди", "price": 1200, "internet_gb": 50, "minutes": 1000, "sms": 500, "family_tariff": True, "unlimited_socials": True, "unlimited_messengers": True, "source_url": "https://beeline.ru/customers/products/mobile/tariffs/blizkie-lyudi/"},
    {"operator_slug": "beeline", "name": "Анлим", "price": 2200, "internet_unlimited": True, "minutes_unlimited": True, "sms_unlimited": True, "unlimited_socials": True, "unlimited_messengers": True, "unlimited_music": True, "tethering": True, "esim": True, "source_url": "https://beeline.ru/customers/products/mobile/tariffs/unlim/"},
    {"operator_slug": "beeline", "name": "Мой онлайн", "price": 500, "internet_gb": 12, "minutes": 300, "sms": 100, "unlimited_messengers": True, "source_url": "https://beeline.ru/customers/products/mobile/tariffs/moj-onlajn/"},
    # Tele2
    {"operator_slug": "tele2", "name": "Мой онлайн", "price": 400, "internet_gb": 15, "minutes": 300, "sms": 50, "unlimited_messengers": True, "source_url": "https://tele2.ru/tariffs/moj-onlajn/"},
    {"operator_slug": "tele2", "name": "Мой онлайн+", "price": 600, "internet_gb": 30, "minutes": 600, "sms": 200, "unlimited_socials": True, "unlimited_messengers": True, "unlimited_music": True, "source_url": "https://tele2.ru/tariffs/moj-onlajn-plus/"},
    {"operator_slug": "tele2", "name": "Безлимит", "price": 1500, "internet_unlimited": True, "minutes_unlimited": True, "sms": 300, "unlimited_socials": True, "unlimited_messengers": True, "unlimited_music": True, "tethering": True, "source_url": "https://tele2.ru/tariffs/bezlimit/"},
    {"operator_slug": "tele2", "name": "Классика", "price": 300, "internet_gb": 5, "minutes": 200, "sms": 50, "source_url": "https://tele2.ru/tariffs/klassika/"},
    # Yota
    {"operator_slug": "yota", "name": "5 ГБ", "price": 350, "internet_gb": 5, "minutes": 200, "sms": 50, "source_url": "https://yota.ru"},
    {"operator_slug": "yota", "name": "20 ГБ", "price": 550, "internet_gb": 20, "minutes": 500, "sms": 100, "unlimited_messengers": True, "source_url": "https://yota.ru"},
    {"operator_slug": "yota", "name": "Безлимит", "price": 900, "internet_unlimited": True, "minutes": 500, "sms": 100, "unlimited_messengers": True, "source_url": "https://yota.ru"},
]

SAMPLE_BENEFITS = [
    {"operator_slug": "megafon", "benefit_type": BenefitType.MNP, "title": "Переходи в МегаФон — 3 месяца скидка 50%", "description": "При переносе номера в МегаФон получите скидку 50% на абонентскую плату в течение первых 3 месяцев.", "source_url": "https://megafon.ru/mnp/"},
    {"operator_slug": "mts", "benefit_type": BenefitType.MNP, "title": "MNP в МТС — бонус 10 ГБ", "description": "При переходе в МТС со своим номером получите 10 ГБ дополнительного интернета на 3 месяца.", "source_url": "https://mts.ru/mnp/"},
    {"operator_slug": "beeline", "benefit_type": BenefitType.MNP, "title": "Билайн: переход с бонусом", "description": "Перенесите номер в Билайн и получите месяц бесплатного пользования тарифом.", "source_url": "https://beeline.ru/mnp/"},
    {"operator_slug": "tele2", "benefit_type": BenefitType.MNP, "title": "Tele2: MNP со скидкой", "description": "Скидка 30% на любой тариф при переносе номера. Действует 6 месяцев.", "source_url": "https://tele2.ru/mnp/"},
    {"operator_slug": "mts", "benefit_type": BenefitType.CASHBACK, "title": "МТС Cashback 5%", "description": "Возврат 5% от абонентской платы на счёт МТС Premium при оплате картой МТС Банка.", "source_url": "https://mts.ru/cashback/"},
    {"operator_slug": "megafon", "benefit_type": BenefitType.LOYALTY, "title": "МегаФон Бонус", "description": "Накапливайте бонусные баллы за оплату связи и тратьте на услуги, сервисы и товары партнёров.", "source_url": "https://megafon.ru/bonus/"},
    {"operator_slug": "beeline", "benefit_type": BenefitType.LOYALTY, "title": "Билайн Бонус", "description": "Программа лояльности: баллы за использование услуг, обмен на скидки и подарки.", "source_url": "https://beeline.ru/bonus/"},
    {"operator_slug": "tele2", "benefit_type": BenefitType.PROMO, "title": "Tele2: двойной интернет", "description": "Акция: удвоение пакета интернета при подключении любого тарифа. Действует до конца месяца.", "source_url": "https://tele2.ru/promo/"},
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        # Seed operators
        operators_map = {}
        for op_data in OPERATORS:
            existing = (await session.execute(select(Operator).where(Operator.slug == op_data["slug"]))).scalars().first()
            if not existing:
                op = Operator(**op_data)
                session.add(op)
                await session.flush()
                operators_map[op.slug] = op
            else:
                operators_map[existing.slug] = existing

        # Seed regions
        regions_map = {}
        for reg_data in REGIONS:
            existing = (await session.execute(select(Region).where(Region.slug == reg_data["slug"]))).scalars().first()
            if not existing:
                reg = Region(**reg_data)
                session.add(reg)
                await session.flush()
                regions_map[reg.slug] = reg
            else:
                regions_map[existing.slug] = existing

        # Seed admin user
        admin_exists = (await session.execute(select(User).where(User.email == "admin@tarif.ru"))).scalars().first()
        if not admin_exists:
            admin = User(
                email="admin@tarif.ru",
                hashed_password=get_password_hash("admin123"),
                full_name="Admin",
                is_superuser=True,
            )
            session.add(admin)

        # Seed tariffs
        moscow_region = regions_map.get("moscow")
        for t_data in SAMPLE_TARIFFS:
            op_slug = t_data.pop("operator_slug")
            operator = operators_map.get(op_slug)
            if not operator:
                continue
            slug = f"{op_slug}-{t_data['name'].lower().replace(' ', '-')}"
            slug = "".join(c for c in slug if c.isascii() and (c.isalnum() or c == "-"))[:300]

            existing = (await session.execute(select(Tariff).where(Tariff.slug == slug))).scalars().first()
            if not existing:
                tariff = Tariff(
                    operator_id=operator.id,
                    slug=slug,
                    status=TariffStatus.PUBLISHED,
                    **t_data,
                )
                session.add(tariff)
                await session.flush()
                if moscow_region:
                    await session.execute(
                        tariff_regions.insert().values(tariff_id=tariff.id, region_id=moscow_region.id)
                    )

        # Seed benefits
        for b_data in SAMPLE_BENEFITS:
            op_slug = b_data.pop("operator_slug")
            operator = operators_map.get(op_slug)
            if not operator:
                continue
            benefit = Benefit(operator_id=operator.id, **b_data)
            session.add(benefit)

        await session.commit()
        print("Seed completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
