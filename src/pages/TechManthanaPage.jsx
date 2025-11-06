import React, { useState } from "react";
import "../styles/TechManthana.css";
import {
  FaCheckSquare,
  FaGraduationCap,
  FaProjectDiagram,
  FaUserTie,
  FaUsers,
  FaCogs,
  FaChartLine,
  FaInfinity,
  FaFileAlt,
  FaVideo,
  FaFolderOpen
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext"; // ✅ Auth hook
import { useNavigate } from "react-router-dom";   // ✅ Redirect

import { motion, AnimatePresence } from "framer-motion"; // ✅ For modal animation

const TechManthanaPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // ✅ Click handler for plan cards
  const handlePlanClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // ✅ Add logic for paid/free access later if needed
    console.log("User accessed a plan!");
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate("/login");
  };

  return (
    <div className="techmanthana-container">
      
      {/* ✅ LEFT SECTION */}
      <div className="left-section">
        <h2 className="brand-title">TECH MANTHANA</h2>
        <p className="brand-subtitle">Upskilling and Outsourcing</p>

        <h1 className="main-heading">Talent That Evolves</h1>
        <p className="description">
          <strong>Tech Manthana</strong> is our initiative to upskill talent and offer strategic outsourcing:
        </p>

        <ul className="features-list">
          <li><FaGraduationCap className="icon" /> Hands-on bootcamps & certifications</li>
          <li><FaProjectDiagram className="icon" /> Project-based learning & mentorship</li>
          <li><FaUserTie className="icon" /> Placement support & career mapping</li>
        </ul>

        <p className="extra-info">
          We also provide skilled teams for outsourced development, support, and innovation.
        </p>

        <h3 className="company-name">Neutill Services Private Limited</h3>
      </div>

      {/* ✅ RIGHT SECTION */}
      <div className="right-section">
        <h1 className="right-heading">Build, Train, Deploy</h1>

        <div className="right-grid">
          <div className="right-item"><FaUsers className="icon yellow" /> Dedicated teams & managed services</div>
          <div className="right-item"><FaInfinity className="icon purple" /> Flexible engagement models</div>
          <div className="right-item"><FaCogs className="icon blue" /> Domain-specific expertise (AI, Cloud, IoT)</div>
          <div className="right-item"><FaChartLine className="icon yellow" /> Continuous learning & performance tracking</div>
        </div>

        <p className="highlight-text">
          Tech Manthana is where talent meets transformation.
        </p>

        {/* ✅ PLANS WITH LOGIN CHECK */}
        <div className="plans">
          <div className="plan-card free" onClick={handlePlanClick}>
            <h4>Free Access</h4>
            <FaFileAlt className="plan-icon" />
            <p>PDF (Learning Path)</p>
          </div>

          <div className="plan-card premium" onClick={handlePlanClick}>
            <h4>Premium Access</h4>
            <FaVideo className="plan-icon" />
            <p>PDF, Lecture Tutor (Video)</p>
          </div>

          <div className="plan-card platinum" onClick={handlePlanClick}>
            <h4>Platinum Access</h4>
            <FaFolderOpen className="plan-icon" />
            <p>Premium + Hands-on Projects</p>
          </div>
        </div>
      </div>

      {/* ✅ LOGIN MODAL (Same as ALFA Section) */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            className="login-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="login-modal"
              initial={{ scale: 0.8, y: -50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              <h3>🔒 Login Required</h3>
              <p>Please log in to access Tech Manthana content.</p>

              <div className="modal-buttons">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="login-btn"
                  onClick={handleLoginRedirect}
                >
                  Login Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="cancel-btn"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TechManthanaPage;
