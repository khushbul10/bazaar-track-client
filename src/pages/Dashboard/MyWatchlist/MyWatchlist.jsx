// src/pages/MyWatchlist.jsx

import React from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query"; // For fetching and caching data
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2"; // For confirmation modal
import useAuth from "../../../hooks/useAuth";

const MyWatchlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming you have an Auth context to get the current user
  const axiosSecure = useAxiosSecure(); // Axios instance for secure API requests

  // Fetch watchlist data using useQuery
  const { data: watchlistItems = [], refetch, isLoading, isError } = useQuery({
    queryKey: ["watchlist", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error("User not authenticated");
      const response = await axiosSecure.get(`/watchlists?email=${user.email}`);
      return response.data; // Assuming response contains an array of watchlist items
    },
    enabled: !!user?.email, // Only run the query if user email is available
  });

  // Handle add more products button
  const handleAddMore = () => {
    navigate("/products"); // Navigate to the All Products page to add more items
  };

  // Handle removing product from watchlist
  const handleRemove = async (wlId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/watchlists/${wlId}`); // Remove product from the watchlist
        refetch(); // Refetch the watchlist data
        toast.success("Product removed from watchlist!");
      } catch (error) {
        toast.error("Error removing product from watchlist!");
      }
    }
  };

  // Show loading state or error message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching watchlist items.</div>;
  }

  return (
    <div className="md:p-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">My Watchlist</h2>

      {/* Watchlist Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-4 text-left text-sm font-medium ">Product Name</th>
              <th className="py-2 px-4 text-left text-sm font-medium ">Market Name</th>
              <th className="py-2 px-4 text-left text-sm font-medium ">Date</th>
              <th className="py-2 px-4 text-left text-sm font-medium ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {watchlistItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-600">
                  No items in your watchlist.
                </td>
              </tr>
            ) : (
              watchlistItems.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-700">{item.productName}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{item.marketName}</td>
                  <td className="py-2 px-4 text-sm text-gray-700">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 text-sm text-gray-700 flex items-center space-x-2">
                    <button
                      onClick={handleAddMore}
                      className="bg-green-600 text-white py-1 px-4 rounded-md mr-2 hover:bg-green-700 transition duration-300"
                    >
                      ➕ Add More
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 transition duration-300"
                    >
                      ❌ Remove
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

export default MyWatchlist;
