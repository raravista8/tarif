from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Tariff Aggregator API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "postgresql+asyncpg://tarif:tarif@localhost:5432/tarif"
    DATABASE_URL_SYNC: str = "postgresql://tarif:tarif@localhost:5432/tarif"

    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    GEOIP_DB_PATH: str = "/opt/geoip/GeoLite2-City.mmdb"

    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_CHAT_ID: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
