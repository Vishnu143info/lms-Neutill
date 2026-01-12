    import React from "react";
    import { Routes, Route, Navigate } from "react-router-dom";

    import PublicLayout from "./layouts/PublicLayout";
    import ProtectedRoute from "./components/ProtectedRoute";
    import BackToTop from "./components/BackToTop";
import PosterDetailsPage from "./pages/PosterDetailsPage";
import SendMail from "./pages/admin/SendMail";
import AllUpdates from "./pages/AllUpdates";


    

    /* -------- PUBLIC PAGES -------- */
    import Home from "./pages/Home";
 
    import Login from "./pages/Login";
    import Logout from "./pages/Logout";
    import SignUp from "./components/SignUp";
    import CheckoutPage from "./components/CheckoutPage";

    import ServiceDetail from "./components/Service/ServiceDetails";
    import IndustryDetail from "./components/Industries/IndustriesDetails";

    import TechManthanaPage from "./pages/TechManthanaPage";
    import ALFASection from "./pages/Alfa/ALFASection";
    import BlogPage from "./pages/BlogPage";
    import ScrollToTop from "./components/ScrollToTop";
    import SubscribePage from "./components/SubscribePage";

    /* -------- DASHBOARD LAYOUTS -------- */
    import ConsumerDashboard from "./layouts/ConsumerDashboard";
    import AdminDashboard from "./layouts/AdminDashboard";
    import TutorDashboard from "./layouts/TutorDashboard";

    /* -------- STUDENT (CONSUMER) -------- */
    import ConsumerDashboardPage from "./pages/student/Dashboard";
    import MyModules from "./pages/student/MyModules";
    import MySchedule from "./pages/student/MySchedule";
    import ResumeUpload from "./pages/student/ResumeUpload";
    import AskTutor from "./pages/student/AskTutor";
    import LearningPath from "./pages/student/LearningPath";


    /* -------- ADMIN -------- */
    import Dashboard from "./pages/admin/Dashboard";
    import Posters from "./pages/admin/Posters";
    import ContentManager from "./pages/admin/ContentManager";
    import ScheduleManager from "./pages/admin/ScheduleManager";
    import Subscriptions from "./pages/admin/Subscriptions";
    import ResumeManager from "./pages/admin/ResumeManager";
    import Users from "./pages/admin/Users";

    /* -------- TUTOR -------- */
    import TutorDashboardPage from "../src/pages/tutor/DashboardTutor"
    import Classes from "./pages/tutor/Classes";
    import Assignments from "./pages/tutor/Assignments";
    import StudentQueries from "./pages/tutor/StudentQueries";

    import PaymentSuccessPage from "./components/PaymentSuccessPage";
    import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";



    const App = () => {
      return (
        <>
          
 <ScrollToTop />
      <BackToTop />
          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><SignUp /></PublicLayout>} />
            <Route path="/logout" element={<PublicLayout><Logout /></PublicLayout>} />

              <Route path="/subscribe" element={<PublicLayout><SubscribePage/></PublicLayout>} />
              <Route
  path="/checkout"
  element={
    <PublicLayout>
      <CheckoutPage />
    </PublicLayout>
  }
/>
<Route
  path="/tech-manthana/blog/:id"
  element={
    <PublicLayout>
      <PosterDetailsPage />
    </PublicLayout>
  }
/>
<Route
  path="/tech-manthana/updates"
  element={
    <PublicLayout>
      <AllUpdates />
    </PublicLayout>
  }
/>


<Route
  path="/payment-success"
  element={
    <PublicLayout>
      <PaymentSuccessPage />
    </PublicLayout>
  }
/>
<Route
  path="/terms"
  element={
    <PublicLayout>
      <TermsAndConditions />
    </PublicLayout>
  }
/>

<Route
  path="/privacy"
  element={
    <PublicLayout>
      <PrivacyPolicy />
    </PublicLayout>
  }
/>



            <Route path="/services/:serviceId" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
           
            <Route path="/industries/:industryId" element={<PublicLayout><IndustryDetail /></PublicLayout>} />

            <Route path="/tech-manthana" element={<PublicLayout><TechManthanaPage /></PublicLayout>} />
            <Route path="/tech-manthana/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />

            {/* ================= CONSUMER ================= */}
            <Route
              path="/dashboard/consumer"
              element={
                <ProtectedRoute allowedRoles={["consumer"]}>
                  <ConsumerDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<ConsumerDashboardPage />} />
              <Route path="page" element={<ConsumerDashboardPage />} />
              <Route path="modules" element={<MyModules />} />
              <Route path="schedule" element={<MySchedule />} />
              <Route path="resume" element={<ResumeUpload />} />
              <Route path="ask" element={<AskTutor />} />
               <Route path="path" element={<LearningPath/>} />
              
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

            {/* ================= ADMIN ================= */}
          <Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="users" element={<Users />} />
<Route path="send-mail" element={<SendMail />} />


              <Route index element={<Dashboard />} />
              <Route path="page" element={<Dashboard />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="posters" element={<Posters />} />
              <Route path="schedule" element={<ScheduleManager />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="resume" element={<ResumeManager />} />
              <Route path="users" element={<Users />} />
            </Route>

            {/* ================= TUTOR ================= */}
          <Route
  path="/dashboard/tutor"
  element={
    <ProtectedRoute allowedRoles={["tutor", "admin"]}>
      <TutorDashboard />
    </ProtectedRoute>
  }
>

              <Route index element={<TutorDashboardPage />} />
              <Route path="page" element={<TutorDashboardPage />} />
              <Route path="classes" element={<Classes />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="queries" element={<StudentQueries />} />
            </Route>

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      );
    };

    export default App;
