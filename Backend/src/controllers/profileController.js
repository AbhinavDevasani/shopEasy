import { UserModel } from "../models/userModel.js";
import { OrderModel } from "../models/orderModel.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, address, city, state, pincode, country } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        profile: {
          phone,
          address,
          city,
          state,
          pincode,
          country,
        },
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getUserActivities = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders = await OrderModel.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    const activities = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.pricing.total, 0),
      lastOrder: orders[0] || null,
      orderHistory: orders,
    };

    res.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};
