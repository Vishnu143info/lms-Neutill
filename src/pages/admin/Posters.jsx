import React, { useState, useEffect } from "react";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import {
  Upload,
  Eye,
  Trash2,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Edit2,
  Heart,
  Share2,
  BookOpen,
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";

/* -------------------- Toast -------------------- */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`fixed top-6 right-6 z-50 animate-slide-in`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl transform transition-all duration-300
        ${type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"}
        text-white backdrop-blur-sm bg-white/10 border border-white/20`}>
        {type === "success" ? 
          <CheckCircle2 className="animate-bounce" /> : 
          <AlertCircle className="animate-pulse" />
        }
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:bg-white/20 p-1 rounded-full transition">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

/* -------------------- Blog Modal -------------------- */
const BlogModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/30 to-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl transform animate-scale-up">
        <div className="relative h-80 overflow-hidden">
          <img
            src={post.fileUrl}
            alt={post.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transform hover:scale-110 transition-all duration-200"
          >
            <X className="text-gray-800" />
          </button>
          
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{post.title}</h2>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{post.views} views</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                <BookOpen size={14} />
                <span>{Math.ceil(post.content.length / 200)} min read</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                <Heart size={16} />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 hover:shadow transition">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
          
          <div className="pt-6 border-t">
            <div className="flex flex-wrap gap-2">
              {post.excerpt.split(" ").slice(0, 4).map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Poster Card -------------------- */
const PosterCard = ({ post, onView, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(post)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative h-56 overflow-hidden">
        <img
          src={post.fileUrl}
          alt={post.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(post.id);
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transform hover:scale-110 transition"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
              Featured
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-1 text-xs text-white bg-black/40 px-2 py-1 rounded-full">
              <Clock size={10} />
              <span>{Math.ceil(post.content.length / 200)} min</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white drop-shadow-lg line-clamp-2">
            {post.title}
          </h3>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <p className="text-gray-600 text-sm line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="font-semibold">{post.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.createdAt?.toDate?.() || post.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm group/read">
            <span>Read More</span>
            <ChevronRight className="w-4 h-4 transform group-hover/read:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Upload Zone -------------------- */
const UploadZone = ({ onUpload, uploading, formData, setFormData }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl mb-10 border border-gray-100">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
        <Upload className="text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Create New Blog Post</h2>
        <p className="text-gray-600">Share your thoughts with the world</p>
      </div>
    </div>

    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Blog Title
          </label>
          <input
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="Enter a catchy title..."
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Short Description
          </label>
          <input
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="Brief summary of your post..."
            value={formData.excerpt}
            onChange={e => setFormData({...formData, excerpt: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Content
        </label>
        <textarea
          className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition h-40"
          placeholder="Write your amazing content here..."
          value={formData.content}
          onChange={e => setFormData({...formData, content: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Cover Image
        </label>
        <label className={`cursor-pointer block ${uploading ? 'opacity-50' : ''}`}>
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={e => onUpload(e.target.files[0])}
            disabled={uploading}
          />
          <div className="border-3 border-dashed border-gray-300 p-10 text-center rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-gray-600 font-medium">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Drop your image here or click to browse</p>
                  <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                  Choose File
                </button>
              </div>
            )}
          </div>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onUpload(null)}
          disabled={uploading || !formData.title || !formData.content}
          className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2
            ${uploading || !formData.title || !formData.content
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Upload />
              Publish Blog Post
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

/* -------------------- Stats -------------------- */
const StatsCard = ({ posts }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-700 font-semibold">Total Posts</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{posts.length}</p>
        </div>
        <div className="p-3 bg-blue-500 rounded-xl">
          <BookOpen className="text-white" />
        </div>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-700 font-semibold">Total Views</p>
          <p className="text-3xl font-bold text-emerald-900 mt-2">
            {posts.reduce((sum, post) => sum + (post.views || 0), 0)}
          </p>
        </div>
        <div className="p-3 bg-emerald-500 rounded-xl">
          <Eye className="text-white" />
        </div>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl border border-violet-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-violet-700 font-semibold">This Month</p>
          <p className="text-3xl font-bold text-violet-900 mt-2">
            {posts.filter(p => {
              const postDate = new Date(p.createdAt?.toDate?.() || p.date);
              const now = new Date();
              return postDate.getMonth() === now.getMonth() && 
                     postDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
        <div className="p-3 bg-violet-500 rounded-xl">
          <Calendar className="text-white" />
        </div>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-orange-700 font-semibold">Avg. Views</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">
            {posts.length > 0 
              ? Math.round(posts.reduce((sum, post) => sum + (post.views || 0), 0) / posts.length)
              : 0
            }
          </p>
        </div>
        <div className="p-3 bg-orange-500 rounded-xl">
          <Heart className="text-white" />
        </div>
      </div>
    </div>
  </div>
);

/* -------------------- MAIN -------------------- */
export default function Posters() {
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: ""
  });

  const showToast = (msg, type = "success") =>
    setToast({ message: msg, type });

  /* Fetch Posts */
  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(
        collection(db, "posters"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchPosts();
  }, []);

  /* Upload Blog */
  const handleUpload = async file => {
    if (!file || !formData.title || !formData.excerpt || !formData.content) {
      showToast("Please fill all fields before uploading", "error");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `posters/${Date.now()}_${file.name}`);
      const snap = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snap.ref);

      const data = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        fileUrl: url,
        createdAt: new Date(),
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        views: 0
      };

      const docRef = await addDoc(collection(db, "posters"), data);
      setPosts([{ id: docRef.id, ...data }, ...posts]);

      setFormData({
        title: "",
        excerpt: "",
        content: ""
      });

      showToast("🎉 Blog post published successfully!");
    } catch {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  /* View Blog */
  const viewPost = async post => {
    await updateDoc(doc(db, "posters", post.id), {
      views: increment(1)
    });

    setPosts(posts =>
      posts.map(p =>
        p.id === post.id ? { ...p, views: (p.views || 0) + 1 } : p
      )
    );

    setActivePost(post);
  };

  /* Delete */
  const deletePost = async id => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, "posters", id));
      setPosts(posts.filter(p => p.id !== id));
      showToast("Post deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {activePost && (
        <BlogModal post={activePost} onClose={() => setActivePost(null)} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Poster Blog Manager
              </h1>
              <p className="text-gray-600 mt-2">Create, manage, and share your blog posts</p>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-semibold">
              {posts.length} Active Posts
            </div>
          </div>
          
          <StatsCard posts={posts} />
        </div>

        {/* Upload Form */}
        <UploadZone 
          onUpload={handleUpload}
          uploading={uploading}
          formData={formData}
          setFormData={setFormData}
        />

        {/* Posts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Posts</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                Sort by Date
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                Sort by Views
              </button>
            </div>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <BookOpen className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Create your first blog post to get started</p>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold">
                Create First Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <PosterCard
                  key={post.id}
                  post={post}
                  onView={viewPost}
                  onDelete={deletePost}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add these CSS animations to your global CSS file or style tag
const styles = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes scale-up {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

.animate-scale-up {
  animation: scale-up 0.3s ease-out;
}
`;