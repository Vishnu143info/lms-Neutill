import React from "react";
import "../styles/TechManthana.css";
import { useNavigate } from "react-router-dom";

import {
  FaGraduationCap,
  FaProjectDiagram,
  FaUserTie,
  FaUsers,
  FaInfinity,
  FaCogs,
  FaChartLine,
  FaFileAlt,
  FaVideo,
  FaFolderOpen
} from "react-icons/fa";

const TechManthanaPage = () => {
 
  const navigate = useNavigate();

const handleNavigate = () => {
  navigate("/tech-manthana/blog");
};


  return (
    <div
  className="techmanthana-container"
  onClick={handleNavigate}
  style={{ cursor: "pointer" }}
>


      {/* LEFT SECTION */}
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
          We also provide skilled teams for outsourced development, support and innovation.
        </p>

        <h3 className="company-name">Neutill Services Private Limited</h3>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <h1 className="right-heading">Build, Train, Deploy</h1>

        <div className="right-grid">
  <div className="right-item" onClick={handleNavigate}>
    <FaUsers className="icon yellow" /> Dedicated teams & managed services
  </div>

  <div className="right-item" onClick={handleNavigate}>
    <FaInfinity className="icon purple" /> Flexible engagement models
  </div>

  <div className="right-item" onClick={handleNavigate}>
    <FaCogs className="icon blue" /> Domain-specific expertise (AI, Cloud, IoT)
  </div>

  <div className="right-item" onClick={handleNavigate}>
    <FaChartLine className="icon yellow" /> Continuous learning & performance tracking
  </div>
</div>


        <p className="highlight-text">
          Tech Manthana is where talent meets transformation.
        </p>

        {/* PLAN CARDS */}
<div className="plans">
  <div className="plan-card free" onClick={handleNavigate}>
    <h4>Free Access</h4>
    <FaFileAlt className="plan-icon" />
    <p>PDF Learning Path</p>
  </div>

  <div className="plan-card premium featured" onClick={handleNavigate}>
    <h4>Basic Access</h4>
    <FaVideo className="plan-icon" />
    <p>PDF + Video Tutor</p>
    <span className="badge">Most Popular</span>
  </div>

  <div className="plan-card platinum" onClick={handleNavigate}>
    <h4>Premium Access</h4>
    <FaFolderOpen className="plan-icon" />
    <p>Premium + Hands-on Projects</p>
  </div>
</div>



        {/* ⭐ EXPLORE MORE BUTTON */}
        <button
          className="explore-btn"
          onClick={() => navigate("/tech-manthana/blog")}
        >
          Explore More
        </button>

      </div>

    </div>
  );
};

export default TechManthanaPage;
