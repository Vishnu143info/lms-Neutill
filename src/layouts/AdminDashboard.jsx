import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Zap,
  BookOpen,
  Wallet,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronRight,
  Settings,
  Calendar,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin/page" },
  { label: "Content", icon: BookOpen, path: "/dashboard/admin/content" },
  { label: "Schedule", icon: Calendar, path: "/dashboard/admin/schedule" },
  { label: "Subscriptions", icon: Wallet, path: "/dashboard/admin/subscriptions" },
  { label: "Automation", icon: Zap, path: "/dashboard/admin/posters" },
  { label: "Users", icon: Users, path: "/dashboard/admin/users" },
  { label: "Resumes", icon: FileText, path: "/dashboard/admin/resume" },
];

const NavItem = ({ label, Icon, active, onClick, collapsed }) => (
  <motion.button
    whileHover={{ x: collapsed ? 0 : 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer w-full text-left transition-all duration-300 group ${
      active
        ? "bg-white shadow-lg text-blue-600"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
    }`}
  >
    {active && !collapsed && (
      <motion.div
        layoutId="activeTab"
        className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <div className={`p-2 rounded-lg transition-all duration-300 ${
      active 
        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" 
        : "bg-gray-100 group-hover:bg-gray-200 text-gray-600"
    }`}>
      <Icon className="w-4 h-4" />
    </div>
    {!collapsed && (
      <>
        <span className="font-medium flex-1 text-left">{label}</span>
        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
          active ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"
        }`} />
      </>
    )}
    {collapsed && active && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
      />
    )}
  </motion.button>
);

export default function AdminDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const sidebar = (collapsed = false) => (
    <nav className="flex flex-col h-full">
      {/* Sidebar Header - Only show in desktop expanded mode */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm">Admin</h1>
            </div>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className={`p-4 ${collapsed ? "pt-6" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`${collapsed ? "w-8 h-8" : "w-10 h-10"} rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold`}>
              A
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          {!collapsed && (
            <div className="transition-all duration-300">
              <p className="font-semibold text-gray-800 text-sm">Administrator</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            Icon={item.icon}
            active={pathname === item.path}
            collapsed={collapsed}
            onClick={() => {
              navigate(item.path);
              setIsMenuOpen(false);
            }}
          />
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className={`flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 rounded-lg font-semibold transition-all duration-300 w-full border border-red-200 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </nav>
  );

  // Mobile overlay
  const mobileOverlay = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isMenuOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={() => setIsMenuOpen(false)}
    />
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
      {/* Mobile Overlay */}
      {isMenuOpen && mobileOverlay}

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? "80px" : "280px" }}
        className="hidden lg:flex flex-col h-screen fixed bg-white shadow-2xl border-r border-gray-100 z-40"
      >
        {sidebar(isCollapsed)}
        
        {/* Collapse Button */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-6 p-2 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`} />
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isMenuOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 lg:hidden flex flex-col"
      >
        {/* Mobile Header */}
        
        
        {/* Mobile Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          {sidebar(false)}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isCollapsed ? "lg:ml-20" : "lg:ml-80"
      } p-4 md:p-6 min-h-screen`}>
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
                <h1 className="font-bold text-gray-800">Admin</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container - Adjusted for fixed mobile header */}
        <div className={`${isMobile ? 'pt-16' : ''}`}>
          {/* Desktop Header - Hidden on mobile */}
          <header className="hidden lg:flex justify-between items-center mb-8 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Administrator</p>
                  <p className="text-xs text-gray-500">Online</p>
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