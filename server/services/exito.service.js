import { fetch } from "undici";

export const getProductsExito = async (query) => {
  const itemsPerPage = 16;
  let currentPage = 0;
  let totalPages = null;
  let products = [];

  try {
    do {
      // Maximo 40 paginas
      if (currentPage >= 40) break;

      console.log(`📄 Página ${currentPage + 1}/${totalPages || "?"}`);

      const after = String(currentPage * itemsPerPage);

      const variables = encodeURIComponent(
        JSON.stringify({
          first: itemsPerPage,
          after,
          sort: "score_desc",
          term: query,
          selectedFacets: [
            { key: "channel", value: '{"salesChannel":"1","regionId":""}' },
            { key: "locale", value: "es-CO" },
          ],
        }),
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

      // Cuando es la primera iteracion, calculamos el total de paginas
      if (totalPages === null) {
        const match = json.match(/"totalCount":\s*(\d+)/i);
        if (!match) {
          break;
        }

        const itemsFound = Number(match[1]);
        totalPages = Math.ceil(itemsFound / itemsPerPage);
      }

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

      console.log(
        `   Names: ${names.length}, Prices: ${prices.length}, Qty: ${qty.length}`,
      );

      // Validación: si los arrays no tienen el mismo tamaño
      if (names.length !== prices.length) {
        console.warn(
          `⚠️ Desbalance en página ${currentPage + 1}: names=${names.length}, prices=${prices.length}`,
        );
      }

      // Calculamos el precio por unidad
      const pricePerUnit = prices.map((price, i) => {
        if (!qty[i] || qty[i] === 0) {
          console.warn(`⚠️ qty[${i}] es ${qty[i]}, usando 0 para pricePerUnit`);
          return 1;
        }
        return Number((price / qty[i]).toFixed(3));
      });

      // Extraemos sku de cada producto y creamos links
      const slugs = [...json.matchAll(/"slug":"([^"]+)"/g)]
        .map((m) => m[1])
        .slice(0, 16);
      const links = slugs.map((slug) => `https://www.exito.com/${slug}/p`);

      names.forEach((name, i) => {
        // Validar que todos los datos existan
        if (!name || !prices[i] || !links[i]) {
          console.warn(`⚠️ Producto incompleto en índice ${i}:`, {
            name: name || "MISSING",
            price: prices[i] || "MISSING",
            link: links[i] || "MISSING",
          });
          return; // Saltar este producto
        }

        // Solo agregar si el precio no es 0
        if (prices[i] !== 0) {
          products.push({
            name,
            price: prices[i],
            pricePerUnit: pricePerUnit[i],
            link: links[i],
          });
        }
      });

      currentPage++;
    } while (currentPage <= totalPages);

    return products;
  } catch (error) {
    console.error("❌ Error en getProductsExito:", error);
    console.error("❌ Stack:", error.stack);
    throw error;
  }
};
