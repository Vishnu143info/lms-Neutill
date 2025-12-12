import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Bell, 
  Edit2, 
  Trash2, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Search,
  PlayCircle
} from "lucide-react";

const ClassCard = ({ classItem, onDelete, onEdit, onStart }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      onStart(classItem.id);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-800">{classItem.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              classItem.status === "Upcoming" ? "bg-blue-100 text-blue-800" :
              classItem.status === "Live" ? "bg-green-100 text-green-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {classItem.status}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{classItem.description}</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{classItem.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{classItem.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-sm">{classItem.students} students enrolled</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(classItem)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => onDelete(classItem.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-800">{classItem.attendance || 0}</p>
              <p className="text-xs text-gray-500">Attending</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-gray-800">{classItem.completed || 0}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleStart}
          disabled={isStarting}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
            classItem.status === "Live" 
              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          } ${isStarting ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {isStarting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Starting...
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4" />
              {classItem.status === "Live" ? "Join Class" : "Start Class"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default function Classes() {
  const [classes, setClasses] = useState([
    { 
      id: 1, 
      title: "React Advanced Patterns", 
      description: "Learn advanced React patterns and best practices",
      date: "2024-03-20",
      time: "14:00 - 16:00",
      students: 24,
      attendance: 18,
      completed: 12,
      status: "Upcoming"
    },
    { 
      id: 2, 
      title: "JavaScript Fundamentals", 
      description: "Master JavaScript basics and core concepts",
      date: "2024-03-21",
      time: "10:00 - 12:00",
      students: 32,
      attendance: 24,
      completed: 16,
      status: "Upcoming"
    },
    { 
      id: 3, 
      title: "Web Development Bootcamp", 
      description: "Complete web development course covering frontend and backend",
      date: "2024-03-19",
      time: "16:00 - 18:00",
      students: 48,
      attendance: 42,
      completed: 36,
      status: "Live"
    },
  ]);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const createClass = () => {
    if (!title.trim()) return;
    
    const newClass = {
      id: Date.now(),
      title,
      description,
      date: date || "2024-03-31",
      time: time || "10:00 - 12:00",
      students: Math.floor(Math.random() * 50) + 10,
      attendance: 0,
      completed: 0,
      status: "Upcoming"
    };
    
    setClasses([newClass, ...classes]);
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
  };

  const deleteClass = (id) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const editClass = (classItem) => {
    setTitle(classItem.title);
    setDescription(classItem.description);
    setDate(classItem.date);
    setTime(classItem.time);
    deleteClass(classItem.id);
  };

  const startClass = (id) => {
    setClasses(classes.map(c => 
      c.id === id ? { ...c, status: "Live", attendance: c.attendance + 1 } : c
    ));
    alert("Class started successfully!");
  };

  const filteredClasses = classes.filter(classItem =>
    classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: classes.length,
    upcoming: classes.filter(c => c.status === "Upcoming").length,
    live: classes.filter(c => c.status === "Live").length,
    totalStudents: classes.reduce((sum, c) => sum + c.students, 0),
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          📅 Class Manager
        </h1>
        <p className="text-gray-600 mt-2">Schedule and manage your teaching sessions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
          <p className="text-blue-700 font-semibold mb-2">Total Classes</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-2xl border border-orange-200">
          <p className="text-orange-700 font-semibold mb-2">Upcoming</p>
          <p className="text-2xl font-bold text-gray-800">{stats.upcoming}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
          <p className="text-green-700 font-semibold mb-2">Live Now</p>
          <p className="text-2xl font-bold text-gray-800">{stats.live}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
          <p className="text-purple-700 font-semibold mb-2">Total Students</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
        </div>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={createClass}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Class
        </button>
      </div>

      {/* Create New Class Form */}
      {(title || description || date || time) && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-8 border border-orange-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {title ? "Edit Class" : "Create New Class"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Class Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Time (e.g., 10:00 - 12:00)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={createClass}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg transition-all duration-300"
            >
              {title ? "Update Class" : "Create Class"}
            </button>
          </div>
          
          <textarea
            placeholder="Class Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full border border-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTitle("");
                setDescription("");
                setDate("");
                setTime("");
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Classes List */}
      <div className="space-y-6">
        {filteredClasses.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classItem={classItem}
            onDelete={deleteClass}
            onEdit={editClass}
            onStart={startClass}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 text-left">
          <Video className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-gray-800 mb-2">Record Lecture</h3>
          <p className="text-gray-600 text-sm">Record and share class sessions</p>
        </button>
        
        <button className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 text-left">
          <Users className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-bold text-gray-800 mb-2">Student Analytics</h3>
          <p className="text-gray-600 text-sm">View student performance and attendance</p>
        </button>
        
        <button className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 text-left">
          <Bell className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-gray-800 mb-2">Send Reminders</h3>
          <p className="text-gray-600 text-sm">Notify students about upcoming classes</p>
        </button>
      </div>
    </div>
  );
}