import { getProductsZapatoca } from "../services/zapatoca.service.js";

export const searchProductsZapatoca = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsZapatoca(query);
    return res.json(response);
  } catch (err) {
    console.error("Zapatoca error:", err);
    return res.status(500).json({
      error: "Error en el servicio de Zapatoca",
    });
  }
};
