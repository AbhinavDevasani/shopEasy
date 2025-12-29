import { ProductModel } from "../models/productsModel.js";
import { WishlistModel } from "../models/wishlistModel.js";
export const getProducts = async(req, res)=>{
    try {
        const products = await ProductModel.find();
        res.status(200).json({
            message:"Products fetched successfully",
            sussess:true,
            products
        })
    } catch (error) {
        console.log("Error in get products", error)
        res.status(500).json({error:"Error in fetching the Products", sussess:false})
    }
}

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        error: "Product Not Found",
        success: false,
      });
    }

    let isWishlisted = false;

    
    if (req.user) {
      const wishlist = await WishlistModel.findOne({
        user: req.user.userId,
      });

      if (wishlist) {
        isWishlisted = wishlist.items.some(
          (item) => item.product.toString() === product._id.toString()
        );
      }
    }

    res.status(200).json({
      message: "Product fetched successfully by Id",
      success: true,
      product: {
        ...product.toObject(),
        isWishlisted, 
      },
    });
  } catch (error) {
    console.log("server error while fetching products by id", error);
    res.status(500).json({
      error: "Server error while fetching products by id",
      success: false,
    });
  }
};

export const getProductsByCategory = async(req,res)=>{
    try {
        const {category} = req.params;
        const {limit = 0} = req.query;
        
        const products = await ProductModel.find({category}).sort({ createdAt: -1 }).limit(limit);
        if(!products){
            return res.status(404).json({
                error:"Products Not found fopr that category",
                success:false
            })
        }
        res.status(200).json({
            message:"Products fetched successfully by category",
            success:true,
            products
        })
    } catch (error) {
        console.log("Server error while fetching products by category",error);
        res.status(500).json({
            error:"Server error while fetching products by category",
            success:false,
            
        })
    }
}
export const insertProducts = async(req, res)=>{
    try {
        const {products} = req.body;
        if(!Array.isArray(products) || products.length===0){
            return res.status(400).json({error:"Product Array is required"})
        }
        const insertedproducts = await ProductModel.insertMany(products);
        res.status(201).json({message:`${products.length} products are inserted successfully`})
    } catch (error) {
        res.status(500).json({error:"Error in Inserting the products"})
    }
}

export const addReview = async (req, res)=>{
    try {
        const {id} = req.params;
        const{rating, comment} = req.body;
        const userId = req.user.userId;
        const username = req.user.username;

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                error: "Rating and comment are required"
            });
        }
        const product = await ProductModel.findById(id);
        if(!product){
            return res.status(404).json({error:"Product Not found", success:false})
        }

        product.reviews.push({user:userId, name:username, rating, comment});
        product.rating = product.reviews.reduce((acc, item)=> acc+item.rating,0)/product.reviews.length;
        product.numReviews = product.reviews.length;

        await product.save();
        res.status(200).json({
            message:"Review added successfully",
            success:true,
            reviews:product.reviews
        })

    } catch (error) {
        console.log("Server Error while adding a review", error);
        res.status(500).json({error:"server Error while adding a review", success:false})
    }
}