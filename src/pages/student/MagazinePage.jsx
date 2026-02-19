import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Calendar, 
  FileText,
  Newspaper,
  Filter,
  ChevronDown,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  Download,
  Eye,
  Share2,
  Bookmark,
  Globe,
  Hash,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Search
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

const MagazinePage = () => {
  const [magazines, setMagazines] = useState([]);
  const [filteredMagazines, setFilteredMagazines] = useState([]);
  const [activePlan, setActivePlan] = useState("All");
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sortBy, setSortBy] = useState("Most Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [bookmarkedIssues, setBookmarkedIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const userPlan = user?.subscription?.planName || "Free";

  /* ================= FETCH MAGAZINES ================= */
  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const q = query(collection(db, "contents"));
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
            date,
            type: (docData.type || "Magazine").toLowerCase(),
            plan: (docData.plan || "Free").trim(),
            coverImage: docData.imageUrl || docData.fileUrl || docData.coverImage || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
            category: docData.category || docData.theme || "General",
            description: docData.description || docData.content || docData.summary || "No description available",
            title: docData.name || docData.title || docData.issueName || "Untitled Magazine",
            issueNumber: docData.issueNumber || docData.issue || `Vol. ${Math.floor(Math.random() * 10) + 1}`,
            pdfUrl: docData.pdfUrl || docData.fileUrl || null,
            fileSize: docData.size || "2.5 MB",
            
            publisher: docData.publisher || docData.author || "Tech Manthana",
            tags: docData.tags || [],
            views: docData.views || Math.floor(Math.random() * 5000) + 500,
            downloads: docData.downloads || Math.floor(Math.random() * 1000) + 100
          };
        });

        const magazineItems = data.filter(item => item.type === "magazine");
        setMagazines(magazineItems);

        // Extract unique categories
        const uniqueCategories = [...new Set(magazineItems.map(item => item.category))];
        setCategories(uniqueCategories);

      } catch (err) {
        console.error("Error fetching magazines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  /* ================= FILTER AND SORT ================= */
  useEffect(() => {
    let filtered = [...magazines];

    // Filter by plan
    if (activePlan !== "All") {
      filtered = filtered.filter(
        (item) => (item.plan || "Free").toLowerCase() === activePlan.toLowerCase()
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) => 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.publisher.toLowerCase().includes(query) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Sort items
    filtered = sortItems(filtered, sortBy);

    setFilteredMagazines(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activePlan, magazines, selectedCategory, searchQuery, sortBy]);

  const sortItems = (items, sortOption) => {
    const sorted = [...items];

    switch (sortOption) {
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
    setBookmarkedIssues(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  /* ================= PAGINATION ================= */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMagazines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMagazines.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  /* ================= MAGAZINE CARD COMPONENT ================= */
  const MagazineCard = ({ item }) => {
    const contentPlan = item.plan || "Free";
    const isUnlocked = contentPlan === "Free" || PLAN_LEVEL[userPlan] >= PLAN_LEVEL[contentPlan];
    const isHovered = hoveredCard === item.id;
    const isBookmarked = bookmarkedIssues.includes(item.id);

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
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
        onClick={() => isUnlocked ? setSelectedIssue(item) : null}
        className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 ${
          isUnlocked ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {/* Premium Overlay for Locked Content */}
        {!isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 flex items-end justify-center pb-8 pointer-events-none"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: isHovered ? 0 : 20 }}
              className="text-center px-4"
            >
              <Lock className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-semibold mb-2">Premium Magazine</p>
              <p className="text-white/80 text-xs mb-3">Upgrade to {contentPlan} to read</p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/subscribe");
                }}
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full font-semibold text-sm hover:shadow-lg transition-shadow pointer-events-auto"
              >
                Subscribe Now
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Magazine Cover */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={item.coverImage} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80";
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Issue Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-lg">
              {item.issueNumber}
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
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {item.description}
          </p>

          {/* Publisher and Date */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-400">
              <Globe className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{item.publisher}</span>
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
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Eye className="w-3 h-3" />
              {item.views?.toLocaleString() || 0} views
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Download className="w-3 h-3" />
              {item.downloads?.toLocaleString() || 0} downloads
            </div>
            {/* <div className="flex items-center gap-1 text-gray-400">
              <FileText className="w-3 h-3" />
              {item.pages} pages
            </div> */}
          </div>

          {/* Action Button */}
          {isUnlocked ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIssue(item);
              }}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
            >
              Read Magazine
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/subscribe");
              }}
              className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Subscribe to Read
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

  /* ================= MAGAZINE READER MODAL ================= */
  const MagazineReader = ({ issue, onClose }) => {
    if (!issue) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 overflow-hidden flex flex-col"
        onClick={onClose}
      >
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold line-clamp-1">{issue.title}</h2>
              <p className="text-xs text-gray-400">{issue.issueNumber} • {issue.publisher}</p>
            </div>
          </div>
        </div>

        {/* Reader Content */}
        <div className="flex-1 overflow-y-auto bg-gray-800 p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Magazine Cover Large */}
            <div className="relative h-64 md:h-96 bg-gradient-to-r from-indigo-900 to-purple-900">
              <img 
                src={issue.coverImage} 
                alt={issue.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>

            {/* Magazine Content */}
            <div className="p-4 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{issue.title}</h1>
                  <p className="text-gray-500">{issue.issueNumber}</p>
                </div>
                {/* <span className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full font-semibold">
                  {issue.pages} Pages
                </span> */}
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">In this issue:</h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Article {i}: Topic {i}</span>
                    </li>
                  ))}
                </ul>
              </div> */}

              {issue.pdfUrl && (
                <div className="flex justify-center">
                  <a
                    href={issue.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Read Full Magazine
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
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
          <p className="text-gray-600 font-medium">Loading magazines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Magazine Library</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4">
              Explore our collection of tech magazines, industry insights, and expert articles. Stay updated with the latest trends.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-md mx-auto px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search magazines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 pl-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Controls Bar */}
        <div className="mb-8 space-y-6">
          
          {/* Plan Tabs - Horizontal Scroll on Mobile */}
          <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {TABS.map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePlan(tab)}
                className={`flex-shrink-0 px-4 md:px-5 py-2 rounded-xl font-semibold transition-all ${
                  activePlan === tab
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            {/* Category Filters - Horizontal Scroll on Mobile */}
            <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-pink-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                All Categories
              </button>
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-pink-600 text-white"
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
              className="w-full lg:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-pink-600" />
            <span className="text-gray-600">
              Showing <span className="font-bold text-pink-600">{filteredMagazines.length}</span> magazine issues
            </span>
          </div>
          <span className="text-sm text-gray-400">
            {userPlan} Plan • {bookmarkedIssues.length} Bookmarked
          </span>
        </div>

        {/* Magazines Grid */}
        {filteredMagazines.length > 0 ? (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              <AnimatePresence>
                {currentItems.map((item) => (
                  <MagazineCard key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 md:py-20 bg-white rounded-3xl shadow-lg px-4"
          >
            <Newspaper className="w-16 md:w-20 h-16 md:h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">No Magazines Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any magazines matching your current filters. Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setActivePlan("All");
                setSelectedCategory("all");
                setSearchQuery("");
                setSortBy("Most Recent");
              }}
              className="mt-6 md:mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Magazine Reader Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <MagazineReader 
            issue={selectedIssue} 
            onClose={() => setSelectedIssue(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagazinePage;