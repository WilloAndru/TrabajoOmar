import express from "express";
import {
  searchProductsExito,
  searchTotalCountExito,
} from "../controllers/exito.controller.ts";
import { searchTotalCountD1 } from "../controllers/d1.controller.ts";

const router = express.Router();

router.get("/searchProductsExito", searchProductsExito);
router.get("/totalCountExito", searchTotalCountExito);
router.get("/totalCountD1", searchTotalCountD1);

export default router;
