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
import Footer from "./Footer";
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
    <div>
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

        {/* Activity Stats & Account - Moved to Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Activity Stats */}
          {activities && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 ">
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activities.totalOrders}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 ">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{activities.totalSpent.toFixed(2)}
                </p>
              </div>
              {activities.lastOrder && (
                <div className="bg-white rounded-lg shadow-sm p-6 ">
                  <p className="text-sm text-gray-600 mb-1">Last Order</p>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {new Date(activities.lastOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Account Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 ">
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Personal Info - Full Width */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="sm:col-span-2 lg:col-span-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
              {user.profile?.phone && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{user.profile.phone}</p>
                  </div>
                </div>
              )}
              {user.profile?.address && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2 lg:col-span-3">
                  <MapPin size={20} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">
                      {user.profile.address}
                      {user.profile.city && `, ${user.profile.city}`}
                      {user.profile.state && `, ${user.profile.state}`}
                      {user.profile.country && `, ${user.profile.country}`}
                      {user.profile.pincode && ` - ${user.profile.pincode}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
    </div>
    <Footer/>
    </div>
  );
}
