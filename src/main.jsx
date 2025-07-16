import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import { router } from "./routes/router.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Aos from "aos";


const queryClient = new QueryClient();
Aos.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer></ToastContainer>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
