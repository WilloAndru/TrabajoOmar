import { Request, Response } from "express";
import {
  getProductsExito,
  getTotalCountExito,
} from "../services/exito.service.ts";

export const searchProductsExito = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { query, sortBy } = req.query as {
    query?: string;
    sortBy?: string;
  };

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getProductsExito(query, sortBy ?? "score_desc");
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ error: "Error en el servicio de exito" });
  }
};

export const searchTotalCountExito = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { query } = req.query as { query?: string };

  if (!query) {
    return res.status(400).json({ error: "No hay consulta" });
  }

  try {
    const response = await getTotalCountExito(query);
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ error: "Error en el servicio de exito" });
  }
};
