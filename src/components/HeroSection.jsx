import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [textIndex, setTextIndex] = useState(0);
  const navigate = useNavigate();

  const texts = [
    "The Yamuna is India's longest tributary, spanning 1,376 km.",
    "Yamuna supplies about 70% of Delhi's water.",
    "Faces severe pollution from untreated sewage and industrial waste.",
    "Highly revered in Hinduism — its confluence with the Ganges at Prayagraj is sacred.",
    "Major tributaries include the Chambal, Sindh, Betwa, and Ken.",
    "Covers a vast area across Uttarakhand, Haryana, and Uttar Pradesh.",
  ];

  // Auto-rotate facts every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((i) => (i + 1) % texts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => setTextIndex((i) => (i - 1 + texts.length) % texts.length);
  const handleNext = () => setTextIndex((i) => (i + 1) % texts.length);

  return (
    <div className="relative h-screen overflow-hidden">

      {/* ── Water ripple background (light blue, behind video) ── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-200 via-blue-100 to-cyan-200">
        {/* Animated wave layers */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "40%", opacity: 0.35 }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#38bdf8"
            fillOpacity="1"
            d="M0,160L48,149.3C96,139,192,117,288,122.7C384,128,480,160,576,165.3C672,171,768,149,864,128C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            style={{
              animation: "wave1 6s ease-in-out infinite alternate",
            }}
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "30%", opacity: 0.25 }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#0ea5e9"
            fillOpacity="1"
            d="M0,256L60,234.7C120,213,240,171,360,165.3C480,160,600,192,720,197.3C840,203,960,181,1080,160C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            style={{
              animation: "wave2 8s ease-in-out infinite alternate",
            }}
          />
        </svg>
      </div>

      {/* CSS keyframes for waves */}
      <style>{`
        @keyframes wave1 {
          0%   { d: path("M0,160L48,149.3C96,139,192,117,288,122.7C384,128,480,160,576,165.3C672,171,768,149,864,128C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L0,320Z"); }
          100% { d: path("M0,192L48,181.3C96,171,192,149,288,138.7C384,128,480,160,576,176C672,192,768,192,864,176C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L0,320Z"); }
        }
        @keyframes wave2 {
          0%   { d: path("M0,256L60,234.7C120,213,240,171,360,165.3C480,160,600,192,720,197.3C840,203,960,181,1080,160C1200,139,1320,117,1380,106.7L1440,96L1440,320L0,320Z"); }
          100% { d: path("M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,218.7C840,213,960,171,1080,160C1200,149,1320,149,1380,149.3L1440,149L1440,320L0,320Z"); }
        }
        @keyframes fadeSlide {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fact-text {
          animation: fadeSlide 0.5s ease forwards;
        }
      `}</style>

      {/* ── Video (on top of background, slightly translucent) ── */}
      <video
        loop
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-10"
        style={{ opacity: 0.72 }}
      >
        <source src="/river.mp4" type="video/mp4" />
      </video>

      {/* ── Dark overlay for text readability ── */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />

      {/* ── Hero Content ── */}
      <div className="absolute top-0 left-0 w-full h-full z-30 flex items-start justify-start text-white px-6">
        <div className="max-w-xl text-left mt-8">
          <h1 className="text-5xl py-2 md:text-7xl font-bold mb-4 drop-shadow-lg leading-tight">
            Revitalize Yamuna,<br />Revitalize Life.
          </h1>
          <p className="text-xl md:text-3xl mb-8 text-sky-100 drop-shadow">
            S.A.F Drones: Flying Towards a Cleaner Yamuna.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 px-8 py-3 rounded-md text-white text-lg font-semibold hover:bg-blue-700 hover:scale-105 hover:shadow-xl transition duration-300"
          >
            Login / Sign Up
          </button>
        </div>
      </div>

      {/* ── Pollution status badges (new addition) ── */}
      <div className="absolute top-8 right-6 z-30 flex flex-col gap-2 hidden md:flex">
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-white text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block"></span>
          Safe Zones Active
        </div>
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-white text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block animate-pulse"></span>
          Monitoring Live
        </div>
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-white text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
          Critical Alerts
        </div>
      </div>

      {/* ── Bottom Fact Bar ── */}
      <div className="absolute bottom-0 left-0 w-full z-30 bg-blue-600/90 backdrop-blur-sm text-white flex justify-between items-center px-6 py-3">
        <button
          onClick={handlePrev}
          className="text-xl font-bold hover:opacity-80 transition"
          aria-label="Previous fact"
        >
          &lt;
        </button>

        <div className="flex items-center gap-3 text-center flex-1 justify-center">
          <span
            key={textIndex}
            className="fact-text text-sm md:text-base"
          >
            💧 {texts[textIndex]}
          </span>
        </div>

        {/* Dot indicators */}
        <div className="hidden md:flex gap-1 mx-4">
          {texts.map((_, i) => (
            <button
              key={i}
              onClick={() => setTextIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === textIndex ? "bg-white scale-125" : "bg-white/40"}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="text-xl font-bold hover:opacity-80 transition"
          aria-label="Next fact"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
