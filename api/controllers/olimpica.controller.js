import { getProductsOlimpica } from "../services/olimpica.service.js";

export const searchProductsOlimpica = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsOlimpica(query);
    return res.json(response);
  } catch (err) {
    res.status(500).json({ err: "Error en el servicio de exito" });
  }
};
