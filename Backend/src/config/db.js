import mongoose from "mongoose"

export const connectDb = async (url)=>{
    try {
        await mongoose.connect(url)
        console.log("Connected to Db")
    } catch (error) {
        console.log("Error in Connecting to Db",error);
        process.exit(1);
    }
}

