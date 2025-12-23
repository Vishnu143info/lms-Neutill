import React, { useState, useEffect, useRef, useMemo } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  MessageSquare,
  Loader2,
  GraduationCap,
  Send,
  Check,
  CheckCheck,
  Search,
  Clock,
  Star,
  Bell,
  Paperclip,
  Mic,
  MoreVertical,
} from "lucide-react";

/* ---------------- Message Bubble ---------------- */
const MessageBubble = ({ msg, isMe, isLastOfUser }) => {
  const [timeString, setTimeString] = useState("");
  const [showFullTime, setShowFullTime] = useState(false);

  useEffect(() => {
    if (msg.timestamp) {
      const date = msg.timestamp.toDate();
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 60) {
        setTimeString(`${diffMins}m ago`);
      } else if (date.toDateString() === now.toDateString()) {
        setTimeString(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } else {
        setTimeString(date.toLocaleDateString([], { month: "short", day: "numeric" }));
      }
    }
  }, [msg.timestamp]);

  const getStatusIcon = () => {
    if (!isMe) return null;
    if (msg.read) return <CheckCheck size={12} className="text-blue-400 ml-1" />;
    if (msg.delivered) return <CheckCheck size={12} className="text-gray-400 ml-1" />;
    return <Check size={12} className="text-gray-400 ml-1" />;
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2 px-4`}>
      <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
        <div
          className={`relative group rounded-2xl px-4 py-3 transition-all duration-200 ${
            isMe
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none shadow-sm"
              : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm"
          } ${!isLastOfUser ? (isMe ? "mb-1" : "mb-1") : "mb-3"}`}
          onClick={() => setShowFullTime(!showFullTime)}
        >
          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
          <div className="flex items-center justify-end mt-2 gap-2">
            <span className="text-xs opacity-80 cursor-pointer">
              {showFullTime 
                ? msg.timestamp?.toDate()?.toLocaleTimeString([], { 
                    hour: "2-digit", minute: "2-digit", second: "2-digit" 
                  })
                : timeString
              }
            </span>
            {getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Chat Preview Card ---------------- */
const ChatCard = ({ chat, isActive, unreadCount, onClick }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        isActive
          ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-500"
          : "hover:bg-gray-50 border-transparent hover:border-l-indigo-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-semibold text-sm">
              {chat.studentName?.charAt(0)?.toUpperCase() || "S"}
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs animate-pulse">
                {unreadCount}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">
                {chat.studentName || "Student"}
              </h3>
              {chat.isImportant && (
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">Student</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatTime(chat.lastUpdated)}
          </span>
          <ChevronRight 
            size={16} 
            className={`text-gray-300 transition-transform ${
              isActive ? "rotate-90" : ""
            }`} 
          />
        </div>
      </div>
      <p className="text-sm text-gray-600 truncate line-clamp-2 pl-13">
        {chat.lastMessage || "No messages yet"}
      </p>
    </div>
  );
};

/* ---------------- ChevronRight Icon Component ---------------- */
const ChevronRight = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

/* ---------------- Main Component ---------------- */
export default function StudentQueries() {
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [messageStats, setMessageStats] = useState({ total: 0, unread: 0 });
  const [filter, setFilter] = useState("all");
  const scrollRef = useRef(null);

  /* 🔐 Auth Listener */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsub();
  }, []);

  /* 📥 Fetch Tutor Chats */
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("tutorId", "==", currentUser.uid),
      orderBy("lastUpdated", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const chatsData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setChats(chatsData);
        setLoading(false);
        
        // Calculate stats
        let unreadTotal = 0;
        chatsData.forEach(async (chat) => {
          const messagesRef = collection(db, "chats", chat.id, "messages");
          const unreadQuery = query(
            messagesRef, 
            where("senderId", "==", chat.studentId),
            where("read", "==", false)
          );
          
          const unsubUnread = onSnapshot(unreadQuery, (unreadSnap) => {
            const count = unreadSnap.size;
            setUnreadCounts(prev => ({...prev, [chat.id]: count}));
            unreadTotal += count;
            
            if (chatsData.indexOf(chat) === chatsData.length - 1) {
              setMessageStats({
                total: chatsData.length,
                unread: unreadTotal
              });
            }
          });
          
          return () => unsubUnread();
        });
      },
      (error) => {
        console.error("Error fetching chats:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [currentUser]);

  /* 💬 Fetch Messages */
  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, "chats", activeChat.id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const newMessages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(newMessages);

      // Mark student messages as read
      const studentMessages = snap.docs
        .filter(doc => doc.data().senderId === activeChat.studentId && !doc.data().read)
        .map(doc => doc.id);

      for (const msgId of studentMessages) {
        await updateDoc(doc(db, "chats", activeChat.id, "messages", msgId), {
          read: true,
          readAt: serverTimestamp()
        });
      }

      // Update unread count for this chat
      setUnreadCounts(prev => ({...prev, [activeChat.id]: 0}));

      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "end" 
        });
      }, 100);
    });

    return () => unsub();
  }, [activeChat]);

  /* 📤 Send Reply */
  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat || !currentUser) return;

    try {
      await addDoc(collection(db, "chats", activeChat.id, "messages"), {
        text: replyText,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        senderRole: "tutor",
        timestamp: serverTimestamp(),
        read: false,
        delivered: false,
      });

      await updateDoc(doc(db, "chats", activeChat.id), {
        lastMessage: replyText,
        lastUpdated: serverTimestamp(),
        lastSenderId: currentUser.uid,
      });

      setReplyText("");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  /* 🔍 Filter and Search Chats */
  const filteredChats = useMemo(() => {
    let filtered = chats.filter(chat =>
      chat.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filter === "unread") {
      filtered = filtered.filter(chat => unreadCounts[chat.id] > 0);
    } else if (filter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(chat => {
        const chatDate = chat.lastUpdated?.toDate();
        return chatDate && chatDate >= today;
      });
    }

    return filtered;
  }, [chats, searchQuery, filter, unreadCounts]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading student queries...</p>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-96 bg-white/90 backdrop-blur-sm border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Student Queries</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {messageStats.total} chats
                  </span>
                  {messageStats.unread > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      {messageStats.unread} unread
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search students or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
              />
            </div>
            <div className="flex gap-2">
              {["all", "unread", "today"].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    filter === filterOption
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageSquare className="text-gray-300 mb-4" size={48} />
              <h3 className="text-gray-400 font-medium mb-2">
                {searchQuery ? "No matching chats" : "No student queries"}
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                {searchQuery 
                  ? "Try searching with different keywords"
                  : "Students will appear here when they send you messages"}
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <ChatCard
                key={chat.id}
                chat={chat}
                isActive={activeChat?.id === chat.id}
                unreadCount={unreadCounts[chat.id] || 0}
                onClick={() => setActiveChat(chat)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white/90">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-semibold text-lg">
                      {activeChat.studentName?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-800">
                        {activeChat.studentName}
                      </h2>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Student
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      Last active 5m ago
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Star size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                </div> */}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50/50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <MessageSquare className="mx-auto mb-4 text-gray-300" size={64} />
                    <h3 className="text-gray-400 font-medium text-lg mb-2">
                      Start the conversation
                    </h3>
                    <p className="text-gray-400">
                      No messages yet. Be the first to reply to {activeChat.studentName}'s query.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  {messages.map((msg, index) => {
                    const isLastOfUser = 
                      index === messages.length - 1 || 
                      messages[index + 1].senderId !== msg.senderId;
                    
                    return (
                      <MessageBubble
                        key={msg.id}
                        msg={msg}
                        isMe={msg.senderId === currentUser.uid}
                        isLastOfUser={isLastOfUser}
                      />
                    );
                  })}
                  <div ref={scrollRef} />
                </div>
              )}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={sendReply} className="space-y-3">
                <div className="flex gap-2 items-center">
                  {/* <button 
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Paperclip size={20} className="text-gray-500" />
                  </button> */}
                  <div className="flex-1 relative">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendReply(e);
                        }
                      }}
                      rows={1}
                      className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent resize-none text-sm"
                      placeholder="Type your reply..."
                    />
                    {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <button 
                        type="button"
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Mic size={18} className="text-gray-500" />
                      </button>
                    </div> */}
                  </div>
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      replyText.trim()
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md"
                        : "bg-gray-200 cursor-not-allowed"
                    }`}
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 px-2">
                  <span>Press Enter to send • Shift+Enter for new line</span>
                  <span>{replyText.length}/1000</span>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
              <GraduationCap size={80} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-3">Welcome, Tutor!</h3>
            <p className="text-gray-400 text-center max-w-md mb-8">
              Select a student chat from the sidebar to view and reply to their queries.
              Help students learn better with your expert guidance.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>{messageStats.total} total chats</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}