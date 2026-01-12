import React, { useState, useEffect } from "react";
import { FaDatabase, FaRobot, FaThLarge, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


const ALFASection = () => {

   const navigate = useNavigate();
  const [mode, setMode] = useState("yellow");
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size for responsiveness
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const handleNavigate = () => {
  navigate("/services/alfa-platform");
};


  const modes = {
    red: {
      title: "ALFA Agent",
      sub: "AI-driven task execution",
      icon: <FaRobot className="text-red-400 text-4xl md:text-6xl" />,
      bgGradient: "from-red-900/20 to-transparent",
      borderColor: "border-red-500/30",
      progressColor: "border-l-red-400",
      description: "Intelligent automation for complex workflows and decision-making processes."
    },
    yellow: {
      title: "Work Space",
      sub: "Assisted Learning For All",
      icon: <FaThLarge className="text-yellow-300 text-4xl md:text-6xl" />,
      bgGradient: "from-yellow-900/20 to-transparent",
      borderColor: "border-yellow-500/30",
      progressColor: "border-l-yellow-400",
      description: "Collaborative environment designed for enhanced productivity and learning."
    },
    purple: {
      title: "Source of Truth",
      sub: "Central knowledge repository",
      icon: <FaDatabase className="text-purple-400 text-4xl md:text-6xl" />,
      bgGradient: "from-purple-900/20 to-transparent",
      borderColor: "border-purple-500/30",
      progressColor: "border-l-purple-400",
      description: "Unified data source ensuring consistency and reliability across all systems."
    },
  };

  const active = modes[mode];
  const order = ["yellow", "purple", "red"];
  const currentIndex = order.indexOf(mode);
  
  const nextMode = () => {
    const nextIndex = (currentIndex + 1) % order.length;
    setMode(order[nextIndex]);
  };
  
  const prevMode = () => {
    const prevIndex = (currentIndex - 1 + order.length) % order.length;
    setMode(order[prevIndex]);
  };

  const right1 = modes[order[(currentIndex + 1) % 3]];
  const right2 = modes[order[(currentIndex + 2) % 3]];

  // Mobile carousel view
  if (isMobile) {
    return (
      
      <section className="w-full min-h-screen bg-gradient-to-br from-[#081420] to-[#0a1929] flex justify-center items-center p-4">
        
        <div className="w-full max-w-md bg-[#0d1b2a] rounded-2xl shadow-2xl overflow-hidden border border-[#1e2f47]">
          <span className="ml-3 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-400 text-black uppercase tracking-wide">
  Commissioning Soon
</span>

          {/* Top Navigation */}
          <div className="h-14 bg-gradient-to-r from-[#132235] to-[#1a2d42] rounded-t-2xl flex items-center justify-between px-6">
            <button onClick={prevMode} className="text-white/70 hover:text-white transition-colors">
              <FaChevronLeft />
            </button>
            
            <div className="flex gap-3">
              {order.map((color) => (
                <span 
                  key={color}
                  onClick={() => setMode(color)} 
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                    mode === color 
                      ? `bg-${color === 'red' ? 'red' : color === 'yellow' ? 'yellow' : 'purple'}-500 scale-110` 
                      : 'bg-white/30'
                  }`} 
                />
              ))}
            </div>
            
            <button onClick={nextMode} className="text-white/70 hover:text-white transition-colors">
              <FaChevronRight />
            </button>
          </div>

          {/* Mobile Carousel Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
              onClick={handleNavigate}
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
               
                className={`bg-gradient-to-br ${active.bgGradient} to-[#0e1c2c] rounded-2xl p-8 relative text-white border ${active.borderColor} cursor-pointer hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center gap-4 mb-6">
                  {active.icon}
                  <div>
                    <h1 className="text-2xl font-bold">{active.title}</h1>
                    <p className="opacity-80 text-sm">{active.sub}</p>
                  </div>
                </div>
                
                <p className="text-white/70 mb-8 text-sm leading-relaxed">
                  {active.description}
                </p>
              </motion.div>
            </AnimatePresence>
                  
            {/* Indicator dots */}
            <div className="flex justify-center gap-2 mt-6">
              {order.map((color, index) => (
                <div 
                  key={color}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIndex === index 
                      ? 'bg-white w-6' 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop view
  return (
    
    <section className="w-full min-h-screen bg-gradient-to-br from-[#081420] to-[#0a1929] flex justify-center items-center p-4 md:p-8">
      
      <div className="w-full max-w-[1600px] h-[85vh] bg-[#0d1b2a] rounded-2xl shadow-2xl overflow-hidden border border-[#1e2f47]">
      

        <span className="ml-[903px] p-10 py-1  text-xs font-semibold rounded-full bg-yellow-400 text-black uppercase tracking-wide">
  Commissioning Soon
</span>
    
        {/* Enhanced Top Bar */}
        <div className="h-14 bg-gradient-to-r from-[#132235] to-[#1a2d42] rounded-t-2xl flex items-center justify-between px-6">
          
          <div className="flex items-center gap-4">
            
            <div className="flex gap-2">
              <span onClick={() => setMode("red")} className={`w-3 h-3 bg-red-500 rounded-full cursor-pointer transition-transform hover:scale-110 ${mode === 'red' ? 'ring-2 ring-red-400' : ''}`} />
              <span onClick={() => setMode("yellow")} className={`w-3 h-3 bg-yellow-400 rounded-full cursor-pointer transition-transform hover:scale-110 ${mode === 'yellow' ? 'ring-2 ring-yellow-300' : ''}`} />
              <span onClick={() => setMode("purple")} className={`w-3 h-3 bg-purple-500 rounded-full cursor-pointer transition-transform hover:scale-110 ${mode === 'purple' ? 'ring-2 ring-purple-400' : ''}`} />
            </div>
            <span className="text-white/60 text-sm">ALFA Platform</span>
          </div>
          
          <div className="text-white/80 font-medium">
            {active.title}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 p-6 h-[calc(100%-3.5rem)]">
          
          {/* Enhanced Left Main Card */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleNavigate}

            className={`lg:flex-[1.7] bg-gradient-to-br ${active.bgGradient} to-[#0e1c2c] rounded-2xl p-8 md:p-10 relative text-white border ${active.borderColor} cursor-pointer hover:shadow-xl transition-all duration-300 group`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            
            <h1 className="text-3xl md:text-5xl font-bold mb-3 relative z-10">{active.title}</h1>
            <p className="opacity-80 mb-4 md:mb-6 text-lg relative z-10">{active.sub}</p>
            
            <p className="text-white/70 mb-8 max-w-2xl leading-relaxed relative z-10">
              {active.description}
            </p>

            <div className="relative z-10 mb-8 md:mb-12">
              {active.icon}
            </div>

            <h2 className="text-xl md:text-2xl font-semibold relative z-10">{active.title} Dashboard</h2>

            {/* Progress Circle Removed */}
          </motion.div>

          {/* Enhanced Right Cards */}
          <div className="flex flex-col gap-6 lg:flex-[1]">
            {[right1, right2].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
               onClick={handleNavigate}
 
                className={`bg-gradient-to-br ${item.bgGradient} to-[#0e1c2c] rounded-2xl p-6 md:p-8 text-center text-white border ${item.borderColor} flex-1 flex flex-col justify-center cursor-pointer hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="text-4xl md:text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm md:text-base">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ALFASection;