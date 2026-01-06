// src/components/BackToTop.jsx
import React, { useEffect, useState } from "react";
import { ChevronUp, ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
      
      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="group fixed bottom-8 right-8 z-50 flex flex-col items-center transition-all duration-300 hover:scale-110"
        aria-label="Back to top"
      >
        {/* Animated background circle with gradient */}
        <div className="absolute inset-0  rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
        
        {/* Progress ring */}
        <div className="relative">
          <svg className="w-16 h-16 -rotate-90 " viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            {/* Progress circle */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth="2"
              strokeDasharray={`${scrollProgress}, 100`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Main button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/25 group-hover:shadow-purple-500/40">
              <ChevronUp className="w-5 h-5 text-white transform group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute -top-12 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
          <div className="relative">
            Back to Top
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping"
              style={{
                top: `${20 + i * 10}%`,
                left: `${30 + i * 20}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Scroll percentage indicator (optional) */}
        <div className="absolute -bottom-5 text-xs text-gray-400 font-medium">
          {Math.round(scrollProgress)}%
        </div>
      </button>
    )
  );
};

export default BackToTop;