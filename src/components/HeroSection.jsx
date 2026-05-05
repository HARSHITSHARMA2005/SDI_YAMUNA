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

      {/* ── Solid dark base (shows only if video fails to load) ── */}
      <div className="absolute inset-0 z-0" style={{ background: "#071a2e" }} />

      {/* ── Video — full opacity, no blend mode ── */}
      <video
        loop autoPlay muted playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-10"
        style={{ opacity: 1 }}
      >
        <source src="/river.mp4" type="video/mp4" />
      </video>

      {/* ── Subtle wave accent at very bottom only ── */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none" style={{ height: "80px" }}>
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "100%", opacity: 0.18, animation: "wave1 8s ease-in-out infinite" }}
          viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#38bdf8"
            d="M0,40L120,34C240,28,480,16,720,20C960,24,1200,44,1320,54L1440,64L1440,80L0,80Z"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "70%", opacity: 0.12, animation: "wave2 11s ease-in-out infinite" }}
          viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#7dd3fc"
            d="M0,30L180,22C360,14,720,10,900,18C1080,26,1260,42,1440,50L1440,60L0,60Z"
          />
        </svg>
      </div>

      {/* ── Dark gradient overlay for text readability ── */}
      <div className="absolute inset-0 z-30"
        style={{ background: "linear-gradient(135deg, rgba(0,30,60,0.52) 0%, rgba(0,15,40,0.22) 50%, rgba(0,40,80,0.12) 100%)" }}
      />

      {/* ── Hero Content ── */}
      <div className="absolute top-0 left-0 w-full h-full z-40 flex items-center justify-start text-white px-6 md:px-14">
        <div className="max-w-2xl text-left" style={{ perspective: "800px" }}>

          {/* Eyebrow tag */}
          <div className="hero-text-in glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-sky-200 text-sm font-medium"
            style={{ animationDelay: "0.1s" }}>
            <span className="w-2 h-2 rounded-full bg-sky-300 inline-block animate-pulse" />
            Live River Monitoring Platform
          </div>

          <h1
            className="hero-text-in text-5xl md:text-7xl font-black mb-4 leading-tight tracking-tight"
            style={{
              animationDelay: "0.25s",
              textShadow: "0 4px 24px rgba(0,60,120,0.6), 0 1px 0 rgba(255,255,255,0.15)",
              background: "linear-gradient(135deg, #ffffff 0%, #bae6fd 60%, #7dd3fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Revitalize Yamuna,<br />Revitalize Life.
          </h1>

          <p className="hero-text-in text-xl md:text-2xl mb-10 text-sky-100 font-light"
            style={{ animationDelay: "0.4s", textShadow: "0 2px 12px rgba(0,40,100,0.5)" }}>
            S.A.F Drones: Flying Towards a Cleaner Yamuna.
          </p>

          {/* Single CTA button */}
          <div className="hero-text-in" style={{ animationDelay: "0.55s" }}>
            <button
              onClick={() => navigate("/login")}
              className="btn-3d rounded-xl text-white text-lg font-bold px-10 py-4"
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)",
                boxShadow: "0 8px 24px rgba(14,165,233,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Get Started — Login / Sign Up
            </button>
          </div>

          {/* Stats row */}
          <div className="hero-text-in flex gap-6 mt-10" style={{ animationDelay: "0.7s" }}>
            {[
              { val: "20+",  label: "Monitoring Stations" },
              { val: "24/7", label: "Live Surveillance"   },
              { val: "3",    label: "Alert Levels"        },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-xs text-sky-200 mt-0.5 whitespace-nowrap">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Status badges (top-right) ── */}
      <div className="absolute top-8 right-6 z-40 hidden md:flex flex-col gap-2.5">
        {[
          { color: "bg-emerald-400", label: "Safe Zones Active" },
          { color: "bg-amber-400 animate-pulse", label: "Monitoring Live" },
          { color: "bg-red-400",     label: "Critical Alerts" },
        ].map((b) => (
          <div key={b.label}
            className="glass-card flex items-center gap-2.5 rounded-full px-4 py-2 text-white text-sm"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${b.color} inline-block`} />
            {b.label}
          </div>
        ))}
      </div>

      {/* ── Bottom Fact Bar ── */}
      <div className="absolute bottom-0 left-0 w-full z-40 flex justify-between items-center px-6 py-3"
        style={{
          background: "linear-gradient(90deg, rgba(2,132,199,0.92) 0%, rgba(14,165,233,0.92) 100%)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 -4px 24px rgba(14,165,233,0.25)",
        }}
      >
        <button onClick={handlePrev} className="text-xl font-bold text-white/80 hover:text-white transition px-2" aria-label="Previous fact">‹</button>

        <div className="flex items-center gap-3 text-center flex-1 justify-center">
          <span key={textIndex} className="fact-text text-sm md:text-base text-white">
            💧 {texts[textIndex]}
          </span>
        </div>

        <div className="hidden md:flex gap-1.5 mx-4">
          {texts.map((_, i) => (
            <button key={i} onClick={() => setTextIndex(i)}
              className={`rounded-full transition-all duration-300 ${i === textIndex ? "w-5 h-2 bg-white scale-125" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>

        <button onClick={handleNext} className="text-xl font-bold text-white/80 hover:text-white transition px-2" aria-label="Next fact">›</button>
      </div>
    </div>
  );
};

export default HeroSection;
