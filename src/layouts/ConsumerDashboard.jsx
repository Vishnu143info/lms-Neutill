import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  Award,
  LogOut,
  Bell,
  ChevronRight,
  Menu,
  X,
  Lock,
  Sparkles,
  User,
  Crown,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ================= PLAN ACCESS ================= */
const NORMALIZE_PLAN = (rawPlan) => {
  if (!rawPlan) return "Starter";

  const name = rawPlan.toLowerCase();

  if (name.includes("starter")) return "Starter";
  if (name.includes("premium")) return "Premium";
  if (name.includes("pro")) return "Pro Learner";
  if (name.includes("platinum") || name.includes("elite")) return "Elite Scholar";

  return "Starter";
};

const PLAN_ACCESS = {
  Starter: {
    page :false,
    modules: true,
    schedule: false,
    resume: false,
    askTutor: false,
  },
  Premium: {
    page:true,
    modules: true,
    schedule: true,
    resume: true,
    askTutor: false, // 🔴 STILL FALSE
  },
  "Pro Learner": {
    page :true,
    modules: true,
    schedule: true,
    resume: true,
    askTutor: false,
  },
  "Elite Scholar": {
    page : true,
    modules: true,
    schedule: true,
    resume: true,
    askTutor: true, // ✅ ONLY HERE
  },
};


/* ================= PLAN COLORS & STYLES ================= */
const PLAN_STYLES = {
  Starter: {
    color: "text-gray-600",
    bg: "bg-gradient-to-r from-gray-50 to-gray-100",
    border: "border-gray-200",
    accent: "bg-gray-500",
    icon: null,
  },
  Premium: {
    color: "text-blue-600",
    bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
    border: "border-blue-200",
    accent: "bg-gradient-to-r from-blue-500 to-indigo-500",
    icon: <Sparkles className="w-3 h-3" />,
  },
  "Pro Learner": {
    color: "text-purple-600",
    bg: "bg-gradient-to-r from-purple-50 to-pink-50",
    border: "border-purple-200",
    accent: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: <Crown className="w-3 h-3" />,
  },
  "Elite Scholar": {
    color: "text-amber-600",
    bg: "bg-gradient-to-r from-amber-50 to-orange-50",
    border: "border-amber-200",
    accent: "bg-gradient-to-r from-amber-500 to-orange-500",
    icon: <Crown className="w-3 h-3" />,
  },
};

/* ================= NAV ITEMS ================= */
const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard/consumer/page", icon: Home,requires: "page" },
  { label: "My Modules", path: "/dashboard/consumer/modules", icon: BookOpen, requires: "modules" },
  { label: "My Schedule", path: "/dashboard/consumer/schedule", icon: Calendar, requires: "schedule" },
  { label: "Ask Tutor", path: "/dashboard/consumer/ask", icon: MessageSquare, requires: "askTutor" },
  { label: "Resume", path: "/dashboard/consumer/resume", icon: Award, requires: "resume" },
];

/* ================= NAV ITEM ================= */
const NavItem = ({ item, active, locked, onClick, planStyle }) => {
  const Icon = item.icon;

  return (
    <motion.div
      whileHover={{ x: locked ? 0 : 4, scale: locked ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
        active
          ? `bg-gradient-to-r ${planStyle.bg.replace('50', '100')} ${planStyle.color} border-l-4 ${planStyle.border.replace('200', '500')} shadow-sm`
          : locked
          ? "text-gray-400 bg-gray-50 hover:bg-gray-100"
          : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm"
      }`}
    >
      {/* Icon Container with Plan Accent */}
      <div
        className={`p-2.5 rounded-xl transition-all duration-300 ${
          active
            ? `${planStyle.accent} text-white shadow-md`
            : locked
            ? "bg-gray-200 text-gray-400"
            : "bg-gradient-to-br from-white to-gray-50 text-gray-600 shadow-sm"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1">
        <span className="font-semibold">{item.label}</span>
        {locked && (
          <p className="text-xs text-gray-500 mt-0.5">Upgrade to unlock</p>
        )}
      </div>

      {locked ? (
        <Lock className="w-4 h-4 text-gray-400" />
      ) : (
        active && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-1 rounded-full ${planStyle.accent} text-white`}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )
      )}
    </motion.div>
  );
};

export default function ConsumerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* ================= PLAN DETECTION (SAFE) ================= */
  const planName = NORMALIZE_PLAN(
    user?.subscription?.planName || user?.planName
  );
  const access = PLAN_ACCESS[planName];
  const planStyle = PLAN_STYLES[planName];

  /* ================= SIDEBAR ================= */
  const sidebar = (
    <nav className="flex flex-col h-full p-5 space-y-6 bg-gradient-to-b from-white to-gray-50">
      {/* Header with Logo */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-10 h-10 rounded-xl ${planStyle.accent} flex items-center justify-center`}>
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            LearnHub
          </h1>
          <p className="text-xs text-gray-500">Student Dashboard</p>
        </div>
      </div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 rounded-2xl ${planStyle.bg} border ${planStyle.border} shadow-sm`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2.5 rounded-xl ${planStyle.bg} border ${planStyle.border}`}>
            <User className={`w-5 h-5 ${planStyle.color}`} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-800 truncate">{user?.name || "Student"}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-sm font-semibold ${planStyle.color}`}>
                {planName} Plan
              </span>
              {planStyle.icon && (
                <div className={`p-1 rounded ${planStyle.bg}`}>
                  {planStyle.icon}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Plan Progress</span>
            <span>0%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "0%" }}
              className={`h-full ${planStyle.accent}`}
            />
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex-1 space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
          Navigation
        </h3>
        {NAV_ITEMS.map((item) => {
          const locked = item.requires && !access[item.requires];
          const active = pathname === item.path;

          return (
            <NavItem
              key={item.label}
              item={item}
              active={active}
              locked={locked}
              planStyle={planStyle}
              onClick={() => {
                if (locked) {
                  navigate("/subscribe");
                } else {
                  navigate(item.path);
                }
                setIsMenuOpen(false);
              }}
            />
          );
        })}
      </div>

      {/* Logout */}
    {/* Logout Button in sidebar */}
<motion.button
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => {
    logout(); // Remove async/await since logout might not return a promise
    navigate("/login");
    setIsMenuOpen(false);
  }}
  className="group mt-auto p-4 rounded-2xl bg-gradient-to-r from-white to-gray-50 border border-gray-200 hover:border-red-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 shadow-sm"
>
  <div className="flex items-center justify-center gap-3">
    <div className="p-2 bg-red-100 group-hover:bg-red-200 rounded-lg transition-colors">
      <LogOut className="w-4 h-4 text-red-600 group-hover:text-red-700" />
    </div>
    <span className="font-semibold text-gray-700 group-hover:text-red-600">
      Logout
    </span>
  </div>
</motion.button>
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-80 bg-white shadow-2xl fixed h-screen z-40 border-r border-gray-200/60"
      >
        {sidebar}
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isMenuOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed z-50 lg:hidden bg-white w-80 h-full shadow-2xl"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${planStyle.accent}`} />
            <span className="font-bold text-lg">Menu</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          {sidebar}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 p-5">
        {/* Mobile Header */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:hidden flex justify-between items-center mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-200"
        >
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl ${planStyle.bg} border ${planStyle.border} flex items-center justify-center`}>
                <User className={`w-5 h-5 ${planStyle.color}`} />
              </div>
              <span className="font-medium text-gray-800 hidden sm:block">
                {user?.name?.split(' ')[0] || "Student"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-200/60 p-6 md:p-8 min-h-[calc(100vh-140px)]"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}