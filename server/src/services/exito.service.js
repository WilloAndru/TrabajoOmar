import { runWithPuppeteer } from "../utils/puppeteerRunner.js";

export const getTotalCountExito = async (query) => {
  let totalCount = 0;
  let captured = false;

  const url = `https://www.exito.com/s?q=${encodeURIComponent(
    query
  )}&sort=score_desc&page=0`;

  await runWithPuppeteer(url, async (response) => {
    const resUrl = response.url();

    if (
      !captured &&
      resUrl.includes("/api/graphql") &&
      resUrl.includes("SearchQuery")
    ) {
      captured = true;
      const json = await response.json();
      totalCount = json?.data?.search?.products?.pageInfo?.totalCount ?? 0;
    }
  });

  return totalCount;
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
          link: `/${p.slug}/p`,
        };
      });
    }
  });

  return { products };
};
