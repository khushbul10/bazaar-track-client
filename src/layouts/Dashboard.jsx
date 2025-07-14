import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      try {
        await logoutUser();
        toast.success("Logged out successfully!");
        navigate("/");
      } catch (error) {
        toast.error("Logout failed");
      }
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      {/* Mobile Toggle */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col bg-green-50 min-h-screen">
        {/* Topbar */}
        <div className="w-full navbar bg-white shadow px-4 justify-between">
          <div className="flex items-center gap-2">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <h1 className="text-lg font-bold text-green-800">Dashboard</h1>
          </div>
          {user && (
            <img
              src={
                user.photoURL || "https://i.ibb.co/8M0CM5w/default-avatar.png"
              }
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-green-400 object-cover"
            />
          )}
        </div>

        {/* Nested Outlet */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 bg-green-700 text-white min-h-full">
          <h2 className="text-xl font-bold mb-4 text-center">BazaarTrack</h2>
          {/* Common link for all users */}
          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive ? "bg-green-600 font-semibold" : ""
              }
            >
              <FaTachometerAlt /> Overview
            </NavLink>
          </li>

          {/* Admin-specific links */}
          {role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/all-users"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaBoxOpen /> All Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/all-products"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaBoxOpen /> All Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/all-ads"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaBoxOpen /> All Advertisements
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/add-products"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaBoxOpen /> Add Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/update-products"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaBoxOpen /> Update Products
                </NavLink>
              </li>
            </>
          )}

          {/* Vendor-specific links */}
          {role === "vendor" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/products"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaBoxOpen /> My Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/add-products"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaBoxOpen /> Add Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/add-ads"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaBoxOpen /> Add Advertisements
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/ads"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaBoxOpen /> My Advertisements
                </NavLink>
              </li>
            </>
          )}

          {/* User-specific link */}
          {role === "user" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/my-orders"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaUser /> My Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/profile"
                  className={({ isActive }) =>
                    isActive ? "bg-green-600 font-semibold" : ""
                  }
                >
                  <FaUser /> Profile
                </NavLink>
              </li>
            </>
          )}

          {/* Logout button */}
          <li>
            <button onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
