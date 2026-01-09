import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import { 
  FiLock, 
  FiUnlock, 
  FiExternalLink, 
  FiStar, 
  FiCalendar, 
  FiBookOpen, 
  FiEye,
  FiTrendingUp
} from "react-icons/fi";
import { FaCloud, FaRobot, FaDatabase, FaServer, FaBullhorn } from "react-icons/fa";

const BlogPage = () => {
  const [contents, setContents] = useState([]);
  const [latestPosters, setLatestPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosters, setLoadingPosters] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  

  /* ================= FETCH ALL CONTENT ================= */
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const q = query(collection(db, "contents"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContents(data);
      } catch (error) {
        console.error("Error fetching contents:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestPosters = async () => {
      try {
        const q = query(
          collection(db, "posters"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLatestPosters(data);
      } catch (error) {
        console.error("Error fetching posters:", error);
      } finally {
        setLoadingPosters(false);
      }
    };

    Promise.all([fetchContents(), fetchLatestPosters()]);
  }, []);

  const getPlanStyle = (plan) => {
    const styles = {
      Free: "bg-gradient-to-r from-green-500 to-emerald-500",
      Premium: "bg-gradient-to-r from-blue-500 to-cyan-500",
      Platinum: "bg-gradient-to-r from-purple-500 to-pink-500",
    };
    return styles[plan] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const getPlanIcon = (plan) => {
    return plan === "Free" ? <FiUnlock className="mr-2" /> : <FiLock className="mr-2" />;
  };

  const getCategoryIcon = (type) => {
    const icons = {
      "Cloud Computing": <FaCloud className="text-blue-500" />,
      "DevOps": <FaServer className="text-green-500" />,
      "Machine Learning": <FaRobot className="text-purple-500" />,
      "Database": <FaDatabase className="text-orange-500" />,
    };
    return icons[type] || <FiBookOpen className="text-gray-500" />;
  };

  const filteredContents = contents.filter((item) => {
    if (filter === "all") return true;
    return item.plan === filter;
  });

  const planStats = {
    Free: contents.filter((item) => item.plan === "Free").length,
    Premium: contents.filter((item) => item.plan === "Premium").length,
    Platinum: contents.filter((item) => item.plan === "Platinum").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/20 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* ================= HERO ================= */}
       <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="mb-20 relative overflow-hidden rounded-3xl shadow-2xl border border-white/10"
>
  {/* Enhanced Background with Gradient Mesh */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-purple-900/90">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15)_0%,transparent_50%)]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15)_0%,transparent_50%)]"></div>
    
    {/* Animated Grid Pattern */}
    <div 
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    />
    
    {/* Floating Particles */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-300/50 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  </div>
  
  {/* Enhanced Glow Effects */}
  <div className="absolute top-0 right-0 w-76 h-96 bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-gradient-to-tr from-purple-500/15 via-transparent to-transparent rounded-full blur-3xl"></div>
  
  {/* Shimmer Effect Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

  <div className="relative z-10 p-8 md:p-16 lg:p-20 text-white">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="max-w-3xl text-left"
    >
      {/* Premium Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-400/30 px-6 py-3 rounded-2xl mb-8 shadow-lg"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping"></div>
          <div className="relative w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
        </div>
        <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent font-bold tracking-widest text-sm md:text-base">
          ✦ DAILY UPSKILLING DOSAGE ✦
        </span>
      </motion.div>

      {/* MAIN TITLE with Gradient */}
     <h1 className="whitespace-nowrap text-[10vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4">

  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
    TECH MANTHANA
  </span>
</h1>


      {/* SUBTITLE with Icon */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-px bg-gradient-to-r from-cyan-400 to-blue-500"></div>
        <h2 className="text-2xl md:text-3xl font-bold text-white/90 tracking-wide">
          Your <span className="text-cyan-300 font-extrabold">Digital Magazine</span> for Tech Excellence
        </h2>
        <div className="w-8 h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
      </div>

  {/* Premium BULLET POINTS */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
  {[
    { text: "Personalized Learning Paths", desc: "Tailored to your career goals" },
    { text: "Interactive Workshops", desc: "Live sessions with experts" },
    { text: "Cloud Projects", desc: "Hands-on AWS, Azure & GCP labs" },
    { text: "Certification Prep", desc: "Conquer Microsoft, AWS & GCP exams" },
  ].map((item, index) => (
    <div
      key={index}
      className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-colors"
    >
      {/* Bullet */}
      <span className="mt-1 text-cyan-400 text-xl">•</span>

      <div>
        <h3 className="font-bold text-lg text-white">
          {item.text}
        </h3>
        <p className="text-sm text-gray-300 mt-1">
          {item.desc}
        </p>
      </div>
    </div>
  ))}
</div>


      {/* Enhanced CTA SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center gap-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/subscribe")}
          className="group relative overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] text-black px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-500 hover:bg-right"
        >
          <span className="relative z-10 flex items-center gap-3">
            Subscribe for Free
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </motion.button>

        {/* Added Trust Indicator */}
        <div className="flex items-center gap-3 text-white/70">
         
        
        </div>
      </motion.div>

      {/* Micro Copy */}
     
    </motion.div>
  </div>
</motion.div>
         
        {/* ================= LATEST UPDATES ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <FaBullhorn className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Latest Updates</h2>
                <p className="text-gray-500">Stay updated with our recent posters and announcements</p>
              </div>
            </div>
<Link
  to="/tech-manthana/updates"
  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
>
  View All Updates
  <span className="text-lg">→</span>
</Link>
          </div>

          {loadingPosters ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border shadow-lg p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : latestPosters.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200">
              <div className="text-6xl mb-6">📢</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No updates yet
              </h3>
              <p className="text-gray-500">Check back soon for new announcements!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {latestPosters.map((poster, i) => (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Poster Image */}
                  {poster.fileUrl ? (
                    <div className="h-48 overflow-hidden w-full">
                      <img
                        src={poster.fileUrl}
                        alt={poster.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-red-600">NEW</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                      <span className="text-white text-xl font-bold text-center px-4">
                        {poster.title}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <FiTrendingUp className="inline mr-1" />
                        Latest
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FiEye />
                        <span>{poster.views || 0} views</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                      {poster.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {poster.excerpt || "Check out our latest update"}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiCalendar />
                        <span>{poster.date || "Recent"}</span>
                      </div>
 <button
  onClick={() =>
    navigate(`/tech-manthana/blog/${poster.id}`, {
      state: { poster }, // 👈 optional but recommended
    })
  }
  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
>
  View Details
  <span className="text-lg">→</span>
</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ================= STATS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {Object.entries(planStats).map(([plan, count], index) => (
            <div
              key={plan}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white ${getPlanStyle(plan)}`}>
                    {getPlanIcon(plan)}
                    {plan}
                  </div>
                  <p className="text-3xl font-bold mt-3">{count}</p>
                  <p className="text-gray-500 text-sm">Resources Available</p>
                </div>
                <div className="text-4xl opacity-20">
                  {plan === "Free" && "🆓"}
                  {plan === "Premium" && "⭐"}
                  {plan === "Platinum" && "👑"}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ================= FILTERS ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Learning Resources
              </h2>
              <p className="text-gray-500 mt-2">
                Filter by plan to find content matching your subscription
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {contents.length} total resources
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {["all", "Free", "Premium", "Platinum"].map((plan) => (
              <motion.button
                key={plan}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(plan)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  filter === plan
                    ? `${getPlanStyle(plan)} text-white shadow-lg`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {plan === "all" ? "All Plans" : plan}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ================= CONTENT GRID ================= */}
        <div id="content-grid" className="mb-20">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border shadow-lg p-6 animate-pulse"
                >
                  <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No resources found
              </h3>
              <p className="text-gray-500 mb-8">
                Try selecting a different plan filter
              </p>
              <button
                onClick={() => setFilter("all")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Show All Resources
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContents.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div
                    className={`h-40 relative overflow-hidden ${getPlanStyle(
                      item.plan
                    )} bg-opacity-10`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="relative h-full flex flex-col items-center justify-center p-6">
                      <div className="text-4xl mb-3 opacity-80">
                        {getCategoryIcon(item.type)}
                      </div>
                      <h3 className="text-xl font-bold text-center text-gray-800">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.type)}
                        <span className="text-sm text-gray-600">{item.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white ${getPlanStyle(
                          item.plan
                        )} shadow-md`}
                      >
                        {getPlanIcon(item.plan)}
                        {item.plan} Plan
                      </div>
                      {item.plan !== "Free" && (
                        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          🔒 Locked
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/subscribe")}
                      className={`w-full py-3 rounded-xl font-semibold text-white mt-4 transition-all duration-300 ${
                        item.plan === "Free"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {item.plan === "Free" ? (
                          <>
                            <FiExternalLink />
                            Access Now
                          </>
                        ) : (
                          <>
                            <FiLock />
                            Unlock Content
                          </>
                        )}
                      </span>
                    </motion.button>

                    <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full mt-2"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ================= CTA SECTION ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900 to-black text-white rounded-3xl shadow-2xl p-12 mb-20 relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}
          />
          
          <div className="relative z-10 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Unlock Premium Content?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Upgrade your plan to access exclusive tutorials, real-world projects,
              and expert guidance that will accelerate your career growth.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/subscribe")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black px-10 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-cyan-500/25"
            >
              <span className="flex items-center justify-center gap-3">
                <FiStar />
                Upgrade Your Plan Today
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* ================= FOOTER ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center py-8 border-t border-gray-200"
        >
          {/* <div className="flex justify-center gap-8 mb-6">
            {["Twitter", "LinkedIn", "GitHub", "Discord", "YouTube"].map(
              (social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                  {social}
                </a>
              )
            )}
          </div> */}
          <p className="text-gray-500">
            © {new Date().getFullYear()} Tech Manthana · Neutill Services Pvt Ltd
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Empowering engineers with world-class learning resources
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;