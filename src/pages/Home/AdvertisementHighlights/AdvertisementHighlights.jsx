import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Shared/Loader/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { Link } from "react-router";
import axios from "axios";

const AdvertisementHighlights = () => {

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["currentAds"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/ads/current`);
      return res.data;
    },
  });
  console.log(ads);

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2
        className="text-3xl font-bold text-center text-green-800 mb-8"
        data-aos="fade-up"
      >
        Advertisement Highlights
      </h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {ads.map((ad, index) => (
          <SwiperSlide key={ad._id}>
            <motion.div
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-aos="fade-up"
            >
              <img
                src={ad.productImage}
                alt={ad.adTitle}
                className="w-full h-100 object-cover rounded-lg mb-4"
                loading="lazy"
              />

              {/* <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold text-green-800">
                  {ad.adTitle}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    ad.status === "approved"
                      ? "bg-green-200 text-green-800"
                      : ad.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {ad.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm flex-1">
                {ad.shortDescription.slice(0, 100)}...
              </p>

              <p className="text-gray-500 text-sm mt-2">
                🛍️ Vendor: {ad.vendorName}
              </p>

              <Link
                to={`/ads/${ad._id}`}
                className="bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition mt-4"
              >
                🔍 View Details
              </Link> */}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AdvertisementHighlights;
