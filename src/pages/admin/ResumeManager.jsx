import React, { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Search,
  Mail,
  Calendar,
  AlertCircle
} from "lucide-react";

/* FIREBASE IMPORTS
  - doc: creates a reference to a specific document
  - updateDoc: updates specific fields without overwriting the whole doc
*/
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

/* ================= Resume Card Component ================= */

const ResumeCard = ({ resume, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Reviewed": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Reviewed": return <Eye className="w-4 h-4 text-blue-500" />;
      case "Pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const handleStatusChange = async (e) => {
    setIsUpdating(true);
    await onUpdateStatus(resume.id, e.target.value);
    setIsUpdating(false);
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
          <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => window.open(resume.url, "_blank")}>
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => window.open(resume.url)}>
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-3 h-3" />
          <span className="truncate">{resume.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>{resume.submitted}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <label className="text-xs text-gray-500 font-semibold uppercase">Update Status</label>
        <select
          disabled={isUpdating}
          value={resume.status}
          onChange={handleStatusChange}
          className={`border border-gray-200 p-1 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isUpdating ? 'opacity-50' : ''}`}
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

/* ================= Main Resume Manager Component ================= */

export default function ResumeManager() {
  const [resumes, setResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch Data from Firestore
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const allResumes = [];

        snapshot.forEach((docSnap) => {
          const userData = docSnap.data();
          if (Array.isArray(userData.resumes)) {
            userData.resumes.forEach((resume, index) => {
              allResumes.push({
                // We use the DocID as the primary key for updates
                id: docSnap.id, 
                resumeIndex: index, // helpful if you decide to update nested arrays later
                user: userData.name || "Unknown User",
                email: userData.email || "N/A",
                file: resume.name,
                url: resume.url,
                status: userData.status || "Pending",
                submitted: resume.uploadedAt
                  ? new Date(resume.uploadedAt).toLocaleDateString()
                  : "N/A",
              });
            });
          }
        });

        setResumes(allResumes);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  /* UPDATED LOGIC:
    Updates Firebase first, then updates the local React state.
  */
  const updateStatus = async (docId, newStatus) => {
    try {
      // 1. Reference the specific User Document in Firestore
      const userRef = doc(db, "users", docId);

      // 2. Update the 'status' field in Firebase
      await updateDoc(userRef, {
        status: newStatus
      });

      // 3. Update the local UI state so it stays in sync
      setResumes((prev) =>
        prev.map((r) => (r.id === docId ? { ...r, status: newStatus } : r))
      );
      
    } catch (error) {
      console.error("Error updating status in Firebase:", error);
      alert("Failed to save changes to database.");
    }
  };

  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch =
      resume.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || resume.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 animate-pulse text-lg font-medium">Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          Resume Manager
        </h1>
        <p className="text-gray-500 mt-1">Review and manage candidate applications</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            className="w-full pl-10 p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredResumes.map((resume, idx) => (
            <ResumeCard
              key={`${resume.id}-${idx}`}
              resume={resume}
              onUpdateStatus={updateStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">No resumes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}