import React, { useState, useEffect } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import "../styles/Navbar.css";
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

  /* ✅ Navigation items - Added Home */
  const navItems = [
    { type: "scroll", to: "hero", label: "Home" },
    { type: "scroll", to: "whatwedo", label: "What We Do" },
    { type: "scroll", to: "services", label: "Services" },
    { type: "scroll", to: "industries", label: "Industries" },
   
    { type: "scroll", to: "alfa", label: "ALFA" },
     { type: "scroll", to: "tech-manthana", label: "Tech Manthana" },
    { type: "scroll", to: "contact", label: "Contact Us" },
  ];

  /* ✅ Smooth scroll handler ONLY for scroll links */
  const handleScrollToSection = (sectionId) => {
    // If NOT on home, go home first ONLY for scroll sections
    if (location.pathname !== "/") {
      navigate("/");
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
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">

        {/* ✅ Logo */}
        <RouterLink to="/" onClick={handleClose}>
          <img src={logo} alt="Logo" className="nav-logo" />
        </RouterLink>

        {/* ✅ Mobile Menu Toggle */}
        <button
          className={`nav-toggle ${isOpen ? "active" : ""}`}
          onClick={handleToggle}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* ✅ Navigation Menu */}
        <ul className={`nav-links ${isOpen ? "open" : ""}`} id="main-nav-links">
          {navItems.map((item, i) => (
            <li key={i}>
              {item.type === "scroll" ? (
                /* ✅ Scroll Link */
                <ScrollLink
                  to={item.to}
                  smooth={true}
                  duration={700}
                  offset={-80}
                  spy={true}
                  onClick={() => {
                    handleClose();
                    handleScrollToSection(item.to);
                  }}
                >
                  {item.label}
                </ScrollLink>
              ) : (
                /* ✅ Page Link (opens directly now) */
                <RouterLink
                  to={item.path}
                  onClick={() => {
                    handleClose();
                  }}
                >
                  {item.label}
                </RouterLink>
              )}
            </li>
          ))}

          {/* ✅ Login Button */}
          <li>
            <button
              className="login-btn"
              onClick={() => {
                handleClose();
                navigate("/login");
              }}
            >
              Login
            </button>
          </li>

          {/* ✅ Subscribe Button */}
          <li>
            <button
              className="subscribe-btn"
              onClick={() => {
                handleClose();
                navigate("/subscribe");
              }}
            >
              Subscribe
            </button>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Header;