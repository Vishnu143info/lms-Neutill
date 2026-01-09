import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiEye ,FiArrowLeft} from "react-icons/fi";
import { FaBullhorn} from "react-icons/fa";


const AllUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const q = query(
          collection(db, "posters"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUpdates(data);
      } catch (error) {
        console.error("Error fetching updates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full" />
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-20">
        <p className="text-gray-600">No updates available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">

          <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 group"
                          onClick={() => navigate(-1)}
                        >
                          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
                          <span>Back to Updates</span>
                        </motion.button> 
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          All Updates
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {updates.map((update) => (
            <motion.div
              key={update.id}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
            >
              {/* Image */}
              {update.fileUrl ? (
                <img
                  src={update.fileUrl}
                  alt={update.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg px-4 text-center">
                  {update.title}
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-red-600 font-semibold mb-2">
                  <FaBullhorn />
                  UPDATE
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {update.title}
                </h2>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {update.excerpt || update.content || "View update details"}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar />
                    <span>
                      {update.createdAt
                        ? new Date(update.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiEye />
                    <span>{update.views || 0}</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/tech-manthana/blog/${update.id}`, {
                      state: { poster: update },
                    })
                  }
                  className="mt-auto text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                  View Details
                  <span className="text-lg">→</span>
                </button>
              
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllUpdates;
