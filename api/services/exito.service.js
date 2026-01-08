import { runWithPuppeteer } from "../utils/puppeteerRunner.js";
import { fetch } from "undici";

export const getTotalCountExito = async (query) => {
  const url = `https://www.exito.com/s?q=${encodeURIComponent(
    query
  )}&sort=score_desc&page=0`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Exito response error: ${res.status}`);
  }

  const json = await res.text();
  const match = json.match(/"totalCount":\s*(\d+)/i);

  return match ? Number(match[1]) : 0;
};

export const getProductsExito = async (query) => {
  let products = [];
  let captured = false;

  const url = `https://www.exito.com/s?q=${encodeURIComponent(
    query
  )}&sort=price_asc&page=0`;

  await runWithPuppeteer(url, async (response) => {
    const resUrl = response.url();

    if (
      !captured &&
      resUrl.includes("/api/graphql") &&
      resUrl.includes("SearchQuery")
    ) {
      captured = true;
      const json = await response.json();
      const edges = json?.data?.search?.products?.edges || [];

      products = edges.map((edge) => {
        const p = edge.node;
        const offer = p.items?.[0]?.sellers?.[0]?.commertialOffer || {};
        const factorProp = p.properties?.find(
          (pr) => pr.name === "Factor Neto PUM"
        );
        const factor = parseFloat(factorProp?.values?.[0] ?? "1");

        return {
          name: p.name,
          price: offer.Price || 0,
          pricePerUnit: factor > 0 ? (offer.Price / factor).toFixed(3) : null,
          link: `https://www.exito.com/${p.slug}/p`,
        };
      });
    }
  });

  return products;
};
