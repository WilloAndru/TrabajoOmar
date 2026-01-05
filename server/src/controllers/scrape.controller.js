import exitoService from "../services/exito.service";

const searchProduct = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const result = await exitoService.search(q);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error de servicio" });
  }
};
