import React, { useState, useEffect } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import logo from "../assets/logo1.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  /* ✅ Add shadow when scrolling */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ✅ Navigation items */
  const navItems = [
    { type: "scroll", to: "hero", label: "Home" },
    { type: "scroll", to: "whatwedo", label: "What We Do" },
    { type: "scroll", to: "services", label: "Services" },
    { type: "scroll", to: "industries", label: "Industries" },
    { type: "scroll", to: "alfa", label: "ALFA" },
    { type: "path", to: "/tech-manthana/blog", label: "Tech Manthana" },
    { type: "scroll", to: "contact", label: "Contact Us" },
  ];

  /* ✅ Smooth scroll handler */
  const handleScrollToSection = (sectionId) => {
    handleClose(); // Close mobile menu on click
    if (location.pathname !== "/") {
      navigate("/");
      // Use window.onload or a more robust check if needed, but setTimeout is a common workaround
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-gradient-to-r from-blue-100 via-blue-900 to-purple-900 shadow-2xl py-2"
          : "bg-gradient-to-r from-blue-100 via-blue-900 to-purple-900 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ✅ Logo with FIXED SIZE: h-30 is replaced with h-12 */}
          <RouterLink 
            to="/" 
            onClick={handleClose}
            className="flex-shrink-0 flex items-center space-x-3 group transition-shadow duration-300"
          >
            <img 
              src={logo} 
              alt="Logo" 
              // Changed h-30 to h-12 to prevent it from dominating the space
              className="h-30 w-auto transition-transform duration-300 group-hover:scale-110" 
            />
          </RouterLink>

          {/* ✅ Desktop Navigation Menu - Increased Spacing */}
          <div className="hidden lg:block">
            {/* Increased space-x-1 to space-x-4 for better large-screen separation */}
            <div className="ml-10 flex items-baseline space-x-4"> 
              {navItems.map((item, i) => (
                <div key={i} className="relative group">
                  {item.type === "scroll" ? (
                    <ScrollLink
                      to={item.to}
                      smooth={true}
                      duration={700}
                      offset={-80}
                      spy={true}
                      // Use handleScrollToSection to manage navigation/scrolling and menu close
                      onClick={() => handleScrollToSection(item.to)} 
                      className="text-gray-200 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 cursor-pointer relative overflow-hidden"
                    >
                      {item.label}
                      {/* ✨ ENHANCED UNDERLINE: Gradient glow that expands from the center */}
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 group-hover:h-0.5"></span>
                    </ScrollLink>
                  ) : (
                   <RouterLink
  to={item.to}
  onClick={handleClose}
  className="text-gray-200 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10"
>
  {item.label}
</RouterLink>

                    
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="text-cyan-300 border border-cyan-400 bg-transparent hover:bg-cyan-400/20 hover:text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/subscribe")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>

          {/* ✅ Mobile Menu Toggle */}
          <button
            onClick={handleToggle}
            className="lg:hidden flex flex-col space-y-1.5 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* ✅ Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-2 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            {navItems.map((item, i) => (
              <div key={i} className="block">
                {item.type === "scroll" ? (
                  <ScrollLink
                    to={item.to}
                    smooth={true}
                    duration={700}
                    offset={-80}
                    spy={true}
                    onClick={() => handleScrollToSection(item.to)} // Updated to use the unified handler
                    className="text-white hover:text-cyan-300 block px-4 py-2 rounded-lg text-[15px] font-semibold transition-all duration-300 hover:bg-white/10 cursor-pointer" // Added block class and hover:bg
                  >
                    {item.label}
                  </ScrollLink>
                ) : (
                 <RouterLink
  to={item.to}
  onClick={handleClose}
  className="text-gray-200 hover:text-white block px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/10"
>
  {item.label}
</RouterLink>

                )}
              </div>
            ))}
            
            {/* ✅ Mobile Buttons */}
            <div className="flex space-x-3 pt-4 px-4 border-t border-white/10">
              <button
                onClick={() => {
                  handleClose();
                  navigate("/login");
                }}
                className="flex-1 text-cyan-300 border border-cyan-400 hover:bg-cyan-400/20 hover:text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={() => {
                  handleClose();
                  navigate("/subscribe");
                }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;