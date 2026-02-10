import { useState, useEffect } from "react";
import { ShoppingBag, Package, Truck, CheckCircle, Clock } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Orders() {
    const token = Cookies.get("Jwt_token");
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/profile/activities`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();

                if (res.ok) {
                    setOrders(data.activities?.orderHistory || []);
                } else {
                    console.error("Orders API error:", data);
                    toast.error(data.error || "Failed to load orders");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, API_URL, navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
                return "text-green-600 bg-green-50 border-green-200";
            case "shipped":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "confirmed":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "delivered":
                return <CheckCircle size={16} />;
            case "shipped":
                return <Truck size={16} />;
            case "confirmed":
                return <Package size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                    <p className="text-gray-600 mt-2">
                        Check the status of recent orders, manage returns, and discover similar products.
                    </p>
                </div>

                {orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-6 justify-between items-center">
                                    <div className="flex flex-wrap gap-8">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Order number</p>
                                            <p className="font-semibold text-gray-900 mt-1">{order._id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Date placed</p>
                                            <p className="font-semibold text-gray-900 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Total amount</p>
                                            <p className="font-semibold text-gray-900 mt-1">
                                                ₹{order.pricing.total?.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {order.items.map((item) => (
                                            <div key={item._id} className="flex gap-6 items-start">
                                                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                    {item.product?.image ? (
                                                        <img
                                                            src={item.product.image}
                                                            alt={item.product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <ShoppingBag size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                                {item.product?.title || "Product Unavailable"}
                                                            </h3>
                                                            <p className="text-gray-500 mt-1 text-sm line-clamp-2">
                                                                {item.product?.description}
                                                            </p>
                                                        </div>
                                                        <p className="font-semibold text-gray-900">
                                                            ₹{item.product?.price?.toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
                        <p className="text-gray-500 mt-2 mb-6">Start shopping to see your orders here.</p>
                        <a href="/shop" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Start Shopping
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
