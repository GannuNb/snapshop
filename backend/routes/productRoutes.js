import express from "express";
import { createProduct, getProducts } from "../controllers/productController.js";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { getProductById } from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("seller"),
  createProduct
);

router.get("/", getProducts);

router.get("/:id", getProductById);

export default router;
