import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

/* ⭐ MISSING ROUTES — ADD THESE */
router.get("/addresses", protect, getMyAddresses);
router.post("/addresses", protect, addAddress);

/* EXISTING ROUTES */
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);
router.put("/addresses/default/:addressId", protect, setDefaultAddress);

export default router;
