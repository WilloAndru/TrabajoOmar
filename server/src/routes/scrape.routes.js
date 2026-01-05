import express from "express";
import { searchProduct } from "../controllers/scrape.controller.js";

const router = express.Router();

router.get("/search", searchProduct);

export default router;
