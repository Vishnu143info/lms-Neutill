    import React from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    // NOTE: These imports must point to your actual component files
    import ALFASection from '../../pages/Alfa/ALFASection'; 
    import TechManthanaPage from '../../pages/TechManthanaPage';
    import './Services.css'; 


    const serviceData = {
        "cloud-consulting": {
            title: "Cloud Consulting",
            icon: "☁️",
            color: "#00eaff",
            pages: [
                {
                    title: "Cloud Transformation Strategy",
                    content: "Accelerate your digital journey with our comprehensive cloud consulting services. We help enterprises harness the power of cloud computing to drive innovation, reduce costs, and achieve unprecedented scalability across Microsoft Azure, Google Cloud Platform, and Amazon Web Services.",
                    features: [
                        "Multi-cloud strategy development and implementation",
                        "Legacy application modernization and cloud migration",
                        "Cloud cost optimization and financial governance",
                        "Disaster recovery and business continuity planning",
                        "Cloud security framework and compliance management"
                    ],
                
                },
                {
                    title: "Advanced Cloud Architecture",
                    content: "Design and implement robust cloud architectures that scale with your business needs. Our expertise in cloud-native technologies ensures your applications are resilient, secure, and performant.",
                    features: [
                        "Microservices architecture and container orchestration",
                        "Serverless computing and event-driven architectures",
                        "DevSecOps implementation and CI/CD pipelines",
                        "Hybrid and multi-cloud connectivity solutions",
                        "AI/ML workload optimization and deployment"
                    ],
                
                },
                {
                    title: "Cloud Operations Excellence",
                    content: "Optimize your cloud operations with our managed services and continuous improvement frameworks. We ensure your cloud environment remains secure, cost-effective, and aligned with business objectives.",
                    features: [
                        "24/7 cloud monitoring and incident management",
                        "Automated backup and recovery solutions",
                        "Cloud governance and policy enforcement",
                        "Performance benchmarking and optimization",
                        "Green cloud initiatives and sustainability tracking"
                    ],
                    technologies: ["Kubernetes", "Docker", "Terraform", "Ansible", "Prometheus", "Grafana"]
                }
            ]
        },
        "ai-machine-learning": {
            title: "AI & Machine Learning",
            icon: "🤖",
            color: "#8f65ff",
            pages: [
                {
                    title: "Intelligent Automation Solutions",
                    content: "Transform your business operations with our cutting-edge AI and machine learning solutions. We develop intelligent systems that learn from your data, automate complex processes, and deliver actionable insights.",
                    features: [
                        "Predictive analytics and forecasting models",
                        "Natural Language Processing for customer insights",
                        "Computer vision for quality control and monitoring",
                        "Recommendation engines and personalization systems",
                        "Anomaly detection and fraud prevention"
                    ],
                
                },
                {
                    title: "MLOps and Model Management",
                    content: "Implement end-to-end machine learning lifecycle management with our MLOps expertise. From data preparation to model deployment and monitoring, we ensure your AI initiatives deliver consistent value.",
                    features: [
                        "Automated data pipelines and feature engineering",
                        "Model versioning and experiment tracking",
                        "A/B testing and model performance monitoring",
                        "Automated retraining and model drift detection",
                        "Explainable AI and model interpretability"
                    ],
                    
                },
                {
                    title: "Enterprise AI Strategy",
                    content: "Develop and execute comprehensive AI strategies that align with your business goals. Our approach ensures successful AI adoption across your organization with measurable outcomes.",
                    features: [
                        "AI maturity assessment and roadmap development",
                        "Data strategy and infrastructure planning",
                        "AI talent development and team structuring",
                        "Ethical AI framework and governance",
                        "AI ROI measurement and value tracking"
                    ],
                    technologies: ["TensorFlow", "PyTorch", "Scikit-learn", "MLflow", "Kubeflow", "Airflow"]
                }
            ]
        },
        "generative-ai": {
            title: "Generative AI",
            icon: "✨",
            color: "#ff6b6b",
            pages: [
                {
                    title: "Creative AI Solutions",
                    content: "Harness the power of generative AI to revolutionize content creation, design, and innovation. Our solutions leverage large language models and multimodal AI to generate high-quality, context-aware content across various domains.",
                    features: [
                        "Content generation for marketing and communications",
                        "Code generation and software development assistance",
                        "Creative design and visual asset creation",
                        "Document processing and knowledge management",
                        "Personalized customer experiences at scale"
                    ],
                
                },
                {
                    title: "Autonomous AI Agents",
                    content: "Deploy intelligent agents that autonomously execute complex tasks, make decisions, and collaborate across systems. Our agentic AI solutions transform business processes and operational efficiency.",
                    features: [
                        "Multi-step workflow automation and execution",
                        "API integration and system orchestration",
                        "Dynamic goal setting and task prioritization",
                        "Cross-platform collaboration and coordination",
                        "Continuous learning and adaptation"
                    ],
                    caseStudy: "Automated 85% of customer service queries using AI agents, reducing response time from hours to seconds"
                },
                {
                    title: "Enterprise Generative AI Platform",
                    content: "Build and deploy secure, scalable generative AI platforms tailored to your organization's needs. Our solutions ensure responsible AI usage while maximizing business value.",
                    features: [
                        "Custom LLM development and fine-tuning",
                        "RAG (Retrieval Augmented Generation) systems",
                        "AI safety and content moderation",
                        "Multi-modal AI integration",
                        "Enterprise-grade security and compliance"
                    ],
                    technologies: ["GPT-4", "Claude", "Llama", "LangChain", "AutoGen", "Semantic Kernel"]
                }
            ]
        },
        "internet-of-things": {
            title: "Internet of Things",
            icon: "🌐",
            color: "#00ff88",
            pages: [
                {
                    title: "Connected Ecosystem Design",
                    content: "Create intelligent, connected ecosystems that transform physical operations into digital insights. Our IoT solutions bridge the gap between devices, data, and decisions across industries.",
                    features: [
                        "End-to-end IoT architecture design and implementation",
                        "Sensor networks and edge computing solutions",
                        "Real-time data collection and processing",
                        "Predictive maintenance and asset tracking",
                        "Smart facility and environment monitoring"
                    ],
                },
                {
                    title: "Industrial IoT and Automation",
                    content: "Drive operational excellence with industrial IoT solutions that optimize manufacturing, logistics, and supply chain operations through real-time monitoring and intelligent automation.",
                    features: [
                        "Industrial sensor deployment and calibration",
                        "PLC integration and SCADA system modernization",
                        "Digital twin creation and simulation",
                        "Quality control and production optimization",
                        "Energy management and sustainability tracking"
                    ],
                
                },
                {
                    title: "IoT Data Intelligence",
                    content: "Transform raw IoT data into actionable business intelligence with our advanced analytics and AI-powered insights platform.",
                    features: [
                        "Time-series data analysis and pattern recognition",
                        "Anomaly detection and predictive analytics",
                        "Dashboard and visualization development",
                        "API integration with enterprise systems",
                        "Security monitoring and threat detection"
                    ],
                    technologies: ["AWS IoT", "Azure IoT", "MQTT", "Node-RED", "Grafana", "TimescaleDB"]
                }
            ]
        },
        "alfa-platform": {
            title: "ALFA Platform",
            icon: "🎓",
            color: "#ffd93d",
            pages: [
                {
                    component: <ALFASection />,
                    type: "component"
                },
                {
                    title: "Enterprise Learning Management",
                    content: "Scale your organization's learning initiatives with our enterprise-grade LMS that integrates seamlessly with your existing HR and business systems.",
                    features: [
                        "SCORM and xAPI compliant content management",
                        "Bulk user enrollment and role-based access",
                        "Learning path customization and certification",
                        "Integration with HRMS and performance systems",
                        "Advanced reporting and analytics dashboard"
                    ],
                    
                },
                {
                    title: "Future of Education Technology",
                    content: "Pioneering the next generation of educational technology with cutting-edge features that prepare learners for the future.",
                    features: [
                        "Virtual and augmented reality learning experiences",
                        "AI-powered tutoring and mentorship",
                        "Blockchain-based credential verification",
                        "Predictive learning analytics and intervention",
                        "Accessibility and inclusive design features"
                    ],
                    technologies: ["React", "Node.js", "MongoDB", "TensorFlow", "WebRTC", "Blockchain"]
                }
            ]
        },
        "supply-chain-logistics": {
            title: "Supply Chain & Logistics",
            icon: "🚚",
            color: "#00b894",
            pages: [
                {
                    title: "Intelligent Supply Chain Optimization",
                    content: "Transform your supply chain into a competitive advantage with our AI-driven optimization solutions that enhance visibility, efficiency, and resilience.",
                    features: [
                        "Demand forecasting and inventory optimization",
                        "Route planning and transportation management",
                        "Warehouse automation and smart storage",
                        "Supplier relationship management",
                        "Risk assessment and mitigation strategies"
                    ],
                
                },
                {
                    title: "Logistics Technology Integration",
                    content: "Integrate cutting-edge technologies into your logistics operations to create seamless, automated, and intelligent supply chain networks.",
                    features: [
                        "IoT sensor integration for real-time tracking",
                        "Blockchain for supply chain transparency",
                        "AI-powered predictive maintenance",
                        "Automated warehouse management systems",
                        "Last-mile delivery optimization"
                    ],
                    caseStudy: "Optimized logistics network reducing delivery times by 40% and cutting fuel costs by 25%"
                },
                {
                    title: "Sustainable Supply Chain Solutions",
                    content: "Build environmentally responsible and socially conscious supply chains that balance profitability with sustainability.",
                    features: [
                        "Carbon footprint tracking and reduction",
                        "Circular economy implementation",
                        "Ethical sourcing and compliance",
                        "Green logistics and transportation",
                        "Sustainability reporting and analytics"
                    ],
                    technologies: ["SAP", "Oracle", "AI/ML", "IoT", "Blockchain", "ERP Systems"]
                }
            ]
        },
        "upskilling-outsourcing": {
            title: "Upskilling & Outsourcing",
            icon: "💡",
            color: "#e17055",
            pages: [
                {
                    component: <TechManthanaPage />,
                    type: "component"
                },
                {
                    title: "Talent Development Ecosystem",
                    content: "Bridge the skills gap with our comprehensive upskilling programs that transform raw talent into industry-ready professionals through hands-on, project-based learning.",
                    features: [
                        "Industry-aligned curriculum development",
                        "Hands-on project-based learning",
                        "Mentorship from industry experts",
                        "Career counseling and placement support",
                        "Continuous learning and skill assessment"
                    ],
                
                },
                {
                    title: "Strategic IT Outsourcing",
                    content: "Access top-tier talent and specialized expertise through our flexible outsourcing models that scale with your business needs.",
                    features: [
                        "Dedicated development teams",
                        "Project-based outsourcing",
                        "Managed services and support",
                        "Quality assurance and testing",
                        "Agile project management"
                    ],
                    
                }
            ]
        },
        "content-management": {
            title: "Content Management",
            icon: "📝",
            color: "#fd79a8",
            pages: [
                {
                    title: "Strategic Content Solutions",
                    content: "Elevate your brand presence with our comprehensive content management and public relations services that drive engagement and build trust.",
                    features: [
                        "Content strategy and editorial planning",
                        "Multi-channel content creation and distribution",
                        "Brand storytelling and messaging",
                        "Audience engagement and community building",
                        "Content performance measurement"
                    ],
                
                },
                {
                    title: "Digital Public Relations",
                    content: "Amplify your brand's voice and reputation through strategic digital PR campaigns and media relations.",
                    features: [
                        "Media outreach and relationship management",
                        "Crisis communication planning and execution",
                        "Influencer partnership development",
                        "Social media strategy and management",
                        "Reputation monitoring and analysis"
                    ],
                    caseStudy: "Increased brand mentions by 300% and improved sentiment score from 65% to 89% in 6 months"
                },
                {
                    title: "Content Technology Stack",
                    content: "Leverage cutting-edge content technologies to streamline creation, distribution, and measurement across all channels.",
                    features: [
                        "AI-powered content optimization",
                        "CMS implementation and customization",
                        "Marketing automation integration",
                        "SEO and SEM strategy execution",
                        "Analytics and ROI measurement"
                    ],
                    technologies: ["WordPress", "HubSpot", "Marketplace", "Google Analytics", "SEMrush", "Hootsuite"]
                }
            ]
        },
        "research-development": {
            title: "Research & Development",
            icon: "🔬",
            color: "#6c5ce7",
            pages: [
                {
                    title: "Innovation-Driven Research",
                    content: "Pioneer breakthrough technologies and solutions through our collaborative R&D initiatives that address complex challenges and create sustainable impact.",
                    features: [
                        "Emerging technology research and prototyping",
                        "Academic and industry collaboration",
                        "Patent research and intellectual property development",
                        "Proof-of-concept and MVP development",
                        "Technology transfer and commercialization"
                    ],
                
                },
                {
                    title: "Sustainable Technology Development",
                    content: "Develop environmentally conscious and socially responsible technologies that contribute to sustainable development goals.",
                    features: [
                        "Clean energy technology research",
                        "Sustainable agriculture solutions",
                        "Water conservation and management systems",
                        "Circular economy model development",
                        "Social impact measurement and optimization"
                    ],
                    
                },
                {
                    title: "Future Technology Incubation",
                    content: "Nurture and accelerate the development of next-generation technologies through our comprehensive incubation ecosystem.",
                    features: [
                        "Startup incubation and acceleration",
                        "Research grant application support",
                        "Prototype development and testing",
                        "Market validation and product-market fit",
                        "Investor networking and funding support"
                    ],
                    technologies: ["AI/ML", "Blockchain", "IoT", "Quantum Computing", "Biotechnology", "Nanotechnology"]
                }
            ]
        }
    };
    // --- END SERVICE DATA STRUCTURE ---


    const ServiceDetail = () => {
        const { serviceId } = useParams();
        const service = serviceData[serviceId];

    

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="service-detail-container"
            >
                {/* Header */}
                <div
  className="service-detail-header"
  style={{ background: `linear-gradient(135deg, ${service.color}20, ${service.color}40)` }}
>
 
  <h1>{service.title}</h1>

  <p className="service-subtitle">
    Transforming businesses with cutting-edge solutions
  </p>

  <p className="service-intro">
    We design and deliver scalable, secure, and future-ready solutions that
    help organizations innovate faster, operate smarter, and achieve measurable results.
  </p>
</div>


                {/* Three-Page Content */}
                <div className="service-pages-container">
                    {service.pages.map((page, pageIndex) => (
                        <motion.div
                            key={pageIndex}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: pageIndex * 0.2 }}
                            className={`service-page ${page.type === 'component' ? 'component-page-wrapper' : ''}`}
                        >
                            {page.type === "component" ? (
                                <div className="component-page">
                                    {/* Renders the imported React component (e.g., ALFASection, TechManthanaPage) */}
                                    {page.component}
                                </div>
                            ) : (
                                <>
                                    <div className="page-header">
                                        <h2>{page.title}</h2>
                                        
                                    </div>
                                    
                                    <div className="page-content">
                                        <p className="page-description">{page.content}</p>
                                        
                                        {page.features && (
                                            <div className="features-section">
                                                <h3>Key Features & Capabilities</h3>
                                                <div className="features-grid">
                                                    {page.features.map((feature, featureIndex) => (
                                                        <motion.div
                                                            key={featureIndex}
                                                            whileHover={{ scale: 1.05 }}
                                                            className="feature-card"
                                                            // Custom property for dynamic border color
                                                            style={{ borderLeftColor: service.color }} 
                                                        >
                                                            <div className="feature-icon">✓</div>
                                                            <span>{feature}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {page.stats && (
                                            <div className="stats-section">
                                                <h3>Performance Metrics</h3>
                                                <div className="stats-grid">
                                                    {Object.entries(page.stats).map(([key, value]) => (
                                                        <div key={key} className="stat-item">
                                                            <div className="stat-value" style={{ color: service.color }}>
                                                                {value}
                                                            </div>
                                                            <div className="stat-label">{key}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        

                                        {page.technologies && (
                                            <div className="technologies-section">
                                                <h3>Technologies & Platforms</h3>
                                                <div className="technologies-grid">
                                                    {page.technologies.map((tech, techIndex) => (
                                                        <span key={techIndex} className="tech-tag">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Navigation - FIXED BACK BUTTON */}
                <div className="service-navigation">
                    {/* This links back to your /services route handled by ServicesSection */}
                        <Link to="/" state={{ scrollTo: "services" }} className="back-button">
    ← Back to Services
    </Link>
                    <Link to="/" state={{ scrollTo: "contact" }} className="contact-button" style={{ backgroundColor: service.color }}>
                        Contact Us About {service.title}
                    </Link>
                </div>
            </motion.div>  
        );
    };

    export default ServiceDetail;