import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/Home";
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

/* -------- STUDENT PAGES -------- */
import ConsumerDashboardPage from "./pages/student/Dashboard";
import MyModules from "./pages/student/MyModules";
import MySchedule from "./pages/student/MySchedule";
import ResumeUpload from "./pages/student/ResumeUpload";
import AskTutor from "./pages/student/AskTutor";

/* -------- ADMIN PAGES -------- */
import Dashboard from "./pages/admin/Dashboard";
import Posters from "./pages/admin/Posters";
import ContentManager from "./pages/admin/ContentManager";
import ScheduleManager from "./pages/admin/ScheduleManager";
import Subscriptions from "./pages/admin/Subscriptions";
import ResumeManager from "./pages/admin/ResumeManager";
import Users from "./pages/admin/Users";

/* -------- TUTOR PAGES -------- */
import TutorDashboardPage from "./pages/tutor/Dashboard";
import Classes from "./pages/tutor/Classes";
import Assignments from "./pages/tutor/Assignments";
import StudentQueries from "./pages/tutor/StudentQueries";

/* -------- PROTECTED ROUTE -------- */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole)) return <div>Access Denied</div>;

  return children;
};

const App = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/logout" element={<PublicLayout><Logout /></PublicLayout>} />

        <Route path="/services/:serviceId" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
        <Route path="/industries" element={<PublicLayout><Industries /></PublicLayout>} />
        <Route path="/industries/:industryId" element={<PublicLayout><IndustryDetail /></PublicLayout>} />

        <Route path="/tech-manthana" element={<PublicLayout><TechManthanaPage /></PublicLayout>} />
        <Route path="/tech-manthana/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />

        {/* STUDENT DASHBOARD (nested) */}
        <Route
          path="/dashboard/consumer"
          element={
            <ProtectedRoute allowedRoles={["consumer"]}>
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        >

          <Route index element={<MyModules />} />
          <Route path="page" element={<ConsumerDashboardPage />} />
          <Route path="modules" element={<MyModules />} />
          <Route path="schedule" element={<MySchedule />} />
          <Route path="resume" element={<ResumeUpload />} />
          <Route path="ask" element={<AskTutor />} />
        </Route>

        {/* ALFA */}
        <Route
          path="/alfa"
          element={
            <ProtectedRoute allowedRoles={["consumer"]}>
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ALFASection />} />
        </Route>

        {/* ADMIN DASHBOARD */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ContentManager />} />
          <Route path="page" element={<Dashboard />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="posters" element={<Posters />} />
          <Route path="schedule" element={<ScheduleManager />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="resumes" element={<ResumeManager />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* TUTOR DASHBOARD */}
        <Route
          path="/dashboard/tutor"
          element={
            <ProtectedRoute allowedRoles={["tutor"]}>
              <TutorDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Classes />} />
          <Route path="page" element={<TutorDashboardPage />} />
          <Route path="classes" element={<Classes />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="queries" element={<StudentQueries />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />

      </Routes>
    </>
  );
};

export default App;
