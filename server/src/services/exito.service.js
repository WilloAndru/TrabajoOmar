import axios from "axios";

const search = async (query) => {
  // Definimos la cantidad y pagina de productos a buscar
  const variables = {
    first: 16, // Productos por página
    after: 0, // Desde qué índice empezar (paginación)
    sort: "score_desc", // Orden por relevancia
    term: query, // Término de búsqueda
    selectedFacets: [
      // Filtros: canal de venta y localización
      { key: "channel", value: '{"salesChannel":"1","regionId":""}' },
      { key: "locale", value: "es-CO" },
    ],
  };

  try {
    const response = await axios.post(
      "https://www.exito.com/api/graphql", // URL real de exito
      {
        operationName: "SearchQuery",
        variables, // Variables de búsqueda y paginación
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0", // Simula un navegador
        },
      }
    );
    console.log("🔹 response.data:", response.data); // <--- para debug

    const productsRaw = response.data?.data?.search?.products;
    if (!productsRaw) {
      console.error("❌ No se pudo obtener productos:", response.data?.errors);
      return { supermarket: "Exito", query, products: [] };
    }

    // Extraemos los datos a mostrar
    const products = productsRaw.edges.map((edge) => {
      const p = edge.node;
      return {
        name: p.name,
        price: p.items?.[0]?.sellers?.[0]?.commertialOffer?.Price || 0,
        image: p.items?.[0]?.images?.[0]?.imageUrl || "",
        link: `/p/${p.slug}`,
      };
    });

    return {
      supermarket: "Exito",
      query,
      products,
    };
  } catch (err) {
    console.error("Error", err);
  }
};

export default search;
