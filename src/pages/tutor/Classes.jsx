import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, getDocs } from "firebase/firestore";
import { 
  Calendar, Clock, Users, PlayCircle, Loader2, User, XCircle, 
  ChevronRight, Sparkles, Zap, TrendingUp, Filter, Search, 
  BookOpen, Video, GraduationCap, Star, Eye, CalendarDays,
  TrendingDown
} from "lucide-react";

const ClassCard = ({ classItem, onStart }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      onStart(classItem.id);
    }, 800);
  };

  const isLive = classItem.type === "Live";
  const isUpcoming = classItem.status === "upcoming";
  const isPopular = classItem.attendees > 50;

  // Calculate time until class
  const getTimeStatus = () => {
    if (!classItem.dateTime) return null;
    const now = new Date();
    const classTime = new Date(classItem.dateTime);
    const diffHours = (classTime - now) / (1000 * 60 * 60);
    
    if (diffHours < 0) return { text: "Completed", color: "bg-gray-100 text-gray-700" };
    if (diffHours < 1) return { text: "Starting Soon", color: "bg-red-100 text-red-700" };
    if (diffHours < 24) return { text: "Today", color: "bg-orange-100 text-orange-700" };
    return { text: "Upcoming", color: "bg-blue-100 text-blue-700" };
  };

  const timeStatus = getTimeStatus();

  return (
    <div 
      className="group relative bg-gradient-to-br from-white to-white/90 backdrop-blur-xl rounded-3xl p-1 shadow-xl hover:shadow-2xl transition-all duration-500 mb-6 overflow-hidden border border-gray-100/50 hover:border-orange-200/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
        isLive ? 'bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-green-500/5' 
        : 'bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-orange-500/5'
      }`} />
      
      {/* Floating particles effect */}
      {isHovered && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400/30 rounded-full animate-ping" />
          <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
        </>
      )}

      <div className="relative p-6 flex flex-col md:flex-row gap-6 items-start md:items-center z-10">
        
        {/* Left Side: Icon & Status */}
        <div className="relative">
          <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
            isLive ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
            : 'bg-gradient-to-br from-orange-500 to-amber-600'
          }`}>
            {isLive ? (
              <PlayCircle className="w-10 h-10 text-white animate-pulse" />
            ) : isUpcoming ? (
              <Clock className="w-10 h-10 text-white" />
            ) : (
              <Video className="w-10 h-10 text-white" />
            )}
            
            {/* Animated ring for live classes */}
            {isLive && (
              <div className="absolute inset-0 border-2 border-white/30 rounded-2xl animate-ping" />
            )}
          </div>
          
          {/* Badges */}
          <div className="absolute -top-2 -right-2 flex flex-col gap-1">
            {isPopular && (
              <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg text-white text-xs flex items-center gap-1 shadow-lg">
                <Star className="w-2.5 h-2.5" />
                <span>Popular</span>
              </div>
            )}
            {timeStatus && (
              <div className={`px-2 py-1 rounded-lg text-xs ${timeStatus.color} shadow-sm`}>
                {timeStatus.text}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-2xl text-gray-900 tracking-tight group-hover:text-orange-600 transition-colors duration-300">
              {classItem.className}
            </h3>
            
            <div className="flex gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                isLive 
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 ring-1 ring-green-200/50" 
                  : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 ring-1 ring-blue-200/50"
              }`}>
                {isLive ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    LIVE
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    RECORDED
                  </>
                )}
              </span>
              
              <span className="px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 ring-1 ring-purple-200/50">
                {classItem.duration || "60 min"}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-2xl">
            {classItem.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="text-sm">{classItem.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{classItem.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
              <User className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Prof. {classItem.tutor}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span className="text-sm">{classItem.level || "Intermediate"}</span>
            </div>
          </div>
        </div>
        
        {/* Right Side: Action & Stats */}
        <div className="w-full md:w-auto flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100/50 pt-4 md:pt-0 md:pl-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
              <div className="flex items-center justify-center gap-1.5 text-gray-900 mb-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-xl">{classItem.attendees || 0}</span>
              </div>
              <p className="text-[10px] uppercase text-gray-500 tracking-widest">Enrolled</p>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
              <div className="flex items-center justify-center gap-1.5 text-gray-900 mb-1">
                {classItem.rating >= 4.5 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xl">{classItem.rating || 4.8}</span>
              </div>
              <p className="text-[10px] uppercase text-gray-500 tracking-widest">Rating</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleStart}
            disabled={isStarting}
            className={`relative group/btn overflow-hidden px-6 py-3.5 rounded-xl text-sm shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 ${
              isLive 
                ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:shadow-green-500/40"
                : "bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-orange-500/40"
            } ${isStarting ? "opacity-75 cursor-not-allowed" : "hover:scale-[1.02]"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            
            {isStarting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLive ? (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    Join Live Session
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    View Recording
                  </>
                )}
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Progress bar for enrollment */}
      {classItem.capacity && (
        <div className="px-6 pb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Seats Available</span>
            <span>{classItem.attendees || 0} / {classItem.capacity}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                ((classItem.attendees || 0) / classItem.capacity) > 0.9 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                  : ((classItem.attendees || 0) / classItem.capacity) > 0.7
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600'
              }`}
              style={{ width: `${Math.min(((classItem.attendees || 0) / classItem.capacity) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    live: 0,
    upcoming: 0,
    recorded: 0,
    totalAttendees: 0
  });

  useEffect(() => {
    const fetchAllSchedules = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "schedules"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClasses(data);
        setFilteredClasses(data);
        
        // Calculate stats
        const stats = {
          total: data.length,
          live: data.filter(c => c.type === "Live").length,
          upcoming: data.filter(c => c.status === "upcoming").length,
          recorded: data.filter(c => c.type === "Recorded").length,
          totalAttendees: data.reduce((sum, c) => sum + (c.attendees || 0), 0)
        };
        setStats(stats);
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSchedules();
  }, []);

  useEffect(() => {
    let filtered = classes;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter(c => c.type === filter);
    }
    
    setFilteredClasses(filtered);
  }, [searchTerm, filter, classes]);

  const handleStartClass = (id) => {
    alert(`Starting class: ${id}`);
    // In a real app, you would navigate to the class page
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
        <div className="absolute inset-0 w-24 h-24 bg-orange-500/10 rounded-full animate-ping" />
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-orange-400 animate-pulse" />
        <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-blue-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
      </div>
      <p className="mt-6 text-gray-600 tracking-widest uppercase text-sm">Loading Class Schedule</p>
      <p className="text-gray-400 text-sm mt-2">Preparing your learning dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl text-center border border-gray-200 shadow-2xl max-w-md">
        <div className="relative inline-block mb-4">
          <XCircle className="w-20 h-20 text-red-500 animate-bounce" />
          <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping" />
        </div>
        <h2 className="text-2xl text-gray-900 mb-2">Connection Lost</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all"
        >
          <Zap className="w-4 h-4 inline mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 text-xs uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" />
                Premium Learning
              </div>
              <h1 className="text-5xl md:text-6xl text-gray-900 tracking-tight mb-3">
                MasterClass <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">Sessions</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Elevate your skills with expert-led live sessions and comprehensive recorded classes.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-200">
                  <CalendarDays className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-tight">Total</p>
                  <p className="text-2xl text-gray-900">{stats.total}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-200">
                  <PlayCircle className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-tight">Live</p>
                  <p className="text-2xl text-gray-900">{stats.live}</p>
                </div>
              </div>
              
              {/* <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-white to-gray-50 p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                  <Users className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-tight">Learners</p>
                  <p className="text-2xl text-gray-900">{stats.totalAttendees}</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes, tutors, or topics..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {["all", "Live", "Recorded"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type === "all" ? "all" : type)}
                  className={`px-5 py-3 rounded-xl text-sm transition-all flex items-center gap-2 ${
                    (filter === type || (type === "all" && filter === "all"))
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-orange-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {type}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-white to-orange-50 p-5 rounded-2xl border border-orange-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-500 uppercase tracking-wider mb-1">Active Now</p>
                  <p className="text-2xl text-gray-900">{stats.live} Sessions</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
                  <Zap className="w-6 h-6 text-orange-600 animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-500 uppercase tracking-wider mb-1">Upcoming</p>
                  <p className="text-2xl text-gray-900">{stats.upcoming} Classes</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-500 uppercase tracking-wider mb-1">Recorded</p>
                  <p className="text-2xl text-gray-900">{stats.recorded} Videos</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl">
                  <Video className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-500 uppercase tracking-wider mb-1">Avg. Rating</p>
                  <p className="text-2xl text-gray-900">4.8 ★</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Classes List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-gray-900">
                Available Sessions <span className="text-orange-500">({filteredClasses.length})</span>
              </h2>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Sorted by: Date</span>
              </div>
            </div>
            
            {filteredClasses.length > 0 ? (
              <div className="space-y-4">
                {filteredClasses.map((item) => (
                  <ClassCard
                    key={item.id}
                    classItem={item}
                    onStart={handleStartClass}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Search className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-2xl text-gray-800 mb-3">No matching classes found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button 
                  onClick={() => { setSearchTerm(""); setFilter("all"); }}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all"
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  View All Classes
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Footer Stats */}
        {filteredClasses.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
              <div className="text-gray-500">
                <p className="text-sm">Ready to transform your learning journey?</p>
                <p className="text-xs mt-1">Join thousands of successful learners</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl text-gray-900">{stats.total}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Total Classes</div>
                </div>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                <div className="text-center">
                  <div className="text-2xl text-gray-900">{stats.totalAttendees}+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Active Learners</div>
                </div>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                <div className="text-center">
                  <div className="text-2xl text-gray-900">98%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}