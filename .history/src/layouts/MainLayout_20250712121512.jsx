import React from 'react';<i class="fa fa-joomla" aria-hidden="true"></i>
import { Outlet, useLocation } from 'react-router';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Header */}
      {/* <Navbar /> */}

      {/* Page Content with smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow flex justify-center px-4 py-6"
        >
          <div className="w-full max-w-6xl">
            <Outlet />
          </div>
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
