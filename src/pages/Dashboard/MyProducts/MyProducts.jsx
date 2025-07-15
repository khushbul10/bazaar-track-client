// src/pages/MyProducts.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // For API requests
import Swal from "sweetalert2"; // For confirmation modal
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

const MyProducts = () => {
  // const [products, setProducts] = useState([]); // State to hold products
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure(); // Axios instance for secure API requests

  // Fetch products submitted by the logged-in vendor
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myProducts"],
    queryFn: async () => {
      if (!user?.email) throw new Error("User not authenticated");
      const response = await axiosSecure.get(
        `/products/vendor?email=${user.email}`
      );
      return response.data; // Assuming response contains an array of products
    },
    enabled: !!user?.email, // Only run the query if user email is available
  });

  // Handle navigating to the update product page
  // const handleUpdate = (productId) => {
  //   navigate(`update-products/${productId}`);
  // };

  // Handle removing a product from the list
  const handleDelete = async (productId) => {
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
        toast.success("Product deleted successfully!");
        refetch(); // Refetch products to update the list
      } catch (error) {
        toast.error("Error deleting product!");
      }
    }
  };

  return (
    <div className="md:p-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">My Products</h2>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                Item Name
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                Price per Unit
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                Market Name
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-600">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  {/* Open the modal using document.getElementById('ID').showModal() method */}

                  <td className="py-2 px-4 text-sm text-gray-700">
                    {product.itemName}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    ৳{product.pricePerUnit}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {product.marketName}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {new Date(product.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-md text-white ${
                        product.status === "approved"
                          ? "bg-green-600"
                          : product.status === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {product.status}
                    </span>
                    {product.status === "rejected" && (
                      <button
                        className="mt-2 text-white cursor-pointer hover:underline bg-red-500 rounded-md px-2 py-1"
                        onClick={() =>
                          document.getElementById(`modal-${product._id}`).showModal()
                        }
                      >
                        See Feedback
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    <Link
                      to={`/dashboard/update-products/${product._id}`}
                      // onClick={() => handleUpdate(product._id)}
                      className="bg-blue-600 text-white btn w-full py-1 px-4 rounded-md mr-2 hover:bg-blue-700 transition duration-300"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 btn text-white w-full py-1 mt-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                  <dialog id={`modal-${product._id}`} className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Feedback</h3>
                      <p className="py-4">
                        {product?.feedback}
                      </p>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyProducts;
