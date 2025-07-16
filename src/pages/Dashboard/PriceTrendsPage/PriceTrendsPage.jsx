import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import moment from "moment";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PriceTrends = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Fetch tracked items list for sidebar
  const { data: trackedItems = [], isLoading: loadingItems } = useQuery({
    queryKey: ["trackedItems"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/watchlists?email=${user.email}`);
      return res.data;
    },
  });

  // Fetch details of selected tracked item
  const {
    data: trackedItem,
    isLoading: loadingItemDetails,
    error,
  } = useQuery({
    queryKey: ["trackedItem", selectedItemId],
    enabled: !!selectedItemId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${selectedItemId}`);
      return res.data;
    },
  });
  // 1️⃣ sort chartData chronologically
  const chartData =
    trackedItem?.priceHistory
      ?.sort((a, b) => new Date(a.date) - new Date(b.date))
      ?.map((entry) => ({
        date: moment(entry.date).format("MMM D"),
        price: parseInt(entry.price),
        rawDate: new Date(entry.date),
      })) || [];

  // 2️⃣ get latest date in the array
  const lastEntry = chartData[chartData.length - 1];
  const latestPrice = lastEntry?.price || 0;
  const lastDate = lastEntry?.rawDate;

  // console.log("Chart Data:", chartData);
  // console.log("Latest Price:", latestPrice);
  // console.log("Last Date:", lastDate);

  // 3️⃣ calculate 7 days before from lastDate
  const targetDate = moment(lastDate).subtract(7, "days").toDate();

  // 4️⃣ find the closest price on or before targetDate
  let price7DaysAgo = latestPrice; // fallback if not found

  // console.log("Target Date:", targetDate);

  for (let i = chartData.length - 1; i >= 0; i--) {
    if (chartData[i].rawDate <= targetDate) {
      price7DaysAgo = chartData[i].price;
      break;
    }
  }

  // console.log("Price 7 Days Ago:", price7DaysAgo);

  // 5️⃣ calculate trend %
  const trendPercent =
    price7DaysAgo !== 0
      ? (((latestPrice - price7DaysAgo) / price7DaysAgo) * 100).toFixed(2)
      : "0";
  const isPositive = trendPercent >= 0;

  // console.log("Trend Percent:", trendPercent);



  // // console.log("Tracked Item:", trackedItem);
  // const chartData = trackedItem?.priceHistory
  //   ?.sort((a, b) => new Date(a.date) - new Date(b.date))
  //   ?.map((entry) => ({
  //     date: moment(entry.date).format("MMM D"),
  //     price: parseInt(entry.price),
  //   })) || [];

  // // console.log("Chart Data:", chartData);

  // const latestPrice = trackedItem ? Number(trackedItem.pricePerUnit) : 0;
  // const initialPrice = chartData[0]?.price || latestPrice;
  // const trendPercent =
  //   initialPrice !== 0
  //     ? (((latestPrice - initialPrice) / initialPrice) * 100).toFixed(2)
  //     : "0";
  // const isPositive = trendPercent >= 0;

  // Calculate trend based on last 7 days
  // const latestPrice = trackedItem ? Number(chartData[chartData.length - 1]?.price) : 0;

  // const sevenDaysAgo = moment(chartData[chartData.length - 1]?.date).subtract(7, "days").toDate();
  // // console.log("Seven Days Ago:", sevenDaysAgo);
  // const pricesBefore7Days = chartData.filter((d) => d.rawDate <= sevenDaysAgo);
  // const price7DaysAgo =
  //   pricesBefore7Days.length > 0
  //     ? pricesBefore7Days[pricesBefore7Days.length - 1].price
  //     : chartData[0]?.price || latestPrice;

  // // console.log("Price 7 Days Ago:", price7DaysAgo);
  // // console.log("Latest Price:", latestPrice);

  // const trendPercent =
  //   price7DaysAgo !== 0
  //     ? (((latestPrice - price7DaysAgo) / price7DaysAgo) * 100).toFixed(2)
  //     : "0";

  // // console.log("Trend Percent:", trendPercent);
  // const isPositive = trendPercent >= 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:flex gap-6">
      {/* Sidebar */}
      <div className="md:w-1/4 bg-white rounded-xl shadow p-4 mb-4 md:mb-0">
        <h3 className="font-bold text-green-800 mb-2">Tracked Items</h3>
        {loadingItems ? (
          <p className="text-green-600 animate-pulse">Loading...</p>
        ) : trackedItems.length > 0 ? (
          <ul className="space-y-2">
            {trackedItems.map((item) => (
              <li
                key={item._id}
                onClick={() => setSelectedItemId(item.productId)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                  selectedItemId === item.productId
                    ? "bg-green-200 text-green-900 font-semibold"
                    : "hover:bg-green-50 text-green-800"
                }`}
              >
                <img src={item.productImage} className="size-6" alt="" />
                {item.productName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No tracked items found.</p>
        )}
      </div>

      {/* Main Graph Section */}
      <div className="md:w-3/4 bg-white rounded-xl shadow p-4 min-h-[400px] flex flex-col justify-center">
        {loadingItemDetails ? (
          <div className="text-center text-green-700 font-semibold animate-pulse">
            Loading item data...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">
            Error loading item data.
          </div>
        ) : trackedItem ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={trackedItem.productImage}
                  alt={trackedItem.itemName}
                  className="w-20 h-20 rounded-lg object-cover border border-green-300"
                />
                <div>
                  <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
                    {trackedItem.itemName}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {trackedItem.marketName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Vendor: {trackedItem.vendorName}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-2 mt-4 md:mt-0 ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                <p className="font-semibold">
                  {isPositive ? "+" : ""}
                  {trendPercent}%
                </p>
                <span className="text-gray-500 text-sm">last 7 days</span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  {/* domain={["auto", "auto"]}  */}
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-center text-green-700 font-semibold">
            Select a tracked item to view price trends.
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceTrends;
