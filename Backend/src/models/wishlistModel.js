import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Product"
    }
},{_id: false})

const wishlistSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    items:[wishlistItemSchema]
},{timestamps:true})

export const WishlistModel = mongoose.model("Wishlist", wishlistSchema)