#!/usr/bin/env python3
"""Simple tariff parser/aggregator.

Usage:
  python3 parser/run_parser.py --region Москва --out data/tariffs.json
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable


@dataclass
class Tariff:
    id: str
    name: str
    operator: str
    region: str
    price: int
    gb: int
    minutes: int
    sms: int
    isMvno: bool
    hasEsim: bool
    has5g: bool
    unlimitedSocial: bool
    roamingIncluded: bool
    logo: str
    connectUrl: str


# In production, replace these stubs with real parsers for each operator site/API.
def parse_mts(region: str) -> Iterable[Tariff]:
    yield Tariff(
        id=f"mts-{region.lower()}-smart-pro".replace(" ", "-"),
        name="МТС Smart Pro",
        operator="МТС",
        region=region,
        price=890,
        gb=35,
        minutes=900,
        sms=200,
        isMvno=False,
        hasEsim=True,
        has5g=True,
        unlimitedSocial=True,
        roamingIncluded=False,
        logo="./assets/logos/mts.svg",
        connectUrl="https://moskva.mts.ru/personal/mobilnaya-svyaz/tarifi/vse-tarifi/mobilnie",
    )


def parse_beeline(region: str) -> Iterable[Tariff]:
    yield Tariff(
        id=f"beeline-{region.lower()}-flex".replace(" ", "-"),
        name="Билайн FLEX+",
        operator="Билайн",
        region=region,
        price=790,
        gb=30,
        minutes=700,
        sms=150,
        isMvno=False,
        hasEsim=True,
        has5g=True,
        unlimitedSocial=True,
        roamingIncluded=False,
        logo="./assets/logos/beeline.svg",
        connectUrl="https://moskva.beeline.ru/customers/products/mobile/tariffs/",
    )


def parse_sber_mobile(region: str) -> Iterable[Tariff]:
    yield Tariff(
        id=f"sber-{region.lower()}-optimum".replace(" ", "-"),
        name="СберМобайл Оптимум",
        operator="СберМобайл",
        region=region,
        price=650,
        gb=20,
        minutes=400,
        sms=100,
        isMvno=True,
        hasEsim=True,
        has5g=False,
        unlimitedSocial=False,
        roamingIncluded=False,
        logo="./assets/logos/sber.svg",
        connectUrl="https://sbermobile.ru/tariffs",
    )


def aggregate(region: str) -> list[Tariff]:
    result: list[Tariff] = []
    for parser in (parse_mts, parse_beeline, parse_sber_mobile):
        result.extend(list(parser(region)))
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--region", default="Москва", help="Регион для парсинга")
    parser.add_argument("--out", default="data/tariffs.json", help="Путь до итогового JSON")
    args = parser.parse_args()

    tariffs = aggregate(args.region)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps([asdict(x) for x in tariffs], ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Saved {len(tariffs)} tariffs to {out}")


if __name__ == "__main__":
    main()
