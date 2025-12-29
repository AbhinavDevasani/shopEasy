import { Router } from "express";
import { insertProducts, getProducts, addReview, getProductsByCategory, getProductById } from "../controllers/productsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const productRouter = Router();

productRouter.get("/products", getProducts);
productRouter.get("/productsbycategory/:category",getProductsByCategory);
productRouter.get("/products/getProductById/:id", getProductById)
productRouter.post("/products", authMiddleware, insertProducts); // protect if needed
productRouter.post("/products/:id/reviews", authMiddleware, addReview);

export default productRouter;
