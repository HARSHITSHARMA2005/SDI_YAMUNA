import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [textIndex, setTextIndex] = useState(0);
  const navigate = useNavigate();

  const texts = [
    "The Yamuna is India's longest tributary, spanning 1,376 km.",
    "Yamuna supplies about 70% of Delhi's water",
    "Faces severe pollution from untreated sewage and industrial waste.",
    "Highly revered in Hinduism, with its confluence with the Ganges at Prayagraj being a sacred site.",
    "Major tributaries include the Chambal, Sindh, Betwa, and Ken.",
    "Covers a vast area across several states, including Uttarakhand, Haryana, and Uttar Pradesh.",
  ];

  const handleNextText = () => {
    setTextIndex((yo) => (yo + 1) % texts.length);
  };

  const handleLoginRedirect = () => {
    navigate("/login");  // ✅ now redirects to login
  };

  return (
    <div className="relative h-screen">
      {/* Video Background */}
      <video
        loop
        autoPlay
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/river.mp4" type="video/mp4" />
      </video>

      {/* Hero Content */}
      <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start text-white px-6">
        <div className="max-w-xl text-left mt-6">
          <h1 className="text-5xl py-2 md:text-8xl font-bold mb-4">
            Revitalize Yamuna, Revitalize Life.
          </h1>
          <p className="text-2xl md:text-4xl mb-6">
            S.A.F Drones: Flying Towards a Cleaner Yamuna.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-600 px-6 py-3 rounded-md text-white font-medium hover:bg-blue-700 hover:scale-105 hover:shadow-md transition duration-300"
          >
            Login
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-blue-600 text-white flex justify-between items-center px-6 py-3">
        <button
          onClick={handleNextText}
          className="text-xl font-bold hover:opacity-80"
        >
          &lt;
        </button>
        <p className="text-center text-sm md:text-lg">{texts[textIndex]}</p>
        <button
          onClick={handleNextText}
          className="text-xl font-bold hover:opacity-80"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default HeroSection;

