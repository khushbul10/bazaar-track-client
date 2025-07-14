// src/pages/MyOrders.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // For API calls
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // Orders state to store the fetched orders
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosSecure.get(`/orders?email=${user.email}`);
        setOrders(response.data); // Assuming response contains an array of orders
      } catch (error) {
        toast.error("Error fetching orders!");
      }
    };

    fetchOrders();
  }, []);

  // Navigate to Product Details page
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Product Name</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Market Name</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-600">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">{order.productName}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{order.marketName}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">৳{order.price}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    <button
                      onClick={() => handleViewDetails(order.productId)}
                      className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      🔍 View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
