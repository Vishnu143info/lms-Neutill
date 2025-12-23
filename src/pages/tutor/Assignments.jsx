import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase"; 
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { 
  Plus, Calendar, Users, Download, Trash2, Loader2, FilePlus, 
  Paperclip, Clock, FileText, ChevronRight, Eye, Upload, 
  CheckCircle, AlertCircle, X
} from "lucide-react";

const AssignmentCard = ({ assignment, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not Set") return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-emerald-100 text-emerald-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Overdue': 'bg-rose-100 text-rose-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 mb-4 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}>
                  {assignment.status}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Due: {formatDate(assignment.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-4 pl-11">{assignment.description}</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowConfirm(true)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete"
          >
            <Trash2 className="w-4 h-4 text-gray-400 group-hover/delete:text-red-500 transition-colors" />
          </button>
          
          {showConfirm && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-64 z-10 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Delete Assignment?</p>
                  <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onDelete(assignment.id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6">
          {assignment.fileUrl && (
            <a 
              href={assignment.fileUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors group/download"
            >
              <div className="p-1.5 bg-blue-50 rounded-lg group-hover/download:bg-blue-100 transition-colors">
                <Download className="w-4 h-4" />
              </div>
              <span>Download Demo File</span>
              {assignment.fileName && (
                <span className="text-xs text-gray-500">({assignment.fileName})</span>
              )}
            </a>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{assignment.students || 0} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Upload className="w-4 h-4" />
              <span>{assignment.submissions || 0} submissions</span>
            </div>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition-all duration-200 group/view">
          <Eye className="w-4 h-4" />
          View Details
          <ChevronRight className="w-4 h-4 group-hover/view:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAssignments(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Please enter a title for the assignment");
      return;
    }
    
    setUploading(true);
    let fileUrl = "";

    try {
      if (file) {
        const storageRef = ref(storage, `assignment-demos/${Date.now()}_${file.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        fileUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, "assignments"), {
        title,
        description,
        dueDate: dueDate || "Not Set",
        fileUrl,
        fileName: file ? file.name : "",
        submissions: 0,
        students: 0,
        status: "Active",
        createdAt: new Date(),
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      setFile(null);
      setFilePreview(null);
      setShowForm(false);
      
      alert("Assignment created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating assignment. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteDoc(doc(db, "assignments", id));
      } catch (error) {
        console.error("Error deleting assignment:", error);
        alert("Failed to delete assignment");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Assignments & Demos</h1>
            <p className="text-gray-600">Create, manage, and track all assignments</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            New Assignment
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white to-orange-50 p-5 rounded-2xl border border-orange-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Assignments</p>
                <p className="text-3xl font-bold text-gray-800">{assignments.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active</p>
                <p className="text-3xl font-bold text-gray-800">
                  {assignments.filter(a => a.status === 'Active').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-800">
                  {assignments.reduce((sum, a) => sum + (a.submissions || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Upload className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-800">
                  {assignments.reduce((sum, a) => sum + (a.students || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Assignment Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-3xl border-2 border-orange-100 mb-10 shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Assignment</h2>
            <button 
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Assignment Title *</label>
              <input 
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="Enter assignment title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  type="date"
                  className="w-full p-3 pl-10 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea 
              className="w-full p-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all min-h-[120px]"
              placeholder="Describe the assignment details, requirements, and objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Demo File (Optional)</label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group">
                  <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Upload className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-700">Upload Demo File</p>
                    <p className="text-sm text-gray-500">PDF, DOC, PPT, Images (Max 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              
              {file && (
                <div className="md:w-48">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <button 
                        onClick={() => { setFile(null); setFilePreview(null); }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {filePreview && (
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="mt-2 rounded-lg w-full h-24 object-cover"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleCreate}
              disabled={uploading || !title.trim()}
              className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Creating...
                </>
              ) : (
                <>
                  <FilePlus className="w-5 h-5" />
                  Create Assignment
                </>
              )}
            </button>
            <button 
              onClick={() => setShowForm(false)}
              className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Assignments</h2>
          <div className="text-sm text-gray-500">
            Showing {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No assignments yet</h3>
            <p className="text-gray-500 mb-6">Create your first assignment to get started</p>
            <button 
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Create First Assignment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(a => (
              <AssignmentCard key={a.id} assignment={a} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}