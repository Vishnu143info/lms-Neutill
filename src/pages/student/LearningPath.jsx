import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Lock, BookOpen, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/* ================= PLAN PRIORITY ================= */
const PLAN_LEVEL = {
  Free: 0,
  Premium: 1,
  Platinum: 2,
};

const TABS = ["All", "Free", "Premium", "Platinum"];

const LearningPath = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [activePlan, setActivePlan] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  const userPlan = user?.subscription?.planName || "Free";

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const contentsRef = collection(db, "contents");
        const q = query(contentsRef, orderBy("date", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMaterials(data);
        setFilteredMaterials(data);
      } catch (err) {
        console.error("Error loading learning path:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, []);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    if (activePlan === "All") {
      setFilteredMaterials(materials);
    } else {
      setFilteredMaterials(
        materials.filter(
          (item) =>
            (item.plan || "Free").toLowerCase() ===
            activePlan.toLowerCase()
        )
      );
    }
  }, [activePlan, materials]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold">
        Loading your learning path...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ================= TABS ================= */}
      <div className="flex gap-3 mb-8">
        {TABS.map((tab) => {
          const isActive = activePlan === tab;

          return (
            <button
              key={tab}
              onClick={() => setActivePlan(tab)}
              className={`px-6 py-2 rounded-xl font-semibold transition
                ${
                  isActive
                    ? "bg-gray-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab === "All" ? "All Plans" : tab}
            </button>
          );
        })}
      </div>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredMaterials.map((item) => {
          const contentPlan = item.plan || "Free";

          const isUnlocked =
            contentPlan === "Free" ||
            PLAN_LEVEL[userPlan] >= PLAN_LEVEL[contentPlan];

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div
                className={`h-32 flex items-center justify-center text-white
                  ${
                    contentPlan === "Free"
                      ? "bg-gradient-to-r from-gray-600 to-gray-500"
                      : contentPlan === "Premium"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
              >
                <BookOpen className="w-10 h-10" />
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-gray-800 truncate">
                  {item.name}
                </h3>

                <div className="flex justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span>{item.type}</span>
                </div>

                {/* Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gray-100">
                    {contentPlan} Plan
                  </span>

                  {!isUnlocked && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Lock className="w-4 h-4" />
                      Locked
                    </span>
                  )}
                </div>

                {/* Action */}
                {isUnlocked ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
                  >
                    View Content
                  </a>
                ) : (
                  <button
                    onClick={() => navigate("/subscribe")}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
                  >
                    <Lock className="w-5 h-5" />
                    Unlock Content
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center text-gray-500 mt-16 font-semibold">
          No content available for this plan
        </div>
      )}
    </div>
  );
};

export default LearningPath;
