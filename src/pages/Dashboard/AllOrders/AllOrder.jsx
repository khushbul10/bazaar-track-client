// src/pages/AllOrders.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query"; // For data fetching
import Loader from "../../../Shared/Loader/Loader"; // Optional Loader component

const AllOrders = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure(); // Axios instance for secure API requests

  // Fetch all orders using React Query
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["orders"],  // Correct queryKey format
    queryFn: async () => {
      const response = await axiosSecure.get("/orders/all"); // Fetch all orders
      return response.data;
    }
  });

  // Handle viewing order details
  const handleViewOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`); // Navigate to Order Details page
  };

  if (isLoading) {
    return <Loader />; // Show loader while data is being fetched
  }

  if (isError) {
    toast.error("Error fetching orders!");
  }

  return (
    <div className="md:p-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">All Orders</h2>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Product Name</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Buyer Name</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-600">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">{order.productName}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{order.buyerName}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">৳{order.price}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</td>
                  
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
