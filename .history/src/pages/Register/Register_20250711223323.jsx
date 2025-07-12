// src/pages/Register.jsx

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { gsap } from "gsap"; // Import GSAP

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

  useEffect(() => {
    // GSAP animation on mount
    gsap.from(".form-item", {
      opacity: 0,
      x: -50,
      stagger: 0.2, // stagger form elements with 0.2 seconds delay
      duration: 1,
      ease: "power4.out",
    });

    gsap.from(".register-button", {
      opacity: 0,
      scale: 0.8,
      duration: 1.5,
      delay: 0.5, // delay button animation
      ease: "bounce.out",
    });

    // Background animation (optional)
    gsap.from(".background-img", {
      opacity: 0,
      y: -100,
      duration: 1.5,
      ease: "power4.out",
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex justify-center items-center max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Left Section: Form */}
        <div className="w-full max-w-md p-8 space-y-6">
          <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6 form-item">
            Create Your Account
          </h2>
          <p className="text-center text-gray-500 mb-8 form-item">
            Join us and start your journey today!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <div className="mb-4 form-item">
              <label htmlFor="name" className="block text-gray-700 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Full name is required" })}
                placeholder="Enter your full name"
                className={`input input-bordered w-full mt-2 p-3 rounded-md border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-4 form-item">
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
                className={`input input-bordered w-full mt-2 p-3 rounded-md border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4 form-item">
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
                className={`input input-bordered w-full mt-2 p-3 rounded-md border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6 form-item">
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
                className={`input input-bordered w-full mt-2 p-3 rounded-md border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="register-button btn btn-success w-full py-3 rounded-md text-white bg-green-500 hover:bg-green-600 transition duration-200"
            >
              Register
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center form-item">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-green-600 font-semibold">
                Login
              </a>
            </p>
          </div>
        </div>

        {/* Right Section: Background Image or Lottie Animation */}
        <div className="w-full max-w-sm background-img">
          <img
            src="https://media.giphy.com/media/3o6nVhZ4aZFbUtgc2I/giphy.gif"
            alt="Relevant Animation"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
