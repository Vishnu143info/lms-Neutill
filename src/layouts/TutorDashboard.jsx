import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Video,
  FileText,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Users,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  Download,
  Eye,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, path: "/dashboard/tutor/page" },
  { label: "Classes", icon: Video, path: "/dashboard/tutor/classes" },
  { label: "Assignments", icon: FileText, path: "/dashboard/tutor/assignments" },
  { label: "Student Queries", icon: MessageSquare, path: "/dashboard/tutor/queries" },
  // { label: "Schedule", icon: Calendar, path: "/dashboard/tutor/schedule" },
  // { label: "Students", icon: Users, path: "/dashboard/tutor/students" },
];

const NavItem = ({ label, Icon, active, onClick }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer w-full text-left transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 border-l-4 border-orange-500"
        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
    }`}
  >
    <div className={`p-2 rounded-lg ${
      active 
        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white" 
        : "bg-gray-100 text-gray-600"
    }`}>
      <Icon className="w-4 h-4" />
    </div>
    <span className="font-medium flex-1">{label}</span>
    {active && (
      <ChevronRight className="w-4 h-4 text-orange-500" />
    )}
  </motion.button>
);

export default function TutorDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const sidebar = (
    <nav className="flex flex-col h-full p-4">
      {/* User Profile */}
    

      {/* Navigation */}
      <div className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            Icon={item.icon}
            active={pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setIsMenuOpen(false);
            }}
          />
        ))}
      </div>

      {/* Stats */}
    

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/")}
        className="mt-4 flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 rounded-xl font-medium transition-all duration-300 border border-red-200"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </motion.button>
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50/30 to-amber-50/30 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen fixed bg-white shadow-2xl border-r border-gray-100 z-40">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Tutor Portal
              </h1>
              <p className="text-xs text-gray-500">Teaching Dashboard</p>
            </div>
          </div>
        </div>

        {sidebar}
      </aside>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isMenuOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 lg:hidden flex flex-col"
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white">
              👨‍🏫
            </div>
            <h1 className="text-xl font-bold text-gray-800">Tutor Portal</h1>
          </div>
          <button 
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sidebar}
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 p-4 md:p-6 min-h-screen">
        {/* Fixed Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-30 border-b border-gray-100">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 shadow-sm"
                onClick={toggleMenu}
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="font-bold text-gray-800">Tutor Portal</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-orange-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="lg:pt-0 pt-16">
          {/* Desktop Header */}
          <header className="hidden lg:flex justify-between items-center mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                Welcome, Tutor!
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage your classes and help students succeed</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Tutor User</p>
                  <p className="text-xs text-gray-500">Senior Instructor</p>
                </div>
              </div>
            </div>
          </header>

          {/* Nested pages render here */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}