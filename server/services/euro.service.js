import { fetch } from "undici";

export const getProductsEuro = async (query) => {
  const itemsPerPage = 24;
  let currentPage = 1;
  let totalPages = null;
  let products = [];

  do {
    const url = `https://www.eurosupermercados.com.co/${encodeURIComponent(query)}?_q=${encodeURIComponent(query)}&map=ft&page=${currentPage}`;

    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "text/html",
      },
    });

    if (!res.ok) {
      throw new Error(`Euro response error: ${res.status}`);
    }

    const html = await res.text();

    // Cuando es la primera iteracion, calculamos el total de paginas
    if (totalPages === null) {
      const match = html.match(/"recordsFiltered"\s*:\s*(\d+)/i);
      if (!match) break;

      const itemsFound = Number(match[1]);
      totalPages = Math.ceil(itemsFound / itemsPerPage);
    }

    // Extraemos los nombres y arreglamos formato
    const names = [...html.matchAll(/"nameComplete"\s*:\s*"([^"]+)"/g)].map(
      (m) => m[1],
    );

    // Extraemos precios
    const prices = [...html.matchAll(/"Price"\s*:\s*(\d+)/g)].map((m) =>
      Number(m[1]),
    );

    // Extraemos cantidad
    const pricePerUnit = names.map((name, i) => {
      let qty = 1;
      const match = name.match(/(?:x)?\s*(\d+(?:\.\d+)?)\s*(kg|g|gr|ml|l)/i);

      if (match) {
        qty = Number(match[1]);
        const unit = match[2].toLowerCase();

        if (unit === "kg" || unit === "l") {
          qty *= 1000; // kg → gramos
        }
      }

      return qty !== 1 && prices[i] ? Number((prices[i] / qty).toFixed(3)) : 1;
    });

    // Extraemos sku de cada producto y creamos links
    const links = [...html.matchAll(/"@id"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);

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
