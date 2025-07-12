import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Register/Register";


exconst router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <div>Error occurred</div>,
    children: [
      {
        path: "register",
        Component: Register
      }
    ]
  }
])