import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logo from "/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-green-700 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Website Name */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 rounded-full bg-green-700 p-1 mb-2"
          />
          <span className="text-green-400 font-bold text-lg">BazaarTrack</span>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-green-400 font-semibold mb-2">Contact</h3>
          <p className="text-gray-300 text-sm">support@bazaartrack.com</p>
          <p className="text-gray-300 text-sm">+123 456 7890</p>
          <p className="text-gray-300 text-sm">Dhaka, Bangladesh</p>
        </div>

        {/* Terms & Conditions */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-green-400 font-semibold mb-2">Legal</h3>
          <Link to="/terms" className="text-gray-300 text-sm hover:text-green-400 transition">
            Terms & Conditions
          </Link>
          <Link to="/privacy" className="text-gray-300 text-sm hover:text-green-400 transition">
            Privacy Policy
          </Link>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-green-400 font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15 }}
              className="text-gray-300 hover:text-green-400 transition"
            >
              <FaFacebookF size={20} />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15 }}
              className="text-gray-300 hover:text-green-400 transition"
            >
              <FaTwitter size={20} />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15 }}
              className="text-gray-300 hover:text-green-400 transition"
            >
              <FaInstagram size={20} />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15 }}
              className="text-gray-300 hover:text-green-400 transition"
            >
              <FaLinkedinIn size={20} />
            </motion.a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm py-4 border-t border-green-700">
        © {new Date().getFullYear()} BazaarTrack. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
