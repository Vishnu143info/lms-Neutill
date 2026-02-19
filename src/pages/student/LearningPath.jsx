import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  BookOpen, 
  Calendar, 
  FileText,
  GraduationCap,
  Clock,
  Download,
  Eye,
  Bookmark,
  Search,
  Star,
  User,
  Tag,
  Filter,
  ChevronDown,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  Hash
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/* ================= PLAN PRIORITY ================= */
const PLAN_LEVEL = {
  Free: 0,
  Basic: 1,
  Premium: 2,
};


const TABS = ["All", "Free", "Basic", "Premium"];

const SORT_OPTIONS = ["Most Recent", "Title A-Z", "Popularity"];

const LearningPath = () => {
  const [materials, setMaterials] = useState([]);
  
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  const [activePlan, setActivePlan] = useState("All");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("Most Recent");
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const userPlan = user?.subscription?.planName || "Free";

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const q = query(collection(db, "contents"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          
          // Process date
          let date = new Date();
          if (docData.date) {
            if (docData.date?.toDate) {
              date = docData.date.toDate();
            } else {
              date = new Date(docData.date);
            }
          }

          return {
            id: doc.id,
            ...docData,
            date: date,
            // Handle different field names
            title: docData.name || docData.title || docData.issueName || "Untitled",
            description: docData.description || docData.content || docData.summary || "No description available",
            imageUrl: docData.imageUrl || docData.coverImage || docData.fileUrl || getDefaultImage(docData.type),
            category: docData.category || docData.theme || "General",
            author: docData.author || docData.publisher || "Tech Manthana",
            duration: docData.duration || "30 min",
            tags: docData.tags || [],
            views: docData.views || Math.floor(Math.random() * 5000) + 500,
            fileSize: docData.size || "2.5 MB",
            pages: docData.pages || Math.floor(Math.random() * 50) + 20,
            issueNumber: docData.issueNumber || docData.issue || `Vol. ${Math.floor(Math.random() * 10) + 1}`
          };
        });

        const learningOnly = data.filter(
  (item) => (item.type || "").toLowerCase() !== "magazine"
);

setMaterials(learningOnly);
setFilteredMaterials(learningOnly);


        // Extract unique categories from all content
        const allCategories = [...new Set(learningOnly.map(item => item.category))];

        setCategories(allCategories);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  // Helper function for default images based on content type
  const getDefaultImage = (type) => {
    const images = {
      magazine: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
      tutorial: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      course: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      default: "https://images.unsplash.com/photo-1497633762265-9d4f6a9a9c9a?auto=format&fit=crop&w=800&q=80"
    };
    return images[type?.toLowerCase()] || images.default;
  };

  /* ================= FILTER ================= */
 useEffect(() => {
  let filtered = [...materials];

  // Filter by plan
  if (activePlan !== "All") {
    filtered = filtered.filter(
      (item) =>
        (item.plan || "Free").toLowerCase() === activePlan.toLowerCase()
    );
  }

  // Filter by category
  if (selectedCategory !== "all") {
    filtered = filtered.filter(
      (item) => item.category === selectedCategory
    );
  }

  // Filter by search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();

    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        )
    );
  }

  filtered = sortItems(filtered, sortBy);

  setFilteredMaterials(filtered);
}, [activePlan, materials, selectedCategory, searchQuery, sortBy]);


  const sortItems = (items, sortOption) => {
    const sorted = [...items];
    
    switch(sortOption) {
      case "Most Recent":
        return sorted.sort((a, b) => b.date - a.date);
      case "Title A-Z":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "Popularity":
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      default:
        return sorted.sort((a, b) => b.date - a.date);
    }
  };

  /* ================= BOOKMARK TOGGLE ================= */
  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarkedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  /* ================= CARD COMPONENT ================= */
  const ContentCard = ({ item, type }) => {
    const contentPlan = item.plan || "Free";
    const isUnlocked = contentPlan === "Free" || PLAN_LEVEL[userPlan] >= PLAN_LEVEL[contentPlan];
    const isHovered = hoveredCard === item.id;
    const isBookmarked = bookmarkedItems.includes(item.id);

    const getPlanColor = (plan) => {
     const colors = {
  Free: "from-emerald-400 to-green-500",
  Basic: "from-blue-400 to-cyan-500",
  Premium: "from-purple-400 to-pink-500",
};

      return colors[plan] || "from-gray-400 to-gray-500";
    };

    const formatDate = (date) => {
      if (!date) return "Invalid Date";
      try {
        return new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      } catch {
        return "Invalid Date";
      }
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setHoveredCard(item.id)}
        onHoverEnd={() => setHoveredCard(null)}
        className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer"
        onClick={() => isUnlocked && window.open(item.url || item.fileUrl, '_blank')}
      >
        {/* Premium Overlay for Locked Content */}
        {!isUnlocked && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 flex items-end justify-center pb-8"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center px-4"
            >
              <Lock className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-semibold mb-2">Premium Content</p>
              <p className="text-white/80 text-xs mb-3">Upgrade to {contentPlan} to access</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/subscribe");
                }}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full font-semibold text-sm hover:shadow-lg transition-shadow"
              >
                Unlock Now
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Image Section */}
        <div className={`relative h-48 bg-gradient-to-r ${getPlanColor(contentPlan)} overflow-hidden`}>
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.src = getDefaultImage(item.type);
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-lg flex items-center gap-1">
              {type === 'magazine' ? <BookOpen className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
              {type === 'magazine' ? 'Magazine' : 'Learning'}
            </span>
          </div>

          {/* Plan Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg bg-gradient-to-r ${getPlanColor(contentPlan)}`}>
            {contentPlan}
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white">
            <Hash className="w-3 h-3" />
            {item.category}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => toggleBookmark(item.id, e)}
            className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-indigo-600 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Title and Issue/Volume */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-1">
              {item.title}
            </h3>
            {item.issueNumber && (
              <p className="text-xs text-gray-400">{item.issueNumber}</p>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-3">
            {item.description}
          </p>

          {/* Author and Date */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-400">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{item.author}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-3 h-3" />
              {formatDate(item.date)}
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Eye className="w-3 h-3" />
              {item.views?.toLocaleString() || 0} views
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-3 h-3" />
              {item.duration}
            </div>
            {item.pages && (
              <div className="flex items-center gap-1 text-gray-400">
                <FileText className="w-3 h-3" />
                {item.pages} pages
              </div>
            )}
          </div>

          {/* Action Button */}
          {isUnlocked ? (
            <a
              href={item.url || item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all text-sm"
            >
              {type === 'magazine' ? 'Read Magazine' : 'Start Learning'}
            </a>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/subscribe");
              }}
              className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Upgrade to {contentPlan}
            </button>
          )}
        </div>

        {/* Hover Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading learning path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-4 md:p-6">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Learning Path</h1>
            <p className="text-white/90 max-w-2xl">
              Discover curated learning materials tailored to your skill level
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="mb-8 space-y-4">
        {/* Plan Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePlan(tab)}
              className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                activePlan === tab
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab === "All" ? "All Plans" : tab}
            </motion.button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              All Categories
            </button>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Stats */}
      <div className="flex items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span className="text-gray-600">
            <span className="font-bold text-indigo-600">{filteredMaterials.length}</span> Learning Materials
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-600" />
         <span className="font-bold text-indigo-600">
  {filteredMaterials.length}
</span> Learning Materials

        </div>
        {bookmarkedItems.length > 0 && (
          <span className="text-gray-400">
            • {bookmarkedItems.length} Bookmarked
          </span>
        )}
      </div>

      {/* Learning Materials Section */}
      {filteredMaterials.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Learning Materials
          </h2>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredMaterials.map((item) => (
                <ContentCard key={item.id} item={item} type="learning" />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Magazines Section */}
      
       <div className="flex items-center gap-4 mb-6 text-sm">
  <div className="flex items-center gap-2">
    <Layers className="w-4 h-4 text-indigo-600" />
    <span className="text-gray-600">
      <span className="font-bold text-indigo-600">
        {filteredMaterials.length}
      </span>{" "}
      Learning Materials
    </span>
  </div>

  {bookmarkedItems.length > 0 && (
    <span className="text-gray-400">
      • {bookmarkedItems.length} Bookmarked
    </span>
  )}
</div>

      

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-3xl shadow-lg"
        >
          <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Content Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find any content matching your current filters. Try adjusting your search or filters.
          </p>
          <button
            onClick={() => {
              setActivePlan("All");
              setSelectedCategory("all");
              setSearchQuery("");
              setSortBy("Most Recent");
            }}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Reset All Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default LearningPath;