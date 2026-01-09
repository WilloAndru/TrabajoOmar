import express from "express";
import { searchProductsExito } from "../controllers/exito.controller.js";
import { searchProductsD1 } from "../controllers/d1.controller.js";
import { searchProductsJumbo } from "../controllers/jumbo.controller.js";
import { searchProductsOlimpica } from "../controllers/olimpica.controller.js";
import { searchProductsCarulla } from "../controllers/carulla.controller.js";

const router = express.Router();

router.get("/searchProductsExito", searchProductsExito);
router.get("/searchProductsD1", searchProductsD1);
router.get("/searchProductsJumbo", searchProductsJumbo);
router.get("/searchProductsOlimpica", searchProductsOlimpica);
router.get("/searchProductsOlimpica", searchProductsOlimpica);
router.get("/searchProductsCarulla", searchProductsCarulla);

export default router;
