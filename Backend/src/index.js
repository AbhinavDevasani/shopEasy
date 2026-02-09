import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import "dotenv/config"
import mongoose from "mongoose";
import authRouter from "./routes/authRoute.js";
import wishlistRouter from "./routes/wishListRoute.js";
import productRouter from "./routes/productsRoute.js";
import cartRouter from "./routes/cartRoute.js";
import profileRouter from "./routes/profileRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import emailRouter from "./routes/emailRoutes.js";
const app = express();

app.use(cors({
    origin: "*",
}))
app.use(express.json());
app.use("/auth", authRouter)
app.use("/product", productRouter)
app.use("/wishlist", wishlistRouter)
app.use("/cart", cartRouter)
app.use("/payment", paymentRouter)
app.use("/profile", profileRouter)
app.use("/email", emailRouter)

const PORT = process.env.PORT || 3000;
const url = process.env.MONGO_URL;

if (!url) {
    console.log("Mongo url is not defined in .env file");
    process.exit(1);
}

const main = async () => {
    try {
        await connectDb(url)
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        })
    } catch (error) {
        console.log("Error in connecting Database", error)
    }

}
main()


