import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";

const Banner = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0xff0b,
          midtoneColor: 0xff92,
          lowlightColor: 0x2fff,
          baseColor: 0xf1f4f1,
          blurFactor: 0.49,
          speed: 1.9,
          zoom: 1.4,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="relative flex flex-col justify-center items-center h-[60vh] w-full overflow-hidden rounded-3xl shadow-lg"
    >
      <div className="absolute inset-0  z-10 rounded-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 text-center px-6"
      >
        <h1 className="text-black text-4xl md:text-7xl font-extrabold drop-shadow mb-4">
          BazaarTrack
        </h1>
        <h1 className="text-black text-3xl md:text-5xl font-extrabold drop-shadow mb-4">
          <Typewriter
            words={[
              "Track Local Market Prices Effortlessly",
              "Empower Farmers & Vendors",
              "Make Smart Buying Decisions",
              "Real-Time Fresh Produce Prices",
            ]}
            loop={0}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </h1>

        <p className="text-grey-600 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm">
          Stay informed with real-time market price tracking for vegetables,
          fruits, and essentials to make smarter market decisions.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-8 flex justify-center"
        >
          <Link
            to="/products"
            className="bg-green-700 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-green-700 transition shadow-md"
          >
            Get Started <FaArrowRight />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Banner;
