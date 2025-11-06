import React from 'react';

const Services = () => {
  // Array structure for easy mapping and clean rendering
  const serviceList = [
    { title: "Cloud Consulting", description: "Seamless migration, optimization, and architecture across Azure, GCP, and AWS.", citation: 102, icon: "💻" },
    { title: "AI & Machine Learning", description: "Building predictive analytics models and intelligent automation systems to drive decision-making.", citation: 103, icon: "🧠" },
    { title: "Generative AI & AI Agents", description: "Leveraging GenAI for advanced content creation, code generation, and autonomous agent development.", citation: 104, icon: "🤖" },
    { title: "Internet Of Things (IoT)", description: "Designing secure IoT architectures, implementing edge computing solutions, and device management.", citation: 106, icon: "🔗" },
    { title: "Supply Chain & Marketing", description: "Utilizing advanced data models for demand prediction, logistics optimization, and marketing automation.", citation: 107, icon: "📈" },
    { title: "Content Management & PR", description: "Strategic messaging, content lifecycle management, and SEO optimization for maximum visibility.", citation: 108, icon: "✍️" },
    { title: "Research And Development", description: "Dedicated R&D focused on innovation, specializing in projects aligned with Sustainable Development Goals.", citation: 110, icon: "🔬" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-8 lg:px-16" 
         style={{ 
           fontFamily: 'Inter, sans-serif',
           background: 'radial-gradient(circle at top, rgba(15, 25, 50, 1), rgba(0, 0, 0, 1))',
           color: '#e2e8ff' 
         }}>
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4" 
            style={{ 
              background: 'linear-gradient(45deg, #00eaff, #8f65ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 8px rgba(0, 234, 255, 0.3))'
            }}>
          Our Core Services
        </h1>
        <p className="text-xl text-gray-300">
          We empower growth through specialized expertise in next-generation technologies.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceList.map((service, index) => (
          <div 
            key={index}
            className="p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 shadow-xl"
            style={{ 
              background: 'rgba(20, 30, 60, 0.7)',
              backdropFilter: 'blur(5px)',
              // Subtle inset shadow for depth
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 8px 15px rgba(0, 0, 0, 0.3)',
              transform: 'translateY(0)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 15px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 234, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 8px 15px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div className="text-4xl mb-4 p-2 inline-block rounded-lg"
                 style={{ 
                    background: 'linear-gradient(135deg, #00eaff, #8f65ff)',
                    color: '#0a1428', // Dark text on gradient icon background
                    lineHeight: '1',
                    boxShadow: '0 4px 10px rgba(0, 234, 255, 0.4)'
                 }}>
              {service.icon}
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-white">
              {service.title}
            </h2>
            
            <p className="text-gray-400">
              {service.description}
            </p>
            
            {/* Citation (Hidden by default, shown here for completeness) */}
            <span className="text-xs text-gray-600 mt-2 block hidden">
              [cite_start] [cite: {service.citation}]
            </span>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Services;
