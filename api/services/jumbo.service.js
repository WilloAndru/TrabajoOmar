import { fetch } from "undici";

export const getTotalCountJumbo = async (query) => {
  const url = `https://www.jumbocolombia.com/${encodeURIComponent(
    query
  )}/s?_q=${encodeURIComponent(
    query
  )}&map=ft&__pickRuntime=appsEtag,blocks,blocksTree,components,contentMap,extensions,messages,page,pages,query,queryData,route,runtimeMeta,settings&__device=phone`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Jumbo response error: ${res.status}`);
  }

  const json = await res.text();
  const match = json.match(/\\"recordsFiltered\\":\s*(\d+)/i);

  return match ? Number(match[1]) : 0;
};

export const getProductsJumbo = async (query) => {
  const url = `https://www.jumbocolombia.com/${encodeURIComponent(
    query
  )}/s?_q=${encodeURIComponent(
    query
  )}&map=ft&__pickRuntime=appsEtag,blocks,blocksTree,components,contentMap,extensions,messages,page,pages,query,queryData,route,runtimeMeta,settings&__device=phone`;

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
  const skus = [...json.matchAll(/\\"linkText\\":\\"([^"]+)\\"/g)].map(
    (m) => m[1]
  );
  const links = skus.map((sku) => `https://www.jumbocolombia.com/${sku}/p`);

  // Evitamos error de pricePerUnit indefinido
  const products = names.map((name, i) => ({
    name,
    price: prices[i] || 0,
    pricePerUnit: pricePerUnitList[i],
    link: links[i],
  }));

  return products;
};
