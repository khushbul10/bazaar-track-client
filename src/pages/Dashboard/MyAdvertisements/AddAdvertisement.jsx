// src/pages/AddAdvertisement.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import useUploadImage from "../../../hooks/useUploadImage";
import useAuth from "../../../hooks/useAuth";

const AddAdvertisement = () => {
  // const [imageUrl, setImageUrl] = useState(""); // For storing image URL after upload
  // const [currentAd, setCurrentAd] = useState(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { uploadImage, isLoading: uploadLoading } = useUploadImage();
  const navigate = useNavigate();
  // const { adId } = useParams(); // To handle update for specific advertisement

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
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
          uploadImage(data.productImage, {
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

      // Prepare advertisement data
      const adData = {
        ...data,
        productImage: imageUrl,
        vendorName: user?.displayName,
        vendorEmail: user?.email,
      };

      // Add a new advertisement
      await axiosSecure.post("/advertisements", adData);
      toast.success("Advertisement added successfully!");

      reset(); // Reset the form after submission
      navigate("/dashboard/ads"); // Redirect to the advertisement list page
    } catch (error) {
      toast.error("Error submitting advertisement!");
    }
  };

  return (
    <div className="md:p-8 bg-green-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8 rounded-lg ">
        <h2 className="text-3xl text-green-700 font-semibold text-center mb-6">
          Add Advertisement
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Ad Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Ad Title
            </label>
            <input
              {...register("adTitle", { required: "Ad Title is required" })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
            {errors.adTitle && (
              <p className="text-red-500">{errors.adTitle.message}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Short Description
            </label>
            <textarea
              {...register("shortDescription", {
                required: "Short Description is required",
              })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
            {errors.shortDescription && (
              <p className="text-red-500">{errors.shortDescription.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Image Upload
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            />
            {errors.productImage && (
              <p className="text-red-500">{errors.productImage.message}</p>
            )}
          </div>

          <div className="my-6">
            
            <button
              type="submit"
              className="bg-green-600 w-full text-white py-2 px-4 rounded-lg"
            >
              Add Advertisement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdvertisement;
