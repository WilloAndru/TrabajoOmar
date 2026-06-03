import { getProductsJumbo } from "../services/jumbo.service.js";
import { filterResponse } from "../utils/filterResponse.js";

export const searchProductsJumbo = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsJumbo(query);
    const resFilter = filterResponse(response, query);
    return res.json(resFilter);
  } catch (err) {
    return res.status(500).json({
      error: "Error en el servicio de Jumbo",
    });
  }
};
