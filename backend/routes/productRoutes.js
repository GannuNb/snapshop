import express from "express";
import { createProduct, getProducts ,getPendingProducts,approveProduct,rejectProduct,getSellerProducts } from "../controllers/productController.js";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { getProductById } from "../controllers/productController.js";

const router = express.Router();

/* ADMIN */
router.get("/pending-products", protect, authorizeRoles("admin"), getPendingProducts);
router.put("/approve-product/:id", protect, authorizeRoles("admin"), approveProduct);
router.put("/reject-product/:id", protect, authorizeRoles("admin"), rejectProduct);

/* SELLER */
router.get(
  "/seller/my-products",
  protect,
  authorizeRoles("seller"),
  getSellerProducts
);

router.post(
  "/",
  protect,
  authorizeRoles("seller"),
  createProduct
);

/* BUYER */
router.get("/", getProducts);

/* SINGLE PRODUCT (ALWAYS LAST) */
router.get("/:id", getProductById);


export default router;
