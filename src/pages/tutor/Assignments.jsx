import React, { useState } from "react";
import { 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  Search, 
  Filter,
  FileText // Added missing import
} from "lucide-react";

const AssignmentCard = ({ assignment, onDelete, onEdit }) => {
  const [submissions, setSubmissions] = useState(assignment.submissions || 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              assignment.status === "Active" ? "bg-green-100 text-green-800" :
              assignment.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {assignment.status}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{assignment.description}</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Due: {assignment.dueDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{assignment.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-sm">{assignment.students} students</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(assignment)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => onDelete(assignment.id)}
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
              <Download className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-800">{submissions}</p>
              <p className="text-xs text-gray-500">Submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Eye className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-gray-800">{assignment.views || 0}</p>
              <p className="text-xs text-gray-500">Views</p>
            </div>
          </div>
        </div>
        
        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default function Assignments() {
  const [assignments, setAssignments] = useState([
    { 
      id: 1, 
      title: "React State Management", 
      description: "Create a todo app using React hooks and context API",
      dueDate: "2024-03-25",
      duration: "1 week",
      students: 24,
      submissions: 18,
      status: "Active",
      views: 45
    },
    { 
      id: 2, 
      title: "JavaScript Algorithms", 
      description: "Solve data structure problems using JavaScript",
      dueDate: "2024-03-28",
      duration: "2 weeks",
      students: 32,
      submissions: 24,
      status: "Active",
      views: 67
    },
    { 
      id: 3, 
      title: "CSS Flexbox Layout", 
      description: "Design responsive layouts using CSS Flexbox",
      dueDate: "2024-03-30",
      duration: "3 days",
      students: 18,
      submissions: 12,
      status: "Draft",
      views: 28
    },
  ]);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const createAssignment = () => {
    if (!title.trim()) return;
    
    const newAssignment = {
      id: Date.now(),
      title,
      description,
      dueDate: dueDate || "2024-03-31",
      duration: "1 week",
      students: Math.floor(Math.random() * 40) + 10,
      submissions: 0,
      status: "Draft",
      views: 0
    };
    
    setAssignments([newAssignment, ...assignments]);
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  const deleteAssignment = (id) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const editAssignment = (assignment) => {
    setTitle(assignment.title);
    setDescription(assignment.description);
    setDueDate(assignment.dueDate);
    deleteAssignment(assignment.id);
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          📝 Assignments Manager
        </h1>
        <p className="text-gray-600 mt-2">Create and manage student assignments</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option>Filter by Status</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Completed</option>
          </select>
          <button className="px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Create New Assignment */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-8 border border-orange-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-orange-100">
            <Plus className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Create New Assignment</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Assignment Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="date"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <textarea
          placeholder="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full border border-gray-200 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={createAssignment}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        {filteredAssignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onDelete={deleteAssignment}
            onEdit={editAssignment}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{assignments.length}</p>
              <p className="text-gray-600">Total Assignments</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {assignments.reduce((sum, a) => sum + a.submissions, 0)}
              </p>
              <p className="text-gray-600">Total Submissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {assignments.reduce((sum, a) => sum + a.students, 0)}
              </p>
              <p className="text-gray-600">Total Students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}