import React, { useState, useEffect } from "react";
import { storage, db } from "../../firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import { Upload, Image, Eye, Download, Trash2, BarChart3, Share2, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";

// --- Custom Popup/Toast Component ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right-10 duration-300 ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
};

const PosterCard = ({ poster, onDelete, onView }) => {
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
            onClick={() => onView(poster)}
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
          <div className="max-w-[70%]">
            <h3 className="font-bold text-gray-800 truncate">{poster.fileName}</h3>
            <p className="text-sm text-gray-500">Uploaded {poster.date}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            poster.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}>
            {poster.status}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{(poster.views || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{poster.downloads || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Posters() {
  const [posters, setPosters] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const q = query(collection(db, "posters"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosters(data);
      } catch (e) {
        showToast("Error loading posters", "error");
      }
    };
    fetchPosters();
  }, []);

  const handlePosterUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    try {
      const storageRef = ref(storage, `posters/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const newPosterData = {
        fileName: file.name,
        fileUrl: downloadURL,
        date: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
        createdAt: new Date(),
        status: "Active",
        views: 0,
        downloads: 0
      };

      const docRef = await addDoc(collection(db, "posters"), newPosterData);
      setPosters([{ id: docRef.id, ...newPosterData }, ...posters]);
      showToast("Poster uploaded successfully!");
    } catch (error) {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const deletePoster = async (id) => {
    try {
      await deleteDoc(doc(db, "posters", id));
      setPosters(posters.filter((p) => p.id !== id));
      showToast("Poster deleted successfully.");
    } catch (error) {
      showToast("Could not delete poster.", "error");
    }
  };

  const viewPoster = async (poster) => {
    const posterRef = doc(db, "posters", poster.id);
    await updateDoc(posterRef, { views: increment(1) });
    setPosters(posters.map(p => p.id === poster.id ? { ...p, views: (p.views || 0) + 1 } : p));
    window.open(poster.fileUrl, "_blank");
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto relative">
      {/* Toast Popup Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          📢 Poster Manager
        </h1>
      </div>

      {/* Upload Area */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
        <label className={`cursor-pointer ${uploading ? 'pointer-events-none opacity-60' : ''}`}>
          <input type="file" className="hidden" onChange={(e) => e.target.files[0] && handlePosterUpload(e.target.files[0])} accept="image/*" disabled={uploading} />
          <div className="border-3 border-dashed border-purple-200 rounded-2xl p-8 text-center hover:border-purple-300 hover:bg-white/50 transition-all duration-300">
            <div className="flex flex-col items-center justify-center">
              {uploading ? (
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              ) : (
                <Upload className="w-12 h-12 text-purple-400 mb-4" />
              )}
              <p className="text-lg font-semibold text-gray-700">
                {uploading ? "Uploading to Cloud..." : "Click to upload poster"}
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posters.map((poster) => (
          <PosterCard key={poster.id} poster={poster} onDelete={deletePoster} onView={viewPoster} />
        ))}
      </div>
    </div>
  );
}