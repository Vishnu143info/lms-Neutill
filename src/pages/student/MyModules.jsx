import React, { useState } from "react";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  PlayCircle,
  Clock,
  TrendingUp,
  Search,
  Filter
} from "lucide-react";

const ModuleCard = ({ title, type, description, progress, duration, lastAccessed }) => {
  const getIcon = () => {
    switch(type) {
      case "PDF": return <FileText className="w-8 h-8" />;
      case "Video": return <Video className="w-8 h-8" />;
      case "Workshop": return <PlayCircle className="w-8 h-8" />;
      default: return <BookOpen className="w-8 h-8" />;
    }
  };

  const getColor = () => {
    switch(type) {
      case "PDF": return "bg-blue-100 text-blue-600";
      case "Video": return "bg-purple-100 text-purple-600";
      case "Workshop": return "bg-green-100 text-green-600";
      default: return "bg-orange-100 text-orange-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${getColor()}`}>
          {getIcon()}
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
          {type}
        </span>
      </div>
      
      <h3 className="font-bold text-gray-800 text-xl mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span>Progress</span>
          </div>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
            <div 
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-500"
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <span>Last accessed: {lastAccessed}</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-medium">
          {type === "Video" ? "Watch Now" : type === "PDF" ? "Read Now" : "Start Workshop"}
        </button>
        <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
          <Download className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default function MyModules() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const modules = [
    { 
      id: 1, 
      title: "Learning Path PDF 1", 
      type: "PDF", 
      description: "Introduction to React concepts and fundamentals with practical examples",
      progress: 75,
      duration: "45 mins",
      lastAccessed: "2 hours ago"
    },
    { 
      id: 2, 
      title: "Learning Path Video 1", 
      type: "Video", 
      description: "Master JavaScript ES6+ features with hands-on coding exercises",
      progress: 45,
      duration: "2 hours",
      lastAccessed: "Yesterday"
    },
    { 
      id: 3, 
      title: "Workshop Project 1", 
      type: "Workshop", 
      description: "Build a complete e-commerce application using React and Node.js",
      progress: 30,
      duration: "4 hours",
      lastAccessed: "3 days ago"
    },
    { 
      id: 4, 
      title: "Advanced CSS Guide", 
      type: "PDF", 
      description: "Modern CSS techniques including Flexbox, Grid, and animations",
      progress: 90,
      duration: "1 hour",
      lastAccessed: "Today"
    },
    { 
      id: 5, 
      title: "Database Design", 
      type: "Video", 
      description: "Learn SQL database design and optimization techniques",
      progress: 60,
      duration: "3 hours",
      lastAccessed: "1 week ago"
    },
    { 
      id: 6, 
      title: "Final Capstone Project", 
      type: "Workshop", 
      description: "Complete portfolio project with real-world application",
      progress: 20,
      duration: "8 hours",
      lastAccessed: "2 weeks ago"
    },
  ];

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(search.toLowerCase()) ||
                         module.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || module.type.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-2">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-900 bg-clip-text text-transparent mb-2">
          📚 My Learning Modules
        </h1>
        <p className="text-gray-600">Access all your learning materials and track your progress</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {["all", "PDF", "Video", "Workshop"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type === "all" ? "all" : type)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                filter === type || (type === "all" && filter === "all")
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {type === "all" ? "All" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Overall Learning Progress</h3>
            <p className="text-gray-600">You've completed 65% of all modules</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-800">6/10</p>
            <p className="text-gray-600">Modules Completed</p>
          </div>
        </div>
        <div className="relative pt-1 mt-4">
          <div className="overflow-hidden h-3 text-xs flex rounded-full bg-blue-100">
            <div 
              style={{ width: "65%" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-500"
            ></div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <ModuleCard key={module.id} {...module} />
        ))}
      </div>

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No modules found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}