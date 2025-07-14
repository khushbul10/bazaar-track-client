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


export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <div>Error occurred</div>,
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
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    errorElement: <div>Error occurred in Dashboard</div>,
    children: [
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
      
      // admin routes
      {
        path: "all-users",
        element: <AdminRoute><AllUsers /></AdminRoute>
      },
      {
        path: "all-products",
        element: <AdminRoute><AllProducts /></AdminRoute>
      }
    ]
  }
])