import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBell, 
  FiCalendar, 
  FiX, 
  FiDownload,
  FiEye,
  FiClock,
  FiImage,
  FiFileText,
  FiExternalLink
} from "react-icons/fi";
import { BsNewspaper, BsLightningCharge } from "react-icons/bs";

export default function RightUpdatesStripe() {
  const [updates, setUpdates] = useState([]);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "posters"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const snap = await getDocs(q);

        setUpdates(snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (error) {
        console.error("Error loading updates:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
  if (selectedPoster) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [selectedPoster]);


  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "Recent";
    const date = timestamp.toDate();
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl">
                <BsNewspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Latest Updates</h3>
                <p className="text-xs text-white/80 mt-0.5">Stay informed with new content</p>
              </div>
            </div>
            
            {/* Animated Bell */}
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl"
            >
              <FiBell className="w-4 h-4 text-white" />
            </motion.div>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Updates List - Scrollable */}
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {loading ? (
            // Loading Skeletons
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : updates.length > 0 ? (
            <div className="p-3 space-y-2">
              {updates.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onHoverStart={() => setHoveredId(item.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onClick={() => setSelectedPoster(item)}
                  className="group relative flex gap-3 items-start p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border border-transparent hover:border-indigo-100"
                >
                  {/* New Badge for latest item */}
                  {index === 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg z-10"
                    >
                      NEW
                    </motion.div>
                  )}

                  {/* Image with Hover Effect */}
                  <div className="relative overflow-hidden rounded-lg shadow-md">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      src={item.fileUrl || "/default-thumbnail.jpg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FiEye className="text-white w-4 h-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {item.title || "Untitled Update"}
                    </h4>
                    
                    {item.content && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {item.content.substring(0, 50)}
                        {item.content.length > 50 && "..."}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1.5">
                      <FiCalendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {formatDate(item.createdAt)}
                      </span>
                      
                      {item.fileUrl && (
                        <>
                          <span className="text-gray-300">•</span>
                          <FiImage className="w-3 h-3 text-gray-400" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow Indicator on Hover */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: hoveredId === item.id ? 1 : 0,
                      x: hoveredId === item.id ? 0 : -10
                    }}
                    className="text-indigo-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="p-8 text-center">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500 text-sm">No updates yet</p>
              <p className="text-xs text-gray-400 mt-1">Check back later for new content</p>
            </div>
          )}
        </div>

        {/* View All Link */}
       
      </motion.div>

      {/* Enhanced Popup Modal with Scroll */}
      <AnimatePresence>
        {selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPoster(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedPoster(null)}
                className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </motion.button>

              {/* Image Section */}
              <div className="relative h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <motion.img
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={selectedPoster.fileUrl}
                  alt={selectedPoster.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
                
              
              </div>

              {/* Scrollable Content Section */}
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="p-6 space-y-4">
                  {/* Title and Date */}
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex-1">
                      {selectedPoster.title || "Untitled"}
                    </h2>
                    
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                      #{selectedPoster.id?.slice(-4) || "Update"}
                    </span>
                  </div>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FiCalendar className="w-4 h-4" />
                      <span>
                        {selectedPoster.createdAt?.toDate?.().toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) || "Date not available"}
                      </span>
                    </div>
                    
                    {selectedPoster.createdAt?.toDate && (
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span>
                          {selectedPoster.createdAt.toDate().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Content - This is scrollable if long */}
                  {selectedPoster.content && (
                    <div className="prose prose-indigo max-w-none">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {selectedPoster.content}
                      </p>
                    </div>
                  )}

                  {/* Additional Info Placeholder */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                      <BsLightningCharge className="w-4 h-4" />
                      About this update
                    </h4>
                    <p className="text-sm text-indigo-700">
                      This content was shared to keep you informed about the latest developments. 
                      Click the download button to save or view the full file.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPoster(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-100 transition-all"
                >
                  Close
                </motion.button>
                
                {/* <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(selectedPoster.fileUrl, "_blank")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Open Full Size
                </motion.button> */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}