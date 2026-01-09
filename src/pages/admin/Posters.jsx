import React, { useState, useEffect, useRef } from "react";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Download,
  Copy,
  ExternalLink,
  Tag,
  User
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

/* -------------------- Enhanced Blog Modal -------------------- */
const BlogModal = ({ post, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.log('Sharing cancelled');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto animate-fade-in">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/90 via-purple-900/40 to-black/90 backdrop-blur-lg"
        onClick={onClose}
      />
      
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl transform animate-scale-up my-8">
        <div className="relative h-96 overflow-hidden">
          <img
            src={post.fileUrl}
            alt={post.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute top-6 right-6 flex gap-2">
            <button
              onClick={handleShare}
              className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transform hover:scale-110 transition-all duration-200"
            >
              {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Share2 size={20} className="text-gray-800" />}
            </button>
            <button
              onClick={onClose}
              className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transform hover:scale-110 transition-all duration-200"
            >
              <X size={20} className="text-gray-800" />
            </button>
          </div>
          
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {new Date(post.createdAt?.toDate?.() || post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock size={14} />
                <span>{Math.ceil(post.content.length / 200)} min read</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg leading-tight">{post.title}</h1>
            <p className="text-lg text-gray-200 mb-6 max-w-2xl">{post.excerpt}</p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">Admin</p>
                  <p className="text-sm text-gray-300">Author</p>
                </div>
              </div>
              
              <div className="flex-1" />
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${liked ? 'bg-rose-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  <Heart size={18} className={liked ? 'fill-current' : ''} />
                  <span>Like</span>
                </button>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{post.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed text-lg">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.excerpt.split(" ").slice(0, 5).map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <Tag size={14} />
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                  <Download size={16} />
                  Save Article
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 hover:border-gray-400 hover:shadow transition"
                >
                  {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
                <ExternalLink size={16} />
                Open in new tab
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Poster Card -------------------- */
const PosterCard = ({ post, onView, onDelete, onEdit, isEditing }) => {
  const [hovered, setHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 ${isEditing ? 'ring-4 ring-blue-500 ring-offset-2' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowMenu(false); }}
      onClick={() => !showMenu && onView(post)}
    >
      {isEditing && (
        <div className="absolute top-4 left-4 z-10">
          <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-full">
            Editing
          </div>
        </div>
      )}
      
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transform hover:scale-110 transition"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fade-in">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition text-left"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Edit Post</span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition text-left"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span className="font-medium">Delete Post</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(post);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left"
              >
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="font-medium">View Details</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative h-56 overflow-hidden">
        <img
          src={post.fileUrl}
          alt={post.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg line-clamp-2 mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-200 line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{Math.ceil(post.content.length / 200)} min</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(post);
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                   bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
                   text-sm font-semibold shadow-md 
                   hover:shadow-lg hover:-translate-y-0.5 transition-all group"
        >
          Read Full Article
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

/* -------------------- Enhanced Upload Zone -------------------- */
const UploadZone = ({ onUpload, uploading, formData, setFormData, editingPost, onCancelEdit, imagePreview, onImageChange, onRemoveImage }) => {
  const fileInputRef = useRef(null);

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl mb-10 border-2 ${editingPost ? 'border-blue-500' : 'border-gray-100'} transition-all`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            {editingPost ? <Edit2 className="text-white" /> : <Upload className="text-white" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <p className="text-gray-600">
              {editingPost ? 'Update your existing post' : 'Share your thoughts with the world'}
            </p>
          </div>
        </div>
        
        {editingPost && (
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
          >
            <X size={16} />
            Cancel Edit
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Blog Title *
            </label>
            <input
              className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="Enter a catchy title..."
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Short Description *
            </label>
            <input
              className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="Brief summary of your post..."
              value={formData.excerpt}
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Content *
          </label>
          <textarea
            className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition h-48 resize-none"
            placeholder="Write your amazing content here..."
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
          />
          <div className="text-sm text-gray-500 flex justify-between">
            <span>{formData.content.length} characters</span>
            <span>{Math.ceil(formData.content.length / 200)} min read</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700">
              Cover Image {editingPost && '(Optional)'}
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={onRemoveImage}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium"
              >
                Remove Image
              </button>
            )}
          </div>
          
          {imagePreview ? (
            <div className="relative group">
              <div className="border-2 border-gray-300 rounded-2xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white rounded-lg font-medium hover:bg-gray-100 transition"
                  >
                    Replace Image
                  </button>
                  <button
                    onClick={onRemoveImage}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Click on the image to replace it with a new one
              </p>
            </div>
          ) : (
            <label className={`cursor-pointer block ${uploading ? 'opacity-50' : ''}`}>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={e => e.target.files[0] && onImageChange(e.target.files[0])}
                disabled={uploading}
              />
              <div className="border-3 border-dashed border-gray-300 p-10 text-center rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group">
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-gray-600 font-medium">Uploading image...</p>
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
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>
            </label>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          {editingPost && (
            <button
              onClick={onCancelEdit}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={() => onUpload(null)}
            disabled={uploading || !formData.title || !formData.excerpt || !formData.content}
            className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2
              ${uploading || !formData.title || !formData.excerpt || !formData.content
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" />
                {editingPost ? 'Updating...' : 'Publishing...'}
              </>
            ) : (
              <>
                {editingPost ? <Edit2 size={18} /> : <Upload size={18} />}
                {editingPost ? 'Update Post' : 'Publish Blog Post'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Stats -------------------- */
const StatsCard = ({ posts }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
    {[
      { icon: BookOpen, label: "Total Posts", value: posts.length, color: "blue" },
      { icon: Eye, label: "Total Views", value: posts.reduce((sum, post) => sum + (post.views || 0), 0), color: "emerald" },
      { icon: Calendar, label: "This Month", value: posts.filter(p => {
          const postDate = new Date(p.createdAt?.toDate?.() || p.date);
          const now = new Date();
          return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
        }).length, color: "violet" },
      { icon: Heart, label: "Avg. Views", value: posts.length > 0 
          ? Math.round(posts.reduce((sum, post) => sum + (post.views || 0), 0) / posts.length)
          : 0, color: "orange" }
    ].map((stat, idx) => (
      <div key={idx} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-6 rounded-2xl border border-${stat.color}-200`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm text-${stat.color}-700 font-semibold`}>{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-900 mt-2`}>{stat.value}</p>
          </div>
          <div className={`p-3 bg-${stat.color}-500 rounded-xl`}>
            <stat.icon className="text-white" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* -------------------- MAIN -------------------- */
export default function Posters() {
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

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

  /* Set up editing */
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content
      });
      setImagePreview(editingPost.fileUrl);
      setImageFile(null);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingPost]);

  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleUpload = async () => {
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (!editingPost && !imageFile) {
      showToast("Please select a cover image", "error");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = editingPost?.fileUrl || null;
      let oldImageRef = null;

      // Upload new image if provided
      if (imageFile) {
        // Delete old image if editing and image changed
        if (editingPost && editingPost.fileUrl && imageFile) {
          try {
            oldImageRef = ref(storage, editingPost.fileUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.log("Old image not found or already deleted");
          }
        }

        const storageRef = ref(storage, `posters/${Date.now()}_${imageFile.name}`);
        const snap = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snap.ref);
      }

      const data = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        fileUrl: imageUrl,
        updatedAt: new Date()
      };

      if (editingPost) {
        await updateDoc(doc(db, "posters", editingPost.id), data);

        setPosts(posts =>
          posts.map(p => (p.id === editingPost.id ? { ...p, ...data } : p))
        );

        setEditingPost(null);
        showToast("✏️ Post updated successfully");
      } else {
        const docRef = await addDoc(collection(db, "posters"), {
          ...data,
          createdAt: new Date(),
          views: 0
        });

        setPosts([{ id: docRef.id, ...data, createdAt: new Date(), views: 0 }, ...posts]);
        showToast("🎉 Post published successfully");
      }

      // Reset form
      setFormData({ title: "", excerpt: "", content: "" });
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Operation failed", "error");
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
const deletePost = async (id) => {
  try {
    // Find the post
    const postToDelete = posts.find(p => p.id === id);

    // Delete image from storage if exists
    if (postToDelete?.fileUrl) {
      const imageRef = ref(storage, postToDelete.fileUrl);
      await deleteObject(imageRef);
    }

    // Delete document from Firestore
    await deleteDoc(doc(db, "posters", id));

    // Update state
    setPosts(posts.filter(p => p.id !== id));

    showToast("Post deleted successfully");
  } catch (error) {
    console.error(error);
    showToast("Failed to delete post", "error");
  }
};

  const cancelEdit = () => {
    setEditingPost(null);
    setFormData({ title: "", excerpt: "", content: "" });
    setImagePreview(null);
    setImageFile(null);
  };

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt?.toDate?.() || b.date) - new Date(a.createdAt?.toDate?.() || a.date);
      } else if (sortBy === "views") {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });

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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Poster Blog Manager
              </h1>
              <p className="text-gray-600 mt-2">Create, manage, and share your blog posts</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-semibold">
                {posts.length} Active Posts
              </div>
            </div>
          </div>
          
          <StatsCard posts={posts} />
        </div>

        {/* Upload/Edit Form */}
        <UploadZone 
          onUpload={handleUpload}
          uploading={uploading}
          formData={formData}
          setFormData={setFormData}
          editingPost={editingPost}
          onCancelEdit={cancelEdit}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />

        {/* Posts Grid */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery ? `Search Results (${filteredAndSortedPosts.length})` : 'Recent Posts'}
            </h2>
            <div className="flex gap-2">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="views">Sort by Views</option>
              </select>
            </div>
          </div>
          
          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <BookOpen className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? 'No posts found' : 'No posts yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Try a different search term' : 'Create your first blog post to get started'}
              </p>
              {!searchQuery && (
                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedPosts.map(post => (
                <PosterCard
                  key={post.id}
                  post={post}
                  onView={viewPost}
                  onDelete={deletePost}
                  onEdit={(post) => setEditingPost(post)}
                  isEditing={editingPost?.id === post.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add CSS animations
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  color: #374151;
}

.prose p {
  margin-bottom: 1.5em;
  line-height: 1.75;
}

.prose-lg {
  font-size: 1.125rem;
}
`;