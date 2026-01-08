import { getTotalCountJumbo } from "../services/jumbo.service.js";

export const searchTotalCountJumbo = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getTotalCountJumbo(query);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({
      error: "Error en el servicio de Jumbo",
    });
  }
};
