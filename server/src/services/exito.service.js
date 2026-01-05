import puppeteer from "puppeteer";

export const search = async (query) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    let allProducts = [];
    let totalCount = 0;

    for (let pageNumber = 0; pageNumber < 3; pageNumber++) {
      // primeras 3 páginas
      let productsData = [];
      let captured = false;

      page.on("response", async (response) => {
        const url = response.url();
        if (
          !captured &&
          url.includes("/api/graphql") &&
          url.includes("SearchQuery")
        ) {
          captured = true;
          const json = await response.json();
          totalCount =
            totalCount ||
            json?.data?.search?.products?.pageInfo?.totalCount ||
            0;
          const edges = json?.data?.search?.products?.edges || [];

          productsData = edges.map((edge) => {
            const p = edge.node;
            const offer = p.items?.[0]?.sellers?.[0]?.commertialOffer || {};
            const factorProp = p.properties?.find(
              (pr) => pr.name === "Factor Neto PUM"
            );
            const factor = factorProp?.values?.[0]
              ? parseFloat(factorProp.values[0])
              : 1;
            const pricePerUnit =
              factor > 0 ? (offer.Price / factor).toFixed(3) : null;

            return {
              name: p.name,
              price: offer.Price || 0,
              pricePerUnit: pricePerUnit,
              link: `/${p.slug}/p`,
            };
          });
        }
      });

      const url = `https://www.exito.com/s?q=${encodeURIComponent(
        query
      )}&sort=score_desc&page=${pageNumber}`;
      await page.goto(url, { waitUntil: "networkidle2" });
      await new Promise((resolve) => setTimeout(resolve, 3000)); // esperar que responda la API

      allProducts.push(...productsData);
      page.removeAllListeners("response"); // limpiar listener antes de la siguiente página
    }

    return { products: allProducts, totalCount };
  } catch (err) {
    console.error("[ERROR] Ocurrió un problema durante el scraping:", err);
    return { products: [], totalCount: 0 };
  } finally {
    if (browser) await browser.close();
  }
};
