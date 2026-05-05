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

  // Bubble positions (stable, not random so no re-render flicker)
  const bubbles = [
    { size: 12, left: "8%",  delay: "0s",   dur: "6s"  },
    { size: 20, left: "18%", delay: "1.2s", dur: "8s"  },
    { size: 8,  left: "30%", delay: "0.5s", dur: "5s"  },
    { size: 16, left: "45%", delay: "2s",   dur: "7s"  },
    { size: 10, left: "60%", delay: "0.8s", dur: "6.5s"},
    { size: 22, left: "72%", delay: "1.5s", dur: "9s"  },
    { size: 6,  left: "85%", delay: "0.3s", dur: "4.5s"},
    { size: 14, left: "92%", delay: "2.5s", dur: "7.5s"},
  ];

  return (
    <div className="relative h-screen overflow-hidden">

      {/* ── Deep layered water background ── */}
      <div className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #bae6fd 0%, #7dd3fc 20%, #38bdf8 50%, #0ea5e9 75%, #0284c7 100%)",
        }}
      >
        {/* Radial light caustics */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(224,242,254,0.5) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 75% 60%, rgba(186,230,255,0.35) 0%, transparent 55%)",
        }} />

        {/* Floating bubbles */}
        {bubbles.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              bottom: `${10 + (i * 7) % 40}%`,
              background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), rgba(186,230,255,0.3))",
              border: "1px solid rgba(255,255,255,0.5)",
              animation: `floatBubble ${b.dur} ${b.delay} ease-in-out infinite`,
            }}
          />
        ))}

        {/* Wave layer 1 — deepest, slowest */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "45%", opacity: 0.55, animation: "wave1 7s ease-in-out infinite" }}
          viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#0284c7" fillOpacity="1"
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,160C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L0,320Z"
          />
        </svg>

        {/* Wave layer 2 */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "38%", opacity: 0.45, animation: "wave2 9s ease-in-out infinite" }}
          viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#0ea5e9" fillOpacity="1"
            d="M0,256L60,234.7C120,213,240,171,360,165.3C480,160,600,192,720,197.3C840,203,960,181,1080,165.3C1200,149,1320,128,1380,117.3L1440,107L1440,320L0,320Z"
          />
        </svg>

        {/* Wave layer 3 — topmost, fastest */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "28%", opacity: 0.35, animation: "wave3 5s ease-in-out infinite" }}
          viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#38bdf8" fillOpacity="1"
            d="M0,288L80,272C160,256,320,224,480,213.3C640,203,800,213,960,208C1120,203,1280,181,1360,170.7L1440,160L1440,320L0,320Z"
          />
        </svg>

        {/* Horizontal light shimmer strip */}
        <div className="absolute left-0 right-0" style={{
          top: "38%", height: "3px", opacity: 0.4,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, rgba(186,230,255,0.7) 50%, rgba(255,255,255,0.9) 70%, transparent 100%)",
          animation: "shimmer 4s linear infinite",
          backgroundSize: "200% 100%",
        }} />
      </div>

      {/* ── Video overlay (translucent on top of water bg) ── */}
      <video
        loop autoPlay muted playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-10"
        style={{ opacity: 0.60, mixBlendMode: "multiply" }}
      >
        <source src="/river.mp4" type="video/mp4" />
      </video>

      {/* ── Dark gradient overlay for text readability ── */}
      <div className="absolute inset-0 z-20"
        style={{ background: "linear-gradient(135deg, rgba(0,30,60,0.55) 0%, rgba(0,15,40,0.25) 50%, rgba(0,40,80,0.15) 100%)" }}
      />

      {/* ── Hero Content ── */}
      <div className="absolute top-0 left-0 w-full h-full z-30 flex items-center justify-start text-white px-6 md:px-14">
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
      <div className="absolute top-8 right-6 z-30 hidden md:flex flex-col gap-2.5">
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
      <div className="absolute bottom-0 left-0 w-full z-30 flex justify-between items-center px-6 py-3"
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
