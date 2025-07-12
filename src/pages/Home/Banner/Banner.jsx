import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router";

const Banner = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/vanta.waves.min.js";
    script.async = true;
    
    script.onload = () => {
      if (window.VANTA && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.WAVES({
          el: vantaRef.current,
          THREE: THREE,
          color: 0x10b981,
          shininess: 50,
          waveHeight: 20,
          waveSpeed: 0.8,
          zoom: 0.9,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="relative h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          Track Local Market Prices Effortlessly
        </h1>
        <p className="text-lg md:text-2xl text-white mt-4 drop-shadow max-w-xl mx-auto">
          Real-time prices for fresh produce and essentials from your local markets.
        </p>
        <div className="mt-6">
          <Link
            to="/products"
            className="bg-green-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-600 transition shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
