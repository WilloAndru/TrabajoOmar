import { getProductsExito } from "../services/exito.service.js";
import { filterResponse } from "../utils/filterResponse.js";

export const searchProductsExito = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsExito(`"${query}"`);
    const resFilter = filterResponse(response, query);
    return res.json(resFilter);
  } catch (err) {
    console.error("❌ ERROR COMPLETO:", err);
    console.error("❌ Error message:", err.message);
    res.status(500).json({
      error: "Error en el servicio de exito",
      message: err.message,
    });
  }
};
