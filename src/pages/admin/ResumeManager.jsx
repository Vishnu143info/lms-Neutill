import React, { useState } from "react";
import { FileText, Download, Eye, CheckCircle, XCircle, Clock, Search, Filter, Mail, Calendar, Award } from "lucide-react";

const ResumeCard = ({ resume, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Reviewed": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Reviewed": return <Eye className="w-4 h-4 text-blue-500" />;
      case "Pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-gray-800">{resume.user}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resume.status)} flex items-center gap-1`}>
              {getStatusIcon(resume.status)}
              {resume.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{resume.file}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-3 h-3" />
          <span>{resume.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>{resume.submitted}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          {resume.skills.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {skill}
            </span>
          ))}
        </div>
        <select
          value={resume.status}
          onChange={(e) => onUpdateStatus(resume.id, e.target.value)}
          className="border border-gray-200 p-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
};

export default function ResumeManager() {
  const [resumes, setResumes] = useState([
    { 
      id: 1, 
      user: "John Doe", 
      email: "john@example.com",
      file: "john_doe_resume.pdf", 
      status: "Pending",
      submitted: "2024-03-18",
      skills: ["React", "Node.js", "TypeScript"]
    },
    { 
      id: 2, 
      user: "Jane Smith", 
      email: "jane@example.com",
      file: "jane_smith_cv.pdf", 
      status: "Reviewed",
      submitted: "2024-03-17",
      skills: ["Python", "Django", "AWS"]
    },
    { 
      id: 3, 
      user: "Robert Johnson", 
      email: "robert@example.com",
      file: "robert_johnson_portfolio.pdf", 
      status: "Approved",
      submitted: "2024-03-16",
      skills: ["UI/UX", "Figma", "React Native"]
    },
    { 
      id: 4, 
      user: "Sarah Wilson", 
      email: "sarah@example.com",
      file: "sarah_wilson_resume.pdf", 
      status: "Pending",
      submitted: "2024-03-19",
      skills: ["Java", "Spring Boot", "SQL"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const updateStatus = (id, status) => {
    setResumes(
      resumes.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "All" || resume.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStats = () => {
    const total = resumes.length;
    const pending = resumes.filter(r => r.status === "Pending").length;
    const reviewed = resumes.filter(r => r.status === "Reviewed").length;
    const approved = resumes.filter(r => r.status === "Approved").length;
    
    return { total, pending, reviewed, approved };
  };

  const stats = getStats();

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          📄 Resume Manager
        </h1>
        <p className="text-gray-600 mt-2">Review and manage user resumes and portfolios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <p className="text-blue-700 font-semibold mb-2">Total Resumes</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <p className="text-yellow-700 font-semibold mb-2">Pending Review</p>
          <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <p className="text-blue-700 font-semibold mb-2">Reviewed</p>
          <p className="text-2xl font-bold text-gray-800">{stats.reviewed}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <p className="text-green-700 font-semibold mb-2">Approved</p>
          <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            resume={resume}
            onUpdateStatus={updateStatus}
          />
        ))}
      </div>

      {/* Bulk Actions */}
      {filteredResumes.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Bulk Actions</h3>
              <p className="text-gray-600 text-sm">Apply actions to multiple resumes at once</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Approve All
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                Download All
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Reject All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}