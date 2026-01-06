import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion"; // npm install framer-motion
import { CheckCircle2 } from "lucide-react"; // npm install lucide-react

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const auth = getAuth();
    auth.currentUser?.reload();

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          navigate("/dashboard/consumer", { replace: true });
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        {/* Animated Check Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </motion.div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Received!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. Your account has been updated successfully.
        </p>

        {/* Visual Countdown Loader */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="text-sm font-medium text-gray-400 mb-2">
            Redirecting to dashboard
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full bg-green-500"
            />
          </div>
          <span className="mt-2 text-xs text-gray-400 font-mono">
            {countdown}s remaining
          </span>
        </div>

        {/* Manual Button (UX Best Practice) */}
        <button 
          onClick={() => navigate("/dashboard/consumer")}
          className="mt-8 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          Click here if not redirected automatically
        </button>
      </motion.div>
    </div>
  );
}