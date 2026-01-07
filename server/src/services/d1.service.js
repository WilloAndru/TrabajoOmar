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

  const html = await res.text();

  // Extrae TODOS los bloques product serializados
  const matches = html.match(/\{\\\"product\\\":\{.*?\}\}/g);

  if (!matches) return [];

  const products = matches
    .map((m) => {
      try {
        const clean = m.replace(/\\"/g, '"');
        return JSON.parse(clean).product;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return products;
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

  const html = await res.text();

  // Extrae TODOS los bloques product serializados
  const matches = html.match(/\{\\\"product\\\":\{.*?\}\}/g);

  if (!matches) return [];

  const products = matches
    .map((m) => {
      try {
        const clean = m.replace(/\\"/g, '"');
        return JSON.parse(clean).product;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return products;
};
