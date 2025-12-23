import React, { useState, useEffect } from "react";
// Import Firebase logic
import { db } from "../../firebase"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import { 
  BookOpen, Video, FileText, Download, PlayCircle,
  Clock, TrendingUp, Search, Loader2, XCircle
} from "lucide-react";

const ModuleCard = ({ title, type, description, progress, duration, lastAccessed, fileUrl }) => {
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
          {type || "Module"}
        </span>
      </div>
      
      <h3 className="font-bold text-gray-800 text-xl mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{description}</p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span>Progress</span>
          </div>
          <span className="font-semibold">{progress || 0}%</span>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
            <div 
              style={{ width: `${progress || 0}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-500"
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{duration || "Flexible"}</span>
          </div>
          <span className="text-[10px]">ID: {lastAccessed}</span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button 
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-medium"
          onClick={() => fileUrl && window.open(fileUrl, '_blank')}
        >
          {type === "Video" ? "Watch Now" : "Open Module"}
        </button>
        {fileUrl && (
          <a 
            href={fileUrl} 
            download 
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </a>
        )}
      </div>
    </div>
  );
};

export default function MyModules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // 1. Fetch data from Firebase Assignments collection
  useEffect(() => {
    const q = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Mapping Firebase fields to Card props if names differ
          title: doc.data().title || "Untitled Assignment",
          type: doc.data().type || "PDF", 
          progress: doc.data().progress || Math.floor(Math.random() * 100), // Demo progress
          lastAccessed: doc.id.substring(0, 5) // Using part of ID for UI
        }));
        setModules(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to parse data");
        setLoading(false);
      }
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(search.toLowerCase()) ||
                         module.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || module.type?.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
      <p className="text-gray-500 font-medium">Fetching your learning modules...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
      <XCircle className="w-12 h-12 mb-2" />
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-900 bg-clip-text text-transparent mb-2">
          📚 My Learning Modules
        </h1>
        <p className="text-gray-600">Access data synced from Firebase path: /assignments</p>
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
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {["all", "PDF", "Video", "Workshop"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                filter === type 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {type === "all" ? "All Content" : type}
            </button>
          ))}
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
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No modules found</h3>
          <p className="text-gray-500">Try adjusting your filters or upload a new assignment to Firebase.</p>
        </div>
      )}
    </div>
  );
}