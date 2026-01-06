import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import { FiEye, FiCalendar, FiChevronRight, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const BlogPage = () => {
  const [posters, setPosters] = useState([]);
  const [loadingPosters, setLoadingPosters] = useState(true);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const q = query(collection(db, "posters"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setPosters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching posters:", error);
      } finally {
        setLoadingPosters(false);
      }
    };

    fetchPosters();
  }, []);

  const openPost = async (post) => {
    setActivePost(post);

    // 🔥 Increment views
    try {
      await updateDoc(doc(db, "posters", post.id), {
        views: increment(1),
      });
    } catch (err) {
      console.error("View update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-16">
          Tech Manthana Blog
        </h1>

        {loadingPosters ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posters.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={post.fileUrl}
                  alt={post.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FiCalendar /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiEye /> {post.views || 0}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* ✅ SAME PAGE READ MORE */}
                  <button
                    onClick={() => openPost(post)}
                    className="inline-flex items-center gap-1 text-blue-600 font-semibold"
                  >
                    Read More <FiChevronRight />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl relative"
            >
              {/* Close */}
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
              >
                <FiX size={22} />
              </button>

              <img
                src={activePost.fileUrl}
                alt={activePost.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-8">
                <h2 className="text-3xl font-bold mb-3">
                  {activePost.title}
                </h2>

                <p className="text-gray-500 mb-6">
                  {activePost.date} • {activePost.views || 0} views
                </p>

                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {activePost.content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPage;
