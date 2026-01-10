import { getProductsD1 } from "../services/d1.service.js";

export const searchProductsD1 = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsD1(query);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({
      error: "Error en el servicio de D1",
    });
  }
};
