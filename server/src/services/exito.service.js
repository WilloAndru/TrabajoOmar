import axios from "axios";

const search = async (query) => {
  // La URL usa directamente la query dinámica
  const url = `https://www.exito.com/api/catalog_system/pub/products/search/${encodeURIComponent(
    query
  )}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // Simula un navegador, para evitar bloqueos por ser un bot
      },
    });

    // Log completo del objeto recibido
    console.log("🔹 Response.data completo:");
    console.log(JSON.stringify(response.data, null, 2));

    // response.data es directamente un array de productos
    const productsRaw = response.data || [];
    console.log("🔹 Total de productos recibidos:", productsRaw.length);

    const products = productsRaw.map((p) => ({
      name: p.productName,
      price: p.items?.[0]?.sellers?.[0]?.commertialOffer?.Price || 0,
      image: p.items?.[0]?.images?.[0]?.imageUrl || "",
      link: `/p/${p.linkText}`,
    }));

    return {
      supermarket: "Exito",
      query,
      products,
    };
  } catch (err) {
    console.error("❌ Error al consultar API pública de Éxito:", err);
  }
};

export default search;
