import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router"; // ✅ use react-router-dom
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";

import Particles, { initParticlesEngine } from "@tsparticles/react"; // ✅ import Particles
import { loadSlim } from "@tsparticles/slim"; // ✅ import loadSlim

function MainLayout() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particleOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      color: { value: "#4ade80" },
      links: {
        enable: true,
        color: "#86efac",
        distance: 150,
        opacity: 0.4,
      },
      move: { enable: true, speed: 1, outModes: { default: "out" } },
      size: { value: { min: 1, max: 3 } },
      opacity: { value: 0.6 },
      number: { value: 70 },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" } },
      modes: { repulse: { distance: 120 } },
    },
    detectRetina: true,
  };

  return (
    <div className="flex flex-col justify-between min-h-screen relative bg-transparent  ">
      {/* Background particles */}
      <div className="absolute inset-0 -z-10">
        {init && (
          <Particles
            id="tsparticles"
            options={particleOptions}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Header */}
      <Navbar />

      {/* Page Content with smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={useLocation().pathname} // ✅ re-render on route change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="flex-grow flex justify-center"
        >
          <div className="w-full max-w-6xl">
            <Outlet />
          </div>
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default MainLayout;
