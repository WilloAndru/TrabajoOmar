import puppeteer from "puppeteer";

// Función que busca productos en Exito usando la API interna
export const search = async (query) => {
  let browser;
  try {
    // Abrimos un navegador Chromium invisible
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Simulamos un navegador real para evitar bloqueos
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    let productsData = [];
    let captured = false; // Flag para capturar la API solo una vez

    // Escuchamos todas las respuestas HTTP de la página
    page.on("response", async (response) => {
      const url = response.url();
      // Filtramos la llamada a la API interna de productos
      if (
        !captured &&
        url.includes("/api/graphql") &&
        url.includes("SearchQuery")
      ) {
        captured = true; // Evita capturar varias veces
        const json = await response.json(); // Convertimos a JSON
        const edges = json?.data?.search?.products?.edges || []; // Obtenemos los productos

        // Transformamos la información al formato
        const products = edges.map((edge) => {
          const p = edge.node;
          const offer = p.items?.[0]?.sellers?.[0]?.commertialOffer || {};

          // Buscar factor y unidad en properties
          const factorProp = p.properties?.find(
            (pr) => pr.name === "Factor Neto PUM"
          );
          const unitProp = p.properties?.find(
            (pr) => pr.name === "Unidad de Medida PUM Calculado"
          );

          const factor = factorProp?.values?.[0]
            ? parseFloat(factorProp.values[0])
            : 1;
          const unit = unitProp?.values?.[0] || "";

          const pricePerUnit =
            factor > 0 ? (offer.Price / factor).toFixed(3) : null;

          return {
            name: p.name,
            price: offer.Price || 0,
            pricePerUnit: pricePerUnit,
            unit: unit,
            link: `/${p.slug}/p`,
          };
        });

        productsData = products;
      }
    });

    // Abrimos la página de búsqueda
    const url = `https://www.exito.com/s?q=${encodeURIComponent(query)}`;
    await page.goto(url, { waitUntil: "networkidle2" }); // Espera a que cargue la mayoría de requests

    // Esperamos unos segundos para que la API responda y podamos capturar productos
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return productsData;
  } catch (err) {
    console.error("[ERROR] Ocurrió un problema durante el scraping:", err);
    return []; // Retornamos array vacío si hay error
  } finally {
    if (browser) {
      await browser.close(); // Cerramos el navegador siempre
      console.log("[INFO] Navegador cerrado");
    }
  }
};
