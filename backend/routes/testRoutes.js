import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Buyer only */
router.get(
  "/buyer",
  protect,
  authorizeRoles("buyer"),
  (req, res) => {
    res.json({ message: "Buyer access granted" });
  }
);

/* Seller only */
router.get(
  "/seller",
  protect,
  authorizeRoles("seller"),
  (req, res) => {
    res.json({ message: "Seller access granted" });
  }
);

/* Admin only */
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

export default router;
