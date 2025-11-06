import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Alfa.css";
import { FaExchangeAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ALFASection = () => {
  const [isSwapped, setIsSwapped] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePromptChange = (e) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setPrompt(e.target.value);
  };

  const handleSend = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    if (prompt.trim() === "") return;

    console.log("User prompt:", prompt);
    setPrompt("");
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate("/login");
  };

  return (
    <section className="alfa-container">
      {/* 🔁 Swap Toggle Button */}
      <div className="toggle-area">
        <motion.button
          whileHover={{ scale: 1.15, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          className="swap-btn"
          onClick={() => setIsSwapped(!isSwapped)}
        >
          <FaExchangeAlt />
        </motion.button>
      </div>

      {/* 🌐 Two Panel Layout */}
      <motion.div
        className={`alfa-layout ${isSwapped ? "swapped" : ""}`}
        layout
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* 🧩 Left Panel */}
        <motion.div className="workspace-panel" layout>
          <h2>Workspace</h2>
          <textarea
            placeholder="Edit your prompt or notes here..."
            className="workspace-input"
            onChange={handlePromptChange}
            value={prompt}
          />
        </motion.div>

        {/* 💬 Right Panel */}
        <motion.div className="response-panel" layout>
          <h2>AI Response</h2>
          <div className="response-box">
            <p>
              Hello 👋, I’m your AI assistant. Ask me anything or share your
              ideas below!
            </p>
          </div>
          <div className="prompt-box">
            <input
              type="text"
              placeholder="Type your prompt here..."
              className="prompt-input"
              value={prompt}
              onChange={handlePromptChange}
            />
            <button className="send-btn" onClick={handleSend}>
              Send
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* 💫 Login Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            className="login-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="login-modal"
              initial={{ scale: 0.8, y: -50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              <h3>🔒 Login Required</h3>
              <p>Please log in to access ALFA’s AI features.</p>
              <div className="modal-buttons">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="login-btn"
                  onClick={handleLoginRedirect}
                >
                  Login Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="cancel-btn"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  Maybe Later
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ALFASection;
