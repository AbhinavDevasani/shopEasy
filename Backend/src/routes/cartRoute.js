import { Router } from "express";
import { getCartItems, addToCart, decreaseCartItems, clearCart } from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const cartRouter = Router();

cartRouter.get("/getCart",authMiddleware, getCartItems);
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/decrease", authMiddleware, decreaseCartItems)
cartRouter.delete("/clear", authMiddleware, clearCart)

export default cartRouter