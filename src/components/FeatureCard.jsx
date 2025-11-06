import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ title, content }) => {
  return (
    <motion.div 
        style={cardStyle}
        whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
            y: -5
        }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
      <h3>{title}</h3>
      <p>{content}</p>
      <motion.button 
        style={buttonStyle}
        whileHover={{ backgroundColor: '#1ABC9C', color: 'white' }}
      >
        Explore
      </motion.button>
    </motion.div>
  );
};

const cardStyle = {
  border: '1px solid #BDC3C7',
  padding: '30px',
  borderRadius: '12px',
  textAlign: 'center',
  backgroundColor: 'white',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
};

const buttonStyle = {
  marginTop: '20px',
  padding: '12px 25px',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600'
}

export default FeatureCard;