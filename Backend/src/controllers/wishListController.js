
import { WishlistModel } from "../models/wishlistModel.js";

export const getWishlistItems = async(req,res)=>{
    try {
        const userId = req.user.userId;

        if(!userId){
            return res.status(401).json({
                error:"Unauthorized: userId is missing",
                success:false
            })
        }
        const wishlist = await WishlistModel.findOne({user:userId}).populate("items.product");
        if(!wishlist){
            return res.status(404).json({
                error:"No products found in user's WishList",
                success:false
            })
        }

        res.status(200).json({
            message:"Wishlist items fetched successfully",
            success:true,
            wishlist
        })

    } catch (error) {
        console.log("Server error while fetching wishlist items",error);
        res.status(500).json({
            error:"Server error while fetching wishlist items",
            success:false
        })
    }
}

export const addToWishlist = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const {productId} = req.body;

        if(!userId){
            return res.status(401).json({
                error:"Unauthorized: user id is missing",
                success:false
            })
        }
        if(!productId){
           return res.status(400).json({ success: false, error: "productId is required" });
        }
        let  wishlist = await WishlistModel.findOne({user: userId});

        if(!wishlist){
            wishlist = new WishlistModel({user: userId, items: []});
        }

        const alreadyExist = wishlist.items.some(
            (item) => item.product.toString()===productId
        )
        if(alreadyExist){
            return res.status(400).json({error:"This product is already in wishlist", success:false, wishlist: wishlist})
        }

        wishlist.items.push({product:productId})
        await wishlist.save();

        const populatedWishlist = await wishlist.populate("items.product");

        res.status(200).json({
            message:"Product is added to wishlist successfully",
            success:true,
            wishlist: populatedWishlist
        })
        
    } catch (error) {
        console.log("server error while adding product to wishlist", error);
        res.status(500).json({
            error:"Server error while adding product to wishlist",
            success:false
        })
    }
}

export const removeFromWishlist = async(req, res)=>{
    try {
        const userId = req.user.userId;
        const productId = req.params?.productId ?? req.body?.productId;

        if(!userId){
            return res.status(401).json({
                error:"Unauthorized: user id is missing",
                success:false
            })
        }
        if(!productId){
            return res.status(400).json({
                error:"Product id is missing",
                success:false
            })
        }

        const wishlist =  await WishlistModel.findOne({user: userId});
        if(!wishlist){
            return res.status(404).json({
                error:"Wishlist is not found for this user",
                success:false
            })
        }

        wishlist.items = wishlist.items.filter((item)=> item.product.toString()!== productId);

        await wishlist.save();

        const populatedwishlist = await wishlist.populate("items.product");

        res.status(200).json({
            message:"Product removed from Wishlist",
            success:true,
            wishlist:populatedwishlist
        })

    } catch (error) {
        console.log("Server error while removing item from wishlist", error);
        res.status(500).json({
            error:"Server error while removing product from wishlist",
            success:false,
        })
    }
}