import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// Variants for the window animation
const windowVariants = {
    initial: { opacity: 0, x: 50, scale: 0.9 },
    animate: { 
        opacity: 1, 
        x: 0, 
        scale: 1, 
        transition: { type: 'spring', stiffness: 50, damping: 10 } 
    }
};

// Unique component for the core LMS learning interface
const ThreeWindowPopup = () => {
    
    // Container for staggered loading
    const container = {
        visible: {
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.3,
            },
        },
    };

    return (
        <motion.div 
            style={popupStyle} 
            variants={container}
            initial="initial" 
            animate="visible"
        >
            <motion.div style={windowStyle(1)} variants={windowVariants}>
                <h4 style={{ color: '#2C3E50' }}>1. Editor ✍️ (Code/Notes Making)</h4>
                <textarea style={textAreaStyle} placeholder="Write your code, notes, or homework here..."></textarea>
            </motion.div>
            
            <motion.div style={windowStyle(2)} variants={windowVariants}>
                <h4 style={{ color: '#F39C12' }}>2. Source of Truth 📖 (Content Reference)</h4>
                <p>Access Content: PDF, Video Streaming Recorded, Online Class Access</p>
                <p style={{ marginTop: '10px', padding: '10px', borderLeft: '3px solid #F39C12', backgroundColor: 'rgba(243, 156, 18, 0.1)' }}>
                    Current Topic: Advanced React Hooks (Content link: [PDF Link] [Video Link])
                </p>
            </motion.div>
            
            <motion.div style={windowStyle(3)} variants={windowVariants}>
                <h4 style={{ color: '#1ABC9C' }}>3. Bot 🤖 (AI Agent for Assistance)</h4>
                <div style={chatWindowStyle}>
                    <p><strong>Bot:</strong> Welcome! I'm your Generative AI assistant. Ask me anything about your current module.</p>
                    <p><strong>You:</strong> Explain useEffect dependencies.</p>
                    <p><strong>Bot:</strong> Happy to help! The dependency array in `useEffect` controls when the effect re-runs...</p>
                </div>
                <input type="text" placeholder="Chat with the Bot..." style={chatInputStyle} />
            </motion.div>
        </motion.div>
    );
};

const popupStyle = {
  display: 'flex',
  gap: '15px',
  marginTop: '30px',
  minHeight: '450px',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  padding: '15px',
  backgroundColor: '#fff'
};

// Utility function to apply different colors to the windows
const windowStyle = (index) => ({
    flex: 1,
    padding: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #DCE4E8',
    backgroundColor: ['#F9F9F9', '#F0F3F4', '#E8F6F3'][index - 1] // Attractive light backgrounds
});

const textAreaStyle = { 
    width: '100%', 
    minHeight: '300px', 
    border: 'none', 
    resize: 'none', 
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: 'white',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
};

const chatWindowStyle = {
    height: '300px', 
    border: '1px solid #ccc', 
    padding: '10px', 
    overflowY: 'scroll',
    backgroundColor: 'white',
    borderRadius: '5px',
    marginBottom: '5px'
};

const chatInputStyle = { 
    width: '100%', 
    padding: '10px', 
    borderRadius: '5px',
    border: '1px solid #3498db'
};

// ConsumerDashboard component (rest of the file)
const ConsumerDashboard = () => {
  const { userProfile } = useAuth();
  const [completionStatus, setCompletionStatus] = useState(false);

  const handleCompletion = () => {
    setCompletionStatus(true);
    alert(`Completion indicator set! An email trigger has been sent to ${userProfile?.email}.`); 
  };
  
  // Use optional chaining for safe access
  const currentPlan = userProfile?.plan ? userProfile.plan.toUpperCase() : 'FREE'; 
  const planColor = currentPlan === 'PREMIUM' ? '#F39C12' : currentPlan === 'PLATINUM' ? '#9B59B6' : '#2ECC71';

  return (
    <div style={{ maxWidth: '1400px', margin: 'auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        style={{ color: '#2C3E50' }}
      >
        Consumer Learning Dashboard 🚀
      </motion.h1>
      
      <div style={profileBoxStyle}>
        <div>
          <p><strong>Student Profile:</strong> {userProfile?.name || 'N/A'}</p>
          <p><strong>Contact:</strong> {userProfile?.contactNumber || 'N/A'}</p>
          <p><strong>Email ID:</strong> {userProfile?.email || 'N/A'}</p>
        </div>
        <div style={{ backgroundColor: planColor, color: 'white', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            Access: **{currentPlan}**
        </div>
      </div>
      
      <section style={{ marginTop: '40px' }}>
        <h2 style={{ borderBottom: '2px solid #F39C12', paddingBottom: '10px' }}>Current Module: Full Stack Development (Hands-on)</h2>
        <p style={{ margin: '15px 0' }}>**Integrated Learning Environment (The 3-Window Interface):**</p>
        <ThreeWindowPopup />
      </section>

      <div style={completionToolboxStyle}>
        <h3 style={{ marginBottom: '15px', color: '#34495E' }}>Module Tools & Actions</h3>
        <motion.button 
            onClick={handleCompletion} 
            disabled={completionStatus}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
                padding: '12px 30px', 
                backgroundColor: completionStatus ? '#BDC3C7' : '#2ECC71', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: 'bold'
            }}
        >
          {completionStatus ? 'Module Completed! 🎉' : 'Mark Module Completion (Trigger Email)'}
        </motion.button>
        
        <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
                padding: '12px 30px', 
                backgroundColor: '#3498DB', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                marginLeft: '15px'
            }}
        >
            Access Outsourcing Hub
        </motion.button>
      </div>

    </div>
  );
};

const profileBoxStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: '20px', 
    padding: '25px', 
    border: '1px solid #DCE4E8', 
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
};

const completionToolboxStyle = { 
    marginTop: '60px', 
    borderTop: '2px solid #ECF0F1', 
    paddingTop: '30px',
    paddingBottom: '30px'
}

export default ConsumerDashboard;