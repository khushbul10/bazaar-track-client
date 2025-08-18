import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home/Home";
import Dashboard from "../layouts/Dashboard";
import PrivateRoute from "./PrivateRoute";
import AddProduct from "../pages/Dashboard/AddProduct/AddProduct";
import VendorRoute from "./VendorRoute";
import UpdateProduct from "../pages/Dashboard/UpdateProduct/UpdateProduct";
import AllProductsPage from "../pages/AllProductPage/AllProuctPage";
import AllUsers from "../pages/Dashboard/AllUsers/AllUsers";
import AdminRoute from "./AdminRoute";
import AllProducts from "../pages/Dashboard/AllProducts/AllProducts";
import MyAdvertisements from "../pages/Dashboard/MyAdvertisements/MyAdvertisements";
import AddAdvertisement from "../pages/Dashboard/MyAdvertisements/AddAdvertisement";
import AllAdvertisements from "../pages/Dashboard/AllAdvertisements/AllAdvertisements";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import MyOrders from "../pages/Dashboard/MyOrders/MyOrders";
import MyWatchlist from "../pages/Dashboard/MyWatchlist/MyWatchlist";
import MyProducts from "../pages/Dashboard/MyProducts/MyProducts";
import AllOrders from "../pages/Dashboard/AllOrders/AllOrder";
import PriceTrendsPage from "../pages/Dashboard/PriceTrendsPage/PriceTrendsPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import ProfilePage from "../pages/Dashboard/ProfilePage/ProfilePage";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "/register",
        Component: Register
      },
      {
        path: "/login",
        Component: Login
      },
      {
        path: "/products",
        Component: AllProductsPage
      },
      {
        path: "/product/:productId",
        element: <PrivateRoute><ProductDetails /></PrivateRoute>
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    errorElement: <div>Error occurred in Dashboard</div>,
    children: [
      // user routes
      {
        path: "my-orders",
        element: <PrivateRoute><MyOrders /></PrivateRoute>
      },
      {
        path: "my-watchlist",
        element: <PrivateRoute><MyWatchlist /></PrivateRoute>
      },
      {
        path: "price-trends",
        element: <PrivateRoute><PriceTrendsPage /></PrivateRoute>
      },
      {
        path: "profile",
        element: <PrivateRoute><ProfilePage /></PrivateRoute>
      },


      // vendor routes
      {
        path: "add-products",
        element: <VendorRoute><AddProduct /></VendorRoute>
      },
      {
        path: "update-products/:productId",
        element: <VendorRoute><UpdateProduct /></VendorRoute>
      },
      {
        path: "ads",
        element: <VendorRoute><MyAdvertisements /></VendorRoute>
      },
      {
        path: "add-ads",
        element: <VendorRoute><AddAdvertisement /></VendorRoute>
      },
      {
        path: "my-products",
        element: <VendorRoute><MyProducts /></VendorRoute>
      },
      
      // admin routes
      {
        path: "all-users",
        element: <AdminRoute><AllUsers /></AdminRoute>
      },
      {
        path: "all-products",
        element: <AdminRoute><AllProducts /></AdminRoute>
      },
      {
        path: "all-ads",
        element: <AdminRoute><AllAdvertisements /></AdminRoute>
      },
      {
        path: "all-orders",
        element: <AdminRoute><AllOrders /></AdminRoute>
      }
    ]
  }
])