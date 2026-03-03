import { getProductsMakro } from "../services/makro.service.js";

export const searchProductsMakro = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsMakro(query);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({
      error: "Error en el servicio de Makro",
    });
  }
};
