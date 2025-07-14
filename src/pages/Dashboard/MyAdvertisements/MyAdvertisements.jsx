// src/pages/MyAdvertisements.jsx

import React, { useState, useEffect, use } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { GiCancel } from "react-icons/gi";
import useUploadImage from "../../../hooks/useUploadImage";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const MyAdvertisements = () => {
  // const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);
  const { user } = useAuth();
  const { uploadImage, isLoading: uploadLoading } = useUploadImage();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [formData, setFormData] = useState({
    adTitle: "",
    shortDescription: "",
    status: "pending",
    productImage: "",
  });
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch advertisements data using useQuery
  const { data: ads = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["myAdvertisements", user?.email],
    queryFn: async () => {
      if (!user?.email) {
        return [];
      }
      const response = await axiosSecure.get(`/advertisements?email=${user.email}`);
      return response.data;
    }
  });
  

  // Handle delete advertisement
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
        refetch(); // Refetch advertisements after deletion
        toast.success("Advertisement deleted successfully!");
      } catch (error) {
        toast.error("Error deleting advertisement!");
      }
    }
  };

  // Handle update advertisement (opens the form with current data)
  const handleUpdate = (ad) => {
    setCurrentAd(ad);
    setFormData({
      adTitle: ad.adTitle,
      shortDescription: ad.shortDescription,
      status: ad.status,
      productImage: ad.productImage,
    });
    setIsModalOpen(true); // Open modal when updating
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload (if needed)
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      productImage: e.target.files,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { adTitle, shortDescription, status, productImage } = formData;

      let imageUrl = productImage;
      console.log("Image URL before upload:", imageUrl);
      console.log("Product Image Type:", productImage);
      if (typeof(productImage) !== "string") {
        await new Promise((resolve) => {
          console.log("Uploading image...");
          uploadImage(productImage[0], {
            onSuccess: (url) => {
              console.log("Image uploaded successfully:", url);
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

      const adData = {
        adTitle,
        shortDescription,
        status: status || "pending",
        vendorName: user?.displayName,
        vendorEmail: user?.email,
        productImage: imageUrl || currentAd?.productImage, // Use existing image if not updated
      };
      console.log("Submitting Ad Data:", adData);

      if (currentAd) {
        await axiosSecure.patch(`/advertisements/${currentAd._id}`, adData);
        toast.success("Advertisement updated successfully!");
      } else {
        await axiosSecure.post("/advertisements", adData);
        toast.success("Advertisement added successfully!");
      }
      refetch(); // Refetch advertisements after submission
      setCurrentAd(null); // Clear form after submission
      toggleModal(); // Close the modal after submission
    } catch (error) {
      toast.error("Error submitting advertisement!");
    }
  };

  // Toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setCurrentAd(null); // Clear current ad when closing
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-600 mb-6">My Advertisements</h2>

      {/* Add Advertisement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-10 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
            <div className="flex justify-between mb-2 items-center">
              <h2
                className="text-3xl text-green-600 text-center font-semibold"
              >
                {currentAd ? "Update Advertisement" : "Add Advertisement"}
              </h2>
              
            </div>
            <form onSubmit={handleFormSubmit}>
              {/* Ad Title */}
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Ad Title
                </label>
                <input
                  type="text"
                  name="adTitle"
                  value={formData.adTitle}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Short Description */}
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">
                  Image Upload
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  {currentAd ? "Update Advertisement" : "Add Advertisement"}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-8">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Ad Title
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Short Description
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id}>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  {ad.adTitle}
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  {ad.shortDescription}
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  {ad.status}
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  <button
                    onClick={() => handleUpdate(ad)}
                    className="bg-blue-600 text-white py-1 px-4 rounded-md mr-2 hover:bg-blue-700 transition duration-300"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Advertisement Button */}
      <button
        onClick={toggleModal}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
      >
        Add Advertisement
      </button>
    </div>
  );
};

export default MyAdvertisements;
