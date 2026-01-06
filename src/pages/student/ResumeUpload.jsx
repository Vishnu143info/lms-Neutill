import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, FileText, CheckCircle, XCircle, Eye, 
  Trash2, Cloud, Shield, Loader2, AlertCircle, Clock, Check,
  Download, Lock, Users, FileCheck, Sparkles, ShieldCheck,
  AlertTriangle, FileX, FileWarning, CloudUpload, FileUp
} from "lucide-react";

// --- FIREBASE IMPORTS ---
import { db, storage, auth } from "../../firebase"; 
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

/* ================= File Card Component ================= */
const FileUploadCard = ({ fileData, onRemove, status }) => {
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FileText className="w-6 h-6 text-red-500" />;
    if (['doc', 'docx'].includes(ext)) return <FileText className="w-6 h-6 text-blue-500" />;
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-indigo-200">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/0 via-purple-100/0 to-pink-100/0 group-hover:from-indigo-100/20 group-hover:via-purple-100/10 group-hover:to-pink-100/10 rounded-2xl transition-all duration-500" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm">
              {getFileIcon(fileData.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 truncate">{fileData.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-gray-500">{formatFileSize(fileData.size)}</p>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {fileData.name.split('.').pop().toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={fileData.url} 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 hover:bg-blue-50 rounded-xl text-blue-600 transition-all hover:scale-110"
              title="View File"
            >
              <Eye className="w-5 h-5" />
            </a>
            <a 
              href={fileData.url}
              download
              className="p-2.5 hover:bg-green-50 rounded-xl text-green-600 transition-all hover:scale-110"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        {/* File metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatDate(fileData.uploadedAt)}</span>
            </div>
            {status === "approved" && (
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Approved
              </div>
            )}
          </div>
          <button 
            onClick={() => onRemove(fileData)} 
            className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-all hover:scale-110 group/delete"
            title="Delete File"
          >
            <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= Upload Progress Component ================= */
const UploadProgress = ({ progress, fileName }) => {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-indigo-100 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <CloudUpload className="text-white w-6 h-6" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <Loader2 className="w-3 h-3 text-indigo-600 animate-spin" />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-800 truncate">{fileName}</p>
          <p className="text-sm text-gray-500">Uploading to secure cloud</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-center pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-3 h-3" />
            <span>File is encrypted during transfer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= Status Badge Component ================= */
const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: {
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      icon: <CheckCircle className="w-4 h-4" />,
      text: "Approved",
      description: "Your resume has been approved"
    },
    reviewed: {
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      icon: <Eye className="w-4 h-4" />,
      text: "Reviewed",
      description: "Your resume is under review"
    },
    pending: {
      color: "bg-gradient-to-r from-amber-500 to-yellow-500",
      icon: <Clock className="w-4 h-4" />,
      text: "Pending",
      description: "Awaiting review"
    },
    rejected: {
      color: "bg-gradient-to-r from-red-500 to-pink-500",
      icon: <XCircle className="w-4 h-4" />,
      text: "Rejected",
      description: "Please update your resume"
    }
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <div className={`${config.color} text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-pulse`}>
      {config.icon}
      <span className="font-bold">{config.text}</span>
    </div>
  );
};

/* ================= Main Upload Component ================= */
export default function ResumeUpload() {
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState("pending");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  // 1. Sync User Data & Status
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        setIsLoading(true);
        
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUploadedFiles(data.resumes || []);
            setStatus(data.status || "pending");
          }
          setIsLoading(false);
        });

        return unsubscribe;
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. Upload Logic
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File too large (max 5MB)");
        return;
      }
      if (!['.pdf', '.doc', '.docx'].some(ext => selectedFile.name.toLowerCase().endsWith(ext))) {
        alert("Please upload PDF or Word documents only");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !currentUser || isUploading) return;
    
    setIsUploading(true);
    const storagePath = `resumes/${currentUser.uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", 
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => { 
        console.error("Upload error:", error); 
        setIsUploading(false);
        alert("Upload failed. Please try again.");
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const fileMetadata = {
            id: Date.now().toString(),
            name: file.name,
            url: downloadURL,
            size: file.size,
            path: storagePath,
            uploadedAt: new Date().toISOString()
          };
          
          const userDoc = doc(db, "users", currentUser.uid);
          await updateDoc(userDoc, { 
            resumes: arrayUnion(fileMetadata),
            updatedAt: new Date().toISOString()
          });
          
          setFile(null);
          setIsUploading(false);
          setUploadProgress(0);
          
          // Success animation feedback
          document.getElementById('success-badge')?.classList.add('animate-bounce');
          setTimeout(() => {
            document.getElementById('success-badge')?.classList.remove('animate-bounce');
          }, 2000);
          
        } catch (error) {
          console.error("Error saving file metadata:", error);
          setIsUploading(false);
          alert("Error saving file information. Please try again.");
        }
      }
    );
  };

  const handleRemoveFile = async (fileObj) => {
    if (!window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) return;
    
    try {
      await deleteObject(ref(storage, fileObj.path));
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, { 
        resumes: arrayRemove(fileObj),
        updatedAt: new Date().toISOString()
      });
    } catch (err) { 
      console.error("Delete failed:", err);
      alert("Failed to delete file. Please try again.");
    }
  };

  const handleDrag = (e) => { 
    e.preventDefault(); 
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover"); 
  };

  const handleDrop = (e) => { 
    e.preventDefault(); 
    e.stopPropagation();
    setDragActive(false); 
    if (e.dataTransfer.files?.[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileUp className="text-white w-8 h-8" />
            </div>
            <Loader2 className="absolute -top-2 -right-2 w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Your Portfolio</h3>
          <p className="text-gray-500">Fetching your files and status...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-500 w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Authentication Required</h3>
          <p className="text-gray-600 mb-6">Please sign in to access your resume portfolio</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center relative">
          <div className="absolute inset-0 flex justify-center">
            <div className="w-72 h-72 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">Student Portfolio</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Resume & Portfolio Manager
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto mb-6">
              Upload, manage, and share your professional documents with approved tutors
            </p>
            
            {/* Status Display */}
            <div className="flex flex-col items-center gap-4">
              <StatusBadge status={status} />
              <p className="text-sm text-gray-500">
                {status === "approved" ? "✅ Tutors can view your documents" : 
                 status === "reviewed" ? "👁️ Your documents are being reviewed" :
                 status === "rejected" ? "⚠️ Please update and re-upload" :
                 "⏳ Awaiting review from admin"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Files */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Zone */}
            <div 
              className={`relative rounded-3xl p-8 text-center transition-all duration-500 ${
                dragActive 
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-3 border-dashed border-indigo-400 shadow-2xl scale-[1.02]' 
                  : 'bg-white border-2 border-dashed border-gray-300 hover:border-indigo-300 shadow-lg hover:shadow-xl'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              {/* Animated background */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-50/30 via-transparent to-purple-50/30 animate-gradient-x" />
              </div>
              
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className={`absolute inset-0 rounded-full ${
                    dragActive ? 'bg-gradient-to-r from-indigo-200 to-purple-200 animate-pulse' : 'bg-gradient-to-r from-gray-100 to-gray-200'
                  }`} />
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    {dragActive ? (
                      <Cloud className="text-indigo-600 w-10 h-10 animate-bounce" />
                    ) : (
                      <Upload className="text-gray-400 w-10 h-10" />
                    )}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {dragActive ? 'Drop Your File Here!' : 'Upload Your Resume'}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Drag & drop your PDF or Word document here, or click to browse
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <FileUp className="w-5 h-5" />
                    Browse Files
                  </button>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    <span>Max 5MB • PDF, DOC, DOCX</span>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx" 
                />
              </div>
            </div>

            {/* File Preview / Upload Progress */}
            {file && !isUploading && (
              <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-indigo-100 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <FileCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">Ready to upload</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                  <CloudUpload className="w-5 h-5" />
                  Upload to Secure Cloud
                </button>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <UploadProgress progress={uploadProgress} fileName={file?.name} />
            )}

            {/* Success Message */}
            {uploadedFiles.length > 0 && !file && !isUploading && (
              <div 
                id="success-badge"
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-green-800">Upload Successful!</p>
                  <p className="text-sm text-green-600">Your file is now securely stored and visible to approved tutors</p>
                </div>
              </div>
            )}

            {/* Files List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="text-indigo-600" />
                  Your Uploaded Files ({uploadedFiles.length})
                </h3>
                {uploadedFiles.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileWarning className="text-gray-400 w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-400 mb-2">No Files Uploaded</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Upload your resume to make it visible to approved tutors
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-1 gap-4">
                  {uploadedFiles.map(f => (
                    <FileUploadCard 
                      key={f.id} 
                      fileData={f} 
                      onRemove={handleRemoveFile}
                      status={status}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info Panel */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-800/50 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Security Status</h3>
                  <p className="text-indigo-200 text-sm">Your files are protected</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-indigo-300">Current Status</span>
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-sm text-indigo-200">
                    {status === "approved" ? "Your documents are visible to tutors" :
                     status === "reviewed" ? "Under review by admin team" :
                     status === "rejected" ? "Please update your resume" :
                     "Awaiting initial review"}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-800/50 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div>
                      <p className="font-medium">End-to-End Encryption</p>
                      <p className="text-xs text-indigo-300">Files are encrypted during transfer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-800/50 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div>
                      <p className="font-medium">Tutor Access Control</p>
                      <p className="text-xs text-indigo-300">Only approved tutors can view</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-800/50 rounded-lg flex items-center justify-center">
                      <Cloud className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div>
                      <p className="font-medium">Cloud Backup</p>
                      <p className="text-xs text-indigo-300">Automatically backed up daily</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="text-amber-500" />
                Tips for Success
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Use a professional file name</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Keep file size under 5MB</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">PDF format is recommended</p>
                </li>
              </ul>
            </div>

            {/* Warning for Rejected Status */}
            {status === "rejected" && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-5 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-red-800 mb-1">Action Required</h5>
                    <p className="text-sm text-red-600">
                      Your previous resume was rejected. Please upload an updated version with corrections.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
           
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" />
            All files are stored securely and only accessible to authorized tutors
          </p>
        </div>
      </div>
    </div>
  );
}