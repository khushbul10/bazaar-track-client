// src/pages/AllProducts.jsx

import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";
import { Link } from "react-router";

const AllProducts = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch products using react-query
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosSecure.get("/products/all");
      return response.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  // Handle approval of a product
  const handleApprove = async (productId) => {
    try {
      await axiosSecure.patch(`/products/${productId}/approve`, {
        status: "approved",
      });
      refetch(); // Refetch products to get updated data
      toast.success("Product approved successfully");
    } catch (error) {
      console.error("Error approving product:", error);
      toast.error("Failed to approve product");
    }
  };

  // Handle rejection of a product with feedback
  const handleReject = async (productId) => {
    // if (!rejectionReason) {
    //   toast.error("Please provide a rejection reason");
    //   return;
    // }

    const result = await Swal.fire({
      title: "Rejection Feedback",
      input: "textarea",
      inputPlaceholder: "Provide rejection feedback...",
      inputAttributes: {
        "aria-label": "Provide rejection feedback",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You need to provide a reason!";
        }
      },
    });
    console.log("result", result);

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/products/${productId}/reject`, {
          status: "rejected",
          feedback: result.value,
        });
        refetch();
        toast.success("Product rejected successfully");
      } catch (error) {
        console.error("Error rejecting product:", error);
        toast.error("Failed to reject product");
      }
    }
  };

  // Handle product removal
  const handleRemove = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/products/${productId}`);
        refetch(); // Refetch products to get updated data
        toast.success("Product removed successfully");
      } catch (error) {
        console.error("Error removing product:", error);
        toast.error("Failed to remove product");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Product Name
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="py-2 px-4 border-b text-center text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  {product.itemName}
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  {product.pricePerUnit}
                </td>
                <td className="py-2 px-4 border-b text-sm ">
                  <p
                    className={`text-white p-1 font-bold rounded-xl px-2 w-fit ${
                      product.status === "pending" && "bg-yellow-400"
                    } ${product.status === "rejected" && "bg-red-600"}
                    ${product.status === "approved" && "bg-green-600"}`}
                  >
                    {product.status}
                  </p>
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  {product.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(product._id)}
                        className="bg-green-600 text-white py-1 px-4 rounded-md mr-2 hover:bg-green-700 transition duration-300"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(product._id)}
                        className="bg-red-600 text-white py-1 px-4 rounded-md mr-2 hover:bg-red-700 transition duration-300"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <Link
                    to={`/dashboard/update-products/${product._id}`}
                    className="bg-blue-600 text-white py-1 px-4 rounded-md mr-2 hover:bg-red-700 transition duration-300"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Remove
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

export default AllProducts;
