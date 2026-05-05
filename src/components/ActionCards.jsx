import React from "react";

const ActionCards = () => {
  const cards = [
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 7.58172 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="currentColor"/>
        </svg>
      ),
      title: "Donate now",
      desc: "Fund drone tech for clean water",
      link: "#",
      accent: "#0284c7",
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Give monthly",
      desc: "Sustain river monitoring 24/7",
      link: "#",
      accent: "#0369a1",
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Get involved",
      desc: "Join our citizen science network",
      link: "#",
      accent: "#0ea5e9",
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H5L5.4 8M5.4 8L7 16H17L19 8H5.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8.5" cy="19" r="1.5" stroke="currentColor" strokeWidth="2"/>
          <circle cx="15.5" cy="19" r="1.5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Our Financial Model",
      desc: "Transparent, impact-driven funding",
      link: "#",
      accent: "#0284c7",
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      ),
      title: "Start a fundraiser",
      desc: "Rally your community for Yamuna",
      link: "#",
      accent: "#0369a1",
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 12H22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Partner with us",
      desc: "Scale impact with institutional support",
      link: "#",
      accent: "#0ea5e9",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-12">
      {/* Section heading */}
      <div className="text-center mb-12">
        <p className="text-sky-500 font-semibold text-sm uppercase tracking-widest mb-2">Take Action</p>
        <h2 className="text-4xl font-black text-gray-800">
          Help change lives with safe water
        </h2>
        <div className="mt-3 mx-auto h-1 w-20 rounded-full"
          style={{ background: "linear-gradient(90deg, #0284c7, #38bdf8)" }} />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: "1200px" }}>
        {cards.map((card, index) => (
          <a
            key={index}
            href={card.link}
            className="card-3d group relative flex items-center justify-between text-white px-6 py-5 rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${card.accent} 0%, #0ea5e9 100%)`,
              boxShadow: "0 8px 24px rgba(14,165,233,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {/* Shine overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                backgroundSize: "200% 100%",
              }}
            />
            {/* Decorative circle */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10"
              style={{ background: "white" }} />
            <div className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full opacity-10"
              style={{ background: "white" }} />

            <div className="relative flex items-center space-x-4">
              <div className="rounded-xl p-2.5 text-white"
                style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
                {card.icon}
              </div>
              <div>
                <span className="text-base font-bold block">{card.title}</span>
                <span className="text-xs text-sky-100 opacity-80">{card.desc}</span>
              </div>
            </div>

            <svg className="relative w-5 h-5 flex-shrink-0 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ActionCards;
