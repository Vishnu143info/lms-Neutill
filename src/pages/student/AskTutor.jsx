import React, { useState, useEffect, useRef, useMemo } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  where,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Send, Loader2, GraduationCap, Check, CheckCheck, Search, Bell, ChevronRight } from "lucide-react";

/* ---------------- Message Bubble ---------------- */
const MessageBubble = ({ text, isMe, timestamp, status, isLastOfUser }) => {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    if (timestamp) {
      const date = timestamp.toDate();
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
  }, [timestamp]);

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2 px-4`}>
      <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
        <div
          className={`relative group rounded-2xl px-4 py-3 transition-all duration-200 ${
            isMe
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none shadow-sm"
              : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm"
          } ${!isLastOfUser ? "mb-1" : "mb-3"}`}
        >
          <p className="text-sm whitespace-pre-wrap">{text}</p>
          <div className="flex items-center justify-end mt-2 gap-2">
            <span className="text-xs opacity-80">
              {timeString}
            </span>
            {isMe && (
              <span className="text-xs">
                {status === "sent" && <Check size={12} className="text-gray-400" />}
                {status === "delivered" && <CheckCheck size={12} className="text-gray-400" />}
                {status === "read" && <CheckCheck size={12} className="text-blue-400" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Tutor Card ---------------- */
const TutorCard = ({ tutor, isActive, unreadCount, onClick, lastMessage }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 60) return `${diffMins}m ago`;
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch (error) {
      return "";
    }
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold">
              {tutor.displayName?.charAt(0) || "T"}
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs animate-pulse">
                {unreadCount}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {tutor.displayName}
            </h3>
            <p className="text-xs text-gray-500">Tutor</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {lastMessage?.timestamp && (
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatTime(lastMessage.timestamp)}
            </span>
          )}
          <ChevronRight 
            size={16} 
            className={`text-gray-300 transition-transform ${
              isActive ? "rotate-90" : ""
            }`} 
          />
        </div>
      </div>
      {lastMessage?.text && (
        <p className="text-sm text-gray-600 truncate line-clamp-2 pl-13">
          {lastMessage.text}
        </p>
      )}
    </div>
  );
};

export default function AskTutor() {
  const [user, setUser] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [activeTutor, setActiveTutor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [messageStats, setMessageStats] = useState({ total: 0, unread: 0 });
  const [filter, setFilter] = useState("all");
  const bottomRef = useRef(null);

  /* 🔐 Auth */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  /* 👨‍🏫 Tutors */
  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "tutor"),
      where("approved", "==", true)
    );

    const unsub = onSnapshot(q, (snap) => {
      const tutorList = snap.docs.map((d) => ({
        id: d.id,
        displayName: d.data().profile?.name || "Tutor",
        subjects: d.data().profile?.subjects || [],
        rating: d.data().profile?.rating || 0,
      }));
      setTutors(tutorList);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* 📊 Fetch Unread Counts and Last Messages */
  useEffect(() => {
    if (!user || tutors.length === 0) return;

    const unreadSubscriptions = [];
    let totalUnread = 0;
    let processedTutors = 0;

    tutors.forEach((tutor) => {
      const chatId = `${user.uid}_${tutor.id}`;
      const chatRef = doc(db, "chats", chatId);
      
      // Subscribe to chat document to get last message
      const chatUnsub = onSnapshot(chatRef, (chatSnap) => {
        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          
          // Get last message from chat data
          if (chatData.lastMessage) {
            setLastMessages(prev => ({
              ...prev,
              [tutor.id]: {
                text: chatData.lastMessage,
                timestamp: chatData.lastUpdated
              }
            }));
          }
        }
      });

      // Subscribe to unread messages
      const messagesRef = collection(db, "chats", chatId, "messages");
      const unreadQuery = query(
        messagesRef, 
        where("senderId", "==", tutor.id),
        where("read", "==", false)
      );
      
      const unreadUnsub = onSnapshot(unreadQuery, (unreadSnap) => {
        const count = unreadSnap.size;
        setUnreadCounts(prev => ({...prev, [tutor.id]: count}));
        
        // Update total unread count
        totalUnread += count;
        processedTutors++;
        
        if (processedTutors === tutors.length) {
          setMessageStats({
            total: tutors.length,
            unread: totalUnread
          });
        }
      });

      unreadSubscriptions.push(() => {
        chatUnsub();
        unreadUnsub();
      });
    });

    return () => {
      unreadSubscriptions.forEach(unsub => unsub());
    };
  }, [user, tutors]);

  /* 💬 Messages */
  useEffect(() => {
    if (!activeTutor || !user) return;

    const chatId = `${user.uid}_${activeTutor.id}`;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const newMessages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(newMessages);
      
      // Mark messages as read when user views them
      const unreadMessages = snap.docs
        .filter(doc => doc.data().senderId === activeTutor.id && !doc.data().read)
        .map(doc => doc.id);

      // Update all unread messages as read
      for (const msgId of unreadMessages) {
        try {
          await updateDoc(doc(db, "chats", chatId, "messages", msgId), {
            read: true,
            readAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      }

      // Reset unread count for this tutor
      if (unreadMessages.length > 0) {
        setUnreadCounts(prev => ({...prev, [activeTutor.id]: 0}));
      }

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "end" 
        });
      }, 100);
    });

    return () => unsub();
  }, [activeTutor, user]);

  /* 📤 Send Message */
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user || !activeTutor) return;

    const chatId = `${user.uid}_${activeTutor.id}`;
    const messageRef = collection(db, "chats", chatId, "messages");

    try {
      await addDoc(messageRef, {
        text: input,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderRole: "student",
        timestamp: serverTimestamp(),
        read: false,
        delivered: false,
      });

      await setDoc(
        doc(db, "chats", chatId),
        {
          lastMessage: input,
          lastUpdated: serverTimestamp(),
          lastSenderId: user.uid,
          studentId: user.uid,
          tutorId: activeTutor.id,
          studentName: user.displayName || user.email,
          tutorName: activeTutor.displayName,
        },
        { merge: true }
      );

      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  /* 🔍 Filter and Search Tutors */
  const filteredTutors = useMemo(() => {
    let filtered = tutors.filter(tutor =>
      tutor.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects?.some(subject => 
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (filter === "unread") {
      filtered = filtered.filter(tutor => unreadCounts[tutor.id] > 0);
    } else if (filter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(tutor => {
        const lastMsg = lastMessages[tutor.id];
        if (!lastMsg?.timestamp) return false;
        const msgDate = lastMsg.timestamp.toDate ? lastMsg.timestamp.toDate() : new Date(lastMsg.timestamp.seconds * 1000);
        return msgDate >= today;
      });
    }

    return filtered;
  }, [tutors, searchQuery, filter, unreadCounts, lastMessages]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading tutors...</p>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Tutors Sidebar */}
      <div className="w-96 bg-white/90 backdrop-blur-sm border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Ask Tutor</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {messageStats.total} tutors
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
                placeholder="Search tutors or subjects..."
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

        {/* Tutors List */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
            Available Tutors ({filteredTutors.length})
          </h3>
          {filteredTutors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <GraduationCap className="text-gray-300 mb-4" size={48} />
              <h3 className="text-gray-400 font-medium mb-2">
                {searchQuery ? "No matching tutors" : "No tutors available"}
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                {searchQuery 
                  ? "Try searching with different keywords"
                  : "Check back later for available tutors"}
              </p>
            </div>
          ) : (
            filteredTutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                isActive={activeTutor?.id === tutor.id}
                unreadCount={unreadCounts[tutor.id] || 0}
                lastMessage={lastMessages[tutor.id]}
                onClick={() => setActiveTutor(tutor)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
        {activeTutor ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white/90">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-lg">
                      {activeTutor.displayName?.charAt(0) || "T"}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-800">
                        {activeTutor.displayName}
                      </h2>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        Tutor
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {activeTutor.subjects?.length > 0 
                        ? activeTutor.subjects.join(", ")
                        : "Expert tutor"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50/50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <GraduationCap className="mx-auto mb-4 text-gray-300" size={64} />
                    <h3 className="text-gray-400 font-medium text-lg mb-2">
                      Start the conversation
                    </h3>
                    <p className="text-gray-400">
                      No messages yet. Send your first message to {activeTutor.displayName}.
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
                        text={msg.text}
                        isMe={msg.senderId === user.uid}
                        timestamp={msg.timestamp}
                        status={msg.read ? "read" : msg.delivered ? "delivered" : "sent"}
                        isLastOfUser={isLastOfUser}
                      />
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={sendMessage} className="space-y-3">
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(e);
                        }
                      }}
                      className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent text-sm"
                      placeholder="Type your message here..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      input.trim()
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md"
                        : "bg-gray-200 cursor-not-allowed"
                    }`}
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 px-2">
                  <span>Press Enter to send</span>
                  <span>{input.length}/1000</span>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
              <GraduationCap size={80} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-3">Welcome!</h3>
            <p className="text-gray-400 text-center max-w-md mb-8">
              Select a tutor from the sidebar to start a conversation. 
              Get help with your subjects and clarify your doubts instantly.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Online tutors available</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={16} />
                <span>{messageStats.total} tutors online</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}