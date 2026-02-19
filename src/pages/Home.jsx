import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../styles/Home.css";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


import {
  Cloud,
  BrainCircuit,
  Sparkles,
  Wifi,
  GraduationCap,
  Truck,
  Lightbulb,
  FileText,
  FlaskConical,
} from "lucide-react";

import { CloudCog } from "lucide-react";



import ALFASection from "./Alfa/ALFASection";
import TechManthanaPage from "./TechManthanaPage";
import ContactUs from "./ContactUs";
import WhatWeDo from "./WhatWeDo";

// Images
import cloudImg from "../assets/cl.png";
import aiImg from "../assets/aiml2.png";
import genaiImg from "../assets/genaii.png";
import iotImg from "../assets/iot1.png";
import researchImg from "../assets/outsourcing2.jpeg";
import alfaImg from "../assets/education1.jpeg";
import contentImg from "../assets/cm1.png";
import marketingImg from "../assets/logi1.png";
import techn from "../assets/tm1.png";

import itImg from "../assets/it2.jpg";
import eduImg from "../assets/education1.jpeg";
import bankingImg from "../assets/bnkng2.jpg";
import healthcareImg from "../assets/hc1.jpeg";
import defenceImg from "../assets/df2.png";
import agricultureImg from "../assets/agri1.png";

// NEW HERO SLIDER
import HeroSlider from "./HeroSlider";
import Footer from "../components/Footer";


// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, duration: 0.8 }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring", stiffness: 60, damping: 12, duration: 0.8 }
  }
};

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring", stiffness: 70, damping: 12, duration: 0.6 }
  },
  hover: {
    y: -10, scale: 1.03,
    transition: { type: "spring", stiffness: 300, damping: 15 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};


const Home = () => {

  const navigate = useNavigate();

  const heroRef = useRef(null);
const isHeroInView = useInView(heroRef, {
  once: false, // IMPORTANT: allows animation every time you scroll to top
});
const heroVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

    const location = useLocation();

useEffect(() => {
  if (!location.state?.scrollTo) return;

  const id = location.state.scrollTo;

  const timer = setTimeout(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset =
      document.querySelector("nav")?.offsetHeight || 0;

    const y =
      el.getBoundingClientRect().top +
      window.pageYOffset -
      headerOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }, 500); // ⭐ bigger delay for real mobile

  return () => clearTimeout(timer);
}, [location]);






const allServices = [
  {
    title: "Cloud Consulting",
    image: cloudImg,
    description: "Scalable cloud solutions for modern businesses",
    icon: CloudCog,
    color: "#00eaff",
  },
  {
    title: "AI & Machine Learning",
    image: aiImg,
    description: "Intelligent systems that learn and adapt",
    icon: BrainCircuit,
    color: "#8f65ff",
  },
  {
    title: "Generative AI",
    image: genaiImg,
    description: "Creative AI solutions for innovation",
    icon: Sparkles,
    color: "#ff6b6b",
  },
  {
    title: "Internet of Things",
    image: iotImg,
    description: "Connect and automate your world",
    icon: Wifi,
    color: "#00ff88",
  },
  {
    title: "ALFA Platform",
    image: alfaImg,
    description: "State of the art Responsible AI platform",
    icon: GraduationCap,
    color: "#ffd93d",
  },
  {
    title: "Supply Chain & Logistics",
    image: marketingImg,
    description: "Optimized marketing and logistics",
    icon: Truck,
    color: "#00b894",
  },
  {
    title: "Tech Manthana",
    image: techn,
    description: "Tech Manthana - Innovation hub",
    icon: Lightbulb,
    color: "#e17055",
    path: "/tech-manthana/blog",
  },
  {
    title: "Content Management",
    image: contentImg,
    description: "Strategic content and PR solutions",
    icon: FileText,
    color: "#fd79a8",
  },
  {
    title: "Research & Development",
    image: researchImg,
    description: "Cutting-edge technology research",
    icon: FlaskConical,
    color: "#6c5ce7",
  },
];


  const industries = [
    { title: "Information Technology", image: itImg, description: "Digital transformation and IT solutions", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { title: "Education", image: eduImg, description: "Modern learning platforms and tools", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"},
    { title: "Finance & Banking", image: bankingImg, description: "Secure financial technology solutions", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { title: "Health Care", image: healthcareImg, description: "Healthcare innovation and technology", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
    { title: "Defence", image: defenceImg, description: "Secure defence technology systems", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { title: "Agriculture", image: agricultureImg, description: "Smart farming and agricultural tech", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }
  ];

  const servicesRef = useRef(null);
  const industriesRef = useRef(null);

 const isServicesInView = useInView(servicesRef, { once: false });
const isIndustriesInView = useInView(industriesRef, { once: false });

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="main-container">

      {/* ⭐ NEW HERO SLIDER HERE */}
    <motion.section
  id="hero"
  style={{
    marginTop: 0,
    paddingTop: 0,
    minHeight: "100svh",   
    overflow: "hidden",    
  }}
>
  <HeroSlider />
</motion.section>


<motion.section id="whatwedo">
   <WhatWeDo />
</motion.section>


 {/* TECH MANTHANA */}
      <motion.section id="tech-manthana" className="platform-section">
        <motion.h2 className="section-title-platform">Tech Manthana</motion.h2>
        <motion.div className="platform-container-magical">
          <TechManthanaPage />
        </motion.div>
      </motion.section>

      {/* SERVICES SECTION */}
      <motion.section
        ref={servicesRef}
        id="services"
        className="services-section-magical"
        initial="hidden"
        animate={isServicesInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="services-container-magical">
          <motion.div className="services-header-magical" variants={itemVariants}>
            <motion.h2 className="section-title-magical">Our Core Services</motion.h2>
            <motion.p className="section-subtitle-magical">Innovative solutions tailored to drive your business forward</motion.p>
          </motion.div>

          <motion.div className="services-grid-magical" variants={staggerContainer}>
            {allServices.map((service, index) => {
              const serviceId = service.title
  .toLowerCase()
  .replace(/&/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");


              return (
               <motion.div
  className="service-card-magical cursor-pointer"
  variants={cardVariants}
  whileHover="hover"
  onClick={() => navigate(service.path || `/services/${serviceId}`)}

  style={{ '--service-color': service.color }}
>

                  <div className="service-card-inner-magical">

                    <motion.div className="service-image-container" whileHover={{ scale: 1.05 }}>
                      <img src={service.image} alt={service.title} />
                      <div className="service-image-overlay"></div>
                    </motion.div>

                    <div className="service-content-magical">
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>

                      <Link
  to={service.path || `/services/${serviceId}`}
  className="service-link"
>

                        <motion.button className="service-cta-magical">Discover →</motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>


      {/* INDUSTRIES */}
      <motion.section
        ref={industriesRef}
        id="industries"
        className="industries-section-magical"
        initial="hidden"
        animate={isIndustriesInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="industries-container-magical">
          <motion.div className="industries-header-magical" variants={itemVariants}>
            <motion.h2 className="section-title-magical">Industries We Transform</motion.h2>
            <motion.p className="section-subtitle-magical">Driving digital transformation across diverse sectors</motion.p>
          </motion.div>

          <motion.div className="industries-grid-magical" variants={staggerContainer}>
            {industries.map((industry, index) => {
              const industryId = industry.title
  .toLowerCase()
  .replace(/&/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "")
  .replace(/\s+/g, "");


              return (
               <motion.div
  className="industry-card-magical cursor-pointer"
  variants={cardVariants}
  whileHover="hover"
  onClick={() => navigate(`/industries/${industryId}`)}
  style={{ '--industry-gradient': industry.gradient }}
>

                  <div className="industry-card-inner-magical">

                    <motion.div className="industry-image-container-magical" whileHover={{ scale: 1.05 }}>
                      <img src={industry.image} alt={industry.title} />
                      <div className="industry-overlay-magical" style={{ background: industry.gradient }}></div>
                    </motion.div>

                    {/* */}

                    <div className="industry-content-magical">
                      <h3>{industry.title}</h3>
                      <p>{industry.description}</p>

                      <Link to={`/industries/${industryId}`} className="industry-link">
                        <motion.button className="industry-cta-magical">Explore Solutions</motion.button>
                      </Link>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>


      {/* ALFA PLATFORM */}
      <motion.section id="alfa" className="platform-section">
        <motion.h2 className="section-title-platform">ALFA Platform</motion.h2>
      


        <motion.div className="platform-container-magical">
 
          <ALFASection />
        </motion.div>
      </motion.section>

     

      {/* CONTACT */}
    <motion.section id="contact" className="contact-section-magical">
        <ContactUs />
      </motion.section>

<motion.section className="">
        <Footer />
      </motion.section>
    </motion.div>
    

  );
};

export default Home;
