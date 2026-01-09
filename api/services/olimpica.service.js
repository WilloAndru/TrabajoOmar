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

  // Calculamos el peso
  const pricePerUnitList = names.map((name, i) => {
    let qty = 1;
    const match = name.match(/(\d+(?:[.,]\d+)?)\s*(g|grs?|kg)\b/i);
    if (match) {
      qty = Number(match[1].replace(",", "."));
      const unit = match[2].toLowerCase();
      // Convertimos kg a gramos
      if (unit === "kg") {
        qty *= 1000;
      }
    }
    return qty !== 1 && prices[i] ? Number((prices[i] / qty).toFixed(3)) : 1;
  });

  // Extraemos sku de cada producto y creamos links
  const skus = [...json.matchAll(/\\"linkText\\":\\"([^"]+)\\"/g)].map(
    (m) => m[1]
  );
  const links = skus.map((sku) => `https://www.olimpica.com/${sku}/p`);

  // Evitamos error de pricePerUnit indefinido
  const products = names.map((name, i) => ({
    name,
    price: prices[i] || 0,
    pricePerUnit: pricePerUnitList[i] || 1,
    link: links[i],
  }));

  return products;
};
