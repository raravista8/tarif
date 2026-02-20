from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "tarif_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Europe/Moscow",
    enable_utc=True,
    beat_schedule={
        "parse-all-operators-daily": {
            "task": "app.tasks.parsing.parse_all_operators",
            "schedule": 86400.0,  # 24 hours
        },
        "express-check-6h": {
            "task": "app.tasks.parsing.express_check",
            "schedule": 21600.0,  # 6 hours
        },
    },
)

celery_app.autodiscover_tasks(["app.tasks"])
