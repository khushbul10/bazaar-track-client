import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import sticker from "../../assets/login.png"; // Your sticker path
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUploadImage from '../../hooks/useUploadImage';

const Register = () => {
  const { registerUser, updateUserProfile, googleLogin } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { uploadImage, isLoading: imageUploading } = useUploadImage();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { name, email, password, photo } = data;

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    const photoURL = "https://i.ibb.co/8M0CM5w/default-avatar.png";
    // try {
    //   // 1️⃣ Upload image if provided
    //   let photoURL = "https://i.ibb.co/8M0CM5w/default-avatar.png";
    //   if (photo && photo[0]) {
    //     await new Promise((resolve) => {
    //       uploadImage(photo[0], {
    //         onSuccess: (url) => {
    //           photoURL = url;
    //           resolve();
    //         },
    //         onError: (error) => {
    //           toast.error("Image upload failed");
    //           console.error(error);
    //           resolve();
    //         },
    //       });
    //     });
    //   }

      // 2️⃣ Register user with email & password
      const userCredential = await registerUser(email, password);
      const user = userCredential.user;

      // 3️⃣ Update user profile
      await updateUserProfile({
        displayName: name,
        photoURL: photoURL,
      });

      // 4️⃣ Save user to your backend
      await axiosSecure.post('/users', {
        name,
        email,
        photo: photoURL,
        role: "user",
      });

      toast.success("Registration successful!");
      reset();
      navigate("/");

    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleLogin();
      const user = result.user;

      // Save user to DB
      await axiosSecure.post('/users', {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: "user",
      });

      toast.success("Google sign-in successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Google sign-in failed");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col md:flex-row-reverse items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Sticker */}
      <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
        <img
          src={sticker}
          alt="Market Sticker"
          className="w-48 md:w-72 rounded-xl"
        />
      </div>

      {/* Form */}
      <div className="max-w-md w-full p-8 rounded-2xl border border-green-100 bg-white shadow-xl">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Name is required" })}
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email
