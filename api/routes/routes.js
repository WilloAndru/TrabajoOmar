import express from "express";
import {
  searchProductsExito,
  searchTotalCountExito,
} from "../controllers/exito.controller.js";
import {
  searchTotalCountD1,
  searchProductsD1,
} from "../controllers/d1.controller.js";

const router = express.Router();

router.get("/totalCountExito", searchTotalCountExito);
router.get("/searchProductsExito", searchProductsExito);
router.get("/totalCountD1", (req, res) => {
  console.log("query:", req.query);
  res.json(req.query);
});
router.get("/searchProductsD1", searchProductsD1);

export default router;
