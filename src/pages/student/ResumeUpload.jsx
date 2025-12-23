import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, FileText, CheckCircle, XCircle, Eye, 
  Download, Trash2, Cloud, Shield, Star, Clock, 
  UserCheck, Calendar, Loader2 
} from "lucide-react";

// --- FIREBASE IMPORTS ---
import { db, storage, auth } from "../../firebase"; 
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const FileUploadCard = ({ fileData, onRemove }) => {
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

  return (
    <div className="bg-white rounded-xl p-4 border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">{getFileIcon(fileData.name)}</div>
          <div>
            <p className="font-medium text-gray-800 truncate max-w-[150px] sm:max-w-xs">{fileData.name}</p>
            <p className="text-sm text-gray-500">{formatFileSize(fileData.size)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <a href={fileData.url} target="_blank" rel="noreferrer" className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
             <Eye className="w-5 h-5" />
           </a>
           <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Encrypted</span>
        <button onClick={() => onRemove(fileData)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function ResumeUpload() {
  const [currentUser, setCurrentUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // 1. Listen for Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // 2. Real-time sync of uploaded files from Firestore
        const userRef = doc(db, "users", user.uid);
        return onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUploadedFiles(docSnap.data().resumes || []);
          }
        });
      }
    });
    return () => unsub();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) return alert("File too large (>5MB)");
      setFile(selectedFile);
    }
  };

  // 3. ACTUAL FIREBASE UPLOAD LOGIC
  const handleUpload = async () => {
    if (!file || !currentUser) return;

    setIsUploading(true);
    const storagePath = `resumes/${currentUser.uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", 
      (snapshot) => {
        setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      }, 
      (error) => {
        console.error(error);
        setIsUploading(false);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const fileMetadata = {
          id: Date.now().toString(),
          name: file.name,
          url: downloadURL,
          size: file.size,
          path: storagePath, // stored for deletion later
          uploadedAt: new Date().toISOString()
        };

        const userDoc = doc(db, "users", currentUser.uid);
        await updateDoc(userDoc, {
          resumes: arrayUnion(fileMetadata)
        });

        setFile(null);
        setIsUploading(false);
        setUploadProgress(0);
      }
    );
  };

  // 4. ACTUAL DELETE LOGIC
  const handleRemoveFile = async (fileObj) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      // Delete from Storage
      const fileRef = ref(storage, fileObj.path);
      await deleteObject(fileRef);

      // Remove metadata from Firestore
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, {
        resumes: arrayRemove(fileObj)
      });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Helper UI functions
  const handleDrag = (e) => { e.preventDefault(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const handleDrop = (e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFileChange({ target: { files: e.dataTransfer.files } }); };

  if (!currentUser) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto mb-4" /> Loading Profile...</div>;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Resume & Portfolio</h1>
        <p className="text-gray-500">Your documents are visible to approved tutors.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Box */}
          <div 
            className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${dragActive ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-gray-300 bg-white'}`}
            onDragOver={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="text-indigo-600 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-1">Select Resume</h3>
            <p className="text-gray-400 text-sm mb-6">Drag & drop or click to browse</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
            <button onClick={() => fileInputRef.current.click()} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg">Browse Files</button>
          </div>

          {/* Pending File Preview */}
          {file && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-500 w-8 h-8" />
                  <div>
                    <p className="font-bold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size/1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)}><XCircle className="text-gray-300 hover:text-red-500" /></button>
              </div>
              {isUploading ? (
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all" style={{width: `${uploadProgress}%`}} />
                </div>
              ) : (
                <button onClick={handleUpload} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                  <Cloud className="w-5 h-5" /> Confirm & Upload
                </button>
              )}
            </div>
          )}

          {/* Files List */}
          <div className="grid sm:grid-cols-2 gap-4">
            {uploadedFiles.map(f => <FileUploadCard key={f.id} fileData={f} onRemove={handleRemoveFile} />)}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-lg"><Shield className="w-5 h-5 text-indigo-300" /> Secure Storage</h3>
              <ul className="text-sm space-y-3 text-indigo-100">
                <li className="flex items-start gap-2"> <CheckCircle className="w-4 h-4 mt-0.5 text-indigo-400" /> Only approved tutors can see files.</li>
                <li className="flex items-start gap-2"> <CheckCircle className="w-4 h-4 mt-0.5 text-indigo-400" /> Files are scanned for security.</li>
                <li className="flex items-start gap-2"> <CheckCircle className="w-4 h-4 mt-0.5 text-indigo-400" /> You can revoke access anytime.</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}