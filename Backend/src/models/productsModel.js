import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    name:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    }
},{timestamps:true})

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:0
    },
    reviews:[reviewSchema],
    numReviews:{
        type:Number,
        default:0
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

 export const ProductModel = mongoose.model("Product",productSchema)