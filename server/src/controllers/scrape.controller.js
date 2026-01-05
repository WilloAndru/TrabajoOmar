import search from "../services/exito.service.js";

const searchProduct = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const result = await search(q);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de servicio" });
  }
};

export default searchProduct;
