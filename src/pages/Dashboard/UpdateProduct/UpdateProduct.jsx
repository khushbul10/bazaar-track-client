// src/pages/UpdateProduct.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // For animations
import DatePicker from "react-datepicker"; // For date picker
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for the date picker
import Swal from "sweetalert2"; // For confirmation dialogs
import useUploadImage from "../../../hooks/useUploadImage"; // Import the useUploadImage hook
import useAuth from "../../../hooks/useAuth"; // Import custom useAuth hook
import { toast } from "react-toastify"; // For showing notifications
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useParams } from "react-router";
import Loader from "../../../Shared/Loader/Loader";

const UpdateProduct = () => {
  const axiosSecure = useAxiosSecure(); // Custom hook for secure axios requests
  const { productId } = useParams();
  const { user } = useAuth();

  // State management for product data
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // For storing image URL after upload
  const [formData, setFormData] = useState({
    marketName: "",
    marketDescription: "",
    itemName: "",
    itemDescription: "",
    pricePerUnit: "",
    productImage: "",
    priceHistory: [{ date: new Date(), price: "" }],
    date: new Date(),
  });

  const { uploadImage, isLoading, isError, error, isSuccess } = useUploadImage(); // Image upload hook

  // Fetch product data when the component mounts
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axiosSecure.get(`/products/${productId}`);
        const productData = response.data;

        // Set product data into form fields
        setProduct(productData);
        setImageUrl(productData.productImage);

        setFormData({
          ...formData,
          vendorName: productData.vendorName,
          vendorEmail: productData.vendorEmail,
          marketName: productData.marketName,
          marketDescription: productData.marketDescription,
          itemName: productData.itemName,
          itemDescription: productData.itemDescription,
          pricePerUnit: productData.pricePerUnit,
          productImage: productData.productImage,
          priceHistory: productData.priceHistory,
          date: new Date(productData.date),
        });
      } catch (err) {
        toast.error("Error fetching product data!");
      }
    };

    fetchProductData();
  }, [productId]);

  // Handle form submission
  const onSubmit = async () => {
    try {
      let updatedImageUrl = imageUrl; // Preserve existing image URL if not updating
      if (formData.productImage && typeof formData.productImage !== "string") {
        // Handle image upload if a new image is provided
        await new Promise((resolve) => {
          uploadImage(formData.productImage[0], {
            onSuccess: (url) => {
              updatedImageUrl = url; // Set new image URL
              resolve();
            },
            onError: () => {
              toast.error("Image upload failed");
              resolve();
            },
          });
        });
      }

      // Format data to send to the backend
      const formattedData = {
        ...formData,
        productImage: updatedImageUrl,
        priceHistory: formData.priceHistory.map((item) => ({
          ...item,
          date:
            item.date instanceof Date && !isNaN(item.date)
              ? item.date.toISOString()
              : item.date, // Ensure date is in ISO format
        })),
        date:
          formData.date instanceof Date && !isNaN(formData.date)
            ? formData.date.toISOString()
            : formData.date, // Ensure date is in ISO format
      };
      console.log("Formatted Data:", formattedData);

      await axiosSecure
        .patch(`/products/${productId}`, formattedData)
        .then(() => {
          toast.success("Product updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          toast.error("Failed to update product");
        });

      // Reset the form after successful submission
      setFormData({
        marketName: "",
        marketDescription: "",
        itemName: "",
        itemDescription: "",
        pricePerUnit: "",
        productImage: "",
        priceHistory: [{ date: new Date(), price: "" }],
        date: new Date(),
      });
    } catch (err) {
      toast.error("Error updating product!");
    }
  };

  // Handle price history updates
  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...formData.priceHistory];
    updatedPrices[index][field] = value; // Update the price or date field
    setFormData((prevData) => ({
      ...prevData,
      priceHistory: updatedPrices,
    }));
  };

  // Add new price row
  const handleAddPriceRow = () => {
    const updatedPrices = [...formData.priceHistory];
    updatedPrices.push({ date: new Date(), price: "" }); // Add a new row with the current date
    setFormData((prevData) => ({
      ...prevData,
      priceHistory: updatedPrices,
    }));
  };

  // Remove price row
  const handleRemovePriceRow = (index) => {
    if (formData.priceHistory.length > 1) {
      const updatedPrices = formData.priceHistory.filter((_, i) => i !== index); // Remove the price at the given index
      setFormData((prevData) => ({
        ...prevData,
        priceHistory: updatedPrices,
      }));
    }
  };

  if (!product) {
    return <Loader />; // Display loading state while data is being fetched
  }

  return (
    <div className="p-8 bg-gray-100">
      <motion.div
        className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-semibold text-center mb-6">Update Product</h2>

        <form onSubmit={onSubmit}>
          {/* Vendor Name (Read-Only) */}
          <div className="mb-4">
            <label
              htmlFor="vendorName"
              className="block text-lg font-medium text-gray-700"
            >
              Vendor Name
            </label>
            <input
              value={formData.vendorName}
              readOnly
              id="vendorName"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Vendor Email (Read-Only) */}
          <div className="mb-4">
            <label
              htmlFor="vendorEmail"
              className="block text-lg font-medium text-gray-700"
            >
              Vendor Email
            </label>
            <input
              value={formData.vendorEmail}
              readOnly
              id="vendorEmail"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Market Name */}
          <div className="mb-4">
            <label
              htmlFor="marketName"
              className="block text-lg font-medium text-gray-700"
            >
              Market Name
            </label>
            <input
              value={formData.marketName}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  marketName: e.target.value,
                }))
              }
              id="marketName"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Item Name */}
          <div className="mb-4">
            <label
              htmlFor="itemName"
              className="block text-lg font-medium text-gray-700"
            >
              Item Name
            </label>
            <input
              value={formData.itemName}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  itemName: e.target.value,
                }))
              }
              id="itemName"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Price Per Unit */}
          <div className="mb-4">
            <label
              htmlFor="pricePerUnit"
              className="block text-lg font-medium text-gray-700"
            >
              Price per Unit
            </label>
            <input
              value={formData.pricePerUnit}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  pricePerUnit: e.target.value,
                }))
              }
              type="number"
              id="pricePerUnit"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Product Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="productImage"
              className="block text-lg font-medium text-gray-700"
            >
              Product Image
            </label>
            <input
              type="file"
              id="productImage"
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  productImage: e.target.files,
                }))
              }
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Price History */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Price History
            </label>
            {formData.priceHistory.map((priceRow, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <DatePicker
                  selected={priceRow.date}
                  onChange={(date) =>
                    handlePriceChange(index, "date", date)
                  }
                  className="p-3 border-2 border-gray-300 rounded-lg  focus:border-green-500 focus:outline-none"
                  dateFormat="yyyy-MM-dd"
                />
                <input
                  type="number"
                  value={priceRow.price}
                  onChange={(e) =>
                    handlePriceChange(index, "price", e.target.value)
                  }
                  className="p-3 border-2 border-gray-300 rounded-lg w-1/3 focus:border-green-500 focus:outline-none"
                  placeholder="Price"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePriceRow(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPriceRow}
              className="text-green-500"
            >
              + Add Price Row
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white py-3 px-8 rounded-lg text-xl font-semibold hover:bg-green-500 transition duration-300"
            >
              Update Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateProduct;
