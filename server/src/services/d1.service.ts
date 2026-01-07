import { runWithPuppeteer } from "../utils/puppeteerRunner.ts";

interface Product {
  name: string;
  price: number;
  pricePerUnit: string | null;
  link: string;
}

export const getTotalCountD1 = async (query: string) => {
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
