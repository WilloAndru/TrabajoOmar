import { getProductsVaquita } from "../services/vaquita.service.js";

export const searchProductsVaquita = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsVaquita(query);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({
      error: "Error en el servicio de Vaquita",
    });
  }
};
