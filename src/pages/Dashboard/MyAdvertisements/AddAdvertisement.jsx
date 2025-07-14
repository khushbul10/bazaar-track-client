// src/pages/AddAdvertisement.jsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddAdvertisement = ({ onSubmit }) => {
  const [imageUrl, setImageUrl] = useState(""); // For storing image URL after upload
  const axiosSecure = useAxiosSecure();

  // React Hook Form setup
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    defaultValues: {
      adTitle: "",
      shortDescription: "",
      status: "pending",
      productImage: "",
    },
  });

  // Handle image upload (if needed)
  const handleImageChange = (e) => {
    setValue("productImage", e.target.files[0]); // Update React Hook Form with the uploaded image
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      let imageUrl = data.productImage;
      if (typeof imageUrl !== "string") {
        // If image is uploaded, upload it and get the URL
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

      // Prepare the advertisement data
      const adData = {
        ...data,
        productImage: imageUrl,
      };

      // Call the onSubmit function passed from the parent component to handle advertisement submission
      await onSubmit(adData);
      toast.success("Advertisement added successfully!");
      reset(); // Reset the form after submission
    } catch (error) {
      toast.error("Error submitting advertisement!");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Ad Title */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Ad Title</label>
        <input
          {...register("adTitle", { required: "Ad Title is required" })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg"
        />
        {errors.adTitle && <p className="text-red-500">{errors.adTitle.message}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Short Description</label>
        <textarea
          {...register("shortDescription", { required: "Short Description is required" })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg"
        />
        {errors.shortDescription && <p className="text-red-500">{errors.shortDescription.message}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Image Upload</label>
        <input
          type="file"
          {...register("productImage", { required: "Image is required" })}
          className="w-full p-3 border-2 border-gray-300 rounded-lg"
          onChange={handleImageChange}
        />
        {errors.productImage && <p className="text-red-500">{errors.productImage.message}</p>}
      </div>

      {/* Status */}
      <div>
        <label className="block text-lg font-medium text-gray-700">Status</label>
        <select
          {...register("status")}
          className="w-full p-3 border-2 border-gray-300 rounded-lg"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="bg-gray-500 text-white py-2 px-4 rounded-lg"
          onClick={() => reset()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          Add Advertisement
        </button>
      </div>
    </form>
  );
};

export default AddAdvertisement;
