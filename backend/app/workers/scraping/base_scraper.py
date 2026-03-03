import logging
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from typing import List
from app.domain.schemas.listing import CarListing

logger = logging.getLogger(__name__)

class BaseScraper:
    """
    Base asynchronous web scraper utilizing Playwright.
    Provides scaffolding for launching browsers and managing contexts.
    """
    def __init__(self, headless: bool = True):
        self.headless = headless
        self._playwright = None
        self.browser: Browser | None = None
        self.context: BrowserContext | None = None

    async def start(self):
        logger.info("Starting up Playwright scraper...")
        self._playwright = await async_playwright().start()
        self.browser = await self._playwright.chromium.launch(
            headless=self.headless,
            args=["--disable-dev-shm-usage", "--no-sandbox"]  # Docker friendly
        )
        self.context = await self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080}
        )
        logger.info("Playwright browser instance started.")

    async def get_page(self) -> Page:
        if not self.context:
            raise RuntimeError("Scraper not started. Call start() first.")
        return await self.context.new_page()

    async def stop(self):
        logger.info("Closing Playwright scraper...")
        if self.browser:
            await self.browser.close()
        if self._playwright:
            await self._playwright.stop()
        logger.info("Playwright browser instance stopped.")

    async def scrape(self) -> List[CarListing]:
        """
        Main extraction routine. Must be overridden by specific scrapers.
        """
        raise NotImplementedError("Subclasses must implement the scrape method.")
