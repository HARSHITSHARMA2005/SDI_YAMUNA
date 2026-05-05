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
          ? "rgba(3, 15, 35, 0.92)"
          : "rgba(3, 15, 35, 0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: scrolled
          ? "0 4px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(56,189,248,0.15)"
          : "none",
        borderBottom: scrolled ? "1px solid rgba(56,189,248,0.12)" : "1px solid transparent",
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: "2px",
        background: "linear-gradient(90deg, transparent 0%, #0ea5e9 30%, #38bdf8 50%, #0284c7 70%, transparent 100%)",
        opacity: 0.8,
      }} />

      <div className="max-w-full mx-auto px-5 py-2.5 flex items-center">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2.5 hover:scale-105 transition duration-300">
          <img src="./Logo.jpeg" alt="S.A.F" className="h-15 rounded-lg" style={{ filter: "drop-shadow(0 0 8px rgba(56,189,248,0.4))" }} />
          <div className="flex flex-col leading-none">
            <span
              className="text-2xl font-black tracking-wide"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              S.A.F
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "rgba(125,211,252,0.7)", letterSpacing: "0.18em" }}>
              Yamuna Watch
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 ml-auto items-center">
          {["About Us", "Our Impact", "Solutions", "Partners"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium transition duration-200 relative group"
              style={{ color: "rgba(186,230,255,0.85)" }}
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sky-400 rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.25)",
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <span className="text-xs font-semibold text-emerald-400">LIVE</span>
          </div>

          {/* CTA button */}
          <Link
            to="/login"
            className="btn-3d text-sm font-bold text-white px-5 py-2.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              boxShadow: "0 4px 16px rgba(14,165,233,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
              border: "1px solid rgba(56,189,248,0.3)",
            }}
          >
            Login / Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden ml-auto p-2 rounded-lg transition"
          style={{ color: "rgba(186,230,255,0.85)", background: "rgba(56,189,248,0.08)" }}
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
        <div className="md:hidden px-5 pb-5 flex flex-col space-y-3 border-t"
          style={{
            background: "rgba(3,15,35,0.97)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(56,189,248,0.12)",
          }}>
          {["About Us", "Our Impact", "Solutions", "Partners"].map((item) => (
            <a key={item} href="#"
              className="py-1.5 font-medium transition"
              style={{ color: "rgba(186,230,255,0.8)" }}
            >{item}</a>
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
