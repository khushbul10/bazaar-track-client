import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import sticker from '../../assets/login.png'; // replace with your image path
import useUploadImage from '../../hooks/useUploadImage';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { uploadImage, isLoading  } = useUploadImage(); // Custom hook for image upload

  const onSubmit = data => {
    console.log(data); // Replace with AuthProvider logic later
    cons
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col md:flex-row-reverse items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Sticker Section */}
      <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
        <img
          src={sticker}
          alt="Market Sticker"
          className="w-48 md:w-72 rounded-xl "
        />
      </div>

      {/* Form Section */}
      <div className="max-w-md w-full p-8 rounded-2xl border border-green-100">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register('name', { required: 'Name is required' })}
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register('email', { required: 'Email is required' })}
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="file"
              {...register('photo')}
              accept="image/*"
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>

          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
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
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
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
          className="w-full flex items-center justify-center gap-2 bg-white border border-green-300 text-green-700 font-semibold p-3 rounded-lg hover:bg-green-50 transition shadow-sm"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google"
            className="w-6 h-6"
          />
          Continue with Google
        </button>
      </div>
    </motion.div>
  );
};

export default Register;
