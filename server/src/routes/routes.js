import express from "express";
import {
  searchProductsExito,
  searchTotalCountExito,
} from "../controllers/exito.controller.js";
import { searchTotalCountD1 } from "../controllers/d1.controller.js";

const router = express.Router();

router.get("/totalCountD1", searchTotalCountD1);
router.get("/searchProductsExito", searchProductsExito);
router.get("/totalCountExito", searchTotalCountExito);

export default router;
