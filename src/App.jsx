import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Industries from './pages/Industries';
import Login from './pages/Login';
import ConsumerDashboard from './pages/ConsumerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TutorDashboard from './pages/TutorDashboard';
import { useAuth } from './context/AuthContext';
import TechManthanaPage from './pages/TechManthanaPage';
import ALFASection from './pages/ALFASection';
import ScrollToTop from './components/ScrollToTop';

// A simple protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect users with wrong roles (e.g., a Consumer trying to access Admin Dashboard)
    return <div>Access Denied. Your role is: {userRole}</div>;
  }

  return children;
};

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
     <ScrollToTop/>
      <Header />
      <main>
        <Routes>
         
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="#services" element={<Services />} />
          <Route path="#ndustries" element={<Industries />} />
          <Route path="/tech-manthana" element={<TechManthanaPage />} />
          <Route path="/alfa" element={<ALFASection />} /> 
          <Route path="/login" element={<Login />} />

          {/* Protected LMS Routes */}
          <Route path="/dashboard/consumer" element={
            <ProtectedRoute allowedRoles={['consumer']}>
              <ConsumerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/tutor" element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <TutorDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};


export default App;