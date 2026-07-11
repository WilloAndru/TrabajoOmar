import { fetch } from "undici";

export const getProductsD1 = async (query) => {
  const itemsPerPage = 8;
  let currentPage = 1;
  let totalPages = null;
  let products = [];

  try {
    do {
      const url = `https://www.d1.com.co/${encodeURIComponent(query)}?_q=${encodeURIComponent(query)}&map=ft&page=${currentPage}`;

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

      if (totalPages === null) {
        const match = html.match(/"recordsFiltered":\s*(\d+)/);
        if (!match) break;

        const itemsFound = Number(match[1]);
        totalPages = Math.ceil(itemsFound / itemsPerPage);
      }

      const names = [...html.matchAll(/"nameComplete":\s*"([^"]+)"/g)].map(
        (m) => m[1],
      );

      const prices = [...html.matchAll(/"Price":\s*(\d+)/g)].map((m) =>
        Number(m[1]),
      );

      const qty = names.map((name) => {
        const match = name.match(/(\d+)\s*(?:G|GR|GRS|GRAMOS)?/i);
        return match ? Number(match[1]) : 0;
      });

      let pricePerUnit = [];
      if (qty[0]) {
        pricePerUnit = prices.slice(0, names.length).map((p, i) => {
          if (qty[i] === 0) return 0;
          return Number((p / qty[i]).toFixed(3));
        });
      }

      const skus = [...html.matchAll(/"@id":\s*"([^"]+)"/g)].map((m) => m[1]);

      names.forEach((name, i) => {
        const price = prices[i] || 0;
        if (price > 0) {
          products.push({
            name,
            price,
            pricePerUnit: pricePerUnit[i] || 0,
            link: skus[i] || null,
          });
        }
      });

      currentPage++;
    } while (currentPage <= totalPages);

    return products;
  } catch (error) {
    throw error;
  }
};
