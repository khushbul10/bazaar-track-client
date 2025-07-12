// src/components/Loader.jsx

import React from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion for animations

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-green-500 border-solid rounded-full"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Loader;
