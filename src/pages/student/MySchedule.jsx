import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  MapPin,
  ChevronRight,
  Download,
  Bell,
  PlayCircle,
  MoreVertical,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const ScheduleCard = ({ className, date, time, tutor, duration, students, status, room }) => {
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'live': return <PlayCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-xl mb-2 group-hover:text-blue-600 transition-colors">
              {className}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDate(date)} • {time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{duration}</span>
              </div>
              {room && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{room}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            {status}
          </span>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              {tutor.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-medium text-gray-800">{tutor}</p>
              <p className="text-sm text-gray-500">Instructor</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div>
            <p className="font-medium text-gray-800">{students} students</p>
            <p className="text-sm text-gray-500">Enrolled</p>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex gap-3">
        {status === 'Live' ? (
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
            <Video className="w-5 h-5" />
            Join Class Now
          </button>
        ) : status === 'Upcoming' ? (
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
            Add to Calendar
          </button>
        ) : (
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-medium">
            View Recording
          </button>
        )}
        <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium">
          Details
        </button>
      </div>
    </div>
  );
};

export default function MySchedule() {
  const [view, setView] = useState("upcoming"); // upcoming, past, all
  const [schedule, setSchedule] = useState([
    { 
      id: 1, 
      className: "React Advanced Fundamentals", 
      date: "2025-01-20", 
      time: "10:00 AM - 12:00 PM", 
      tutor: "Alex Johnson",
      duration: "2 hours",
      students: 24,
      status: "Upcoming",
      room: "Virtual Room A"
    },
    { 
      id: 2, 
      className: "JavaScript OOP Masterclass", 
      date: "2025-01-22", 
      time: "02:00 PM - 04:00 PM", 
      tutor: "Sarah Miller",
      duration: "2 hours",
      students: 18,
      status: "Live",
      room: "Live Session"
    },
    { 
      id: 3, 
      className: "Web Development Bootcamp", 
      date: "2025-01-25", 
      time: "04:30 PM - 06:30 PM", 
      tutor: "Mike Chen",
      duration: "2 hours",
      students: 32,
      status: "Upcoming",
      room: "Virtual Room B"
    },
    { 
      id: 4, 
      className: "Node.js Backend Workshop", 
      date: "2025-01-18", 
      time: "11:00 AM - 01:00 PM", 
      tutor: "David Wilson",
      duration: "2 hours",
      students: 28,
      status: "Completed",
      room: "Recorded"
    },
    { 
      id: 5, 
      className: "UI/UX Design Principles", 
      date: "2025-01-19", 
      time: "03:00 PM - 05:00 PM", 
      tutor: "Emma Davis",
      duration: "2 hours",
      students: 22,
      status: "Completed",
      room: "Recorded"
    },
    { 
      id: 6, 
      className: "Data Structures & Algorithms", 
      date: "2025-01-24", 
      time: "09:00 AM - 12:00 PM", 
      tutor: "Robert Brown",
      duration: "3 hours",
      students: 30,
      status: "Upcoming",
      room: "Virtual Room C"
    },
  ]);

  const upcomingCount = schedule.filter(item => item.status === "Upcoming" || item.status === "Live").length;
  const pastCount = schedule.filter(item => item.status === "Completed").length;

  const filteredSchedule = schedule.filter(item => {
    if (view === "upcoming") return item.status === "Upcoming" || item.status === "Live";
    if (view === "past") return item.status === "Completed";
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-900 bg-clip-text text-transparent mb-2">
            📅 My Class Schedule
          </h1>
          <p className="text-gray-600">Manage and join your upcoming classes and workshops</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-medium">
            + Add Personal Event
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Classes</p>
              <p className="text-3xl font-bold text-gray-800">{upcomingCount}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2 text-sm text-blue-600 flex items-center gap-1">
            <ChevronRight className="w-4 h-4" />
            <span>View all upcoming</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Live Now</p>
              <p className="text-3xl font-bold text-gray-800">1</p>
            </div>
            <Video className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
            <ChevronRight className="w-4 h-4" />
            <span>Join live class</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-800">{pastCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-2 text-sm text-purple-600 flex items-center gap-1">
            <ChevronRight className="w-4 h-4" />
            <span>View recordings</span>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-8">
        {["upcoming", "past", "all"].map((viewType) => (
          <button
            key={viewType}
            onClick={() => setView(viewType)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              view === viewType
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {viewType === "upcoming" ? `Upcoming (${upcomingCount})` : 
             viewType === "past" ? `Past (${pastCount})` : 
             `All Classes (${schedule.length})`}
          </button>
        ))}
      </div>

      {/* Schedule Calendar View */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800 text-lg">This Week's Schedule</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View Full Calendar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className={`p-3 rounded-lg ${
                index === 1 ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600'
              }`}>
                <p className="text-sm mb-1">{day}</p>
                <p className="text-lg">{20 + index}</p>
              </div>
              <div className="mt-2">
                {index === 1 && (
                  <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto"></div>
                )}
                {index === 3 && (
                  <div className="h-2 w-2 bg-green-500 rounded-full mx-auto"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-6">
        {filteredSchedule.length > 0 ? (
          filteredSchedule.map((classItem) => (
            <ScheduleCard key={classItem.id} {...classItem} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No classes found</h3>
            <p className="text-gray-500">You don't have any {view} classes scheduled</p>
            <button className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-medium">
              Browse Available Classes
            </button>
          </div>
        )}
      </div>

      {/* Empty slot for next class */}
      {filteredSchedule.length > 0 && view === "upcoming" && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Ready for your next class?</h3>
              <p className="text-gray-600">Your next class starts in 2 hours 30 minutes</p>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-xl">02:30:00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}