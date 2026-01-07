import {
  getProductsExito,
  getTotalCountExito,
} from "../services/exito.service.js";

export const searchProductsExito = async (req, res) => {
  const { query, sortBy } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsExito(`"${query}"`, sortBy);
    return res.json(response);
  } catch (err) {
    res.status(500).json({ err: "Error en el servicio de exito" });
  }
};

export const searchTotalCountExito = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getTotalCountExito(`"${query}"`);
    return res.json(response);
  } catch (err) {
    res.status(500).json({ err: "Error en el servicio de exito" });
  }
};
