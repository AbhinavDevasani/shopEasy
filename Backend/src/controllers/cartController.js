import { CartModel } from "../models/cartModel.js";
import { ProductModel } from "../models/productsModel.js";

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized: user id missing" });
    }
    const cartProducts = await CartModel
      .findOne({ user: userId })
      .populate("items.product", "title price description image category");
      

    if (!cartProducts) {
      return res.status(404).json({
        success: false,
        error: "No cart found for this user",
        cartProducts: { items: [], totalPrice: 0 },
      });
    }

    
    const totalPrice = await calculateCartTotal(cartProducts.items);
    cartProducts.totalPrice = totalPrice;

    
    if (CartModel.schema.path("totalPrice")) {
      await cartProducts.save();
    }

    res.status(200).json({
      message: "Successful in getting cart items",
      success: true,
      cartProducts,
    });
  } catch (error) {
    console.error("Error while fetching cart items", error);
    res.status(500).json({ success: false, error: "Server error while fetching cart items" });
  }
};

const calculateCartTotal = async (items) => {
  
  const productIds = items
    .map((i) => {
      if (!i?.product) return null;
      if (typeof i.product === "object" && i.product._id) return i.product._id.toString();
      return i.product.toString();
    })
    .filter(Boolean);
  const products = productIds.length
    ? await ProductModel.find({ _id: { $in: productIds } }).select("price")
    : [];
  const getPriceForItem = (item) => {
    if (item.product && typeof item.product === "object" && item.product.price != null) {
      return Number(item.product.price) || 0;
    }
    const pid = (item.product && item.product._id) ? item.product._id.toString() : item.product.toString();
    const p = products.find((x) => x._id.toString() === pid);
    return p ? Number(p.price) || 0 : 0;
  };

  let total = 0;
  for (const item of items) {
    const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
    const price = getPriceForItem(item);
    total += price * qty;
  }

  return Math.round(total * 100) / 100;
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized: user id missing" });
    }
    if (!productId) {
      return res.status(400).json({ success: false, error: "productId is required" });
    }
    const productExists = await ProductModel.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = new CartModel({ user: userId, items: [] });
    }
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity = Number(existingItem.quantity || 0) + 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    cart.totalPrice = await calculateCartTotal(cart.items);

    await cart.save();

    const updatedCart = await CartModel.findOne({ user: userId }).populate("items.product", "title price description image category");

    res.status(200).json({
      message: "Updated cart items",
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error while adding to cart", error);
    res.status(500).json({
      success: false,
      error: "Server error while adding item to cart",
    });
  }
};

export const decreaseCartItems = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized: user id missing" });
    }
    if (!productId) {
      return res.status(400).json({ success: false, error: "productId is required" });
    }

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId.toString());

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: "Product not found in cart" });
    }

    const item = cart.items[itemIndex];

    if ((Number(item.quantity) || 0) > 1) {
      item.quantity = Number(item.quantity) - 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    
    cart.totalPrice = await calculateCartTotal(cart.items);

    await cart.save();

    const updatedCart = await CartModel
      .findOne({ user: userId })
      .populate("items.product", "title price description image category");

    return res.status(200).json({
      success: true,
      message: "Item decreased successfully",
      cart: updatedCart ?? { items: [], totalPrice: 0 },
    });
  } 
  catch (error) {
    console.error("Error in decreaseCartItems:", error);
    return res.status(500).json({ success: false, error: "Server error while decreasing cart item" });
  }
};


export const clearCart = async(req, res)=>{
    try {
        
        const userId = req.user.userId;

        if(!userId){
            return res.status(401).json({
                error:"Unauthorized: User id is missing",
                success:false
            })
        }
    
        const cart = await CartModel.findOne({user: userId});
        if(!cart){
            return res.status(404).json({
                error:"No Cart found for this user",
                success:false
            })
        }

        cart.items = [];
        cart.totalPrice = 0;

        await cart.save();

        res.status(200).json({
            message:"Cart Cleared successfully",
            success:true,
            cart
        });

    } catch (error) {
        console.log("Error while clearing the cart",error);
        res.status(500).json({
            error:"Server error while clearing the cart",
            success:false
        })
    }
}