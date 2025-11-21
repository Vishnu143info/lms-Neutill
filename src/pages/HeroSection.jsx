import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.section 
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background Gradient */}
      <motion.div
        className="hero-bg"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15, 
          ease: "linear" 
        }}
      />

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="particle"
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div className="hero-content">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          NEUTILL: Igniting Minds, Empowering Future
        </motion.h1>

        <motion.p
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          We blend innovation, intelligence, and human empathy to create digital
          ecosystems that transform industries and empower the future.
        </motion.p>

        <motion.button
          className="hero-btn"
          whileHover={{
            scale: 1.05,
            background: "linear-gradient(90deg, #00ffff, #8f65ff, #00ffff)",
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;