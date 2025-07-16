import React from "react";
import { Link, useRouteError } from "react-router";
import { motion } from "framer-motion";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 text-center">
      <motion.h1
        className="text-7xl font-extrabold text-green-700 mb-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        404
      </motion.h1>
      <motion.h2
        className="text-2xl font-semibold text-green-800 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oops! Page Not Found
      </motion.h2>
      <p className="text-green-700 mb-6">
        {error?.statusText || error?.message || "The page you are looking for does not exist."}
      </p>
      <Link
        to="/"
        className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition shadow-lg"
      >
        Go Home
      </Link>
    </div>
  );
};

export default ErrorPage;
