import { getProductsEuro } from "../services/euro.service.js";

export const searchProductsEuro = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsEuro(query);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({
      error: "Error en el servicio de Euro",
    });
  }
};
