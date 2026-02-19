import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

import {
  placeOrder,
  getMyOrders,
  sellerUpdateOrderStatus,
  adminUpdateOrderStatus,
  getAllOrders,
  getSellerOrders,
  buyNowOrder,
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  createCODOrder,
  createCartPaymentOrder,
  verifyCartPaymentAndCreateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

/* ================= BUYER ROUTES ================= */

/* Cart COD Order */
router.post("/", protect, authorizeRoles("buyer"), placeOrder);

/* Get My Orders */
router.get("/my", protect, authorizeRoles("buyer"), getMyOrders);

/* Buy Now Direct Order optional code */
router.post("/buy-now", protect, authorizeRoles("buyer"), buyNowOrder);

/* Single Product - Razorpay */
router.post("/create-payment-order", protect, authorizeRoles("buyer"), createPaymentOrder);
router.post("/verify-payment", protect, authorizeRoles("buyer"), verifyPaymentAndCreateOrder);

/* Single Product - COD */
router.post("/cod-order", protect, authorizeRoles("buyer"), createCODOrder);

/* Cart - Razorpay */
router.post("/create-cart-payment-order", protect, authorizeRoles("buyer"), createCartPaymentOrder);
router.post("/verify-cart-payment", protect, authorizeRoles("buyer"), verifyCartPaymentAndCreateOrder);


/* ================= SELLER ROUTES ================= */

router.get("/seller", protect, authorizeRoles("seller"), getSellerOrders);
router.put("/seller/:orderId", protect, authorizeRoles("seller"), sellerUpdateOrderStatus);


/* ================= ADMIN ROUTES ================= */

router.get("/admin", protect, authorizeRoles("admin"), getAllOrders);
router.put("/admin/:orderId", protect, authorizeRoles("admin"), adminUpdateOrderStatus);


export default router;
