import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number,
        default:1,
        required:true
    }
},{_id: false})

const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
        unique:true
    },
    items:[cartItemSchema],
    total:{
        type:Number,
        default:0
    }

})

export const CartModel = mongoose.model("Cart", cartSchema)