import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import sticker from "../../assets/login.png"; // replace with your actual sticker path
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useUploadImage from "../../hooks/useUploadImage";

const Register = () => {
  const { registerUser, updateUserProfile, googleLogin } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const { uploadImage, isLoading: isImageUploading } = useUploadImage();

  const onSubmit = async (data) => {
    const { name, email, password, photo } = data;

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    const photoURL = "https://i.ibb.co/8M0CM5w/default-avatar.png"; // Default image URL
    try {
    //   let photoURL = "https://i.ibb.co/8M0CM5w/default-avatar.png";

    //   // ✅ Upload image if selected
    //   if (photo && photo[0]) {
    //     await new Promise((resolve) => {
    //       uploadImage(photo[0], {
    //         onSuccess: (url) => {
    //           photoURL = url;
    //           resolve();
    //         },
    //         onError: () => {
    //           toast.error("Image upload failed");
    //           resolve();
    //         },
    //       });
    //     });
    //   }

      // ✅ Register user in Firebase/AuthProvider
      const userCredential = await registerUser(email, password);

      // ✅ Update profile
      await updateUserProfile({
        displayName: name,
        photoURL: photoURL,
      });

      // ✅ Save user in your DB
      await axiosSecure.post("/users", {
        name,
        email,
        photo: photoURL,
        role: "user",
      });

      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(`Registration failed: ${err.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleLogin();
      const user = result.user;

      await axiosSecure.post("/users", {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: "user",
      });

      toast.success("Google sign-in successful!");
      navigate("/");
    } catch (err) {
      console.error("Google sign-in error:", err);
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
          alt="Register Sticker"
          className="w-48 md:w-72 rounded-xl"
        />
      </div>

      {/* Form Section */}
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
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
              type="file"
              {...register("photo")}
              accept="image/*"
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {/* {isImageUploading && (
              <p className="text-green-600 text-sm mt-1">
                Uploading image...
              </p>
            )} */}
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
            Register
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-green-700">Already have an account?</p>
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login here
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
          <FaGoog
          Continue with Google
        </button>
      </div>
    </motion.div>
  );
};

export default Register;
