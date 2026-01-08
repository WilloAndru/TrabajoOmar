import puppeteer from "puppeteer";

export async function runWithPuppeteer(url, onResponse) {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    page.on("response", onResponse);

    await page.goto(url, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 3000));
  } finally {
    if (browser) await browser.close();
  }
}
