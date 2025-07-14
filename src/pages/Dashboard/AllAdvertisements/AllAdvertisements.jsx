// src/pages/AllAdvertisements.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const AllAdvertisements = () => {
  // const [ads, setAds] = useState([]);
  const axiosSecure = useAxiosSecure();

  // Fetch all advertisements using useQuery for the admin to view
  const { data: ads = [], isLoading, refetch } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const response = await axiosSecure.get("/advertisements/all");
      return response.data;
    },
  })

  // Handle changing advertisement status (approved, rejected, pending)
  const handleChangeStatus = async (adId, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "approved" : "pending"; // Toggle status
    try {
      await axiosSecure.patch(`/advertisements/${adId}/status`, { status: newStatus });
      refetch(); // Refetch advertisements to update the list
      toast.success(`Advertisement status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Error updating advertisement status!");
    }
  };

  // Handle deleting an advertisement
  const handleDelete = async (adId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this advertisement!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/advertisements/${adId}`);
        refetch(); // Refetch advertisements to update the list
        toast.success("Advertisement deleted successfully!");
      } catch (error) {
        toast.error("Error deleting advertisement!");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Advertisements</h2>

      {/* Table to display all advertisements */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Ad Title</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Short Description</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-700">{ad.adTitle}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{ad.shortDescription}</td>
                <td className="py-3 px-6 text-sm text-gray-700">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      ad.status === "approved"
                        ? "bg-green-600"
                        : ad.status === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {ad.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-sm text-gray-700 flex items-center space-x-2">
                  {/* Change Status Button */}
                  <button
                    onClick={() => handleChangeStatus(ad._id, ad.status)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Change Status
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAdvertisements;
