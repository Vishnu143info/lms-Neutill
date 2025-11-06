import React from "react";
import { motion } from "framer-motion";
import { FaLightbulb, FaUsers, FaBrain, FaRocket } from "react-icons/fa";

export default function WhatWeDo() {
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2 },
    }),
  };

  const items = [
    {
      icon: <FaLightbulb size={40} color="#0066ff" />,
      title: "Innovation Into Impact",
      text:
        "Neutill Services Private Limited is a purpose-driven technology services company committed to transforming innovation into impact. We convert emerging technologies into intelligent applications and solutions that serve society.",
    },
    {
      icon: <FaUsers size={40} color="#8f65ff" />,
      title: "Collaboration for Progress",
      text:
        "We believe collaboration is the cornerstone of progress. We actively partner with students, professionals, universities, startups, and multinational corporations—building a vibrant ecosystem of shared knowledge and mutual growth.",
    },
    {
      icon: <FaBrain size={40} color="#00c2ff" />,
      title: "Research-Driven Culture",
      text:
        "At our core, we foster a culture of research. Continuous learning is essential to achieving research-oriented outcomes and nurturing the growth of individuals and institutions.",
    },
    {
      icon: <FaRocket size={40} color="#ff6ec7" />,
      title: "Empowering the AI Future",
      text:
        "We ensure that both talent and technology are empowered to fuel the new era of artificial intelligence. Together, we are shaping a future built on innovation and responsibility.",
    },
  ];

  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(135deg, #eef4ff, #f7faff)",
        paddingTop: "100px",
        paddingBottom: "100px",
        textAlign: "center",
      }}
    >
      {/* ✅ TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="fw-bold mb-4"
        style={{
          fontSize: "3rem",
          background: "linear-gradient(90deg, #0066ff, #6600ff, #00e1ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        What We Do
      </motion.h1>

      {/* ✅ 2×2 GRID */}
      <div
        className="wwd-grid container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "30px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="wwd-card"
            style={{
              padding: "30px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
            }}
          >
            <div className="mb-3">{item.icon}</div>
            <h3 className="fw-bold mb-2">{item.title}</h3>
            <p className="text-muted">{item.text}</p>
          </motion.div>
        ))}
      </div>

      {/* ✅ Card Hover Styling */}
      <style>{`
        .wwd-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 35px rgba(0, 123, 255, 0.25);
          border-color: rgba(0,123,255,0.25);
        }

        /* ✅ 1 CARD PER ROW ON MOBILE */
        @media (max-width: 768px) {
          .wwd-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
