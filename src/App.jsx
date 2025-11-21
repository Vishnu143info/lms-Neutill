import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import Login from "./pages/Login";
import Logout from "./pages/Logout";

import ServiceDetail from "./components/Service/ServiceDetails";
import IndustryDetail from "./components/Industries/IndustriesDetails";

import ConsumerDashboard from "./layouts/ConsumerDashboard";
import AdminDashboard from "./layouts/AdminDashboard";
import TutorDashboard from "./layouts/TutorDashboard";

import { useAuth } from "./context/AuthContext";
import TechManthanaPage from "./pages/TechManthanaPage";
import ALFASection from "./pages/Alfa/ALFASection";
import ScrollToTop from "./components/ScrollToTop";
import BlogPage from "./pages/BlogPage";

// ✅ Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole))
    return <div>Access Denied</div>;

  return children;
};

const App = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />

        {/* SERVICES ROUTES */}
        <Route
          path="/services"
          element={
            <PublicLayout>
              <Services />
            </PublicLayout>
          }
        />

        {/* ✅ ADD INDIVIDUAL SERVICE DETAIL ROUTES */}
        <Route
          path="/services/:serviceId"
          element={
            <PublicLayout>
              <ServiceDetail />
            </PublicLayout>
          }
        />

        {/* INDUSTRIES ROUTES */}
        <Route
          path="/industries"
          element={
            <PublicLayout>
              <Industries />
            </PublicLayout>
          }
        />

        {/* ✅ ADD INDIVIDUAL INDUSTRY DETAIL ROUTES */}
        <Route
          path="/industries/:industryId"
          element={
            <PublicLayout>
              <IndustryDetail />
            </PublicLayout>
          }
        />

        <Route
          path="/tech-manthana"
          element={
            <PublicLayout>
              <TechManthanaPage />
            </PublicLayout>
          }
        />

        {/* BLOG PAGE ROUTE */}
        <Route
          path="/tech-manthana/blog"
          element={
            <PublicLayout>
              <BlogPage />
            </PublicLayout>
          }
        />

        {/* LOGOUT */}
        <Route
          path="/logout"
          element={
            <PublicLayout>
              <Logout />
            </PublicLayout>
          }
        />

        {/* DASHBOARD ROUTES */}
        <Route
          path="/dashboard/consumer"
          element={
            <ProtectedRoute allowedRoles={["consumer"]}>
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/tutor"
          element={
            <ProtectedRoute allowedRoles={["tutor"]}>
              <TutorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ALFA PAGE */}
        <Route
          path="/alfa"
          element={
            <ProtectedRoute allowedRoles={["consumer"]}>
              <ConsumerDashboard>
                <ALFASection />
              </ConsumerDashboard>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

      </Routes>
    </>
  );
};

export default App;