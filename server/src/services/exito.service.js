import puppeteer from "puppeteer";

export const searchProducts = async (query, sortBy) => {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Simulamos que es un navegador
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    let allProducts = [];
    let totalCount = 0; // Numero total de resultados

    // Recorremos cada paginacion, para obtener todos los productos
    for (let pageNumber = 0; pageNumber < 1; pageNumber++) {
      let productsData = [];
      let captured = false; // Capturamos el html una sola vez

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
            console.log(p);
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
      )}&sort=${sortBy}&page=${pageNumber}`;

      await page.goto(url, { waitUntil: "networkidle2" });
      await new Promise((resolve) => setTimeout(resolve, 3000)); // esperar que responda la API

      allProducts.push(...productsData);

      page.removeAllListeners("response"); // limpiar listener antes de la siguiente página
    }

    return { products: allProducts, totalCount };
  } catch (err) {
    console.error("Error", err);
  } finally {
    // Siempre cerramos la pagina
    if (browser) await browser.close();
  }
};
