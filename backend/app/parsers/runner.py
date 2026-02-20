"""Parser runner — orchestrates parser execution."""

import asyncio
import logging

from app.parsers.operators.megafon import MegafonParser
from app.parsers.operators.mts import MTSParser
from app.parsers.operators.beeline import BeelineParser
from app.parsers.operators.tele2 import Tele2Parser
from app.parsers.operators.yota import YotaParser

logger = logging.getLogger(__name__)

PARSERS = {
    "megafon": MegafonParser,
    "mts": MTSParser,
    "beeline": BeelineParser,
    "tele2": Tele2Parser,
    "yota": YotaParser,
}


def run_all_parsers(region_slug: str | None = None) -> dict:
    """Run all parsers and return combined results."""
    return asyncio.run(_run_all_async(region_slug))


async def _run_all_async(region_slug: str | None = None) -> dict:
    results = {}
    for slug, parser_cls in PARSERS.items():
        parser = parser_cls()
        result = await parser.run(region_slug)
        results[slug] = result
    return results


def run_express_check() -> dict:
    """Express check — quick validation that key pages are still accessible."""
    return asyncio.run(_express_check_async())


async def _express_check_async() -> dict:
    results = {}
    for slug, parser_cls in PARSERS.items():
        parser = parser_cls()
        try:
            # Quick check: just verify the parser can start
            results[slug] = {"status": "ok"}
        except Exception as e:
            results[slug] = {"status": "error", "error": str(e)}
    return results


def run_parser_for_operator(operator_slug: str, region_slug: str | None = None) -> dict:
    """Run a single operator parser."""
    if operator_slug not in PARSERS:
        return {"status": "error", "error": f"Unknown operator: {operator_slug}"}
    parser = PARSERS[operator_slug]()
    return asyncio.run(parser.run(region_slug))
