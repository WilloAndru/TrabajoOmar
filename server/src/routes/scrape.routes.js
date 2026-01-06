import express from "express";
import {
  searchProductsExito,
  searchTotalCountExito,
} from "../controllers/exito.controller.js";

const router = express.Router();

router.get("/searchProductsExito", searchProductsExito);
router.get("/totalCountExito", searchTotalCountExito);

export default router;
