import React from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";
import ALFASection from "../pages/ALFASection";
import TechManthanaPage from "./TechManthanaPage";
import ContactUs from "./ContactUs";
import WhatWeDo from "./WhatWeDo";
// ✅ Import service images
import cloudImg from "../assets/cl.png";
import aiImg from "../assets/aiml2.png";
import genaiImg from "../assets/genaii.png";
import iotImg from "../assets/iot1.png";
import researchImg from "../assets/outsourcing2.jpeg";
import alfaImg from "../assets/education1.jpeg";
import contentImg from "../assets/cm1.png";
import marketingImg from "../assets/logi1.png";
import techn from "../assets/talent.png";

// ✅ Import industry images
import itImg from "../assets/it2.jpg";
import eduImg from "../assets/education1.jpeg";
import bankingImg from "../assets/bnkng2.jpg";
import healthcareImg from "../assets/hc1.jpeg";
import defenceImg from "../assets/df2.png";
import agricultureImg from "../assets/agri1.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 80 } },
};

const Home = () => {
  const allServices = [
    { title: "Cloud Consulting", image: cloudImg },
    { title: "AI & Machine Learning", image: aiImg },
    { title: "Internet of Things (IoT)", image: iotImg },
    { title: "Generative AI & AI Agents", image: genaiImg },
    { title: "ALFA Platform", image: alfaImg },
    { title: "Research & Development", image: researchImg },
    { title: "Content Management & PR", image: contentImg },
    { title: "Marketing & Supply Chain", image: marketingImg },
    { title: "Tech Manthana", image: techn },
  ];

  const industries = [
    { title: "Information Technology", image: itImg },
    { title: "Education", image: eduImg },
    { title: "Finance and Banking", image: bankingImg },
    { title: "Health Care", image: healthcareImg },
    { title: "Defence", image: defenceImg },
    { title: "Agriculture and Allied Activities", image: agricultureImg },
  ];

  return (
    
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* 🌌 HERO SECTION */}
      <motion.section className="hero" variants={itemVariants}>
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="hero-bg"
        />

        <div className="particles">
          {[...Array(12)].map((_, i) => (
            <motion.span
              key={i}
              className="particle"
              animate={{
                y: [0, -25, 0],
                x: [0, 15, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-title"
        >
          NEUTILL: Igniting Minds, Empowering Future
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="hero-text"
        >
          We blend innovation, intelligence, and human empathy to create digital
          ecosystems that transform industries and empower the future.
        </motion.p>

        <motion.button
          whileHover={{
            scale: 1.15,
            background: "linear-gradient(90deg, #00ffff, #8f65ff, #00ffff)",
            boxShadow: "0 0 30px rgba(0,234,255,0.9)",
          }}
          whileTap={{ scale: 0.95 }}
          className="hero-btn"
        >
          Get Started
        </motion.button>
      </motion.section>

<motion.section id="whatwedo">
  <WhatWeDo/>
</motion.section>

      {/* 💡 Services Section */}
      <motion.section
        id="services"
        className="service-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h2 className="service-heading" variants={itemVariants}>
          Our Core Services
        </motion.h2>

        <motion.div className="service-grid" variants={containerVariants}>
          {allServices.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              variants={itemVariants}
              whileHover={{
                scale: 1.08,
                rotate: Math.random() > 0.5 ? 1.5 : -1.5,
                boxShadow: "0 0 40px rgba(0,170,255,0.4)",
              }}
              transition={{ type: "spring", stiffness: 150, damping: 12 }}
            >
              <img src={service.image} alt={service.title} />
              <motion.div
                className="overlay"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {service.title}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 🏭 Industries Section */}
      <motion.section
        id="industries"
        className="industries-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h2 className="industries-title" variants={itemVariants}>
          Industries
        </motion.h2>

        <div className="industries-grid">
          {industries.map((ind, i) => (
            <motion.div
              key={i}
              className="industry-card"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 35px rgba(0, 170, 255, 0.4)",
              }}
            >
              <img src={ind.image} alt={ind.title} />
              <div className="industry-label">{ind.title}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      {/* 🌟 ALFA Section (Centered with Gradient Heading) */}
<motion.div
  className="alfa-wrapper"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
  viewport={{ once: true }}
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    marginTop: "100px",
    marginBottom: "100px",
  }}
>
  <h2
    style={{
      fontSize: "2.5rem",
      fontWeight: "700",
      background: "linear-gradient(90deg, #ff6ec7, #8f65ff, #00ffff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "40px",
      textTransform: "uppercase",
      letterSpacing: "2px",
    }}
  >
    ALFA Platform
  </h2>

  <motion.div
    whileHover={{
      scale: 1.03,
      boxShadow: "0 0 40px rgba(0,170,255,0.3)",
    }}
    transition={{ duration: 0.4 }}
    style={{
      borderRadius: "20px",
      overflow: "hidden",
      width: "90%",
      maxWidth: "1200px",
      
    }}
  >
    <ALFASection />
  </motion.div>
</motion.div>

     {/* ✨ Tech Manthana Section (Centered with Animation) */}
<motion.div
  className="techmanthana-wrapper"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
  viewport={{ once: true }}
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    marginTop: "100px",
    marginBottom: "100px",
  }}
>
  <h2
    style={{
      fontSize: "2.5rem",
      fontWeight: "700",
      background: "linear-gradient(90deg, #00ffff, #8f65ff, #00ffff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "40px",
      textTransform: "uppercase",
      letterSpacing: "2px",
    }}
  >
    Tech Manthana
  </h2>

  <motion.div
    whileHover={{
      scale: 1.03,
      boxShadow: "0 0 40px rgba(0,170,255,0.3)",
    }}
    transition={{ duration: 0.4 }}
    style={{
      borderRadius: "20px",
      overflow: "hidden",
      width: "90%",
      maxWidth: "1200px",
    }}
  >
    <TechManthanaPage />
   
  </motion.div>
   
</motion.div>
<motion.div id="contact">
<ContactUs/>
</motion.div>
 
    </motion.div>
   


    
  );
};

export default Home;
