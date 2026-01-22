import { getProductsExito } from "../services/exito.service.js";
import { filterResponse } from "../utils/filterResponse.js";

export const searchProductsExito = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    console.log("🔍 Buscando productos para:", query);
    const response = await getProductsExito(`"${query}"`);
    console.log("✅ Productos obtenidos:", response.length);

    const resFilter = filterResponse(response, query);
    console.log("✅ Productos filtrados:", resFilter.length);

    return res.json(resFilter);
  } catch (err) {
    console.error("❌ ERROR COMPLETO:", err); // ← ESTO ES CLAVE
    console.error("❌ Error message:", err.message);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({
      error: "Error en el servicio de exito",
      message: err.message, // ← Enviar mensaje para debugging
    });
  }
};
