import express from "express";
import {
  searchProductsExito,
  searchTotalCountExito,
} from "../controllers/exito.controller.js";
import {
  searchTotalCountD1,
  searchProductsD1,
} from "../controllers/d1.controller.js";
import {
  searchTotalCountJumbo,
  searchProductsJumbo,
} from "../controllers/jumbo.controller.js";

const router = express.Router();

router.get("/totalCountExito", searchTotalCountExito);
router.get("/searchProductsExito", searchProductsExito);
router.get("/totalCountD1", searchTotalCountD1);
router.get("/searchProductsD1", searchProductsD1);
router.get("/totalCountJumbo", searchTotalCountJumbo);
router.get("/searchProductsJumbo", searchProductsJumbo);

export default router;
