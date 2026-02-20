import httpx

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
}


async def fetch_page(url: str, headers: dict | None = None) -> str:
    """Fetch a page using httpx."""
    async with httpx.AsyncClient(
        headers=headers or DEFAULT_HEADERS,
        follow_redirects=True,
        timeout=30.0,
    ) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.text


async def fetch_json(url: str, headers: dict | None = None) -> dict:
    """Fetch JSON data from an API endpoint."""
    async with httpx.AsyncClient(
        headers=headers or DEFAULT_HEADERS,
        follow_redirects=True,
        timeout=30.0,
    ) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()
