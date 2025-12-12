import React from "react";
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Video, 
  Award, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  Users,
  Download,
  Star
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
              <TrendingUp className="w-4 h-4 text-green-500" />
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

const CourseCard = ({ title, progress, module, duration, status }) => (
  <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{module}</span>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === "Active" ? "bg-blue-100 text-blue-800" :
        status === "Completed" ? "bg-green-100 text-green-800" :
        "bg-gray-100 text-gray-800"
      }`}>
        {status}
      </span>
    </div>
    
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">Progress</span>
        <span className="font-medium text-gray-800">{progress}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="w-4 h-4" />
        <span>{duration}</span>
      </div>
      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 text-sm">
        Continue
      </button>
    </div>
  </div>
);

const UpcomingClass = ({ title, time, tutor, type }) => (
  <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-blue-100">
        <Video className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-3 h-3" />
            <span>{tutor}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            type === "Live" ? "bg-red-100 text-red-800" :
            type === "Recorded" ? "bg-blue-100 text-blue-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {type}
          </span>
        </div>
        <button className="mt-3 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm">
          Join Class
        </button>
      </div>
    </div>
  </div>
);

export default function ConsumerDashboardPage() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Active Courses",
      value: "4",
      icon: BookOpen,
      color: "text-blue-500 bg-blue-500",
      trend: "+1 this week",
      onClick: () => navigate("/dashboard/consumer/modules")
    },
    {
      title: "Completed Assignments",
      value: "12",
      icon: FileText,
      color: "text-green-500 bg-green-500",
      trend: "+3 today",
      onClick: () => navigate("/dashboard/consumer/assignments")
    },
    {
      title: "Upcoming Classes",
      value: "5",
      icon: Calendar,
      color: "text-orange-500 bg-orange-500",
      onClick: () => navigate("/dashboard/consumer/schedule")
    },
    {
      title: "Learning Streak",
      value: "7",
      icon: Award,
      color: "text-purple-500 bg-purple-500",
      trend: "days",
      onClick: () => navigate("/dashboard/consumer/modules")
    },
  ];

  const activeCourses = [
    { id: 1, title: "React Fundamentals", progress: 75, module: "Module 4 of 6", duration: "2 weeks left", status: "Active" },
    { id: 2, title: "JavaScript Advanced", progress: 45, module: "Module 2 of 5", duration: "3 weeks left", status: "Active" },
    { id: 3, title: "CSS & Design Systems", progress: 90, module: "Module 5 of 5", duration: "4 days left", status: "Active" },
  ];

  const upcomingClasses = [
    { id: 1, title: "React Hooks Deep Dive", time: "10:00 AM", tutor: "Alex Johnson", type: "Live" },
    { id: 2, title: "JavaScript Async Patterns", time: "2:00 PM", tutor: "Sarah Miller", type: "Recorded" },
    { id: 3, title: "CSS Grid Workshop", time: "4:30 PM", tutor: "Mike Chen", type: "Live" },
  ];

  const recentAchievements = [
    { id: 1, title: "Course Completion", description: "Completed Web Development Basics", icon: Award, color: "bg-yellow-100 text-yellow-600" },
    { id: 2, title: "Perfect Score", description: "Scored 100% in JavaScript Quiz", icon: Star, color: "bg-blue-100 text-blue-600" },
    { id: 3, title: "Consistent Learner", description: "7-day learning streak", icon: CheckCircle, color: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="p-2 md:p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          Learning Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Track your progress and continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Courses */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Active Courses</h2>
            <button 
              onClick={() => navigate("/dashboard/consumer/modules")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>
          
          <div className="space-y-4">
            {activeCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate("/dashboard/consumer/assignments")}
                className="p-4 bg-white rounded-xl border border-blue-200 hover:shadow-md transition-shadow text-left"
              >
                <FileText className="w-5 h-5 text-blue-600 mb-2" />
                <p className="font-medium text-gray-800">View Assignments</p>
              </button>
              <button 
                onClick={() => navigate("/dashboard/consumer/ask")}
                className="p-4 bg-white rounded-xl border border-green-200 hover:shadow-md transition-shadow text-left"
              >
                <Users className="w-5 h-5 text-green-600 mb-2" />
                <p className="font-medium text-gray-800">Ask Tutor</p>
              </button>
              <button 
                onClick={() => navigate("/dashboard/consumer/classes")}
                className="p-4 bg-white rounded-xl border border-orange-200 hover:shadow-md transition-shadow text-left"
              >
                <Video className="w-5 h-5 text-orange-600 mb-2" />
                <p className="font-medium text-gray-800">Join Class</p>
              </button>
              <button 
                onClick={() => navigate("/dashboard/consumer/resume")}
                className="p-4 bg-white rounded-xl border border-purple-200 hover:shadow-md transition-shadow text-left"
              >
                <Download className="w-5 h-5 text-purple-600 mb-2" />
                <p className="font-medium text-gray-800">Upload Resume</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Upcoming Classes */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Classes</h2>
              <button 
                onClick={() => navigate("/dashboard/consumer/schedule")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All →
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <UpcomingClass key={classItem.id} {...classItem} />
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-6">Recent Achievements</h3>
            <div className="space-y-4">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${achievement.color}`}>
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Tips */}
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-800">Learning Tip</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Consistent daily practice is more effective than cramming. Try to spend at least 30 minutes every day on learning.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Today's goal: 60 min</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                45/60 min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Content */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <div className="p-3 rounded-xl bg-blue-100 w-fit mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">React State Management</h3>
            <p className="text-gray-600 text-sm mb-4">Master useState, useEffect, and Context API</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Start Learning →
            </button>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <div className="p-3 rounded-xl bg-green-100 w-fit mb-4">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">JavaScript Interview Prep</h3>
            <p className="text-gray-600 text-sm mb-4">Common interview questions and solutions</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Watch Now →
            </button>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <div className="p-3 rounded-xl bg-purple-100 w-fit mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Resume Building Workshop</h3>
            <p className="text-gray-600 text-sm mb-4">Create an impressive tech resume</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Join Workshop →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}