import axios from "axios";
import * as cheerio from "cheerio";

const search = async (query) => {
  const url = `https://www.exito.com/s?q=${encodeURIComponent(query)}`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "AcademicPriceComparator/1.0",
    },
  });

  const $ = cheerio.load(response.data);

  console.log($(".productCard_productInfo__yn2lK").length);

  const products = [];

  $(".productCard_productInfo__yn2lK").each((_, el) => {
    const name = $(el).find(".styles_name__qQJiK").text().trim();
    const price = $(el)
      .find(".ProductPrice_container__price__XmMWA.ProductPrice_text14___ZxlL")
      .text()
      .trim();

    if (name && price) {
      products.push({ name, price });
    }
  });

  return {
    supermarket: "Exito",
    query,
    products,
  };
};

export default search;
