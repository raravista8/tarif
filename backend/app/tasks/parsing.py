import logging

from app.tasks import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="app.tasks.parsing.parse_all_operators")
def parse_all_operators():
    """Full daily parse of all operators."""
    from app.parsers.runner import run_all_parsers

    logger.info("Starting full parse of all operators")
    results = run_all_parsers()
    logger.info("Full parse completed: %s", results)
    return results


@celery_app.task(name="app.tasks.parsing.express_check")
def express_check():
    """Express check of key pages every 6 hours."""
    from app.parsers.runner import run_express_check

    logger.info("Starting express check")
    results = run_express_check()
    logger.info("Express check completed: %s", results)
    return results


@celery_app.task(name="app.tasks.parsing.parse_operator")
def parse_operator(operator_slug: str):
    """Parse a single operator on demand."""
    from app.parsers.runner import run_parser_for_operator

    logger.info("Starting parse for operator: %s", operator_slug)
    result = run_parser_for_operator(operator_slug)
    logger.info("Parse completed for %s: %s", operator_slug, result)
    return result
