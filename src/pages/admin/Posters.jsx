import React, { useState } from "react";
import { Upload, Image, Eye, Download, Trash2, Filter, Calendar, BarChart3, Share2 } from "lucide-react";

const PosterCard = ({ poster, onDelete, onView }) => {
  const [views, setViews] = useState(poster.views || 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={poster.fileUrl}
          alt="poster"
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button 
            onClick={() => {
              onView(poster);
              setViews(views + 1);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </button>
          <button 
            onClick={() => onDelete(poster.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-800 truncate">{poster.fileName}</h3>
            <p className="text-sm text-gray-500">Uploaded {poster.date}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            poster.status === "Active" ? "bg-green-100 text-green-800" :
            poster.status === "Scheduled" ? "bg-blue-100 text-blue-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {poster.status}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{poster.downloads || 0}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <BarChart3 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Posters() {
  const [posters, setPosters] = useState([
    { 
      id: 1, 
      fileName: "Spring_Sale_Poster.jpg", 
      fileUrl: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=300&fit=crop", 
      date: "2 days ago",
      status: "Active",
      views: 1245,
      downloads: 89
    },
    { 
      id: 2, 
      fileName: "Webinar_Announcement.png", 
      fileUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w-400&h=300&fit=crop", 
      date: "1 week ago",
      status: "Active",
      views: 2890,
      downloads: 156
    },
    { 
      id: 3, 
      fileName: "New_Course_Launch.jpg", 
      fileUrl: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=300&fit=crop", 
      date: "3 days ago",
      status: "Scheduled",
      views: 890,
      downloads: 45
    }
  ]);

  const handlePosterUpload = (file) => {
    const newPoster = {
      id: Date.now(),
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      date: "Just now",
      status: "Active",
      views: 0,
      downloads: 0
    };
    setPosters([newPoster, ...posters]);
  };

  const deletePoster = (id) => {
    setPosters(posters.filter((p) => p.id !== id));
  };

  const viewPoster = (poster) => {
    console.log("Viewing poster:", poster);
    // Implement poster viewing logic
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      handlePosterUpload(e.target.files[0]);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          📢 Poster & Banner Manager
        </h1>
        <p className="text-gray-600 mt-2">Upload and manage promotional materials</p>
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-100">
            <Image className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Upload New Poster</h2>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <div className="border-3 border-dashed border-purple-200 rounded-2xl p-8 text-center hover:border-purple-300 hover:bg-white/50 transition-all duration-300">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 text-purple-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-2">Drop your poster here</p>
              <p className="text-gray-500 mb-4">or click to browse files</p>
              <p className="text-sm text-gray-400">Supports: JPG, PNG, SVG up to 10MB</p>
            </div>
          </div>
        </label>

        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Post
          </button>
          <button className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
            Bulk Upload
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
            All Posters
          </button>
          <button className="px-4 py-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors">
            Active
          </button>
          <button className="px-4 py-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors">
            Archived
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Sort by Date</option>
              <option>Sort by Views</option>
              <option>Sort by Name</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search posters..."
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Posters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posters.map((poster) => (
          <PosterCard
            key={poster.id}
            poster={poster}
            onDelete={deletePoster}
            onView={viewPoster}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Image className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{posters.length}</p>
              <p className="text-gray-600">Total Posters</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {posters.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
              </p>
              <p className="text-gray-600">Total Views</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {posters.reduce((sum, p) => sum + p.downloads, 0)}
              </p>
              <p className="text-gray-600">Total Downloads</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <BarChart3 className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">24.5%</p>
              <p className="text-gray-600">Engagement Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}