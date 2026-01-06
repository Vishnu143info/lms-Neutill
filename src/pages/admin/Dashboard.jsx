import React, { useEffect, useState } from "react";
import {
  Users,
  Wallet,
  BookOpen,
  Calendar,
  FileText,
  Download,
  Eye,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Zap,
  Shield,
  Bell,
  ChevronRight,
  UserPlus,
  DollarSign,
  FileUp,
  Video,
  Target,
  MoreVertical,
  Activity,
  Cpu,
  Database,
  HardDrive,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// Simple chart component for growth visualization
const GrowthChart = ({ percentage, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-gradient-to-r from-blue-500 to-cyan-400",
    green: "bg-gradient-to-r from-green-500 to-emerald-400",
    purple: "bg-gradient-to-r from-purple-500 to-pink-400",
    orange: "bg-gradient-to-r from-orange-500 to-amber-400",
  };

  return (
    <div className="relative mt-2">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

// Enhanced StatCard with growth indicator
const StatCard = ({ title, value, icon: Icon, color, growth, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border hover:border-transparent hover:scale-[1.02] relative overflow-hidden"
  >
    {/* Background decorative element */}
    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${color} opacity-10`} />
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-gray-500 text-sm mb-2 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
          
          {growth && (
            <div className="flex items-center gap-1">
              <TrendingUp className={`w-4 h-4 ${growth > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growth > 0 ? '+' : ''}{growth}%
              </span>
              <span className="text-gray-400 text-sm ml-2">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
      </div>
      
      {growth && <GrowthChart percentage={Math.abs(growth) * 3} color={color.split(' ')[1]?.replace('text-', '')} />}
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
          View details
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </div>
);

// Enhanced RecentUploads with file type icons
const RecentUploads = ({ uploads }) => {
  const getFileIcon = (type) => {
    if (type?.includes('video')) return <Video className="w-5 h-5 text-red-500" />;
    if (type?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type?.includes('image')) return <FileText className="w-5 h-5 text-green-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-purple-500" />
            Recent Uploads
          </h3>
          <p className="text-gray-500 text-sm mt-1">Latest content additions</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        {uploads.length > 0 ? uploads.map((file) => (
          <div 
            key={file.id} 
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white border hover:border-blue-200 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white shadow-sm border group-hover:bg-blue-50 transition-colors">
                {getFileIcon(file.type)}
              </div>
              <div>
                <p className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                  {file.name || file.title || "Untitled"}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(file.date || file.createdAt)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {file.size || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                title="Preview"
                onClick={() => window.open(file.url, '_blank')}
              >
                <Eye className="w-4 h-4 text-gray-600 hover:text-blue-600" />
              </button>
              <button 
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                title="Download"
                onClick={() => window.open(file.url, '_download')}
              >
                <Download className="w-4 h-4 text-gray-600 hover:text-green-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-8">
            <FileUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent uploads</p>
            <p className="text-gray-400 text-sm mt-1">Uploaded content will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Activity Feed
const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch(type) {
      case 'user': return <UserPlus className="w-4 h-4" />;
      case 'subscription': return <DollarSign className="w-4 h-4" />;
      case 'content': return <FileUp className="w-4 h-4" />;
      case 'schedule': return <Calendar className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            Recent Activity
          </h3>
          <p className="text-gray-500 text-sm mt-1">Platform updates & events</p>
        </div>
        <Bell className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
          >
            <div className={`p-2 rounded-lg ${activity.iconColor} bg-opacity-10`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1">
              <p className="font-medium text-gray-800">{activity.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.statusColor}`}>
                  {activity.status}
                </span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 group-hover:text-gray-600">
              {activity.detail || ''}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Last updated: Just now</span>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            See all activity <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// System Status with progress bars
const SystemStatus = () => {
  const [systemStats] = useState([
    { name: "Server", value: 95, color: "bg-gradient-to-r from-green-500 to-emerald-400", icon: Cpu },
    { name: "Database", value: 87, color: "bg-gradient-to-r from-blue-500 to-cyan-400", icon: Database },
    { name: "Storage", value: 78, color: "bg-gradient-to-r from-amber-500 to-orange-400", icon: HardDrive },
    { name: "API", value: 99, color: "bg-gradient-to-r from-purple-500 to-pink-400", icon: Zap },
  ]);

  return (
    <div className=" ">
      
      
      
      
    </div>
  );
};

// Quick Actions Component
const QuickActions = ({ onAction }) => (
 <div></div>
);

/* -------------------- MAIN DASHBOARD -------------------- */

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    subscriptions: 0,
    contents: 0,
    schedules: 0,
  });

  const [recentUploads, setRecentUploads] = useState([]);
  const [activities, setActivities] = useState([]);

  // Mock growth data (in a real app, this would come from comparing with previous period)
  const growthData = {
    users: 12.5,
    subscriptions: 8.3,
    contents: 25.7,
    schedules: -2.4, // Negative growth example
  };

  useEffect(() => {
    /* USERS */
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setStats((c) => ({ ...c, users: snap.size }));
    });

    /* ACTIVE SUBSCRIPTIONS */
    const unsubSubs = onSnapshot(
      query(collection(db, "users"), where("subscription.status", "==", "active")),
      (snap) => {
        setStats((c) => ({ ...c, subscriptions: snap.size }));
      }
    );

    /* CONTENTS + RECENT UPLOADS */
    const unsubContent = onSnapshot(
      query(collection(db, "contents"), orderBy("date", "desc")),
      (snap) => {
        setStats((c) => ({ ...c, contents: snap.size }));
        setRecentUploads(
          snap.docs.slice(0, 4).map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );

    /* UPCOMING SCHEDULES */
    const unsubSchedules = onSnapshot(
      query(collection(db, "schedules"), orderBy("date", "asc")),
      (snap) => {
        const upcoming = snap.docs.filter((d) => {
          const s = d.data();
          return new Date(`${s.date}T${s.time}`) > new Date();
        });
        setStats((c) => ({ ...c, schedules: upcoming.length }));
      }
    );

    /* ENHANCED ACTIVITY FEED */
    setActivities([
      { 
        title: "New user registered", 
        time: "5 minutes ago", 
        status: "Completed", 
        type: "user",
        statusColor: "bg-green-100 text-green-800",
        iconColor: "text-blue-500",
        detail: "Premium Plan"
      },
      { 
        title: "Content upload completed", 
        time: "25 minutes ago", 
        status: "Processed", 
        type: "content",
        statusColor: "bg-blue-100 text-blue-800",
        iconColor: "text-purple-500",
        detail: "Video Lecture"
      },
      { 
        title: "Monthly report generated", 
        time: "1 hour ago", 
        status: "Pending", 
        type: "content",
        statusColor: "bg-yellow-100 text-yellow-800",
        iconColor: "text-orange-500",
        detail: "PDF Export"
      },
      { 
        title: "Schedule conflict detected", 
        time: "2 hours ago", 
        status: "Resolved", 
        type: "schedule",
        statusColor: "bg-red-100 text-red-800",
        iconColor: "text-red-500",
        detail: "Auto-resolved"
      },
    ]);

    return () => {
      unsubUsers();
      unsubSubs();
      unsubContent();
      unsubSchedules();
    };
  }, []);

  const handleQuickAction = (action) => {
    switch(action) {
      case 'addUser':
        navigate("/dashboard/admin/users/new");
        break;
      case 'createSchedule':
        navigate("/dashboard/admin/schedule/new");
        break;
      case 'uploadContent':
        navigate("/dashboard/admin/content/upload");
        break;
      case 'viewAnalytics':
        navigate("/dashboard/admin/analytics");
        break;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Live Data</span>
            </div>
         
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* STATS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="text-blue-500"
          growth={growthData.users}
          onClick={() => navigate("/dashboard/admin/users")}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.subscriptions}
          icon={Wallet}
          color="text-green-500"
          growth={growthData.subscriptions}
          onClick={() => navigate("/dashboard/admin/subscriptions")}
        />
        <StatCard
          title="Content Items"
          value={stats.contents}
          icon={BookOpen}
          color="text-purple-500"
          growth={growthData.contents}
          onClick={() => navigate("/dashboard/admin/content")}
        />
        <StatCard
          title="Upcoming Classes"
          value={stats.schedules}
          icon={Calendar}
          color="text-orange-500"
          growth={growthData.schedules}
          onClick={() => navigate("/dashboard/admin/schedule")}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          <RecentUploads uploads={recentUploads} />
          
          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Performance Metrics
                </h3>
                <p className="text-gray-500 text-sm mt-1">Platform engagement & growth</p>
              </div>
              <select className="border rounded-lg px-3 py-2 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last quarter</option>
              </select>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-gray-800">87%</div>
                <div className="text-sm text-gray-500 mt-1">Engagement Rate</div>
                <div className="mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 inline mx-1" />
                  <span className="text-xs text-green-600">+5.2%</span>
                </div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-gray-800">4.2m</div>
                <div className="text-sm text-gray-500 mt-1">Avg. Session</div>
                <div className="mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 inline mx-1" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-gray-800">92%</div>
                <div className="text-sm text-gray-500 mt-1">Satisfaction</div>
                <div className="mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 inline mx-1" />
                  <span className="text-xs text-green-600">+3.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          <ActivityFeed activities={activities} />
          <SystemStatus />
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Data updates in real-time • Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
      </div>
    </div>
  );
}