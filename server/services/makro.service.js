import { fetch } from "undici";

export const getProductsMakro = async (query) => {
  const itemsPerPage = 50;
  let currentPage = 1;
  let totalPages = null;
  let products = [];

  do {
    const url = `https://tienda.makro.com.co/search?name=${encodeURIComponent(query)}&currentPage=${currentPage}`;

    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "text/html",
      },
    });

    if (!res.ok) {
      throw new Error(`Makro response error: ${res.status}`);
    }

    const html = await res.text();

    // Cuando es la primera iteracion, calculamos el total de paginas
    if (totalPages === null) {
      const match = html.match(/\\"itemsFound\\":\s*(\d+)/i);
      if (!match) break;

      const itemsFound = Number(match[1]);
      totalPages = Math.ceil(itemsFound / itemsPerPage);
    }

    // Extraemos los nombres y arreglamos formato
    const names = [
      ...html
        .matchAll(/\\"product\\":\{\\\"name\\\":\\"([^"]+)"/g)
        .map((m) => m[1].replace(/\\+/g, "")),
    ];

    // Extraemos precios
    const prices = [...html.matchAll(/\\"price\\":\s*(\d+)/g)].map((m) =>
      Number(m[1]),
    );

    // Extraemos cantidad
    const qty = [...html.matchAll(/\\"subQty\\":\s*(\d+)/g)].map((m) =>
      Number(m[1]),
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
    const links = skus.map((sku) => `https://tienda.makro.com.co/p/${sku}`);

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
