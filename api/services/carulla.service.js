import { fetch } from "undici";

export const getProductsCarulla = async (query) => {
  const variables = encodeURIComponent(
    JSON.stringify({
      first: 16,
      after: "0",
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

  // Evitamos error de pricePerUnit indefinido
  const products = names.map((name, i) => ({
    name,
    price: prices[i] || 0,
    pricePerUnit: pricePerUnit[i] || 1,
    link: links[i],
  }));

  return products;
};
