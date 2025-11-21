import React from "react";
import { motion } from "framer-motion";

// Import industry images
import itImg from "../assets/it2.jpg";
import eduImg from "../assets/education1.jpeg";
import bankingImg from "../assets/bnkng2.jpg";
import healthcareImg from "../assets/hc1.jpeg";
import defenceImg from "../assets/df2.png";
import agricultureImg from "../assets/agri1.png";

const IndustriesSection = () => {
  const industries = [
    { title: "Information Technology", image: itImg },
    { title: "Education", image: eduImg },
    { title: "Finance and Banking", image: bankingImg },
    { title: "Health Care", image: healthcareImg },
    { title: "Defence", image: defenceImg },
    { title: "Agriculture and Allied Activities", image: agricultureImg },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.8, // Slow zoom
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      id="industries"
      className="industries-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.h2 
        className="section-title"
        variants={itemVariants}
      >
        Industries We Serve
      </motion.h2>

      <motion.div 
        className="industries-grid"
        variants={containerVariants}
      >
        {industries.map((industry, index) => (
          <motion.div
            key={index}
            className="industry-card"
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div className="industry-image-container">
              <motion.img 
                src={industry.image} 
                alt={industry.title}
                variants={imageVariants}
                whileHover="hover"
              />
              <div className="industry-overlay" />
            </motion.div>
            
            <div className="industry-content">
              <h3>{industry.title}</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="industry-btn"
              >
                Explore
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default IndustriesSection;