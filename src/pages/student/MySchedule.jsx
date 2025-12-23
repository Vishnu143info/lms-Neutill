import React, { useState, useEffect } from "react";
// 1. Firebase Imports
import { db } from "../../firebase"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import { 
  Calendar, Clock, Users, Video, MapPin, 
  PlayCircle, CheckCircle, AlertCircle, Loader2, ExternalLink 
} from "lucide-react";

/**
 * ScheduleCard Component
 * Handles the display of individual class sessions and the Join logic
 */
const ScheduleCard = ({ className, date, time, tutor, duration, students, status, room, meetingUrl }) => {
  
  const handleJoinClass = () => {
    if (meetingUrl && meetingUrl.startsWith('http')) {
      window.open(meetingUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("The meeting link is not available yet or is invalid. Please contact your instructor.");
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'live': return 'bg-green-100 text-green-800 border-green-200 animate-pulse';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'live': return <PlayCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
      {/* Header: Title and Status */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
            <Calendar className="w-6 h-6 text-blue-600 group-hover:text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-xl mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
              {className}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDate(date)} • {time}</span>
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
        <span className={`px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest border ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          {status}
        </span>
      </div>

      {/* Instructor & Enrollment Info */}
      <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {tutor?.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{tutor}</p>
            <p className="text-xs text-gray-500 italic">{duration}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-800">{students}</p>
          <p className="text-[10px] text-gray-500 uppercase font-medium">Students</p>
        </div>
      </div>

      {/* Action Button: Logic changes based on Status */}
      <div className="flex gap-3">
        {status?.toLowerCase() === 'live' ? (
          <button 
            onClick={handleJoinClass}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-green-700 transition-all transform active:scale-95 shadow-green-100"
          >
            <Video className="w-5 h-5" /> 
            Join Live Class Now
            <ExternalLink className="w-4 h-4 opacity-70" />
          </button>
        ) : status?.toLowerCase() === 'upcoming' ? (
          <button 
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            onClick={() => alert("This class hasn't started yet. Please come back at the scheduled time.")}
          >
            Class Details
          </button>
        ) : (
          <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">
            View Recording
          </button>
        )}
      </div>
    </div>
  );
};

export default function MySchedule() {
  const [view, setView] = useState("upcoming");
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Real-time Firebase Sync
  useEffect(() => {
    const q = query(collection(db, "schedules"), orderBy("date", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scheduleData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSchedule(scheduleData);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter logic for Tabs
  const filteredSchedule = schedule.filter(item => {
    if (view === "upcoming") return item.status === "Upcoming" || item.status === "Live";
    if (view === "past") return item.status === "Completed";
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500 font-medium">Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 My Class Schedule</h1>
        <p className="text-gray-500">Your synchronized learning timeline</p>
      </div>

      {/* View Toggle (Tabs) */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
        {["upcoming", "past", "all"].map((viewType) => (
          <button
            key={viewType}
            onClick={() => setView(viewType)}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              view === viewType
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
          </button>
        ))}
      </div>

      {/* Schedule List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchedule.length > 0 ? (
          filteredSchedule.map((classItem) => (
            <ScheduleCard key={classItem.id} {...classItem} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No {view} classes found</h3>
            <p className="text-gray-400 text-sm">Check back later for new updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}