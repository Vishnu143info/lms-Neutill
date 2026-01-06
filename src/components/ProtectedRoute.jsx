import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, role, loading } = useAuth();

  // ⏳ Wait for Firebase
  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role not allowed
  if (!allowedRoles.includes(role)) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>Your role: <b>{role}</b></p>
      </div>
    );
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
