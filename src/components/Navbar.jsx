import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md w-full sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 py-2 flex items-center">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center space-x-2 hover:scale-105 hover:shadow-md transition duration-300 pr-2"
        >
          <img src="./Logo.jpeg" alt="S.A.F" className="h-15" />
          <span className="text-4xl font-bold text-blue-600">S.A.F</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 ml-auto items-center">
          <a href="#" className="text-xl text-gray-600 py-2 hover:text-blue-600 transition duration-200">
            About Us
          </a>
          <a href="#" className="text-xl text-gray-600 py-2 hover:text-blue-600 transition duration-200">
            Our Impact
          </a>
          <a href="#" className="text-xl text-gray-600 py-2 hover:text-blue-600 transition duration-200">
            Solutions
          </a>
          <a href="#" className="text-xl text-gray-600 py-2 hover:text-blue-600 transition duration-200">
            Partners
          </a>

          {/* Single Login / Sign Up button */}
          <Link
            to="/login"
            className="text-xl bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 hover:scale-105 hover:shadow-md transition duration-300"
          >
            Login / Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden ml-auto text-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col space-y-3 bg-white border-t border-gray-100">
          <a href="#" className="text-gray-600 hover:text-blue-600 py-1">About Us</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 py-1">Our Impact</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 py-1">Solutions</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 py-1">Partners</a>
          <Link
            to="/login"
            className="bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Login / Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
