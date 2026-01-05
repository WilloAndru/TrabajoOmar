import { search } from "../services/exito.service.js";

export const searchProduct = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const products = await search(q);
    return res.json({ supermarket: "Exito", q, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de servicio" });
  }
};
