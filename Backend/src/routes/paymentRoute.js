import express from "express";
import { createRazorpayOrder, verifyPayment, getOrders } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createRazorpayOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);
router.get("/orders", authMiddleware, getOrders);

export default router;
