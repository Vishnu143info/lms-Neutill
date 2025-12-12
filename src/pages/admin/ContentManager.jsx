import React, { useState } from "react";
import { Upload, FileText, Video, Package, Clock, Download, Eye, Trash2, Search } from "lucide-react";

const FileUploadCard = ({ title, description, icon: Icon, color, onFileSelect }) => {
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={title.includes("PDF") ? ".pdf" : title.includes("Video") ? "video/*" : "*"}
        />
        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <p className="text-gray-600 group-hover:text-blue-600 font-medium">Click to upload</p>
            <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
          </div>
        </div>
      </label>
    </div>
  );
};

const ContentItem = ({ item, type, onDelete }) => {
  const getTypeColor = () => {
    switch(type) {
      case "PDF": return "bg-blue-100 text-blue-600";
      case "Video": return "bg-red-100 text-red-600";
      case "Workshop": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getTypeColor()}`}>
            {type === "PDF" && <FileText className="w-4 h-4" />}
            {type === "Video" && <Video className="w-4 h-4" />}
            {type === "Workshop" && <Package className="w-4 h-4" />}
          </div>
          <div>
            <p className="font-medium text-gray-800">{item.name}</p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{item.type}</span>
              <span>•</span>
              <span>{item.size}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.date}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ContentManager() {
  const [contents, setContents] = useState([
    { id: 1, name: "JavaScript_Guide.pdf", type: "PDF", size: "2.4 MB", date: "2 days ago" },
    { id: 2, name: "React_Tutorial.mp4", type: "Video", size: "45 MB", date: "1 week ago" },
    { id: 3, name: "Web_Dev_Workshop.zip", type: "Workshop", size: "120 MB", date: "3 days ago" },
    { id: 4, name: "CSS_Advanced.pdf", type: "PDF", size: "1.8 MB", date: "1 day ago" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const uploadPDF = (file) => {
    const newItem = {
      id: Date.now(),
      name: file.name,
      type: "PDF",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: "Just now"
    };
    setContents([newItem, ...contents]);
  };

  const uploadVideo = (file) => {
    const newItem = {
      id: Date.now(),
      name: file.name,
      type: "Video",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: "Just now"
    };
    setContents([newItem, ...contents]);
  };

  const uploadWorkshop = (file) => {
    const newItem = {
      id: Date.now(),
      name: file.name,
      type: "Workshop",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: "Just now"
    };
    setContents([newItem, ...contents]);
  };

  const deleteItem = (id) => {
    setContents(contents.filter(item => item.id !== id));
  };

  const filteredContents = contents.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          📚 Content Manager
        </h1>
        <p className="text-gray-600 mt-2">Upload and manage your educational content</p>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FileUploadCard
          title="Upload PDFs"
          description="Study materials, notes, and guides"
          icon={FileText}
          color="bg-blue-500"
          onFileSelect={uploadPDF}
        />
        <FileUploadCard
          title="Upload Videos"
          description="Tutorials, lectures, and demos"
          icon={Video}
          color="bg-red-500"
          onFileSelect={uploadVideo}
        />
        <FileUploadCard
          title="Upload Workshops"
          description="Projects, templates, and resources"
          icon={Package}
          color="bg-green-500"
          onFileSelect={uploadWorkshop}
        />
      </div>

      {/* Content Library */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Content Library</h2>
            <p className="text-gray-600 text-sm">Manage all your uploaded files</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredContents.map((item) => (
            <ContentItem
              key={item.id}
              item={item}
              type={item.type}
              onDelete={deleteItem}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{contents.filter(c => c.type === "PDF").length}</p>
            <p className="text-gray-600">PDF Documents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{contents.filter(c => c.type === "Video").length}</p>
            <p className="text-gray-600">Video Files</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{contents.filter(c => c.type === "Workshop").length}</p>
            <p className="text-gray-600">Workshop Files</p>
          </div>
        </div>
      </div>
    </div>
  );
}