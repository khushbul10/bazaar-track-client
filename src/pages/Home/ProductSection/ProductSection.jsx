import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";
import moment from "moment";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaStar } from "react-icons/fa";

const ProductSection = () => {
  const axiosSecure = useAxiosSecure();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["latestProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products/latest");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  // Utility: show entries within last 3 days
  const isRecent = (date) => {
    const diff = moment().diff(moment(date), "days");
    return diff <= 3;
  };

  // Calculate average rating
  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="max-w-6xl mt-10 mx-auto p-4">
      <h2
        className="text-3xl font-bold text-center text-green-800 mb-8"
        data-aos="fade-up"
      >
        Latest Market Prices
      </h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products
          .filter((product) => isRecent(product.date))
          .map((product, index) => {
            const avgRating = getAverageRating(product.reviews);
            return (
              <motion.div
                key={product._id}
                className="bg-white/70 backdrop-blur-[2px] rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-aos="fade-up"
              >
                <img
                  src={product.productImage}
                  alt={product.itemName}
                  className="w-full h-48 object-cover  rounded-lg mb-4"
                  loading="lazy"
                />

                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-green-800">
                    🛒 {product.marketName}
                  </h3>
                  <div className="flex items-center text-yellow-500 text-sm gap-1">
                    <FaStar />
                    {avgRating}
                  </div>
                </div>

                <p className="text-gray-500 mb-2 text-sm">
                  📅 {moment(product.date).format("MMMM D, YYYY")}
                </p>

                <p className="font-medium text-gray-800 mb-2">
                  {product.itemName} — ৳{product.pricePerUnit}/kg
                </p>

                <div className="flex-1 mb-4">
                  <h4 className="font-semibold text-gray-700 mb-1">
                    📈 Price History:
                  </h4>
                  <ul className="space-y-1 text-sm max-h-24 overflow-y-auto pr-2">
                    {product.priceHistory?.slice(-3).reverse().map((entry, idx) => (
                      <li key={idx} className="flex justify-between text-gray-600">
                        <span>{moment(entry.date).format("MMM D")}</span>
                        <span className="font-semibold text-green-700">
                          ৳{entry.price}/kg
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/products/${product._id}`}
                  className="bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition mt-auto"
                >
                  🔍 View Details
                </Link>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default ProductSection;
