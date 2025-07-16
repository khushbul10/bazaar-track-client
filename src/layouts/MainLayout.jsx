import React from "react";
import { Outlet, useLocation } from "react-router";
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min.js";
import NET from "vanta/dist/vanta.net.min.js";

class MainLayout extends React.Component {
  constructor() {
    super();
    this.vantaRef = React.createRef();
  }
  componentDidMount() {
    this.vantaEffect = NET({
      el: this.vantaRef.current,
      THREE: THREE,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 0.5,
      scaleMobile: 1.0,
      color: 0xb4c0b,
      backgroundColor: 0xe4efe4,
      points: 14.0,
      spacing: 15.0,
      showDots: false,
    });
  }
  componentWillUnmount() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

  render() {
    return (
      <div
        ref={this.vantaRef}
        className="flex flex-col justify-between min-h-screen bg-green-50"
      >
        {/* Header */}
        <Navbar></Navbar>

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
        <Footer></Footer>
      </div>
    );
  }
}

export default MainLayout;
