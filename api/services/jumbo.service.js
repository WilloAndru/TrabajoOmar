import { fetch } from "undici";

export const getProductsJumbo = async (query) => {
  const itemsPerPage = 28;
  let currentPage = 0;
  let totalPages = null;
  let products = [];

  do {
    const from = currentPage * itemsPerPage;
    const to = from + itemsPerPage - 1;

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
      })
    )}`;

    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "text/html",
      },
    });

    if (!res.ok) {
      throw new Error(`Jumbo response error: ${res.status}`);
    }

    const json = await res.text();

    // Cuando es la primera iteracion, calculamos el total de paginas
    if (totalPages === null) {
      const match = json.match(/"recordsFiltered":\s*(\d+)/i);
      if (!match) break;

      const itemsFound = Number(match[1]);
      totalPages = Math.ceil(itemsFound / itemsPerPage);
    }

    // Extraemos los nombres y arreglamos formato
    const names = [...json.matchAll(/"productName":"([^"]+)"/g)].map(
      (m) => m[1]
    );

    // Extraemos precios
    const prices = [
      ...json.matchAll(/"TotalValuePlusInterestRate":\s*(\d+)/g),
    ].map((m) => Number(m[1]));

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

    // Extraemos sku de cada producto y creamos links
    const skus = [...json.matchAll(/"linkText":"([^"]+)"/g)].map((m) => m[1]);
    const links = skus.map((sku) => `https://www.jumbocolombia.com/${sku}/p`);

    names.forEach((name, i) => {
      products.push({
        name,
        price: prices[i],
        pricePerUnit: pricePerUnit[i],
        link: links[i],
      });
    });

    currentPage++;
  } while (currentPage <= totalPages);

  return products;
};
