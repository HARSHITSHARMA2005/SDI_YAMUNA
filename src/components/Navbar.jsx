import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="w-full sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(255,255,255,0.92)"
          : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: scrolled
          ? "0 4px 30px rgba(14,165,233,0.12), 0 1px 0 rgba(14,165,233,0.08)"
          : "0 2px 16px rgba(14,165,233,0.07)",
        borderBottom: "1px solid rgba(14,165,233,0.1)",
      }}
    >
      <div className="max-w-full mx-auto px-5 py-2.5 flex items-center">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2 hover:scale-105 transition duration-300">
          <img src="./Logo.jpeg" alt="S.A.F" className="h-15" />
          <span
            className="text-3xl font-black"
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            S.A.F
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 ml-auto items-center">
          {["About Us", "Our Impact", "Solutions", "Partners"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-base font-medium text-gray-600 hover:text-sky-600 transition duration-200 relative group"
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sky-500 rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          {/* Single CTA button */}
          <Link
            to="/login"
            className="btn-3d text-sm font-bold text-white px-5 py-2.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              boxShadow: "0 4px 14px rgba(14,165,233,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            Login / Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden ml-auto text-gray-500 p-2 rounded-lg hover:bg-sky-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
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
        <div className="md:hidden px-5 pb-5 flex flex-col space-y-3 border-t border-sky-100"
          style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)" }}>
          {["About Us", "Our Impact", "Solutions", "Partners"].map((item) => (
            <a key={item} href="#" className="text-gray-600 hover:text-sky-600 py-1.5 font-medium transition">{item}</a>
          ))}
          <Link
            to="/login"
            className="btn-3d text-sm font-bold text-white text-center px-4 py-2.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
            }}
          >
            Login / Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
