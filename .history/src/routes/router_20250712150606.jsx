import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <div>Error occurred</div>,
    children: [
      {
        path: "/register",
        Component: Register
      },
      {
        path: "/login",
        
      }
    ]
  }
])