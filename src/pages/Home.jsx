import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import ALFASection from "./Alfa/ALFASection";
import TechManthanaPage from "./TechManthanaPage";
import ContactUs from "./ContactUs";
import WhatWeDo from "./WhatWeDo";

import cloudImg from "../assets/cl.png";
import aiImg from "../assets/aiml2.png";
import genaiImg from "../assets/genaii.png";
import iotImg from "../assets/iot1.png";
import researchImg from "../assets/outsourcing2.jpeg";
import alfaImg from "../assets/education1.jpeg";
import contentImg from "../assets/cm1.png";
import marketingImg from "../assets/logi1.png";
import techn from "../assets/talent.png";

import itImg from "../assets/it2.jpg";
import eduImg from "../assets/education1.jpeg";
import bankingImg from "../assets/bnkng2.jpg";
import healthcareImg from "../assets/hc1.jpeg";
import defenceImg from "../assets/df2.png";
import agricultureImg from "../assets/agri1.png";

// Simplified Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { 
    y: 50, 
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 12,
      duration: 0.8
    }
  }
};

const cardVariants = {
  hidden: { 
    y: 40, 
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 12,
      duration: 0.6
    }
  },
  hover: {
    y: -10,
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

const floatingVariants = {
  floating: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const textGlowVariants = {
  glow: {
    textShadow: [
      "0 0 20px rgba(0, 234, 255, 0.5)",
      "0 0 30px rgba(143, 101, 255, 0.6)",
      "0 0 20px rgba(0, 234, 255, 0.5)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const backgroundVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const Home = () => {
const allServices = [
  { 
    title: "Cloud Consulting", 
    image: cloudImg,
    description: "Scalable cloud solutions for modern businesses",
    icon: "☁️",
    color: "#00eaff"
  },
  { 
    title: "AI & Machine Learning", 
    image: aiImg,
    description: "Intelligent systems that learn and adapt",
    icon: "🤖",
    color: "#8f65ff"
  },
  { 
    title: "Generative AI", 
    image: genaiImg,
    description: "Creative AI solutions for innovation",
    icon: "✨",
    color: "#ff6b6b"
  },
  { 
    title: "Internet of Things", 
    image: iotImg,
    description: "Connect and automate your world",
    icon: "🌐",
    color: "#00ff88"
  },
  { 
    title: "ALFA Platform", 
    image: alfaImg,
    description: "Comprehensive educational ecosystem",
    icon: "🎓",
    color: "#ffd93d"
  },
  { 
    title: "Supply Chain & Logistics", 
    image: marketingImg,
    description: "Optimized marketing and logistics",
    icon: "🚚",
    color: "#00b894"
  },
  { 
    title: "Upskilling & Outsourcing", 
    image: techn,
    description: "Tech Manthana - Innovation hub",
    icon: "💡",
    color: "#e17055"
  },
  { 
    title: "Content Management", 
    image: contentImg,
    description: "Strategic content and PR solutions",
    icon: "📝",
    color: "#fd79a8"
  },
  { 
    title: "Research & Development", 
    image: researchImg,
    description: "Cutting-edge technology research",
    icon: "🔬",
    color: "#6c5ce7"
  },
];


  const industries = [
    { 
      title: "Information Technology", 
      image: itImg,
      description: "Digital transformation and IT solutions",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      stats: "+48%"
    },
    { 
      title: "Education", 
      image: eduImg,
      description: "Modern learning platforms and tools",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      stats: "+52%"
    },
    { 
      title: "Finance & Banking", 
      image: bankingImg,
      description: "Secure financial technology solutions",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      stats: "+45%"
    },
    { 
      title: "Health Care", 
      image: healthcareImg,
      description: "Healthcare innovation and technology",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      stats: "+61%"
    },
    { 
      title: "Defence", 
      image: defenceImg,
      description: "Secure defence technology systems",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      stats: "+38%"
    },
    { 
      title: "Agriculture", 
      image: agricultureImg,
      description: "Smart farming and agricultural tech",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      stats: "+55%"
    },
  ];

  const heroButtons = [
    { label: "Services", target: "#services", icon: "🚀" },
    { label: "Industries", target: "#industries", icon: "🏢" },
    { label: "ALFA Platform", target: "#alfa", icon: "🎓" },
    { label: "Tech Manthana", target: "#tech-manthana", icon: "💡" },
    { label: "What We Do", target: "#whatwedo", icon: "🔍" },
    { label: "Contact", target: "#contact", icon: "📞" }
  ];

  // Navigation function
  const scrollToSection = (target) => {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Create refs for section animations
  const servicesRef = useRef(null);
  const industriesRef = useRef(null);
  const isServicesInView = useInView(servicesRef, { once: true, margin: "-50px" });
  const isIndustriesInView = useInView(industriesRef, { once: true, margin: "-50px" });

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="main-container"
    >
      
      {/* 🌟 ENHANCED HERO SECTION */}
      <motion.section 
        className="hero-enhanced"
        id="hero"
        variants={containerVariants}
      >
        {/* Simplified Background */}
        <motion.div
          className="hero-bg-enhanced"
          variants={backgroundVariants}
          animate="animate"
        />

        {/* Floating Shapes */}
        <motion.div 
          className="floating-shapes"
          variants={floatingVariants}
          animate="floating"
        >
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </motion.div>
        

        <motion.div
          className="hero-content"
          variants={itemVariants}
        >
          <motion.div
            variants={pulseVariants}
            animate="pulse"
            className="title-container"
          >
            <motion.h1
              className="hero-title-enhanced"
              variants={textGlowVariants}
              animate="glow"
            >
              NEUTILL
            </motion.h1>
            <motion.div
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Igniting Minds, Empowering Future
            </motion.div>
          </motion.div>

          <motion.p
            className="hero-text-enhanced"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.8, 
              duration: 0.8,
            }}
          >
            We blend innovation, intelligence, and human empathy to create digital
            ecosystems that transform industries and empower the future.
          </motion.p>

           <motion.button
              whileHover={{
                scale: 1.05,
                background: "linear-gradient(90deg, #00ffff, #8f65ff)",
                boxShadow: "0 0 30px rgba(0,234,255,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              className="hero-btn-primary"
            >
              Explore Our Solutions
            </motion.button>

          {/* 6 Navigation Buttons */}
          <motion.div
            className="hero-navigation-buttons"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {heroButtons.map((button, index) => (
              <motion.button
                key={index}
                onClick={() => scrollToSection(button.target)}
                whileHover={{
                  scale: 1.05,
                  background: "linear-gradient(90deg, #00ffff, #8f65ff)",
                  boxShadow: "0 0 30px rgba(0,234,255,0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                className="nav-btn"
              >
                <span className="nav-btn-icon">{button.icon}</span>
                {/* <span className="nav-btn-text">{button.label}</span> */}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
           
            
            {/* <motion.button
              whileHover={{
                scale: 1.05,
                borderColor: "#8f65ff",
                boxShadow: "0 0 20px rgba(143, 101, 255, 0.4)"
              }}
              className="hero-btn-secondary"
            >
              Watch Demo
            </motion.button> */}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        {/* <motion.div 
          className="scroll-indicator"
          animate={{ 
            y: [0, 8, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="scroll-arrow"></div>
        </motion.div> */}
      </motion.section>

      {/* WHAT WE DO */}
      <motion.section 
        id="whatwedo"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="section-enhanced"
      >
        <WhatWeDo />
      </motion.section>

   {/* 💫 ENHANCED SERVICES SECTION */}
<motion.section
  ref={servicesRef}
  id="services"
  className="services-section-magical"
  initial="hidden"
  animate={isServicesInView ? "visible" : "hidden"}
  variants={containerVariants}
>
  <div className="services-container-magical">
    <motion.div 
      className="services-header-magical"
      variants={itemVariants}
    >
      <motion.h2 
        className="section-title-magical"
        variants={textGlowVariants}
        animate="glow"
      >
        Our Core Services
      </motion.h2>
      <motion.p 
        className="section-subtitle-magical"
        variants={itemVariants}
      >
        Innovative solutions tailored to drive your business forward with cutting-edge technology
      </motion.p>
    </motion.div>

    <motion.div 
      className="services-grid-magical"
      variants={staggerContainer}
    >
      {allServices.map((service, index) => {
        // Create URL-friendly ID for routing
        const serviceId = service.title.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <motion.div
            key={index}
            className="service-card-magical"
            variants={cardVariants}
            whileHover="hover"
            custom={index}
            style={{ '--service-color': service.color }}
          >
            <div className="service-card-inner-magical">
              {/* Service Image */}
              <motion.div 
                className="service-image-container"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <img src={service.image} alt={service.title} />
                <div className="service-image-overlay"></div>
              </motion.div>

              {/* Animated Icon */}
              <motion.div 
                className="service-icon-magical"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {service.icon}
              </motion.div>

              {/* Content */}
              <div className="service-content-magical">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                
                {/* Updated Button with Link */}
                <Link to={`/services/${serviceId}`} className="service-link">
                  <motion.button 
                    className="service-cta-magical"
                    whileHover={{ 
                      scale: 1.05, 
                      background: service.color,
                      boxShadow: `0 0 20px ${service.color}40`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Discover</span>
                    <span>→</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  </div>
</motion.section>


{/* 🚀 ENHANCED INDUSTRIES SECTION */}
<motion.section
  ref={industriesRef}
  id="industries"
  className="industries-section-magical"
  initial="hidden"
  animate={isIndustriesInView ? "visible" : "hidden"}
  variants={containerVariants}
>
  <div className="industries-container-magical">
    <motion.div 
      className="industries-header-magical"
      variants={itemVariants}
    >
      <motion.h2 
        className="section-title-magical"
        variants={textGlowVariants}
        animate="glow"
      >
        Industries We Transform
      </motion.h2>
      <motion.p 
        className="section-subtitle-magical"
        variants={itemVariants}
      >
        Driving digital transformation across diverse sectors with tailored solutions
      </motion.p>
    </motion.div>

    <motion.div 
      className="industries-grid-magical"
      variants={staggerContainer}
    >
      {industries.map((industry, index) => {
        // Create URL-friendly ID for routing
        const industryId = industry.title.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <motion.div
            key={index}
            className="industry-card-magical"
            variants={cardVariants}
            whileHover="hover"
            custom={index}
            style={{ '--industry-gradient': industry.gradient }}
          >
            <div className="industry-card-inner-magical">
              {/* Animated Image Container */}
              <motion.div 
                className="industry-image-container-magical"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <img src={industry.image} alt={industry.title} />
                <div 
                  className="industry-overlay-magical"
                  style={{ background: industry.gradient }}
                ></div>
              </motion.div>

              {/* Floating Stats */}
              <motion.div 
                className="industry-stats-magical"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <span>{industry.stats}</span>
                <small>Growth</small>
              </motion.div>

              {/* Content */}
              <div className="industry-content-magical">
                <h3>{industry.title}</h3>
                <p>{industry.description}</p>
                
                {/* Add Explore Button with Link */}
                <Link to={`/industries/${industryId}`} className="industry-link">
                  <motion.button 
                    className="industry-cta-magical"
                    whileHover={{ 
                      scale: 1.05,
                      background: `linear-gradient(135deg, ${industry.gradient})`,
                      boxShadow: "0 0 20px rgba(255,255,255,0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Solutions
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  </div>
</motion.section>
      {/* 🌟 ENHANCED ALFA PLATFORM */}
      <motion.section
        id="alfa"
        className="platform-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.h2 
          className="section-title-platform"
          variants={textGlowVariants}
          animate="glow"
        >
          ALFA Platform
        </motion.h2>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
          className="platform-container-magical"
        >
          <ALFASection />
        </motion.div>
      </motion.section>

      {/* ✨ ENHANCED TECH MANTHANA */}
      <motion.section
        id="tech-manthana"
        className="platform-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.h2 
          className="section-title-platform"
          variants={textGlowVariants}
          animate="glow"
        >
          Tech Manthana
        </motion.h2>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
          className="platform-container-magical"
        >
          <TechManthanaPage />
        </motion.div>
      </motion.section>

      {/* 🌈 ENHANCED CONTACT */}
      <motion.section
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="contact-section-magical"
      >
        <ContactUs />
      </motion.section>

    </motion.div>
  );
};

export default Home;