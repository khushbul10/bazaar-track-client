import React, { useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Shared/Loader/Loader";

const fetchOrders = async (axiosSecure, page) => {
  const response = await axiosSecure.get(`orders/all?page=${page}&limit=10`);
  return response.data;
};

const AllOrders = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", currentPage],
    queryFn: () => fetchOrders(axiosSecure, currentPage),
    keepPreviousData: true,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    toast.error("Error fetching orders!");
    return null;
  }

  const { orders, totalPages } = data;

  return (
    <div className="md:p-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-green-800">All Orders</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Product Name</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Buyer Name</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Order Date</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-600">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-green-50 transition">
                  <td className="py-2 px-4 text-sm text-gray-700">{order.productName}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{order.buyerName}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">৳{order.price}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Prev
        </button>
        <span className="text-green-800 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllOrders;
