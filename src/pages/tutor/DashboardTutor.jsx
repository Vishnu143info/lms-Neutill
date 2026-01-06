import React, { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Award,
  Clock,
  TrendingUp,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Star,
  Zap,
  BarChart3,
  Video,
  Bell,
  Plus,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

/* ================= STAT CARD ================= */

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon: Icon, color, trend, onClick }) => {
  // Define color mappings for different icon colors
  const colorMap = {
    "text-blue-500": {
      bg: "bg-blue-500",
      text: "text-blue-500",
      lightBg: "bg-blue-100",
      border: "border-blue-200"
    },
    "text-green-500": {
      bg: "bg-green-500",
      text: "text-green-500",
      lightBg: "bg-green-100",
      border: "border-green-200"
    },
    "text-orange-500": {
      bg: "bg-orange-500",
      text: "text-orange-500",
      lightBg: "bg-orange-100",
      border: "border-orange-200"
    },
    "text-purple-500": {
      bg: "bg-purple-500",
      text: "text-purple-500",
      lightBg: "bg-purple-100",
      border: "border-purple-200"
    },
  };

  const colors = colorMap[color] || colorMap["text-blue-500"];

  return (
    <div
      onClick={onClick}
      className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] overflow-hidden relative"
    >
      {/* Gradient accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${colors.bg} bg-opacity-10 rounded-full -translate-y-12 translate-x-12`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-xs text-green-600 font-medium">{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colors.text} ${colors.lightBg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        {onClick && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-600 group-hover:text-gray-800 font-medium">
              View details
            </span>
            <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= CLASS CARD ================= */

const UpcomingClass = ({ className, date, time, attendees, type, tutor }) => (
  <div className="group bg-white rounded-2xl p-5 shadow border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${type === "Live" ? "bg-green-100" : "bg-blue-100"}`}>
            {type === "Live" ? (
              <PlayCircle className={`w-5 h-5 ${type === "Live" ? "text-green-600" : "text-blue-600"}`} />
            ) : (
              <Video className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              type === "Live"
                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800"
            }`}
          >
            {type} Class
          </span>
        </div>
        
        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {className}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{date} • {time}</span>
          </div>
          {tutor && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Tutor: {tutor}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1 mb-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">{attendees || 0}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
          {attendees || 0}
        </div>
      </div>
    </div>

    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2 text-sm">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 border-2 border-white" />
          ))}
          <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
            +{Math.max(0, (attendees || 0) - 3)}
          </div>
        </div>
        <span className="text-gray-600">attending</span>
      </div>
      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 group-hover:from-orange-600 group-hover:to-amber-600">
        <PlayCircle className="w-4 h-4" />
        Start Class
      </button>
    </div>
  </div>
);

/* ================= QUERY CARD ================= */

const PendingQuery = ({ studentName, question, createdAt, subject, priority }) => {
  const timeAgo = (timestamp) => {
    if (!timestamp?.toDate) return "Just now";
    const now = new Date();
    const created = timestamp.toDate();
    const diff = now - created;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const priorityColor = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-blue-100 text-blue-700 border-blue-200"
  }[priority || "medium"];

  return (
    <div className="group bg-white rounded-2xl p-5 shadow border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
            {studentName?.charAt(0)?.toUpperCase() || "S"}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-800 truncate">{studentName || "Student"}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColor}`}>
                  {priority || "medium"} priority
                </span>
              </div>
              {subject && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-3 h-3" />
                  <span>{subject}</span>
                </div>
              )}
            </div>
            
          
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {question || "No question provided"}
          </p>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 flex-1 justify-center">
              <MessageSquare className="w-4 h-4" />
              Reply Now
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */

export default function TutorDashboardPage() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [queries, setQueries] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorDashboard = async () => {
      try {
        /* SCHEDULES */
        const schedulesSnap = await getDocs(collection(db, "schedules"));
        const schedulesData = schedulesSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));
        setClasses(schedulesData);

        /* STUDENTS */
        const usersSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "student"))
        );
        setStudentsCount(usersSnap.size);

        /* QUERIES (CHAT / ASK TUTOR) */
        const queriesSnap = await getDocs(
          query(collection(db, "chats"), where("status", "==", "Pending"))
        );
        setQueries(queriesSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })));

        /* ASSIGNMENTS */
        const assignmentsSnap = await getDocs(collection(db, "assignments"));
        setAssignments(assignmentsSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
      {/* HEADER */}
      <div className="relative">
        <div className="absolute -top-8 -left-8 w-48 h-48 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full blur-3xl opacity-60" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent">
                Tutor Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage your classes, students, and teaching activities
              </p>
            </div>
            
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Teaching now</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-600">Rating: 4.8/5.0</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Engagement: 92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Classes"
          value={classes.length}
          icon={Calendar}
          color="text-blue-500"
          trend={classes.length > 0 ? "+2 today" : null}
          onClick={() => navigate("/dashboard/tutor/classes")}
        />
       
        <StatCard
          title="Pending Queries"
          value={queries.length}
          icon={MessageSquare}
          color="text-orange-500"
          trend={queries.length > 0 ? "Require attention" : null}
          onClick={() => navigate("/dashboard/tutor/queries")}
        />
        <StatCard
          title="Assignments"
          value={assignments.length}
          icon={FileText}
          color="text-purple-500"
          trend={assignments.length > 0 ? "3 to grade" : null}
          onClick={() => navigate("/dashboard/tutor/assignments")}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid lg:grid-cols-1 gap-8">
        {/* UPCOMING CLASSES */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">Upcoming Classes</h2>
                <p className="text-gray-600 text-sm">Your scheduled teaching sessions</p>
              </div>
              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button
                  onClick={() => navigate("/dashboard/tutor/classes")}
                  className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium group text-sm"
                >
                  View All
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            {classes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No upcoming classes</p>
                <p className="text-gray-400 text-sm mt-1">Schedule your next class session</p>
              </div>
            ) : (
              <div className="space-y-4">
                {classes.slice(0, 4).map(c => (
                  <UpcomingClass key={c.id} {...c} />
                ))}
              </div>
            )}
          </div>

      
        </div>

     
      </div>
    </div>
  );
}

/* ================= SKELETON LOADER ================= */

const DashboardSkeleton = () => (
  <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen animate-pulse">
    {/* Header Skeleton */}
    <div className="space-y-4">
      <div className="h-10 w-64 bg-gray-200 rounded-xl" />
      <div className="h-6 w-80 bg-gray-200 rounded" />
      <div className="flex gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 w-32 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-36 bg-white rounded-2xl border p-6">
          <div className="flex justify-between">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-12 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>

    {/* Main Content Skeleton */}
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between mb-6">
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-60 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded-xl" />
              <div className="h-8 w-20 bg-gray-200 rounded-xl" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="h-64 bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-6" />
      </div>
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between mb-6">
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-60 bg-gray-200 rounded" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-xl" />
          </div>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="h-72 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border p-6" />
      </div>
    </div>
  </div>
);