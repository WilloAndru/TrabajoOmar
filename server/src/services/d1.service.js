import { fetch } from "undici";
import puppeteer from "puppeteer";

export const getTotalCountD1 = async (query) => {
  const url = `https://domicilios.tiendasd1.com/search?name=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "text/html",
    },
  });

  if (!res.ok) {
    throw new Error(`D1 response error: ${res.status}`);
  }

  const html = await res.text();
  const match = html.match(/\\"itemsFound\\":\s*(\d+)/i);
  return match ? Number(match[1]) : 0;
};

export const getProductsD1 = async (query) => {
  console.log("[getProductsD1] Iniciando búsqueda para:", query);
  const url = `https://domicilios.tiendasd1.com/search?name=${encodeURIComponent(
    query
  )}`;
  console.log("[getProductsD1] URL:", url);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/118.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1200, height: 800 });

  await page.goto(url, { waitUntil: "networkidle2" });
  console.log("[getProductsD1] Página cargada");

  // Esperar que los productos estén presentes
  try {
    await page.waitForSelector('[data-testid="product-card"]', {
      timeout: 5000,
    });
    console.log("[getProductsD1] Selector de productos encontrado");
  } catch {
    console.log("[getProductsD1] No se encontraron productos en el DOM");
  }

  const products = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll('[data-testid="product-card"]')
    );
    console.log(
      "[getProductsD1][evaluate] Cantidad de elementos encontrados:",
      items.length
    );

    return items.map((item, index) => {
      const name =
        item.querySelector('[data-testid="product-name"]')?.innerText?.trim() ||
        null;
      const priceText =
        item
          .querySelector('[data-testid="product-price"]')
          ?.innerText?.replace(/\D/g, "") || null;
      const price = priceText ? Number(priceText) : null;

      const qtyText =
        item.querySelector('[data-testid="product-quantity"]')?.innerText ||
        null;
      let subQty = null;
      let unit = null;
      if (qtyText) {
        const match = qtyText.match(/([\d.,]+)\s*(g|kg|ml|l|unidad)/i);
        if (match) {
          subQty = Number(match[1].replace(",", ""));
          unit = match[2];
        }
      }

      console.log(`[getProductsD1][evaluate] Producto ${index + 1}:`, {
        name,
        price,
        subQty,
        unit,
      });

      return { name, price, subQty, unit };
    });
  });

  console.log("[getProductsD1] Productos extraídos:", products.length);

  await browser.close();
  return products;
};
