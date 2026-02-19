import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { updateQuantity } from "../controllers/cartController.js";


const router = express.Router();

router.post("/", protect, authorizeRoles("buyer"), addToCart);
router.get("/", protect, authorizeRoles("buyer"), getCart);
router.delete("/:productId", protect, authorizeRoles("buyer"), removeFromCart);


router.put("/", protect, authorizeRoles("buyer"), updateQuantity);


export default router;
