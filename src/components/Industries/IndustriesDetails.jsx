import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Industry.css';

const industryData = {
  "information-technology": {
    title: "Information Technology",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    pages: [
      {
        title: "Digital Transformation in IT",
        content: "Revolutionizing the IT sector with innovative solutions and cutting-edge technology implementations that drive digital transformation and business growth.",
        solutions: [
          "Enterprise software development and integration",
          "Cloud infrastructure and migration services",
          "Cybersecurity and data protection solutions",
          "IT consulting and strategic planning"
        ],
        stats: { growth: "+48%", projects: "200+", clients: "50+" }
      },
      {
        title: "Future-Ready IT Infrastructure",
        content: "Building scalable and resilient IT systems that adapt to evolving business needs and technological advancements.",
        solutions: [
          "DevOps and continuous integration pipelines",
          "Microservices architecture implementation",
          "Legacy system modernization",
          "Digital workspace solutions"
        ],
        caseStudy: "Successfully migrated 15+ enterprises to cloud-native architectures, reducing operational costs by 40%"
      }
    ]
  },
  "healthcare": {
    title: "Health Care",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    pages: [
      {
        title: "Healthcare Innovation",
        content: "Transforming healthcare delivery through technology and data-driven solutions that improve patient outcomes and operational efficiency.",
        solutions: [
          "Electronic Health Record (EHR) systems",
          "Telemedicine and remote patient monitoring platforms",
          "Medical imaging AI solutions",
          "Patient data analytics and insights"
        ],
        stats: { growth: "+61%", efficiency: "+40%", accuracy: "+35%" }
      },
      {
        title: "Medical Technology Advancements",
        content: "Pioneering healthcare solutions that improve patient outcomes and operational efficiency through cutting-edge technology.",
        solutions: [
          "IoT medical device integration",
          "Predictive analytics for patient care",
          "Healthcare supply chain optimization",
          "Clinical decision support systems"
        ],
        caseStudy: "Reduced patient wait times by 60% through AI-powered scheduling and resource allocation systems"
      }
    ]
  },
  "defence": {
    title: "Defence",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    pages: [
      {
        title: "Secure Defence Technology",
        content: "Developing advanced defence technologies and secure systems that protect national interests and ensure mission success.",
        solutions: [
          "Secure communication systems",
          "Surveillance and reconnaissance technology",
          "Cybersecurity for defence networks",
          "Command and control systems"
        ],
        stats: { security: "99.9%", reliability: "+45%", innovation: "+52%" }
      },
      {
        title: "Mission-Critical Solutions",
        content: "Creating robust, reliable solutions for defence applications that operate in the most demanding environments.",
        solutions: [
          "Real-time data processing systems",
          "Secure mobile and field applications",
          "AI-powered threat detection",
          "Military-grade hardware integration"
        ],
        caseStudy: "Implemented secure communication network serving 10,000+ users with 99.99% uptime"
      }
    ]
  },
  "finance-banking": {
    title: "Finance & Banking",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    pages: [
      {
        title: "Financial Technology Innovation",
        content: "Transforming the finance and banking sector with secure, scalable technology solutions that enhance customer experience and operational efficiency.",
        solutions: [
          "Digital banking platforms",
          "Fraud detection and prevention systems",
          "Blockchain and cryptocurrency solutions",
          "Investment and trading platforms"
        ],
        stats: { transactions: "1M+/day", security: "99.99%", growth: "+45%" }
      },
      {
        title: "Banking Digital Transformation",
        content: "Modernizing banking operations with AI-driven solutions and secure digital platforms that meet evolving customer expectations.",
        solutions: [
          "Mobile banking applications",
          "AI-powered customer service",
          "Risk management systems",
          "Regulatory compliance automation"
        ],
        caseStudy: "Developed mobile banking app serving 500,000+ users with 4.8-star rating and 99.9% uptime"
      }
    ]
  },
  "education": {
    title: "Education",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    pages: [
      {
        title: "Educational Technology Revolution",
        content: "Transforming education through innovative technology solutions that enhance learning outcomes and accessibility for students worldwide.",
        solutions: [
          "Learning Management Systems (LMS)",
          "Virtual and augmented reality learning",
          "Adaptive learning platforms",
          "Educational data analytics"
        ],
        stats: { engagement: "+52%", retention: "+38%", accessibility: "+65%" }
      },
      {
        title: "Future of Learning",
        content: "Creating immersive, personalized learning experiences that prepare students for the challenges of tomorrow.",
        solutions: [
          "AI-powered tutoring systems",
          "Collaborative learning platforms",
          "Skills assessment and certification",
          "Remote learning solutions"
        ],
        caseStudy: "Implemented university-wide LMS serving 25,000+ students with 95% satisfaction rate"
      }
    ]
  },
  "agriculture": {
    title: "Agriculture",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    pages: [
      {
        title: "Agricultural Technology Innovation",
        content: "Revolutionizing agriculture with smart farming solutions that increase yield, reduce waste, and promote sustainable practices.",
        solutions: [
          "Precision farming and IoT sensors",
          "Crop monitoring and yield prediction",
          "Supply chain optimization",
          "Sustainable farming practices"
        ],
        stats: { yield: "+55%", efficiency: "+42%", sustainability: "+60%" }
      },
      {
        title: "Smart Farming Solutions",
        content: "Leveraging technology to create smarter, more efficient agricultural practices that benefit farmers and consumers alike.",
        solutions: [
          "Drone-based field monitoring",
          "Automated irrigation systems",
          "Soil health analysis",
          "Market connectivity platforms"
        ],
        caseStudy: "Increased crop yield by 35% while reducing water usage by 25% through smart irrigation systems"
      }
    ]
  }
};

const IndustryDetail = () => {
  const { industryId } = useParams();
  const industry = industryData[industryId];

  if (!industry) {
    return (
      <div className="industry-not-found">
        <h2>Industry not found</h2>
        <Link to="/industries">Back to Industries</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="industry-detail-container"
    >
      {/* Header */}
      <div 
        className="industry-detail-header"
        style={{ background: industry.gradient }}
      >
        <h1>{industry.title}</h1>
        <p>Driving innovation and transformation in the {industry.title.toLowerCase()} sector</p>
      </div>

      {/* Two-Page Content */}
      <div className="industry-pages-container">
        {industry.pages.map((page, pageIndex) => (
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, x: pageIndex % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: pageIndex * 0.3 }}
            className="industry-page"
          >
            <div className="page-header">
              <h2>{page.title}</h2>
              <div className="page-number">0{pageIndex + 1}</div>
            </div>

            <div className="page-content">
              <p className="page-description">{page.content}</p>

              {page.solutions && (
                <div className="solutions-section">
                  <h3>Our Solutions</h3>
                  <div className="solutions-grid">
                    {page.solutions.map((solution, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="solution-card"
                      >
                        <div className="solution-icon">✓</div>
                        <span>{solution}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {page.stats && (
                <div className="stats-section">
                  <h3>Impact Metrics</h3>
                  <div className="stats-grid">
                    {Object.entries(page.stats).map(([key, value]) => (
                      <div key={key} className="stat-item">
                        <div className="stat-value">{value}</div>
                        <div className="stat-label">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {page.caseStudy && (
                <div className="case-study-section">
                  <h3>Success Story</h3>
                  <p>{page.caseStudy}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="industry-navigation">
        <Link to="/#industries" className="back-button">
          ← Back to Industries
        </Link>
        <Link to="/contact" className="inquiry-button" style={{ background: industry.gradient }}>
          Get Industry Solution
        </Link>
      </div>
    </motion.div>
  );
};

export default IndustryDetail;