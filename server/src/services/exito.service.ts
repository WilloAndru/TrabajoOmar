import { runWithPuppeteer } from "../utils/puppeteerRunner.ts";

interface Product {
  name: string;
  price: number;
  pricePerUnit: string | null;
  link: string;
}

export const getTotalCountExito = async (query: string) => {
  let totalCount = 0;
  let captured = false;

  const url = `https://www.exito.com/s?q=${encodeURIComponent(
    query
  )}&sort=score_desc&page=0`;

  await runWithPuppeteer(url, async (response: any) => {
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

export const getProductsExito = async (query: string, sortBy: string) => {
  let products: Product[] = [];
  let captured = false;

  const url = `https://www.exito.com/s?q=${encodeURIComponent(
    query
  )}&sort=${sortBy}&page=0`;

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

      products = edges.map((edge: any) => {
        const p = edge.node;
        const offer = p.items?.[0]?.sellers?.[0]?.commertialOffer || {};
        const factorProp = p.properties?.find(
          (pr: any) => pr.name === "Factor Neto PUM"
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
