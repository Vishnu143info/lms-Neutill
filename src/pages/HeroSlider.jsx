import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/HeroSlide.css"
import img1 from "../assets/hero.png"
import img2 from "../assets/whatwedo.png"
import img3 from "../assets/services animation.jpg"
import img4 from "../assets/industries.png"
import img5  from "../assets/alfa1.png"
import img6 from "../assets/tm.png"

const slides = [
     {
    title: "Neutill",
    desc: "At Neutill Services Private Limited, we innovate to accelerate progress towards the Sustainable Development Goals. Together, we are not just building solutions, we are shaping a sustainable future.",
    img: img1,
    link: "#neutill",
    gradient: "from-violet-500 to-purple-600"
  },
  {
    title: "What We Do",
    desc: "We provide cutting-edge digital solutions for modern challenges through innovative technology and strategic thinking.",
    img: img2,
    link: "#whatwedo",
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    title: "Services",
    desc: "Explore our advanced technology services in Cloud technology, Generative AI and ML, Internet of things , content management and public relations, Logistics and marketing, upskilling and outsourcing designed for exponential growth and digital transformation.",
    img: img3,
    link: "#services",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Industries",
    desc: "Transforming industries with innovative digital ecosystems and future-ready solutions.",
    img: img4,
    link: "#industries",
    gradient: "from-teal-400 to-cyan-500"
  },
  {
    title: "ALFA Platform",
    desc: "ALFA provides the essential guardrails for meaningful innovation. By integrating elite data management with strict AI policy enforcement, we empower users to leverage generative AI technology as a strategic asset. With ALFA, AI is no longer a dependency—it is a sustainable partner in professional excellence.",
    img: img5,
    link: "#alfa",
    gradient: "from-amber-400 to-orange-500"
  },
  {
    title: "Tech Manthana",
    desc: "Through digital magazine We churn the raw potential of emerging technologies into intelligent applications and products that serve the greater good of society. we believe that collaboration is the cornerstone of progress. we actively partner with students, professionals, universities, startups, and multinational corporations—building a vibrant ecosystem of shared knowledge and mutual growth. ",
    img: img6,
    link: "#tech-manthana",
    gradient: "from-emerald-400 to-green-500"
  },
 
];

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (i) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [index]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9
    })
  };

  const textVariants = {
    enter: {
      y: 50,
      opacity: 0
    },
    center: {
      y: 0,
      opacity: 1
    },
    exit: {
      y: -50,
      opacity: 0
    }
  };

  return (
    <div className="hero-slider-container ">
      {/* Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="slider-left">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={slides[index].img}
            className="image-container"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
          >
            <img
              src={slides[index].img}
              className="slider-image"
              alt={slides[index].title}
            />
            {/* Image Overlay Gradient */}
            <div className={`image-gradient ${slides[index].gradient}`}></div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <button 
          className="slide-btn left" 
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <motion.span
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ‹
          </motion.span>
        </button>
        <button 
          className="slide-btn right" 
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <motion.span
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ›
          </motion.span>
        </button>

        {/* Progress Bar */}
        <div className="progress-bar">
         
        </div>

        {/* Dots */}
        <div className="slider-dots">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => goToSlide(i)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {i === index && (
                <motion.div
                  className="dot-pulse"
                  layoutId="activeDot"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="slider-right">
        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[index].title}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.h1 
                className="slider-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {slides[index].title}
                <motion.span 
                  className="title-underline"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </motion.h1>

              <motion.p
                className="slider-desc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {slides[index].desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.a
                  href={slides[index].link}
                  className="slider-btn"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(0, 234, 255, 0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Explore {slides[index].title}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.a>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Counter */}
          <div className="slide-counter">
            <span className="current-slide">0{index + 1}</span>
            <span className="total-slides">/0{slides.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;