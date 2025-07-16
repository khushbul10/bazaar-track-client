import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import logo from "/logo.png";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
    });

    if (!result.isConfirmed) return;
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      // console.error(error);
      toast.error("Logout failed");
    }
  };

  const dashboardRoute = "/dashboard";

  return (
    <nav className="bg-gradient-to-r from-green-100 to-green-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Name */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 rounded-full bg-green-200 p-1"
            />
            <span className="font-bold text-green-800 text-lg">BazaarTrack</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-2 items-center">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-green-300 text-green-900"
                    : "text-green-800 hover:bg-green-200"
                }`
              }
            >
              All Products
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to={dashboardRoute}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-green-300 text-green-900"
                        : "text-green-800 hover:bg-green-200"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-green-800 hover:bg-green-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-green-300 text-green-900"
                        : "text-green-800 hover:bg-green-200"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "bg-green-300 text-green-900"
                        : "text-green-800 hover:bg-green-200"
                    }`
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}

            {/* Profile */}
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(dashboardRoute)}
                className="ml-2 cursor-pointer"
              >
                <img
                  src={user.photoURL || "https://i.ibb.co/8M0CM5w/default-avatar.png"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-green-400"
                />
              </motion.div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-green-800 hover:text-green-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-3 space-y-1 bg-green-100 shadow">
          <NavLink
            to="/products"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? "bg-green-300 text-green-900"
                  : "text-green-800 hover:bg-green-200"
              }`
            }
          >
            All Products
          </NavLink>
          {user ? (
            <>
              <NavLink
                to={dashboardRoute}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-green-300 text-green-900"
                      : "text-green-800 hover:bg-green-200"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-green-800 hover:bg-green-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-green-300 text-green-900"
                      : "text-green-800 hover:bg-green-200"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-green-300 text-green-900"
                      : "text-green-800 hover:bg-green-200"
                  }`
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
