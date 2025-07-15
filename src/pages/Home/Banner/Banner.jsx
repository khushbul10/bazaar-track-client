import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Link } from "react-router";
// import BIRDS from 'vanta/dist/vanta.birds.min'
import VantaBackground from "./VantaBackground";
import vantaBirdsMin from "vanta/dist/vanta.birds.min";

const Banner = () => {
  const [vantaEffect, setVantaEffect] = useState(null)
  const myRef = useRef(null)
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(vantaBirdsMin({
        el: myRef.current
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])
  

  return (
    <div
      ref={myRef}
      className="relative h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Dark overlay for readability */}
      <div></div>

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
