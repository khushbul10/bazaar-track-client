import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import Loader from "../../Shared/Loader/Loader";
import axios from "axios";

// Fetch products from the backend with pagination
const fetchProducts = async (filters, page) => {
  const { dateRange, priceSort } = filters;
  const queryParams = new URLSearchParams();

  // Ensure that date range is passed as ISO string
  if (dateRange) {
    queryParams.append("startDate", dateRange.startDate);
    queryParams.append("endDate", dateRange.endDate);
  }
  if (priceSort) {
    queryParams.append("priceSort", priceSort);
  }
  queryParams.append("page", page); // Add page query parameter
  queryParams.append("limit", 10); // Limit to 10 items per page

  const response = await axios.get(`${import.meta.env.VITE_API_URL}/products?${queryParams.toString()}`);
  return response.data; // Return the data directly
};

const AllProductsPage = () => {
  const { user } = useAuth(); // Get the logged-in user data
  const navigate = useNavigate();

  // Sorting and filtering state
  const [priceSort, setPriceSort] = useState(""); // Default: no sorting
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" }); // Default: no date filter
  const [currentPage, setCurrentPage] = useState(1); // Default to page 1

  // Query to fetch products with filters and pagination
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["products", { dateRange, priceSort }, currentPage],
    queryFn: () => fetchProducts({ dateRange, priceSort }, currentPage),
    enabled: true,
    onError: () => {
      toast.error("Failed to fetch products.");
    },
  });

  // Handle sorting options
  const handleSortChange = (e) => {
    setPriceSort(e.target.value);
  };

  // Handle date range filter
  const handleDateFilterChange = (e) => {
    // Update the date range state
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  // Trigger refetch when date range changes
  const handleDateRangeChange = () => {
    refetch(); // Trigger refetch when the date range is changed
  };

  // Redirect to login or details page
  const handleViewDetails = (productId) => {
    if (!user) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      navigate(`/product/${productId}`); // Redirect to product details if logged in
    }
  };

  // Change page
  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page state
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error fetching products!</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-semibold text-center mb-6">All Products</h1>

      {/* Filter & Sort Section */}
      <div className="flex md:flex-col sm:flex-row justify-between mb-6 bg-green-100 p-4 rounded-lg shadow-md">
        {/* Sorting */}
        <div className="flex items-center space-x-4">
          <label htmlFor="sortPrice" className="text-lg font-medium text-gray-700">Sort by Price:</label>
          <select
            id="sortPrice"
            value={priceSort}
            onChange={handleSortChange}
            className="p-2 rounded-md border-2 w-full border-green-300"
          >
            <option value="">Select</option>
            <option value="asc">Price Low to High</option>
            <option value="desc">Price High to Low</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex w-full items-center mt-2 text-lg font-medium text-gray-700 space-x-4">
          <label htmlFor="startDate" className="text-lg font-medium text-gray-700">Date Range:</label>
          <div className="flex w-full items-center space-x-2">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateFilterChange}
              onBlur={handleDateRangeChange} // Trigger refetch when date range changes
              className="p-2 w-full rounded-md border-2 border-green-300"
            />
            <p>to</p>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateFilterChange}
              onBlur={handleDateRangeChange} // Trigger refetch when date range changes
              className="p-2 w-full rounded-md border-2 border-green-300"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {data && data.products.map((product) => (
          <div key={product._id} className="bg-green-100 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <img src={product.productImage} alt={product.itemName} className="w-full h-48 object-cover mb-4 rounded-md" />
            <h2 className="text-xl font-semibold text-gray-800">{product.itemName}</h2>
            <p className="text-lg text-gray-600 mb-2">Market: {product.marketName}</p>
            <p className="text-lg text-gray-700">Price: ৳{product.pricePerUnit}</p>
            <p className="text-md text-gray-500 mb-4">Vendor: {product.vendorName}</p>
            <p className="text-sm text-gray-400 mb-4">Date: {new Date(product.date).toLocaleDateString()}</p>
            <button
              onClick={() => handleViewDetails(product._id)}
              className="bg-green-600 text-white py-2 px-4 rounded-md w-full hover:bg-green-700 transition-all duration-200"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-400 text-white py-2 px-4 rounded-md mr-4"
        >
          Previous
        </button>

        {/* Page Number */}
        <span className="text-lg font-medium text-gray-700">
          Page {currentPage} of {data.totalPages}
        </span>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data.totalPages}
          className="bg-gray-400 text-white py-2 px-4 rounded-md ml-4"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllProductsPage;
