import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../Shared/Loader/Loader";

const ProfilePage = () => {
  const { user } = useAuth();

  // Fetch additional profile details from server if needed
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.email}`);
      return res.json();
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <Loader />;

  const details = profileData || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <div className="backdrop-blur-md bg-white/70 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-green-600 h-40 relative">
            <img
              src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt="Profile"
              className="absolute -bottom-16 left-6 w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
          <div className="pt-20 px-6 pb-8">
            <h2 className="text-2xl font-bold text-gray-800">{user?.displayName || "User Name"}</h2>
            <p className="text-gray-500 mb-6">{details.role || "User"}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Mail className="text-green-600" />
                <span className="text-gray-700">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-green-600" />
                <span className="text-gray-700">{details.phone || "Not Provided"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-green-600" />
                <span className="text-gray-700">{details.address || "Not Provided"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="text-green-600" />
                <span className="text-gray-700">Member since {new Date(user?.metadata?.creationTime).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Extra Section */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-xl shadow-md">
                <h3 className="font-semibold text-gray-700 mb-2">Orders</h3>
                <p className="text-gray-500">{details.ordersCount || 0} total</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl shadow-md">
                <h3 className="font-semibold text-gray-700 mb-2">Reviews</h3>
                <p className="text-gray-500">{details.reviewsCount || 0} written</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl shadow-md">
                <h3 className="font-semibold text-gray-700 mb-2">Role</h3>
                <p className="text-gray-500">{details.role || "User"}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
