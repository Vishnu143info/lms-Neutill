import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

/* ===== PLAN HELPERS ===== */
const normalizePlan = (rawPlan) => {
  if (!rawPlan) return "Starter";
  const name = rawPlan.toLowerCase();
  if (name.includes("starter")) return "Starter";
  if (name.includes("premium")) return "Premium";
  if (name.includes("pro")) return "Pro Learner";
  if (name.includes("elite") || name.includes("platinum")) return "Elite Scholar";
  return "Starter";
};

const PLAN_ACCESS = {
  Starter: { modules: false, schedule: false, resume: false, askTutor: false },
  Premium: { modules: true, schedule: true, resume: true, askTutor: false },
  "Pro Learner": { modules: true, schedule: true, resume: true, askTutor: false },
  "Elite Scholar": { modules: true, schedule: true, resume: true, askTutor: true },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ADD THIS
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const adminSnap = await getDoc(doc(db, "admin", firebaseUser.uid));
      if (adminSnap.exists()) {
        setUser({
          ...firebaseUser,
          planName: "Admin",
          plan: "Admin",
          planAccess: {
            modules: true,
            schedule: true,
            resume: true,
            askTutor: true,
          },
          subscription: null,
        });
        setRole("admin");
        setLoading(false);
        return;
      }

      const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
    const userData = userSnap.exists() ? userSnap.data() : {};

// ✅ Only unlock if subscription is ACTIVE
const resolvedPlan =
  userData.subscription?.status === "active"
    ? normalizePlan(userData.subscription.planName)
    : "Starter";

const planAccess = PLAN_ACCESS[resolvedPlan];

setUser({
  ...firebaseUser,
  name: userData.name || "Student",
  planName: resolvedPlan,
  plan: resolvedPlan,
  planAccess,
  subscription: userData.subscription || {
    planName: "Starter",
    status: "inactive",
  },
});


      setRole(userData.role || "consumer");
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
