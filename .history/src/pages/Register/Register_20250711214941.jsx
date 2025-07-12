// src/pages/Register.jsx

import React from "react";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Handle registration logic here (for now, just log the data)
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-green-500 flex items-center justify-center bg-opacity-70">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-8">Join us now to get started!</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Full name is required" })}
              placeholder="Enter your full name"
              className={`input input-bordered w-full mt-2 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  message: "Please enter a valid email",
                },
              })}
              placeholder="Enter your email"
              className={`input input-bordered w-full mt-2 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your password"
              className={`input input-bordered w-full mt-2 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              placeholder="Confirm your password"
              className={`input input-bordered w-full mt-2 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Register Button */}
          <button type="submit" className="btn btn-success w-full">
            Register
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
