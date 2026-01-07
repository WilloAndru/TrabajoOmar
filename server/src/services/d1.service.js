import { runWithPuppeteer } from "../utils/puppeteerRunner.js";

export const getTotalCountD1 = async (query) => {
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
