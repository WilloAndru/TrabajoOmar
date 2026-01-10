import { getProductsCarulla } from "../services/carulla.service.js";

export const searchProductsCarulla = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsCarulla(`"${query}"`);
    return res.json(response);
  } catch (err) {
    res.status(500).json({ err: "Error en el servicio de exito" });
  }
};
