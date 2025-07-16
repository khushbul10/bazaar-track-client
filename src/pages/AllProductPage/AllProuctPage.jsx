import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import Loader from "../../Shared/Loader/Loader";
import axios from "axios";
import { DateRange } from "react-date-range";
import { CSVLink } from "react-csv";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";

// Fetch products with filters and pagination
const fetchProducts = async ({ dateRange, priceSort, category }, page) => {
  const queryParams = new URLSearchParams();

  if (dateRange?.startDate) {
    queryParams.append("startDate", dateRange.startDate);
  }
  if (dateRange?.endDate) {
    queryParams.append("endDate", dateRange.endDate);
  }
  if (priceSort) {
    queryParams.append("priceSort", priceSort);
  }
  if (category) {
    queryParams.append("category", category);
  }
  queryParams.append("page", page);
  queryParams.append("limit", 10);

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/products?${queryParams.toString()}`
  );
  return response.data;
};

const AllProductsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filters
  const [priceSort, setPriceSort] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const [calendarState, setCalendarState] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  // Fetch data with TanStack Query
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["products", { dateRange, priceSort, category }, currentPage],
    queryFn: () =>
      fetchProducts({ dateRange, priceSort, category }, currentPage),
    enabled: true,
    onError: () => {
      toast.error("Failed to fetch products.");
    },
  });

  // Sync calendar selection to dateRange filter
  useEffect(() => {
    if (calendarState[0].startDate && calendarState[0].endDate) {
      setDateRange({
        startDate: calendarState[0].startDate.toISOString(),
        endDate: calendarState[0].endDate.toISOString(),
      });
      setCurrentPage(1);
    }
  }, [calendarState]);

  const handleSortChange = (e) => {
    setPriceSort(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (productId) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        Error fetching products!
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
        🛒 All Products
      </h1>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-4 w-full lg:w-1/3">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Filter by Date Range
          </h3>
          <div className="w-fit mx-auto">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setCalendarState([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={calendarState}
              maxDate={new Date()}
              rangeColors={["#16a34a"]}
            />
          </div>
        </div>

        {/* Sort & Category */}
        <div className="bg-white rounded-lg shadow p-4 flex-1 flex flex-col gap-4">
          {/* Price Sort */}
          <div>
            <label className="block mb-1 font-medium text-green-700">
              Sort by Price:
            </label>
            <select
              value={priceSort}
              onChange={handleSortChange}
              className="w-full p-2 rounded border border-green-300"
            >
              <option value="">Select</option>
              <option value="asc">Price Low to High</option>
              <option value="desc">Price High to Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block mb-1 font-medium text-green-700">
              Filter by Name:
            </label>
            <input
              type="text"
              placeholder="e.g., Carrot, Potato"
              value={category}
              onChange={handleCategoryChange}
              className="w-full p-2 rounded border border-green-300"
            />
          </div>

          {/* CSV Export */}
          <div className="mt-auto">
            <CSVLink
              data={data.products}
              filename={"products.csv"}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-center block w-full"
            >
              Export Filtered Products as CSV
            </CSVLink>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <img
              src={product.productImage}
              alt={product.itemName}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold text-green-800 mb-1">
              {product.itemName}
            </h2>
            <p className="text-gray-600 mb-1">Market: {product.marketName}</p>
            <p className="text-green-700 font-semibold mb-1">
              ৳{product.pricePerUnit}/kg
            </p>
            <p className="text-gray-500 text-sm mb-1">
              Vendor: {product.vendorName}
            </p>
            <p className="text-gray-400 text-xs mb-3">
              Date: {new Date(product.date).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleViewDetails(product._id)}
              className="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Prev
        </button>
        <span className="text-green-800 font-medium">
          Page {currentPage} of {data.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data.totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === data.totalPages
              ? "bg-gray-300"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllProductsPage;
