import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Mail, 
  ArrowLeft, 
  Users, 
  User, 
  Send, 
  Edit3, 
  Eye,
  EyeOff,
  Palette,
  Bold,
  Italic,
  List,
  Type,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SendMail() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Normalize single + bulk users
  const users =
    location.state?.users ||
    (location.state?.user ? [location.state.user] : []);

  const [subject, setSubject] = useState("Message from Administration");
  const [message, setMessage] = useState(
    users.length === 1
      ? `Hello ${users[0].name || "there"},\n\nWe have an update regarding your account.\n\nRegards,\nAdmin`
      : `Hello,\n\nWe have an important update regarding your account.\n\nRegards,\nAdmin`
  );
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);

  // Formatting options
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    fontSize: "normal"
  });

  // Guard
  if (!users || users.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6"
      >
        <motion.div 
          initial={{ y: 20, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border border-gray-200"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Recipients Selected</h2>
          <p className="text-gray-600 mb-8">Please go back and select users to send email to.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            ← Go Back
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const emails = users.map((u) => u.email).join(",");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      emails
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    // Animate before opening
    setTimeout(() => {
      window.open(gmailUrl, "_blank");
    }, 1500);
    
    setTimeout(() => navigate(-1), 3000);
  };

  // Apply formatting
  const applyFormatting = (type) => {
    if (type === 'bold') {
      setFormatting({...formatting, bold: !formatting.bold});
      // In a real app, you would use a rich text editor
    } else if (type === 'italic') {
      setFormatting({...formatting, italic: !formatting.italic});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 opacity-90"></div>
          <div className="relative p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  {users.length === 1 ? (
                    <User className="w-7 h-7" />
                  ) : (
                    <Users className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Compose Email
                  </h1>
                  <p className="text-white/80 mt-1">
                    {users.length === 1 
                      ? `To: ${users[0].name}`
                      : `To: ${users.length} recipients`
                    }
                  </p>
                </div>
              </div>
              
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl"
              >
                <span className="font-bold text-lg">{users.length}</span>
                <span className="ml-2">recipient{users.length !== 1 ? 's' : ''}</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {isSent && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-8 mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-bold">Email ready to send!</p>
                  <p className="text-sm opacity-90">Opening Gmail in a new window...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipients Preview */}
        <div className="p-8 pb-0">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                Recipients
              </h3>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                {users.length} selected
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {users.slice(0, 5).map((u, index) => (
                <motion.div 
                  key={u.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-red-700">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </motion.div>
              ))}
              
              {users.length > 5 && (
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl">
                  <span className="text-gray-700 font-medium">
                    +{users.length - 5} more
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-gray-50/50"
              placeholder="What's this email about?"
            />
          </div>

          {/* Message Editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Message
              </label>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormatting(!showFormatting)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Formatting options"
                >
                  <Palette className="w-4 h-4 text-gray-600" />
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  {isPreview ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Preview
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Formatting Bar */}
            {showFormatting && !isPreview && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-gray-100 rounded-xl mb-3"
              >
                <button
                  type="button"
                  onClick={() => applyFormatting('bold')}
                  className={`p-2 rounded-lg ${formatting.bold ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('italic')}
                  className={`p-2 rounded-lg ${formatting.italic ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="h-6 w-px bg-gray-400"></div>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-gray-200"
                >
                  <List className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Message Input / Preview */}
            <div className={`rounded-xl border-2 ${isPreview ? 'border-green-200' : 'border-gray-200'} overflow-hidden transition-all duration-300`}>
              {isPreview ? (
                <div className="p-4 bg-gray-50 min-h-[200px] whitespace-pre-line">
                  {message || <span className="text-gray-400 italic">No message content...</span>}
                </div>
              ) : (
                <textarea
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 focus:outline-none bg-gray-50/50 resize-none min-h-[200px]"
                  placeholder="Write your message here..."
                />
              )}
            </div>
            
            <div className="mt-2 flex justify-end">
              <span className="text-sm text-gray-500">
                {message.length} characters
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-medium group transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Cancel
            </button>
            
            <div className="flex items-center gap-4">
             
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSent}
                className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {isSent ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Opening...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Open in Gmail
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 text-center">
            <p className="text-sm text-gray-500">
              This will open Gmail with pre-filled recipients, subject, and message
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}