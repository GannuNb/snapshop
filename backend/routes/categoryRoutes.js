import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCategory
);

router.get("/", getCategories);

export default router;
