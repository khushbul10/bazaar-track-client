// src/pages/UpdateProduct.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // For animations
import DatePicker from "react-datepicker"; // For date picker
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for the date picker
import Swal from "sweetalert2"; // For confirmation dialogs
import { useForm, Controller } from "react-hook-form"; // Import useForm and Controller from react-hook-form
import useUploadImage from "../../../hooks/useUploadImage"; // Import the useUploadImage hook
import useAuth from "../../../hooks/useAuth"; // Import custom useAuth hook
import { toast } from "react-toastify"; // For showing notifications
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UpdateProduct = ({ match }) => {
  const { user } = useAuth(); // Get the logged-in user data
  const axiosSecure = useAxiosSecure(); // Custom hook for secure axios requests

  // State to store existing product data
  const [product, setProduct] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      marketName: "",
      marketDescription: "",
      itemName: "",
      itemDescription: "",
      pricePerUnit: "",
      productImage: "",
      priceHistory: [{ date: new Date(), price: "" }],
      date: new Date(),
    },
  });

  const { uploadImage, data, isLoading, isError, error, isSuccess } = useUploadImage(); // Upload hook

  // Fetch product data when the component mounts
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Fetch product data from your backend based on the product ID (use match.params.id if using React Router)
        const response = await axiosSecure.get(`/products/${match.params.id}`);
        const productData = response.data;
        
        // Set product data into form fields
        setProduct(productData);
        setValue("marketName", productData.marketName);
        setValue("marketDescription", productData.marketDescription);
        setValue("itemName", productData.itemName);
        setValue("itemDescription", productData.itemDescription);
        setValue("pricePerUnit", productData.pricePerUnit);
        setValue("productImage", productData.productImage);
        setValue("priceHistory", productData.priceHistory);
        setValue("date", new Date(productData.date));
      } catch (err) {
        toast.error("Error fetching product data!");
      }
    };
    
    fetchProductData();
  }, [match.params.id, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // 1️⃣ Handle Image Upload if productImage field is provided
      let imageUrl = product.productImage; // Preserve the existing image URL if not updating
      
      if (data.productImage && data.productImage[0]) {
        await new Promise((resolve) => {
          uploadImage(data.productImage[0], {
            onSuccess: (url) => {
              imageUrl = url;
              resolve();
            },
            onError: () => {
              toast.error("Image upload failed");
              resolve();
            },
          });
        });
      }

      // 2️⃣ Format data and add the image URL
      const formattedData = {
        ...data,
        productImage: imageUrl, // Set the uploaded image URL or existing one
        priceHistory: data.priceHistory.map(item => ({
          ...item,
          date: item.date.toISOString(), // Ensure date is in ISO format
        })),
        date: data.date.toISOString(), // Ensure date is in ISO format
      };

      // 3️⃣ Send the updated data to the backend using axiosSecure
      const response = await axiosSecure.put(`/products/${match.params.id}`, formattedData);

      toast.success("Product updated successfully!");

      // Reset the form after successful submission
      reset();
    } catch (err) {
      toast.error("Error updating product!");
    }
  };

  // Handle price change
  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...product?.priceHistory];
    updatedPrices[index][field] = value;
    setValue(`priceHistory[${index}].${field}`, value); // Update React Hook Form's value
  };

  // Add new price row
  const handleAddPriceRow = () => {
    setValue("priceHistory", [...product?.priceHistory, { date: new Date(), price: "" }]);
  };

  // Remove price row
  const handleRemovePriceRow = (index) => {
    if (product?.priceHistory.length > 1) {
      const updatedPrices = product?.priceHistory.filter((_, i) => i !== index);
      setValue("priceHistory", updatedPrices);
    }
  };

  if (!product) {
    return <div>Loading...</div>; // Display loading state while data is being fetched
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
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Vendor Name (Read-Only) */}
          <div className="mb-4">
            <label htmlFor="vendorName" className="block text-lg font-medium text-gray-700">Vendor Name</label>
            <input
              value={user?.displayName} // Display vendor name from user data
              readOnly
              id="vendorName"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Vendor Email (Read-Only) */}
          <div className="mb-4">
            <label htmlFor="vendorEmail" className="block text-lg font-medium text-gray-700">Vendor Email</label>
            <input
              value={user?.email} // Display vendor email from user data
              readOnly
              id="vendorEmail"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Market Name */}
          <div className="mb-4">
            <label htmlFor="marketName" className="block text-lg font-medium text-gray-700">Market Name</label>
            <input
              {...register("marketName", { required: "Market Name is required" })}
              id="marketName"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
            {errors.marketName && <span className="text-red-500">{errors.marketName.message}</span>}
          </div>

          {/* Market Description */}
          <div className="mb-4">
            <label htmlFor="marketDescription" className="block text-lg font-medium text-gray-700">Market Description</label>
            <textarea
              {...register("marketDescription")}
              id="marketDescription"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              rows="4"
            />
          </div>

          {/* Item Name */}
          <div className="mb-4">
            <label htmlFor="itemName" className="block text-lg font-medium text-gray-700">Item Name</label>
            <input
              {...register("itemName", { required: "Item Name is required" })}
              id="itemName"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
            {errors.itemName && <span className="text-red-500">{errors.itemName.message}</span>}
          </div>

          {/* Item Description */}
          <div className="mb-4">
            <label htmlFor="itemDescription" className="block text-lg font-medium text-gray-700">Item Description</label>
            <textarea
              {...register("itemDescription")}
              id="itemDescription"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              rows="4"
            />
          </div>

          {/* Price Per Unit */}
          <div className="mb-4">
            <label htmlFor="pricePerUnit" className="block text-lg font-medium text-gray-700">Price per Unit</label>
            <input
              {...register("pricePerUnit", { required: "Price per Unit is required" })}
              type="number"
              id="pricePerUnit"
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
            {errors.pricePerUnit && <span className="text-red-500">{errors.pricePerUnit.message}</span>}
          </div>

          {/* Product Image Upload */}
          <div className="mb-4">
            <label htmlFor="productImage" className="block text-lg font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              id="productImage"
              {...register("productImage")}
              className="w-full p-3 mt-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Price History */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Price History</label>
            {product.priceHistory.map((priceRow, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <DatePicker
                  selected={priceRow.date}
                  onChange={(date) => handlePriceChange(index, "date", date)}
                  className="p-3 border-2 border-gray-300 rounded-lg w-1/3 focus:border-green-500 focus:outline-none"
                  dateFormat="yyyy-MM-dd"
                />
                <input
                  type="number"
                  value={priceRow.price}
                  onChange={(e) => handlePriceChange(index, "price", e.target.value)}
                  className="p-3 border-2 border-gray-300 rounded-lg w-1/3 focus:border-green-500 focus:outline-none"
                  placeholder="Price"
                  required
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
