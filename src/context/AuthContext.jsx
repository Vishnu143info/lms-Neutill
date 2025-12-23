
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'consumer', 'admin', 'tutor' 
  const [userProfile, setUserProfile] = useState({});

  // Simulate login logic based on credentials
  const login = (email, password) => {
    // In a real app, this would call an API to verify credentials
    if (email === 'admin@neutill.com' && password === 'admin') {
      setUserRole('admin');
      setIsAuthenticated(true);
      setUserProfile({ name: 'Admin User', email: email });
      return 'admin';
    } else if (email === 'tutor@neutill.com' && password === 'tutor') {
      setUserRole('tutor');
      setIsAuthenticated(true);
      setUserProfile({ name: 'Tutor Jane', email: email });
      return 'tutor';
    } else if (email === 'consumer@neutill.com' && password === 'consumer') {
      setUserRole('consumer');
      setIsAuthenticated(true);
      setUserProfile({ 
        name: 'Student Profile', 
        contactNumber: '1234567890', 
        email: email, 
        plan: 'premium' // Based on Free, Premium, Platinum
      });
      return 'consumer';
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      return null;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserProfile({});
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
