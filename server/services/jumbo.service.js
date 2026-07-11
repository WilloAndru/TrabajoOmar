import { fetch } from "undici";

export const getProductsJumbo = async (query) => {
  const itemsPerPage = 28;
  let currentPage = 0;
  let totalPages = null;
  let products = [];

  do {
    const from = currentPage * itemsPerPage;
    const to = from + itemsPerPage - 1;

    console.log(`[JUMBO] Página ${currentPage + 1}, from: ${from}, to: ${to}`);

    const variables = {
      hideUnavailableItems: true,
      skusFilter: "ALL_AVAILABLE",
      simulationBehavior: "default",
      installmentCriteria: "MAX_WITHOUT_INTEREST",
      productOriginVtex: false,
      map: "ft",
      query,
      orderBy: "OrderByScoreDESC",
      from,
      to,
      selectedFacets: [{ key: "ft", value: query }],
      fullText: query,
      facetsBehavior: "Static",
      categoryTreeBehavior: "default",
      withFacets: false,
    };

    const encodedVariables = btoa(JSON.stringify(variables));

    const url = `https://www.jumbocolombia.com/_v/segment/graphql/v1?workspace=master&maxAge=short&appsEtag=remove&domain=store&locale=es-CO&operationName=productSearchV3&extensions=${encodeURIComponent(
      JSON.stringify({
        persistedQuery: {
          version: 1,
          sha256Hash:
            "31d3fa494df1fc41efef6d16dd96a96e6911b8aed7a037868699a1f3f4d365de",
          sender: "vtex.store-resources@0.x",
          provider: "vtex.search-graphql@0.x",
        },
        variables: encodedVariables,
      }),
    )}`;

    console.log(`[JUMBO] URL: ${url.substring(0, 100)}...`);

    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "text/html",
      },
    });

    console.log(`[JUMBO] Response status: ${res.status}`);

    if (!res.ok) {
      throw new Error(`Jumbo response error: ${res.status}`);
    }

    const json = await res.text();
    console.log(`[JUMBO] Response length: ${json.length} caracteres`);

    // Cuando es la primera iteracion, calculamos el total de paginas
    if (totalPages === null) {
      const match = json.match(/"recordsFiltered":\s*(\d+)/i);
      console.log(`[JUMBO] recordsFiltered match:`, match);

      if (!match) {
        console.log(
          `[JUMBO] No se encontró recordsFiltered, mostrando primeros 500 caracteres:`,
        );
        console.log(json.substring(0, 500));
        break;
      }

      const itemsFound = Number(match[1]);
      totalPages = Math.ceil(itemsFound / itemsPerPage);
      console.log(
        `[JUMBO] Items encontrados: ${itemsFound}, Total páginas: ${totalPages}`,
      );
    }

    // Extraemos los nombres y arreglamos formato
    const names = [...json.matchAll(/"productName":"([^"]+)"/g)].map(
      (m) => m[1],
    );
    console.log(`[JUMBO] Nombres encontrados: ${names.length}`);
    if (names.length > 0) console.log(`[JUMBO] Primer nombre:`, names[0]);

    // Extraemos precios
    const prices = [
      ...json.matchAll(/"TotalValuePlusInterestRate":\s*(\d+)/g),
    ].map((m) => Number(m[1]));
    console.log(`[JUMBO] Precios encontrados: ${prices.length}`);
    if (prices.length > 0) console.log(`[JUMBO] Primer precio:`, prices[0]);

    // Calculamos el peso
    const pricePerUnit = names.map((name, i) => {
      let qty = 1;
      const match = name.match(/(?:x)?(\d+(?:\.\d+)?)\s*(g|kg)/i);
      if (match) {
        qty = Number(match[1]);
        const unit = match[2].toLowerCase();
        // Convertimos kg a gramos
        if (unit === "kg") {
          qty *= 1000;
        }
      }
      return qty !== 1 && prices[i] ? Number((prices[i] / qty).toFixed(3)) : 1;
    });
    console.log(`[JUMBO] Precio por unidad calculado: ${pricePerUnit.length}`);

    // Extraemos sku de cada producto y creamos links
    const skus = [...json.matchAll(/"linkText":"([^"]+)"/g)].map((m) => m[1]);
    console.log(`[JUMBO] SKUs encontrados: ${skus.length}`);
    if (skus.length > 0) console.log(`[JUMBO] Primer SKU:`, skus[0]);

    const links = skus.map((sku) => `https://www.jumbocolombia.com/${sku}/p`);

    names.forEach((name, i) => {
      products.push({
        name,
        price: prices[i],
        pricePerUnit: pricePerUnit[i],
        link: links[i],
      });
    });

    console.log(`[JUMBO] Productos totales hasta ahora: ${products.length}`);

    currentPage++;
  } while (currentPage < totalPages);

  console.log(
    `[JUMBO] Scraping completado. Total productos: ${products.length}`,
  );
  return products;
};
