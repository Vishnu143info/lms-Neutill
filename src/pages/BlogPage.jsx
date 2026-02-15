import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import RightUpdatesStripe from "./RightUpdatesStripe";

import {
  FiLock,
  FiUnlock,
  FiStar,
  FiCalendar,
  FiBookOpen
} from "react-icons/fi";

import { FaCloud, FaRobot, FaDatabase, FaServer, FaBullhorn } from "react-icons/fa";

const BlogPage = () => {

  const [contents, setContents] = useState([]);
  const [latestPosters, setLatestPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchContents = async () => {
      const q = query(collection(db, "contents"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      setContents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    const fetchPosters = async () => {
      const q = query(collection(db, "posters"), orderBy("createdAt", "desc"), limit(3));
      const snap = await getDocs(q);
      setLatestPosters(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchContents();
    fetchPosters();
  }, []);

  /* ================= HELPERS ================= */

  const getPlanStyle = (plan) => ({
    Free: "from-green-500 to-emerald-500",
    Basic: "from-blue-500 to-cyan-500",
    Premium: "from-purple-500 to-pink-500"
  }[plan] || "from-gray-500 to-gray-600");

  const getPlanIcon = (plan) =>
    plan === "Free"
      ? <FiUnlock className="mr-2" />
      : <FiLock className="mr-2" />;

  const getCategoryIcon = (type) => ({
    "Cloud Computing": <FaCloud />,
    DevOps: <FaServer />,
    "Machine Learning": <FaRobot />,
    Database: <FaDatabase />
  }[type] || <FiBookOpen />);

  const filteredContents =
    filter === "all"
      ? contents
      : contents.filter(item => item.plan === filter);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="mb-20 text-center">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TECH MANTHANA
          </h1>
          <p className="text-gray-500 mt-4 text-lg">
            Your Digital Magazine for Tech Excellence
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-3 mb-12 justify-center">
          {["all","Free","Basic","Premium"].map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                filter===p
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p === "all" ? "All Plans" : p}
            </button>
          ))}
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid xl:grid-cols-4 gap-12">

          {/* CONTENT */}
          <div className="xl:col-span-3">

            <div className="flex justify-between mb-10">
              <h2 className="text-3xl font-bold">Explore Resources</h2>
              <span className="text-sm bg-blue-50 px-4 py-2 rounded-xl">
                {filteredContents.length} Results
              </span>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_,i)=>(
                  <div key={i} className="h-52 bg-gray-200 rounded-3xl animate-pulse"/>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {filteredContents.map((item,i)=>(
                  <motion.div
                    key={item.id}
                    initial={{opacity:0,y:20}}
                    animate={{opacity:1,y:0}}
                    transition={{delay:i*0.05}}
                    whileHover={{y:-8}}
                    className="rounded-3xl shadow-xl overflow-hidden bg-white border"
                  >

                    {/* TOP */}
                    <div className={`h-40 flex flex-col justify-center items-center text-white bg-gradient-to-r ${getPlanStyle(item.plan)}`}>
                      <div className="text-4xl mb-2">{getCategoryIcon(item.type)}</div>
                      <h3 className="font-bold">{item.name}</h3>
                    </div>

                    {/* BODY */}
                    <div className="p-6 space-y-4">

                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span>{item.type}</span>
                      </div>

                      <div className={`inline-flex items-center px-4 py-1 text-white rounded-full text-sm bg-gradient-to-r ${getPlanStyle(item.plan)}`}>
                        {getPlanIcon(item.plan)} {item.plan}
                      </div>

                      {item.description &&
                        <p className="text-sm text-gray-600">{item.description}</p>
                      }

                      <button
                        onClick={()=>navigate("/subscribe")}
                        className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-cyan-600"
                      >
                        {item.plan==="Free" ? "Open Resource" : "Unlock Content"}
                      </button>

                    </div>
                  </motion.div>
                ))}

              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="hidden xl:block space-y-8">

            <div className="sticky top-24 space-y-8">

              <div className="bg-white rounded-3xl shadow-xl p-6">
                <RightUpdatesStripe/>
              </div>

              <div className="rounded-3xl p-6 text-white bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl">
                <h4 className="font-bold mb-2">Daily Tip 🚀</h4>
                <p className="text-sm opacity-90">
                  Learn consistently for 30 days and your skills will transform.
                </p>
              </div>

              <div className="rounded-3xl p-6 bg-black text-white shadow-xl">
                <h4 className="font-bold mb-2">Unlock Premium</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Access exclusive content and real projects.
                </p>
                <button
                  onClick={()=>navigate("/subscribe")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500"
                >
                  Upgrade Now
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center mt-24 text-gray-400">
          © {new Date().getFullYear()} Tech Manthana
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
