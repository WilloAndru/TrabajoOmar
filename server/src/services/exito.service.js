import axios from "axios";

const search = async (query) => {
  const url = `https://www.exito.com/s?q=${encodeURIComponent(query)}`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "AcademicPriceComparator/1.0",
    },
  });

  return {
    supermarket: "Exito",
    query,
    htmlLength: response.data.length,
  };
};

export default search;
