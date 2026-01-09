import { fetch } from "undici";

export const getTotalCountExito = async (query) => {
  const variables = encodeURIComponent(
    JSON.stringify({
      first: 16,
      after: "16",
      sort: "score_desc",
      term: query,
      selectedFacets: [
        { key: "channel", value: '{"salesChannel":"1","regionId":""}' },
        { key: "locale", value: "es-CO" },
      ],
    })
  );

  const url = `https://www.exito.com/api/graphql?operationName=SearchQuery&variables=${variables}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Exito response error: ${res.status}`);
  }

  const json = await res.text();
  const match = json.match(/"totalCount":\s*(\d+)/i);

  return match ? Number(match[1]) : 0;
};

export const getProductsExito = async (query) => {
  const variables = encodeURIComponent(
    JSON.stringify({
      first: 16,
      after: "16",
      sort: "score_desc",
      term: query,
      selectedFacets: [
        { key: "channel", value: '{"salesChannel":"1","regionId":""}' },
        { key: "locale", value: "es-CO" },
      ],
    })
  );

  const url = `https://www.exito.com/api/graphql?operationName=SearchQuery&variables=${variables}`;

  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "text/html",
    },
  });

  if (!res.ok) {
    throw new Error(`Exito response error: ${res.status}`);
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
  const links = slugs.map((slug) => `https://www.exito.com/${slug}/p`);

  // Evitamos error de pricePerUnit indefinido
  const products = names.map((name, i) => ({
    name,
    price: prices[i] || 0,
    pricePerUnit: pricePerUnit[i] || 1,
    link: links[i],
  }));

  return products;
};
