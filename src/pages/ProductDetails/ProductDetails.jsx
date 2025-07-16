// src/pages/ProductDetails.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Price comparison chart
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaStar, FaRegStar } from "react-icons/fa"; // React Icons for stars
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
import Payment from "./Payment";
import useUserRole from "../../hooks/useUserRole";

const ProductDetails = () => {
  const { productId } = useParams(); // Get product ID from URL
  // const [product, setProduct] = useState(null);
  const [paymentToggle, setPaymentToggle] = useState(true); // Toggle for payment form
  const { user } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  // console.log(role);
  // console.log(user);
  const axiosSecure = useAxiosSecure();
  // const [reviews, setReviews] = useState([]);
  // const [watchlist, setWatchlist] = useState(false); // For watchlist feature
  // const [priceHistory, setPriceHistory] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: "" }); // User review state
  const navigate = useNavigate();

  // Fetch product details and reviews
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/products/${productId}`);
      return response.data;
    },
  });

  // Check if the product is in the user's watchlist
  const { data : watchlistData, isLoading: watchlistLoading , refetch: refetchWatchlist} = useQuery({
    queryKey: ["watchlist", user?.email, productId],
    queryFn: async () => {
      if (user?.email) {
        const response = await axiosSecure.get(`/watchlists/check?userEmail=${user.email}&productId=${productId}`);
        // setWatchlist(response.data.exists); // Set watchlist state based on response
        return response.data; // Return watchlist data
      }
      return null; // No data to return
    },
    enabled: !!user?.email && !!productId, // Only run if user is logged in and productId is available
  });
  // console.log("watchlist data", watchlistData);
  // const watchlistData = {
  //   exists: false, // Placeholder for watchlist existence check
  // }
  // useEffect(() => {
  //   const fetchProductDetails = async () => {
  //     try {
  //       const response = await axiosSecure.get(`/products/${productId}`);
  //       setProduct(response.data);
  //       setPriceHistory(response.data.priceHistory);
  //       setReviews(response.data.reviews || []);
  //     } catch (error) {
  //       toast.error("Error fetching product details.");
  //     }
  //   };

  //   fetchProductDetails();
  // }, [productId]);

  // Handle adding product to watchlist
  const handleWatchlist = () => {
    if (product) {
      axiosSecure.post("/watchlists", {
        productId: product._id,
        productName: product.itemName,
        marketName: product.marketName,
        date: new Date(),
        userEmail: user.email,
        productImage: product.productImage,
      })
      .then(() => {
        toast.success("Product added to watchlist!");
        refetchWatchlist(); // Refetch watchlist data to update UI
      })
      .catch((error) => {
        // console.error("Error adding to watchlist:", error);
        toast.error("Failed to add product to watchlist.");
      });
    }
  };

  // Handle Buy Product button (Stripe Payment integration)
  // const handleBuyProduct = async () => {
  //   try {
  //     const response = await axiosSecure.post(`/checkout/${productId}`);
  //     window.location.href = response.data.paymentUrl; // Redirect to Stripe checkout page
  //   } catch (error) {
  //     toast.error("Error initiating payment!");
  //   }
  // };

  // Render price comparison chart (reversed data for latest date at right)
  const renderPriceChart = () => {
    const data = product.priceHistory.map((priceData) => ({
      date: new Date(priceData.date).toLocaleDateString(),
      price: priceData.price,
    }));

    // Reverse the data so that the latest date appears at the right side
    const reversedData = data.reverse();

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={reversedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Handle review form submission
  const handleReviewSubmit = async () => {
    try {
      const reviewData = {
        ...userReview,
        userName: user.displayName,
        userEmail: user.email,
        userPhotoURL:
          user.photoURL || "https://i.ibb.co/8M0CM5w/default-avatar.png",
      };
      // console.log(reviewData);
      await axiosSecure.patch(`/products/${productId}/review`, reviewData); // Submit the review to the backend
      refetch(); // Refetch product details to update reviews
      // setReviews((prevReviews) => [...prevReviews, reviewData]); // Add new review to the list
      toast.success("Review submitted successfully!");
      setUserReview({ rating: 0, comment: "" }); // Reset review form
    } catch (error) {
      toast.error("Error submitting review!");
    }
  };

  // Handle Star Rating Change
  const handleStarRating = (rating) => {
    setUserReview({ ...userReview, rating });
  };

  if (isLoading || roleLoading || watchlistLoading ) return <Loader />;

  return (
    <div className="md:p-8 min-h-screen">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Product Information */}
        <div className="flex flex-col  justify-between  mb-6">
          <div>
            <div className="mt-4">
              <img
                src={product.productImage}
                alt={product.itemName}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <h1 className="text-4xl font-semibold text-gray-800">
              {product.itemName}
            </h1>
            <p className="text-xl text-gray-600">{product.marketName}</p>
            <p className="mt-4 text-lg font-semibold">
              Price: ৳{product.pricePerUnit}
            </p>
            <p className="mt-2 text-lg">
              Date: {new Date(product.date).toLocaleDateString()}
            </p>
          </div>

          {/* Add to Watchlist Button */}

          <div>
            {(role == 'user' ) && (
              <button
                onClick={handleWatchlist}
                className={`bg-green-600 mt-2 text-white py-3 px-8 rounded-lg ${watchlistData.exists ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={watchlistData.exists}
              >
                {watchlistData.exists ? "Added to Watchlist" : "Add to Watchlist"}
              </button>
            )}
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Vendor Information</h2>
          <p className="text-lg text-gray-600">Vendor: {product.vendorName}</p>
          <p className="text-lg text-gray-600">
            Vendor Email: {product.vendorEmail}
          </p>
        </div>

        {/* User Reviews */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>
          {product?.reviews?.length === 0 || !product?.reviews ? (
            <p className="text-lg text-gray-600">No reviews yet.</p>
          ) : (
            product.reviews.map((review, index) => (
              <div
                key={index}
                className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md flex items-start space-x-4"
              >
                {/* User Photo */}
                <img
                  src={
                    review.userPhotoURL ||
                    "https://i.ibb.co/8M0CM5w/default-avatar.png"
                  }
                  alt="User Photo"
                  className="h-12 w-12 rounded-full object-cover border-2 border-gray-300"
                />

                {/* Review Content */}
                <div className="flex-1">
                  <p className="font-semibold">{review.userName}</p>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star}>
                        {review.rating >= star ? (
                          <FaStar className="text-yellow-500 h-5 w-5" />
                        ) : (
                          <FaRegStar className="text-gray-400 h-5 w-5" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Posted on: {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}

          {/* Review Form */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Submit Your Review</h3>

            {/* Star Rating System */}
            <div className="flex space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  onClick={() => handleStarRating(star)}
                  className="cursor-pointer"
                >
                  {userReview.rating >= star ? (
                    <FaStar className="text-yellow-500 h-6 w-6" />
                  ) : (
                    <FaRegStar className="text-gray-400 h-6 w-6" />
                  )}
                </div>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={userReview.comment}
              onChange={(e) =>
                setUserReview({ ...userReview, comment: e.target.value })
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg mt-2"
              placeholder="Leave a comment..."
            />
            <button
              onClick={handleReviewSubmit}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
            >
              Submit Review
            </button>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Price Comparison</h2>
          {renderPriceChart()}
        </div>

        {/* Buttons */}
        <div className=" mt-8">
          {paymentToggle ? (
            <button
              // onClick={handleBuyProduct}
              onClick={() => setPaymentToggle(false)}
              className="bg-green-600 text-white w-full py-3 px-8 rounded-lg"
            >
              Buy Now
            </button>
          ) : (
            <Payment product={product} setPaymentToggle={setPaymentToggle}></Payment>
          )}
          {/* <Payment className="w-full "></Payment> */}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetails;
