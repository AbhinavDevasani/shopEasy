import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  LogOut,
  Edit2,
  Save,
} from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const token = Cookies.get("Jwt_token");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const [profileRes, activitiesRes] = await Promise.all([
          fetch(`${API_URL}/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/profile/activities`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const profileData = await profileRes.json();
        const activitiesData = await activitiesRes.json();

        if (profileRes.ok) {
          setUser(profileData.user);
          setFormData(profileData.user.profile || {});
        } else {
          console.error("Profile API error:", profileData);
          toast.error(profileData.error || "Failed to load profile");
        }

        if (activitiesRes.ok) {
          setActivities(activitiesData.activities);
        
        } else {
          console.error("Activities API error:", activitiesData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, API_URL, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setEditMode(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = () => {
    Cookies.remove("Jwt_token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">User not found</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User size={32} /> My Profile
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            {/* Personal Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Personal Information</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Username</p>
                      <p className="font-semibold">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                  </div>
                  {user.profile?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={20} className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold">{user.profile.phone}</p>
                      </div>
                    </div>
                  )}
                  {user.profile?.address && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold">
                          {user.profile.address}
                          {user.profile.city && `, ${user.profile.city}`}
                          {user.profile.state && `, ${user.profile.state}`}
                          {user.profile.pincode && ` - ${user.profile.pincode}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <ShoppingBag size={24} /> Order History
              </h2>
              {activities?.orderHistory && activities.orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {activities.orderHistory.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <p className="font-semibold text-sm truncate">
                            {order._id}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "confirmed"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-semibold">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-semibold">
                            ₹{order.pricing.total?.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <p className="text-sm text-gray-600 mb-2">Items</p>
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex gap-3 text-sm mb-2"
                          >
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.product.title}</p>
                              <p className="text-gray-600">
                                Qty: {item.quantity} × ₹{item.product.price?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag
                    size={48}
                    className="mx-auto text-gray-300 mb-3"
                  />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Statistics */}
          <div className="space-y-6">
            {/* Activity Stats */}
            {activities && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Activity</h3>
                <div className="space-y-4">
                  <div className="rounded-lg p-4 bg-blue-50">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-500">
                      {activities.totalOrders}
                    </p>
                  </div>
                  <div className=" rounded-lg p-4 bg-green-50">
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold text-green-500">
                      ₹{activities.totalSpent.toFixed(2)}
                    </p>
                  </div>
                  {activities.lastOrder && (
                    <div className="rounded-lg p-4 bg-purple-50">
                      <p className="text-sm text-gray-600">Last Order Date</p>
                      <p className="text-lg font-bold text-purple-500">
                        {new Date(
                          activities.lastOrder.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Account</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-600">Member Since</p>
                  <p className="font-semibold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
