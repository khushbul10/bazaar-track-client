import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home/Home";
import Dashboard from "../layouts/Dashboard";
import PrivateRoute from "./PrivateRoute";
import AddProduct from "../pages/Dashboard/AddProduct/AddProduct";
import VendorRoute from "./VendorRoute";


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

      }
    ]
  }
])