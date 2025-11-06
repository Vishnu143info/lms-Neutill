// Footer.js
import React from 'react';

const Footer = () => { 
  // ... your footer code
  return (
    <footer style={{ padding: '20px', textAlign: 'center', backgroundColor: '#34495e', color: 'white', marginTop: '20px' }}>
      <p>&copy; {new Date().getFullYear()} Neutill Services. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer; // <--- This is the essential fix