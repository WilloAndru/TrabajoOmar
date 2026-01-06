import { search } from "../services/exito.service.js";

export const searchProduct = async (req, res) => {
  const { query, sortBy } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await search(query, sortBy);
    return res.json(response);
  } catch (err) {
    res.status(500).json({ err: "Error en el servicio de exito" });
  }
};
