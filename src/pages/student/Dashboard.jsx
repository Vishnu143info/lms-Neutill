import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  FileText,
  Award,
  ChevronRight,
  Clock,
  User,
  TrendingUp,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

/* ================= DASHBOARD PAGE ================= */

export default function Dashboard() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [contents, setContents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        /* ASSIGNMENTS */
        const assignmentsSnap = await getDocs(
          query(
            collection(db, "assignments"),
            where("status", "==", "Active")
          )
        );
        setAssignments(assignmentsSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })));

        /* CONTENTS */
        const contentsSnap = await getDocs(collection(db, "contents"));
        setContents(contentsSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })));

        /* SCHEDULES */
        const schedulesSnap = await getDocs(collection(db, "schedules"));
        setClasses(schedulesSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* HEADER */}
      <div className="relative">
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50" />
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
          Learning Dashboard
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Welcome back! Here's your learning overview
        </p>
        
        {/* Stats Summary */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Learning in progress</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">Last active: Today</span>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat
          title="Active Assignments"
          value={assignments.length}
          icon={FileText}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          onClick={() => navigate("/dashboard/consumer/modules")}
          trend={assignments.length > 0 ? "+2 this week" : null}
        />
        <Stat
          title="Learning Resources"
          value={contents.length}
          icon={BookOpen}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          onClick={() => navigate("/dashboard/consumer/modules")}
          trend={contents.length > 0 ? "+5 new" : null}
        />
        <Stat
          title="Upcoming Classes"
          value={classes.length}
          icon={Calendar}
          color="bg-gradient-to-br from-green-500 to-green-600"
          onClick={() => navigate("/dashboard/consumer/schedule")}
          trend={classes.length > 0 ? "This week" : null}
        />
        <Stat
          title="Learning Streak"
          value="7 Days"
          icon={Award}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          trend="🔥 3 days to gold"
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* ASSIGNMENTS SECTION */}
        <div className="lg:col-span-2 space-y-8">
          {/* ASSIGNMENTS */}
          <Section
            title="Active Assignments"
            subtitle="Tasks requiring your attention"
            actionLabel="View All Assignments"
            onAction={() => navigate("/dashboard/consumer/modules")}
          >
            {assignments.length === 0 ? (
              <Empty 
                text="No active assignments" 
                subtext="You're all caught up!"
                icon={Award}
              />
            ) : (
              <div className="space-y-4">
                {assignments.slice(0, 3).map(a => (
                  <Card
                    key={a.id}
                    onClick={() => navigate("/dashboard/consumer/modules")}
                    badge={
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        a.priority === 'High' 
                          ? 'bg-red-100 text-red-700' 
                          : a.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {a.priority || 'Normal'} Priority
                      </span>
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">{a.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {a.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {a.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-sm text-blue-600 font-medium">Active</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Section>

          {/* CONTENTS */}
          <Section
            title="Learning Resources"
            subtitle="Available study materials"
            actionLabel="Browse All Resources"
            onAction={() => navigate("/dashboard/consumer/modules")}
          >
            {contents.length === 0 ? (
              <Empty 
                text="No contents available" 
                subtext="Check back later for new materials"
                icon={BookOpen}
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {contents.slice(0, 4).map(c => (
                  <Card
                    key={c.id}
                    onClick={() => window.open(c.url, "_blank")}
                    className="hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        c.type === 'PDF' ? 'bg-red-50' :
                        c.type === 'Video' ? 'bg-blue-50' :
                        c.type === 'Document' ? 'bg-green-50' : 'bg-gray-50'
                      }`}>
                        <BookOpen className={`w-6 h-6 ${
                          c.type === 'PDF' ? 'text-red-600' :
                          c.type === 'Video' ? 'text-blue-600' :
                          c.type === 'Document' ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{c.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{c.type}</span>
                          <div className="flex items-center gap-1 text-blue-600 text-sm">
                            <Download className="w-4 h-4" />
                            <span>Open</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* UPCOMING CLASSES SIDEBAR */}
        <div className="space-y-8">
          <Section
            title="Upcoming Classes"
            subtitle="Your learning schedule"
            actionLabel="View Full Schedule"
            onAction={() => navigate("/dashboard/consumer/schedule")}
          >
            {classes.length === 0 ? (
              <Empty 
                text="No upcoming classes" 
                subtext="Schedule your next session"
                icon={Calendar}
              />
            ) : (
              <div className="space-y-4">
                {classes.slice(0, 4).map(c => (
                  <Card
                    key={c.id}
                    onClick={() => navigate("/dashboard/consumer/schedule")}
                    className="border-l-4 border-l-blue-500"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                          c.type === 'Live' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {c.type} Session
                        </span>
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">{c.className}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{c.date} • {c.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Tutor: {c.tutor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mb-2 ${
                          new Date(c.date) > new Date() 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`} />
                        <div className="w-px h-8 bg-gray-200" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Section>

          {/* LEARNING PROGRESS */}
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-xl">Learning Progress</h3>
                <p className="text-blue-200 text-sm">Your weekly activity</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-300" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-200">Completion Rate</span>
                <span className="font-bold">78%</span>
              </div>
              <div className="w-full bg-blue-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-blue-300 h-2 rounded-full w-3/4" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-200">Avg. Score</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="w-full bg-blue-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-green-300 h-2 rounded-full w-[92%]" />
              </div>
            </div>
            <button 
              onClick={() => navigate("/dashboard/consumer/modules")}
              className="w-full mt-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              Continue Learning
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

const Stat = ({ title, value, icon: Icon, color, onClick, trend }) => (
  <div
    onClick={onClick}
    className={`group bg-white p-6 rounded-2xl border shadow-sm transition-all duration-300
      ${onClick ? "cursor-pointer hover:shadow-xl hover:-translate-y-1" : ""}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      {trend && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-3 py-1 rounded-full">
          <span className="text-xs font-medium text-green-700">{trend}</span>
        </div>
      )}
    </div>
    {onClick && (
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-blue-600 group-hover:text-blue-700 font-medium">
          View Details
        </span>
        <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
      </div>
    )}
  </div>
);

const Section = ({ title, subtitle, actionLabel, onAction, children }) => (
  <div className="bg-white rounded-2xl border shadow-sm p-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {subtitle && (
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-2 sm:mt-0 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium group"
        >
          {actionLabel}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
    {children}
  </div>
);

const Card = ({ children, onClick, badge, className = "" }) => (
  <div
    onClick={onClick}
    className={`bg-white p-5 rounded-xl border shadow-sm transition-all duration-300 group
      ${onClick ? "cursor-pointer hover:shadow-md hover:border-blue-200" : ""}
      ${className}`}
  >
    {badge && <div className="mb-4">{badge}</div>}
    {children}
  </div>
);

const Empty = ({ text, subtext, icon: Icon }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-600 font-medium">{text}</p>
    {subtext && (
      <p className="text-gray-400 text-sm mt-1">{subtext}</p>
    )}
  </div>
);

/* ================= SKELETON ================= */

const DashboardSkeleton = () => (
  <div className="p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen animate-pulse">
    {/* Header Skeleton */}
    <div className="space-y-4">
      <div className="h-10 w-64 bg-gray-200 rounded-xl" />
      <div className="h-6 w-80 bg-gray-200 rounded" />
      <div className="flex gap-4">
        <div className="h-8 w-32 bg-gray-200 rounded-full" />
        <div className="h-8 w-40 bg-gray-200 rounded-full" />
      </div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-36 bg-white rounded-2xl border p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>

    {/* Main Content Skeleton */}
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between mb-6">
              <div>
                <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-60 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            <div className="space-y-4">
              {[1, 2].map(j => (
                <div key={j} className="h-24 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between mb-6">
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-60 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2].map(j => (
              <div key={j} className="h-28 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="h-64 bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6" />
      </div>
    </div>
  </div>
);