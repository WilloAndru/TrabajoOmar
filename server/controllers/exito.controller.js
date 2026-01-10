import { getProductsExito } from "../services/exito.service.js";

export const searchProductsExito = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsExito(`"${query}"`);
    return res.json(response);
  } catch (err) {
    res.status(500).json({ err: "Error en el servicio de exito" });
  }
};
