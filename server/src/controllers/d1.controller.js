import { getTotalCountD1 } from "../services/d1.service.js";

export const searchTotalCountD1 = async () => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getTotalCountD1(query);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ error: "Error en el servicio de exito" });
  }
};
