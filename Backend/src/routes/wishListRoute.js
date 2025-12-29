import { Router } from "express";
import { getWishlistItems, addToWishlist, removeFromWishlist } from "../controllers/wishListController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const wishlistRouter = Router();


wishlistRouter.get("/", authMiddleware, getWishlistItems);          
wishlistRouter.post("/", authMiddleware, addToWishlist);            
wishlistRouter.delete("/remove/:productId", authMiddleware, removeFromWishlist); 

export default wishlistRouter;
