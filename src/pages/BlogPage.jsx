import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RightUpdatesStripe from "./RightUpdatesStripe";
import { 
  FiLock, 
  FiUnlock, 
  FiBookOpen, 
  FiTrendingUp, 
  FiStar,
  FiCalendar,
  FiArrowRight,
  FiFilter,
  FiGrid,
  FiList
} from "react-icons/fi";
import { IoMdRibbon } from "react-icons/io";
import { BsLightningCharge, BsNewspaper } from "react-icons/bs";
import Magazine from "./Magazine";

const BlogPage = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [hoveredId, setHoveredId] = useState(null);
  const [stats, setStats] = useState({ total: 0, free: 0, basic: 0, premium: 0 });

  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  /* ================= FETCH CONTENTS ================= */
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const q = query(collection(db, "contents"), orderBy("date", "desc"));
        const snap = await getDocs(q);
        
        const fetchedContents = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setContents(fetchedContents);
        
        // Calculate stats
        const planCounts = fetchedContents.reduce((acc, item) => {
          acc[item.plan?.toLowerCase()] = (acc[item.plan?.toLowerCase()] || 0) + 1;
          return acc;
        }, {});
        
        setStats({
          total: fetchedContents.length,
          free: planCounts.free || 0,
          basic: planCounts.basic || 0,
          premium: planCounts.premium || 0
        });
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  /* ================= HELPERS ================= */

  const getPlanStyle = (plan) => {
    const styles = {
      Free: {
        bg: "from-emerald-50 to-green-50",
        text: "text-emerald-700",
        badge: "bg-emerald-500",
        gradient: "from-emerald-400 to-green-500",
        icon: <FiUnlock className="w-3 h-3" />
      },
      Basic: {
        bg: "from-blue-50 to-cyan-50",
        text: "text-blue-700",
        badge: "bg-blue-500",
        gradient: "from-blue-400 to-cyan-500",
        icon: <FiLock className="w-3 h-3" />
      },
      Premium: {
        bg: "from-purple-50 to-pink-50",
        text: "text-purple-700",
        badge: "bg-purple-500",
        gradient: "from-purple-400 to-pink-500",
        icon: <FiLock className="w-3 h-3" />
      }
    };
    return styles[plan] || styles.Free;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Technology: <BsLightningCharge />,
      News: <BsNewspaper />,
      Tutorial: <FiBookOpen />,
      Trending: <FiTrendingUp />
    };
    return icons[category] || <FiBookOpen />;
  };

  /* ❌ REMOVE MAGAZINES */
  const nonMagazineContents = contents.filter(
    (item) => item.type !== "Magazine"
  );

  /* FILTER BY PLAN */
  const filteredContents =
    filter === "all"
      ? nonMagazineContents
      : nonMagazineContents.filter((item) => item.plan === filter);

  /* ================= UI ================= */

  const FilterButton = ({ label, value, count }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setFilter(value)}
      className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        filter === value
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-blue-200"
      }`}
    >
      <span className="flex items-center gap-2">
        {label}
        {count !== undefined && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            filter === value 
              ? "bg-white/20 text-white" 
              : "bg-gray-100 text-gray-600"
          }`}>
            {count}
          </span>
        )}
      </span>
      {filter === value && (
        <motion.div
          layoutId="activeFilter"
          className="absolute inset-0 rounded-xl"
          transition={{ type: "spring", bounce: 0.2 }}
        />
      )}
    </motion.button>
  );

  const ContentCard = ({ item, index }) => {
    const planStyle = getPlanStyle(item.plan);
    const isHovered = hoveredId === item.id;
    
    return (
      <motion.article
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -8 }}
        onHoverStart={() => setHoveredId(item.id)}
        onHoverEnd={() => setHoveredId(null)}
        className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
        onClick={() =>  navigate("/subscribe")}
      >
        {/* Premium Overlay */}
        {item.plan !== "Free" && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 flex items-end justify-center pb-8"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center"
            >
              <FiLock className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-semibold mb-3">Premium Content</p>
              <button className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 rounded-full font-semibold text-sm hover:shadow-lg transition-shadow">
                Unlock Now
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Image Container */}
        <div className="relative h-52 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={item.imageUrl || "/default.jpg"}
            alt={item.name}
            className="w-full h-full object-fill  "
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-lg flex items-center gap-1">
              {getCategoryIcon(item.category)}
              {item.category || "General"}
            </span>
          </div>

          {/* Plan Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg bg-gradient-to-r ${planStyle.gradient}`}>
            <span className="flex items-center gap-1">
              {planStyle.icon}
              {item.plan}
            </span>
          </div>

          {/* Date Badge */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {item.description || "No description available"}
          </p>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  #{tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Author/Source */}
          {item.author && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs">
                {item.author.charAt(0)}
              </div>
              <span className="text-xs text-gray-500">{item.author}</span>
            </div>
          )}

          {/* Action Button */}
<motion.button
  type="button"
  onClick={(e) => {
    e.stopPropagation();   // prevents double trigger
    navigate("/subscribe");
  }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
>
  Read Now
</motion.button>


        </div>
      </motion.article>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      
      {/* Hero Section */}
     

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Magazine Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <Magazine />
        </motion.div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            <FilterButton label="All" value="all"  />
            <FilterButton label="Free" value="Free"  />
            <FilterButton label="Basic" value="Basic"  />
            <FilterButton label="Premium" value="Premium" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition ${
                viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition ${
                viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid xl:grid-cols-4 gap-12">
          
          {/* Main Content */}
          <div className="xl:col-span-3">
            
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">Latest Updates</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  {filteredContents.length} {filteredContents.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              
            
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-3xl" />
                    <div className="p-6 bg-white rounded-b-3xl space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-8 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`${
                  viewMode === "grid" 
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
                    : "space-y-6"
                }`}
              >
                <AnimatePresence>
                  {filteredContents.map((item, i) => (
                    <ContentCard key={item.id} item={item} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && filteredContents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No content found</h3>
                <p className="text-gray-500">Try adjusting your filters or check back later</p>
              </motion.div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="hidden xl:block space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* Updates Stripe */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden"
              >
              
                <div className="p-2">
                  <RightUpdatesStripe />
                </div>
              </motion.div>

              {/* Daily Tip Card */}
              {/* <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  
                  <h4 className="font-bold text-xl mb-2">Daily Pro Tip</h4>
                  <p className="text-sm text-white/90 mb-4">
                    Consistency is key. Dedicate just 30 minutes daily to learning, 
                    and you'll master any technology in 90 days.
                  </p>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-semibold hover:bg-white/30 transition">
                    Get Daily Tips
                  </button>
                </div>
              </motion.div> */}

              {/* Upgrade Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-3xl bg-black p-8 text-white shadow-xl"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />
                <div className="flex items-center gap-3 mb-4">
                  <IoMdRibbon className="w-8 h-8 text-yellow-400" />
                  <h4 className="font-bold text-xl">Unlock Premium</h4>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  Get access to exclusive content, expert guides, and premium resources
                </p>
                <ul className="space-y-3 mb-6 text-sm">
                  {[
                    "Premium Articles",
                    "Expert Video Tutorials",
                    "Downloadable Resources",
                    "Community Access"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <FiStar className="w-4 h-4 text-yellow-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/subscribe")}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:shadow-lg hover:shadow-yellow-500/25 transition-all"
                >
                  Upgrade Now
                </motion.button>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-gray-200">
        
          <div className="text-center text-sm text-gray-400 py-6">
            © {new Date().getFullYear()} Tech Manthana. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogPage;