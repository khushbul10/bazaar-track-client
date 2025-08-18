// src/pages/Dashboard/OverviewPage/OverviewPage.jsx

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../../Shared/Loader/Loader";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Users, ShoppingBag, Star, TrendingUp } from "lucide-react";

const COLORS = ["#16a34a", "#f59e0b", "#3b82f6", "#ef4444"];

const OverviewPage = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch stats from backend
  const { data: stats, isLoading } = useQuery({
    queryKey: ["overview-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/overview");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  const {
    totalUsers,
    totalOrders,
    totalProducts,
    avgRating,
    salesTrend,
    categoryDistribution,
  } = stats;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4"
        >
          <Users className="text-green-600 w-10 h-10" />
          <div>
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-2xl font-bold">{totalUsers}</h2>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4"
        >
          <ShoppingBag className="text-blue-600 w-10 h-10" />
          <div>
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-bold">{totalOrders}</h2>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4"
        >
          <TrendingUp className="text-yellow-600 w-10 h-10" />
          <div>
            <p className="text-gray-500">Products</p>
            <h2 className="text-2xl font-bold">{totalProducts}</h2>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4"
        >
          <Star className="text-red-600 w-10 h-10" />
          <div>
            <p className="text-gray-500">Avg. Rating</p>
            <h2 className="text-2xl font-bold">{avgRating.toFixed(1)}</h2>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sales Trend Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewPage;
