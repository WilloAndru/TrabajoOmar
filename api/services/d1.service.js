import { fetch } from "undici";

export const getTotalCountD1 = async (query) => {
  const url = `https://domicilios.tiendasd1.com/search?name=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "text/html",
    },
  });

  if (!res.ok) {
    throw new Error(`D1 response error: ${res.status}`);
  }

  const html = await res.text();
  const match = html.match(/\\"itemsFound\\":\s*(\d+)/i);

  return match ? Number(match[1]) : 0;
};

export const getProductsD1 = async (query) => {
  const url = `https://domicilios.tiendasd1.com/search?name=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "text/html",
    },
  });

  if (!res.ok) {
    throw new Error(`D1 response error: ${res.status}`);
  }

  const html = await res.text();
  // Extraemos los nombres y arreglamos formato
  const names = [
    ...html
      .matchAll(/\\"product\\":\{\\\"name\\\":\\"([^"]+)"/g)
      .map((m) => m[1].replace(/\\+/g, "")),
  ];

  // Extraemos precios
  const prices = [...html.matchAll(/\\"price\\":\s*(\d+)/g)].map((m) =>
    Number(m[1])
  );

  // Extraemos cantidad
  const qty = [...html.matchAll(/\\"subQty\\":\s*(\d+)/g)].map((m) =>
    Number(m[1])
  );

  // Si hay cantidad calculamos precio por unidad
  let pricePerUnit = [];
  if (qty[0]) {
    pricePerUnit = prices
      .slice(0, names.length)
      .map((p, i) => Number((p / qty[i]).toFixed(3)));
  }

  // Extraemos sku de cada producto y creamos links
  const skus = [...html.matchAll(/\\"sku\\":\\"(\d+)\\"/g)].map((m) => m[1]);
  const links = skus.map((sku) => `https://domicilios.tiendasd1.com/p/${sku}`);

  const products = names.map((name, i) => ({
    name,
    price: prices[i],
    pricePerUnit: pricePerUnit[i] || 1,
    link: links[i],
  }));

  return products;
};
