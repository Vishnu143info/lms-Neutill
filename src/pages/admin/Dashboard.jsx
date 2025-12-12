import React from "react";
import {
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Wallet,
  Zap,
  FileText,
  Download,
  Eye,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color, trend, onClick }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-[1.02] cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-green-600 text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
      <Clock className="w-5 h-5 text-gray-500" />
    </div>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
          <div className={`p-2 rounded-lg ${activity.bgColor}`}>
            <activity.icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{activity.title}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.statusColor}`}>
            {activity.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const QuickAction = ({ title, description, icon: Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group flex items-center gap-4 w-full text-left"
  >
    <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
  </button>
);

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      icon: Users,
      color: "text-blue-500 bg-blue-500",
      trend: "+12%",
      onClick: () => navigate("/dashboard/admin/users")
    },
    {
      title: "Active Subscriptions",
      value: "856",
      icon: Wallet,
      color: "text-green-500 bg-green-500",
      trend: "+8%",
      onClick: () => navigate("/dashboard/admin/subscriptions")
    },
    {
      title: "Content Items",
      value: "324",
      icon: BookOpen,
      color: "text-purple-500 bg-purple-500",
      trend: "+15%",
      onClick: () => navigate("/dashboard/admin/content")
    },
    {
      title: "Upcoming Classes",
      value: "28",
      icon: Calendar,
      color: "text-orange-500 bg-orange-500",
      onClick: () => navigate("/dashboard/admin/schedule")
    },
  ];

  const activities = [
    {
      title: "New user registration",
      time: "2 minutes ago",
      icon: Users,
      bgColor: "bg-blue-500",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      title: "Content upload",
      time: "15 minutes ago",
      icon: BookOpen,
      bgColor: "bg-purple-500",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      title: "Subscription upgrade",
      time: "1 hour ago",
      icon: Wallet,
      bgColor: "bg-green-500",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      title: "Schedule update",
      time: "2 hours ago",
      icon: Calendar,
      bgColor: "bg-orange-500",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-800"
    },
  ];

  const quickActions = [
    {
      title: "Upload New Content",
      description: "Add PDFs, videos, or workshops",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
      onClick: () => navigate("/dashboard/admin/content")
    },
    {
      title: "Create Schedule",
      description: "Add new class schedules",
      icon: Calendar,
      color: "bg-orange-100 text-orange-600",
      onClick: () => navigate("/dashboard/admin/schedule")
    },
    {
      title: "Manage Subscriptions",
      description: "Update user plans",
      icon: Wallet,
      color: "bg-green-100 text-green-600",
      onClick: () => navigate("/dashboard/admin/subscriptions")
    },
    {
      title: "Upload Posters",
      description: "Add promotional materials",
      icon: Zap,
      color: "bg-purple-100 text-purple-600",
      onClick: () => navigate("/dashboard/admin/posters")
    },
  ];

  return (
    <div className="p-2 md:p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2">Monitor and manage your platform efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <QuickAction key={index} {...action} />
              ))}
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Uploads</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Document_{item}.pdf</p>
                      <p className="text-sm text-gray-500">Uploaded 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-white transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity activities={activities} />
          
          {/* System Status */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Server Status</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Database</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">Storage</span>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  78% Used
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}