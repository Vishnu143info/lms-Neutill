import React from "react";
import { motion } from "framer-motion";
import { FaLightbulb, FaUsers, FaBrain, FaRocket, FaStar } from "react-icons/fa";

export default function WhatWeDo() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -15,
      scale: 1.03,
      boxShadow: "0 25px 50px rgba(0, 123, 255, 0.3), 0 0 80px rgba(143, 101, 255, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.6
      }
    }
  };

  const items = [
    {
      icon: <FaLightbulb size={50} />,
      title: "Innovation Into Impact",
      text: "Neutill Services Private Limited is committed to turning emerging technologies into intelligent, impactful real-world applications.",
      gradient: "linear-gradient(135deg, #0066ff, #00ccff)",
      glow: "rgba(0, 102, 255, 0.4)",
      stars: 3
    },
    {
      icon: <FaUsers size={50} />,
      title: "Collaboration for Progress",
      text: "We partner with students, professionals, universities, startups, and corporations to build a vibrant ecosystem of shared innovation.",
      gradient: "linear-gradient(135deg, #8f65ff, #d164ff)",
      glow: "rgba(143, 101, 255, 0.4)",
      stars: 4
    },
    {
      icon: <FaBrain size={50} />,
      title: "Research-Driven Culture",
      text: "Our research culture drives continuous learning, enabling transformative outcomes for individuals and institutions.",
      gradient: "linear-gradient(135deg, #00c2ff, #00ffcc)",
      glow: "rgba(0, 194, 255, 0.4)",
      stars: 5
    },
    {
      icon: <FaRocket size={50} />,
      title: "Empowering the AI Future",
      text: "We ensure both talent and technology are equipped to power the next era of responsible, intelligent AI innovation.",
      gradient: "linear-gradient(135deg, #ff6ec7, #ff8a00)",
      glow: "rgba(255, 110, 199, 0.4)",
      stars: 4
    },
  ];

  const renderStars = (count) => {
    return [...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="floating-star"
        animate={{
          y: [0, -10, 0],
          opacity: [0.5, 1, 0.5],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
        style={{
          position: "absolute",
          fontSize: "8px",
          color: "gold",
        }}
      >
        <FaStar />
      </motion.div>
    ));
  };

  return (
    <section
      className="what-we-do-section"
      style={{
        background: "linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 50%, #f8fbff 100%)",
        paddingTop: "120px",
        paddingBottom: "120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div className="background-elements">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-shape"
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              background: "linear-gradient(45deg, #0066ff, #8f65ff)",
              borderRadius: "50%",
              opacity: 0.3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <motion.div
        className="container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Enhanced Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <motion.div
            className="title-decoration"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              fontSize: "4rem",
              marginBottom: "1rem",
              background: "linear-gradient(45deg, #0066ff, #8f65ff, #ff6ec7)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "900",
              textShadow: "0 10px 30px rgba(0, 102, 255, 0.3)",
            }}
          >
            What We Do
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontSize: "1.3rem",
              color: "#64748b",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.7",
              fontWeight: "500",
            }}
          >
            Transforming ideas into impactful solutions through innovation, collaboration, and cutting-edge technology
          </motion.p>
        </motion.div>

        {/* Enhanced Grid */}
        <div
          className="wwd-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "40px",
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="wwd-card"
              style={{
                padding: "45px 35px",
                borderRadius: "25px",
                background: "linear-gradient(145deg, #ffffff, #f8faff)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: `
                  0 10px 30px rgba(0, 0, 0, 0.08),
                  0 1px 0 rgba(255, 255, 255, 0.9) inset,
                  0 -1px 0 rgba(0, 0, 0, 0.05) inset
                `,
                position: "relative",
                overflow: "hidden",
                transformStyle: "preserve-3d",
              }}
              custom={index}
            >
              {/* Animated Border */}
              <div
                className="card-border"
                style={{
                  position: "absolute",
                  inset: "0",
                  borderRadius: "25px",
                  padding: "2px",
                  background: item.gradient,
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                }}
              />
              
              {/* Floating Stars */}
              <div className="stars-container">
                {renderStars(item.stars)}
              </div>

              {/* Icon Container */}
              <motion.div
                variants={iconVariants}
                className="icon-container"
                style={{
                  marginBottom: "25px",
                  display: "inline-flex",
                  padding: "20px",
                  borderRadius: "20px",
                  background: `linear-gradient(135deg, ${item.gradient})`,
                  boxShadow: `0 10px 30px ${item.glow}`,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div style={{ color: "white" }}>
                  {item.icon}
                </div>
                
                {/* Icon Glow Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    inset: "0",
                    borderRadius: "20px",
                    background: item.gradient,
                    filter: "blur(15px)",
                    opacity: 0.6,
                    zIndex: -1,
                  }}
                />
              </motion.div>

              {/* Content */}
              <motion.h3
                style={{
                  fontWeight: "800",
                  marginBottom: "15px",
                  background: item.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "1.5rem",
                  lineHeight: "1.3",
                }}
              >
                {item.title}
              </motion.h3>

              <motion.p 
                style={{ 
                  color: "#4a5568", 
                  lineHeight: "1.7", 
                  fontSize: "1.05rem",
                  fontWeight: "500",
                }}
              >
                {item.text}
              </motion.p>

              {/* Hover Glow Effect */}
              <motion.div
                className="hover-glow"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: "absolute",
                  inset: "0",
                  borderRadius: "25px",
                  background: item.gradient,
                  filter: "blur(30px)",
                  opacity: 0,
                  zIndex: -1,
                  transition: "opacity 0.4s ease",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            textAlign: "center",
            marginTop: "60px",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              display: "inline-block",
              fontSize: "2rem",
              background: "linear-gradient(45deg, #0066ff, #8f65ff, #ff6ec7)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <FaStar />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Responsive Styles */}
      <style jsx>{`
        .wwd-card:hover .card-border {
          opacity: 1 !important;
        }
        
        @media (max-width: 968px) {
          .wwd-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          
          .wwd-card {
            padding: 35px 25px !important;
          }
        }
        
        @media (max-width: 480px) {
          .title-decoration {
            font-size: 3rem !important;
          }
          
          .wwd-card {
            padding: 25px 20px !important;
          }
        }
        
        .floating-star:nth-child(1) { top: 10%; left: 10%; }
        .floating-star:nth-child(2) { top: 20%; right: 15%; }
        .floating-star:nth-child(3) { bottom: 30%; left: 20%; }
        .floating-star:nth-child(4) { bottom: 15%; right: 25%; }
        .floating-star:nth-child(5) { top: 40%; left: 30%; }
      `}</style>
    </section>
  );
}