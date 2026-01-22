import express from "express";
import {
  placeOrder,
  getMyOrders,
  sellerUpdateOrderStatus,
  adminUpdateOrderStatus,
} from "../controllers/orderController.js";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { getAllOrders } from "../controllers/orderController.js";
import { getSellerOrders } from "../controllers/orderController.js";
import { buyNowOrder } from "../controllers/orderController.js";


const router = express.Router();

/* BUYER */
router.post("/", protect, authorizeRoles("buyer"), placeOrder);
router.get("/my", protect, authorizeRoles("buyer"), getMyOrders);

/* SELLER */
router.get("/seller", protect, authorizeRoles("seller"), getSellerOrders);
router.put("/seller/:orderId", protect, authorizeRoles("seller"), sellerUpdateOrderStatus);

/* ADMIN */
router.get("/", protect, authorizeRoles("admin"), getAllOrders);
router.put("/admin/:orderId", protect, authorizeRoles("admin"), adminUpdateOrderStatus);
router.post(
  "/buy-now",
  protect,
  authorizeRoles("buyer"),
  buyNowOrder
);



export default router;

// /* BUYER */
// router.post("/", protect, authorizeRoles("buyer"), placeOrder);
// router.get("/my", protect, authorizeRoles("buyer"), getMyOrders);

// /* SELLER */
// router.put(
//   "/seller/:orderId",
//   protect,
//   authorizeRoles("seller"),
//   sellerUpdateOrderStatus
// );

// /* ADMIN */
// router.put(
//   "/admin/:orderId",
//   protect,
//   authorizeRoles("admin"),
//   adminUpdateOrderStatus
// );
// import { getSellerOrders } from "../controllers/orderController.js";

// router.get(
//   "/seller",
//   protect,
//   authorizeRoles("seller"),
//   getSellerOrders
// );

// export default router;

// router.get(
//   "/",
//   protect,
//   authorizeRoles("admin"),
//   getAllOrders
// );
