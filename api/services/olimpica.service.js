import { fetch } from "undici";

export const getProductsOlimpica = async (query) => {
  const url = `https://www.olimpica.com/${encodeURIComponent(
    query
  )}/s?_q=${encodeURIComponent(
    query
  )}&map=ft&page=1&__pickRuntime=appsEtag%2Cblocks%2CblocksTree%2Ccomponents%2CcontentMap%2Cextensions%2Cmessages%2Cpage%2Cpages%2Cquery%2CqueryData%2Croute%2CruntimeMeta%2Csettings&__device=phone`;

  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "text/html",
    },
  });

  if (!res.ok) {
    throw new Error(`Olimpica response error: ${res.status}`);
  }

  const json = await res.text();

  // Extraemos los nombres y arreglamos formato
  const names = [...json.matchAll(/\\"productName\\":\\"([^"]+)\\"/g)].map(
    (m) => m[1]
  );

  // Extraemos precios
  const prices = [
    ...json.matchAll(/\\"TotalValuePlusInterestRate\\":\s*(\d+)/g),
  ].map((m) => Number(m[1]));
  console.log(prices);

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

(async () => {
  await getProductsOlimpica("cafe");
})();
