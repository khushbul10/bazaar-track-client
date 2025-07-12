import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { auth, googleProvider } from/ '../../firebase/firebase.config';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const Register = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      return res.data.secure_url;
    } catch (error) {
      console.error(error);
      toast.error('Image upload failed');
      return null;
    }
  };

  const onSubmit = async (data) => {
    const { name, email, password, photo } = data;
    if (password.length < 6) {
      toast.error('Password should be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      let photoURL = 'https://i.ibb.co/8M0CM5w/default-avatar.png';
      if (photo && photo[0]) {
        const uploadedUrl = await uploadImageToCloudinary(photo[0]);
        if (uploadedUrl) {
          photoURL = uploadedUrl;
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL,
      });

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        name,
        email,
        photo: photoURL,
        role: 'user',
      });

      toast.success('Registration successful!');
      reset();
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: 'user',
      });

      toast.success('Google sign-in successful!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            {...register('name', { required: 'Name is required' })}
            className="w-full p-3 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
            className="w-full p-3 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            type="file"
            {...register('photo')}
            accept="image/*"
            className="w-full p-3 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
            className="w-full p-3 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>or</p>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-2 w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
