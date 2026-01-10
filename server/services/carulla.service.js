import { fetch } from "undici";

export const getProductsCarulla = async (query) => {
  const itemsPerPage = 16;
  let currentPage = 0;
  let totalPages = null;
  let products = [];

  do {
    const after = String(currentPage * itemsPerPage);
    const variables = encodeURIComponent(
      JSON.stringify({
        first: itemsPerPage,
        after,
        sort: "score_desc",
        term: query,
        selectedFacets: [
          { key: "channel", value: '{"salesChannel":"1","regionId":""}' },
          { key: "locale", value: "es-CO" },
        ],
      })
    );

    const url = `https://www.carulla.com/api/graphql?operationName=SearchQuery&variables=${variables}`;

    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "text/html",
      },
    });

    if (!res.ok) {
      throw new Error(`Carulla response error: ${res.status}`);
    }

    const json = await res.text();

    // Cuando es la primera iteracion, calculamos el total de paginas
    if (totalPages === null) {
      const match = json.match(/"totalCount":\s*(\d+)/i);
      if (!match) break;

      const itemsFound = Number(match[1]);
      totalPages = Math.ceil(itemsFound / itemsPerPage);
    }

    // Extraemos los nombres y arreglamos formato
    const names = [...json.matchAll(/},\"name\":\"([^\"]+)\"/g)]
      .map((m) => m[1])
      .slice(0, 16);

    // Extraemos precios
    const prices = [...json.matchAll(/,"price":\s*(\d+(\.\d+)?)/g)]
      .map((m) => Number(m[1]))
      .slice(0, 16);

    // Extraemos el peso
    const qty = [
      ...json.matchAll(/\{"name":"Factor Neto PUM","values":\["(\d+)"\]/g),
    ]
      .map((m) => Number(m[1]))
      .slice(0, 16);

    // Calculamos el peso
    const pricePerUnit = prices.map((price, i) => {
      return Number((price / qty[i]).toFixed(3));
    });

    // Extraemos sku de cada producto y creamos links
    const slugs = [...json.matchAll(/"slug":"([^"]+)"/g)]
      .map((m) => m[1])
      .slice(0, 16);
    const links = slugs.map((slug) => `https://www.carulla.com/${slug}/p`);

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
