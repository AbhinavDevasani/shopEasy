import { UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken"

export const authMiddleware = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not provided" });
    }
    const token = authHeader.split(" ")[1];

    try {
        const secret_code = process.env.secret_key;
        if(!secret_code){
            return res.status(400).json({error:"Server misconfiguration"})
        }
        const verifiy = jwt.verify(token,secret_code);
    
        const userDetails = await UserModel.findById(verifiy.id)

        req.user = {
            userId:userDetails._id, 
            username:userDetails.username, 
            email:userDetails.email
        }

        next();
        
    } catch (err) {
        console.log("Error in middleware");
        return res.status(401).json({error:"Invalid Token"})
    }
}