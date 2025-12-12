import React from "react";
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle,
  Home,
  Video,
  BookOpen,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color, onClick }) => {
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
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const UpcomingClass = ({ title, time, students, status }) => (
  <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{time}</span>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === "Upcoming" ? "bg-blue-100 text-blue-800" :
        status === "Live" ? "bg-green-100 text-green-800" :
        "bg-gray-100 text-gray-800"
      }`}>
        {status}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">{students} students</span>
      </div>
      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 text-sm">
        Start Class
      </button>
    </div>
  </div>
);

const PendingQuery = ({ student, question, time }) => (
  <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
        {student.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-gray-800">{student}</p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{question}</p>
        <button className="mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 text-sm">
          Reply
        </button>
      </div>
    </div>
  </div>
);

export default function TutorDashboardPage() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Today's Classes",
      value: "5",
      icon: Calendar,
      color: "text-blue-500 bg-blue-500",
      onClick: () => navigate("/dashboard/tutor/classes")
    },
    {
      title: "Active Students",
      value: "48",
      icon: Users,
      color: "text-green-500 bg-green-500",
      onClick: () => navigate("/dashboard/tutor/students")
    },
    {
      title: "Pending Queries",
      value: "12",
      icon: MessageSquare,
      color: "text-orange-500 bg-orange-500",
      onClick: () => navigate("/dashboard/tutor/queries")
    },
    {
      title: "Assignments",
      value: "8",
      icon: FileText,
      color: "text-purple-500 bg-purple-500",
      onClick: () => navigate("/dashboard/tutor/assignments")
    },
  ];

  const upcomingClasses = [
    { id: 1, title: "React Advanced Patterns", time: "10:00 AM - 12:00 PM", students: 24, status: "Upcoming" },
    { id: 2, title: "JavaScript Fundamentals", time: "02:00 PM - 04:00 PM", students: 18, status: "Upcoming" },
    { id: 3, title: "Web Development Bootcamp", time: "04:30 PM - 06:30 PM", students: 32, status: "Live" },
  ];

  const pendingQueries = [
    { id: 1, student: "John Doe", question: "Can you explain the concept of React hooks in more detail?", time: "2 min ago" },
    { id: 2, student: "Sarah Miller", question: "I'm having trouble with the assignment on asynchronous JavaScript", time: "15 min ago" },
    { id: 3, student: "Alex Johnson", question: "Could you review my project code?", time: "1 hour ago" },
  ];

  return (
    <div className="p-2 md:p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          Tutor Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage your teaching schedule and student interactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Classes */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Classes</h2>
            <button 
              onClick={() => navigate("/dashboard/tutor/classes")}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <UpcomingClass key={classItem.id} {...classItem} />
            ))}
          </div>

          {/* Performance Stats */}
          <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-800">Performance Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-800">4.8★</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">95%</p>
                <p className="text-sm text-gray-600">Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">24</p>
                <p className="text-sm text-gray-600">Hours Taught</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">12</p>
                <p className="text-sm text-gray-600">Active Courses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Queries */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Pending Queries</h2>
            <button 
              onClick={() => navigate("/dashboard/tutor/queries")}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>
          
          <div className="space-y-4">
            {pendingQueries.map((query) => (
              <PendingQuery key={query.id} {...query} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate("/dashboard/tutor/classes")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-xl border border-orange-200 transition-all duration-300"
              >
                <Calendar className="w-5 h-5 text-orange-600 mb-2" />
                <p className="font-medium text-gray-800">Schedule Class</p>
              </button>
              <button 
                onClick={() => navigate("/dashboard/tutor/assignments")}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all duration-300"
              >
                <FileText className="w-5 h-5 text-blue-600 mb-2" />
                <p className="font-medium text-gray-800">Create Assignment</p>
              </button>
              <button 
                onClick={() => navigate("/dashboard/tutor/queries")}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border border-green-200 transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5 text-green-600 mb-2" />
                <p className="font-medium text-gray-800">Answer Queries</p>
              </button>
              <button 
                onClick={() => navigate("/dashboard/tutor/students")}
                className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 rounded-xl border border-purple-200 transition-all duration-300"
              >
                <Users className="w-5 h-5 text-purple-600 mb-2" />
                <p className="font-medium text-gray-800">View Students</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}