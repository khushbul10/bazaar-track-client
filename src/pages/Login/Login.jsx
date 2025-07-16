import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import sticker from "../../assets/login.png"; // Replace with your sticker path
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const { loginUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      await loginUser(email, password);
      toast.success("Login successful!");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      // console.error(err);
      toast.error(`Login failed: ${err.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleLogin();
      toast.success("Logged in with Google!");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      // console.error(err);
      toast.error(`Google sign-in failed: ${err.message}`);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col md:flex-row-reverse items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Sticker Section */}
      <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
        <img
          src={sticker}
          alt="Login Sticker"
          className="w-48 md:w-72 rounded-xl"
        />
      </div>

      {/* Form Section */}
      <div className="max-w-md w-full md:p-8 rounded-2xl border border-green-100 ">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 transition shadow-md"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-green-700">Don't have an account?</p>
          <Link
            to="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-green-300" />
          <span className="px-2 text-green-500">or</span>
          <hr className="flex-grow border-green-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white border border-green-300 text-green-700 font-semibold p-3 rounded-lg hover:bg-green-50 transition shadow-sm"
        >
          
          <FaGoogle></FaGoogle>
          Continue with Google
        </button>
      </div>
    </motion.div>
  );
};

export default Login;
