import express from "express";
import { createRazorpayOrder, verifyPayment, getOrders } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", authMiddleware, createRazorpayOrder);
paymentRouter.post("/verify-payment", authMiddleware, verifyPayment);
paymentRouter.get("/orders", authMiddleware, getOrders);

export default paymentRouter;
