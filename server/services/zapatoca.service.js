import puppeteer from "puppeteer";

let browser = null;

const getBrowser = async () => {
  if (!browser || !browser.isConnected()) {
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } catch (error) {
      console.error("[ERROR] No se pudo iniciar el navegador:", error.message);
      browser = null;
      throw error;
    }
  }
  return browser;
};

export const getProductsZapatoca = async (query) => {
  let currentPage = 1;
  let totalPages = 1;
  let products = [];

  try {
    const browserInstance = await getBrowser();

    do {
      const page = await browserInstance.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      );

      const url = `https://www.mercadozapatoca.com/search/?k=${encodeURIComponent(query)}&page=${currentPage}`;

      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      const html = await page.content();

      // Extraemos los nombres
      const names = [
        ...html
          .matchAll(/<div class="dpr_product-name[^"]*">([^<]+)<\/div>/g)
          .map((m) => m[1].trim()),
      ];

      // Extraemos precios
      const prices = [
        ...html
          .matchAll(/<div class="dpr_listprice"[^>]*>\$([^<]+)<\/div>/g)
          .map((m) => Number(m[1].replace(/,/g, ""))),
      ];

      // Extraemos precio por unidad
      const pricePerUnit = [
        ...html
          .matchAll(/<div class="price_per_unit">\$([^\s<]+)/g)
          .map((m) => parseFloat(m[1])),
      ];

      // Extraemos links
      const links = [
        ...html
          .matchAll(/href="(\/p\/[^"]+)"/g)
          .map((m) => `https://www.mercadozapatoca.com${m[1]}`),
      ];

      // Agregar productos
      names.forEach((name, i) => {
        products.push({
          name,
          price: prices[i],
          pricePerUnit: pricePerUnit[i],
          link: links[i],
        });
      });

      await page.close();

      currentPage++;
    } while (currentPage <= totalPages);

    return products;
  } catch (error) {
    console.error("[ERROR] En Zapatoca:", error.message);
    return [];
  }
};
