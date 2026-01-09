import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiEye, 
  FiDownload, 
  FiShare2,
  FiCopy,
  FiCheck
} from "react-icons/fi";
import { FaBullhorn, FaWhatsapp, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

const PosterDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // If poster data was passed via navigation state
  const posterFromState = location.state?.poster;

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        // If we have poster data from state, use it and still update view count
        if (posterFromState) {
          setPoster(posterFromState);
          // Update view count in background
          await updateViewCount(posterFromState.id);
        } else {
          // Fetch from Firestore if not in state
          const posterRef = doc(db, "posters", id);
          const posterSnap = await getDoc(posterRef);
          
          if (posterSnap.exists()) {
            const posterData = {
              id: posterSnap.id,
              ...posterSnap.data()
            };
            setPoster(posterData);
            // Update view count
            await updateViewCount(id);
          } else {
            setError("Poster not found");
          }
        }
      } catch (error) {
        console.error("Error fetching poster:", error);
        setError("Failed to load poster");
      } finally {
        setLoading(false);
      }
    };

    const updateViewCount = async (posterId) => {
      try {
        const posterRef = doc(db, "posters", posterId);
        await updateDoc(posterRef, {
          views: increment(1),
          lastViewed: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error updating view count:", error);
      }
    };

    fetchPoster();
  }, [id, posterFromState]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = poster?.title || "Check out this update!";
    const text = poster?.excerpt || "Interesting update from Tech Manthana";

    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title}: ${url}`)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}: ${text}`)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        break;
    }
  };

  const handleDownload = () => {
    if (poster?.fileUrl) {
      const link = document.createElement('a');
      link.href = poster.fileUrl;
      link.download = `${poster.title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading poster details...</p>
        </div>
      </div>
    );
  }

  if (error || !poster) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Poster Not Found</h2>
          <p className="text-gray-600 mb-8">{error || "The poster you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 group"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Updates</span>
        </motion.button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Poster Image/Header */}
          <div className="relative">
            {poster.fileUrl ? (
              <div className="h-96 md:h-[500px] overflow-hidden">
                <img
                  src={poster.fileUrl}
                  alt={poster.title}
                  className="w-full h-full object-full"
                />
              </div>
            ) : (
              <div className="h-96 md:h-[500px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white text-3xl font-bold text-center px-4">
                  {poster.title}
                </span>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-semibold text-red-600 flex items-center gap-2">
                <FaBullhorn />
                UPDATE
              </span>
              {poster.category && (
                <span className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium">
                  {poster.category}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title and Meta */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {poster.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                {/* <div className="flex items-center gap-2">
                  <FiCalendar />
                  <span>{poster.createdAt ? new Date(poster.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "Recent"}</span>
                </div> */}
                
                <div className="flex items-center gap-2">
                  <FiEye />
                  <span>{(poster.views || 0) + 1} views</span>
                </div>
                
                {poster.author && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Posted by {poster.author}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none mb-8">
              {poster.content ? (
                <div className="text-gray-700 leading-relaxed">
                  {poster.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">
                  No detailed content available for this update.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-8">
              
              <div className="flex flex-wrap gap-4">
                {/* Copy Link Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium"
                >
                  {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
                  {copied ? "Copied!" : "Copy Link"}
                </motion.button>

                {/* Download Button (if file exists) */}
                {poster.fileUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    <FiDownload />
                    Download Poster
                  </motion.button>
                )}

                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigator.share ? navigator.share({
                    title: poster.title,
                    text: poster.excerpt,
                    url: window.location.href
                  }) : handleCopyLink()}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg font-medium"
                >
                  <FiShare2 />
                  Share
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">More Updates</h3>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-600 mb-4">
              Explore more updates from Tech Manthana:
            </p>
          <button
  onClick={() => navigate("/tech-manthana/updates")}
  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
>
  View all updates
  <span className="text-lg">→</span>
</button>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PosterDetailsPage;