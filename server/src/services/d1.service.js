import { fetch } from "undici";
import puppeteer from "puppeteer";

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
  const quantity = Number(match[1]);

  const nombres = [
    ...html
      .matchAll(/\\"product\\":\{\\\"name\\\":\\"([^"]+)"/g)
      .map((m) => m[1].replace(/\\+/g, "")),
  ];

  const precios = [...html.matchAll(/\\"price\\":\s*(\d+)/g)].map((m) =>
    Number(m[1])
  );

  const qty = [...html.matchAll(/\\"subQty\\":\s*(\d+)/g)].map((m) =>
    Number(m[1])
  );
  const pricePerUnit = precios
    .slice(0, nombres.length)
    .map((p, i) => (p / qty[i]).toFixed(3));

  const skus = [...html.matchAll(/\\"sku\\":\\"(\d+)\\"/g)].map((m) => m[1]);
  const links = skus.map((sku) => `https://domicilios.tiendasd1.com/p/${sku}`);

  // Creamos la lista de objetos
  const productos = nombres.map((name, i) => ({
    name,
    price: precios[i],
    pricePerUnit: pricePerUnit[i],
    link: links[i],
  }));

  console.log(productos);

  return match ? quantity : 0;
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
  const match2 = html.match(/\\"product\\":\{\\\"name\\\":\\"([^"]+)"/);
  console.log(match2);

  return match ? Number(match[1]) : 0;
};
