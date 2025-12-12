import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Image as ImageIcon,
  Mic,
  Video,
  FileText,
  Calendar,
  Clock,
  User,
  CheckCircle,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Star,
  Phone,
  MessageSquare,
  Bot,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  Download
} from "lucide-react";

const MessageBubble = ({ message, isStudent, timestamp, isRead }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex ${isStudent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isStudent ? 'ml-auto' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isStudent 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
        
        <div className={`flex items-center gap-2 mt-1 text-xs ${isStudent ? 'justify-end' : 'justify-start'}`}>
          <span className="text-gray-500">{formatTime(timestamp)}</span>
          {isStudent && (
            <CheckCircle className={`w-3 h-3 ${isRead ? 'text-green-500' : 'text-gray-400'}`} />
          )}
        </div>
      </div>
    </div>
  );
};

const TutorCard = ({ name, role, status, avatarColor, responseTime, rating }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-lg`}>
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-800">{name}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === 'online' ? 'bg-green-100 text-green-800' :
              status === 'away' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{role}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">~{responseTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs text-gray-600">{rating}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickQuestion = ({ question, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-100 transition-all duration-300 text-left group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-800">{question}</span>
      </div>
    </button>
  );
};

export default function AskTutor() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I need help with React hooks. Can you explain useState?", sender: "student", timestamp: new Date(Date.now() - 3600000), isRead: true },
    { id: 2, text: "Hello! Of course. useState is a Hook that lets you add React state to function components.", sender: "tutor", timestamp: new Date(Date.now() - 3500000), isRead: true },
    { id: 3, text: "What about useEffect? I'm having trouble understanding dependencies.", sender: "student", timestamp: new Date(Date.now() - 3400000), isRead: true },
    { id: 4, text: "useEffect runs after every render. The dependency array controls when it re-runs. Want me to show an example?", sender: "tutor", timestamp: new Date(Date.now() - 3300000), isRead: true },
  ]);
  
  const [input, setInput] = useState("");
  const [activeTutor, setActiveTutor] = useState("John Smith");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const tutors = [
    { name: "John Smith", role: "React Specialist", status: "online", avatarColor: "bg-gradient-to-r from-blue-500 to-indigo-500", responseTime: "5 min", rating: 4.8 },
    { name: "Sarah Chen", role: "JavaScript Expert", status: "away", avatarColor: "bg-gradient-to-r from-purple-500 to-pink-500", responseTime: "15 min", rating: 4.9 },
    { name: "Mike Johnson", role: "Full Stack Developer", status: "offline", avatarColor: "bg-gradient-to-r from-green-500 to-emerald-500", responseTime: "2 hours", rating: 4.7 },
  ];

  const quickQuestions = [
    { id: 1, question: "Explain useState with example", icon: HelpCircle },
    { id: 2, question: "Async/await best practices", icon: HelpCircle },
    { id: 3, question: "Project structure advice", icon: HelpCircle },
    { id: 4, question: "Schedule 1:1 session", icon: Calendar },
    { id: 5, question: "Share code file", icon: FileText },
    { id: 6, question: "Need video explanation", icon: Video },
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "student",
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setInput("");
    
    // Simulate tutor typing
    setIsTyping(true);
    
    // Simulate tutor response after delay
    setTimeout(() => {
      setIsTyping(false);
      const tutorResponse = {
        id: Date.now() + 1,
        text: getRandomResponse(input),
        sender: "tutor",
        timestamp: new Date(),
        isRead: false
      };
      setMessages(prev => [...prev, tutorResponse]);
    }, 2000);
  };

  const getRandomResponse = (question) => {
    const responses = [
      "That's a great question! Let me explain that in detail.",
      "I understand your confusion. Here's how it works:",
      "Good question! The concept you're asking about is important. Let me break it down.",
      "I can help with that! Here's my explanation:",
      "Thanks for asking! This is a common point of confusion. Here's what you need to know:"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="p-6 h-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-900 bg-clip-text text-transparent mb-2">
            💬 Ask Tutor - Instant Help
          </h1>
          <p className="text-gray-600">Get real-time help from expert tutors. Average response time: 5 minutes</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Voice Call
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-medium flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video Chat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
        {/* Left Sidebar - Available Tutors */}
        <div className="lg:col-span-1 space-y-6">
          {/* Available Tutors */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">Available Tutors</h3>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                3 Online
              </span>
            </div>
            
            <div className="space-y-4">
              {tutors.map((tutor, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveTutor(tutor.name)}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeTutor === tutor.name ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                >
                  <TutorCard {...tutor} />
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              View All Tutors
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Your Support Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Questions Asked</span>
                <span className="font-bold text-gray-800">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Response Time</span>
                <span className="font-bold text-gray-800">4.2 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Session Rating</span>
                <span className="font-bold text-gray-800">4.8★</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tutors Helped</span>
                <span className="font-bold text-gray-800">8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white rounded-t-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {activeTutor.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{activeTutor}</h3>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">Typing {isTyping ? "..." : ""}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 bg-gradient-to-b from-gray-50 to-white p-6 overflow-y-auto border-x border-gray-100">
            <div className="space-y-1">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.text}
                  isStudent={msg.sender === "student"}
                  timestamp={msg.timestamp}
                  isRead={msg.isRead}
                />
              ))}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[70%]">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-none">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white rounded-b-2xl p-6 border border-gray-100 shadow-sm">
            {/* Quick Questions */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.slice(0, 4).map((q) => (
                  <QuickQuestion
                    key={q.id}
                    question={q.question}
                    icon={q.icon}
                    onClick={() => handleQuickQuestion(q.question)}
                  />
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <textarea
                  className="w-full bg-transparent p-4 focus:outline-none resize-none"
                  placeholder="Type your question here..."
                  rows="2"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div className="flex items-center justify-between p-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <ImageIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Smile className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Mic className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {input.length}/500
                  </div>
                </div>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Help & Resources */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Assistant */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <Bot className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-800">AI Assistant</h3>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              Get instant answers to common questions while waiting for tutor response
            </p>
            <button className="w-full px-4 py-3 bg-white text-gray-800 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium border border-purple-200">
              Ask AI Assistant
            </button>
          </div>

          {/* Quick Resources */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Quick Resources</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-800">React Hooks Guide</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Video className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-800">Video Tutorials</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Download className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-800">Code Examples</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
              </button>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Session Feedback</h3>
            <p className="text-gray-600 text-sm mb-4">
              How helpful was this session?
            </p>
            <div className="flex gap-2 mb-4">
              <button className="flex-1 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors flex items-center justify-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                Helpful
              </button>
              <button className="flex-1 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors flex items-center justify-center gap-2">
                <ThumbsDown className="w-4 h-4" />
                Not Helpful
              </button>
            </div>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium">
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}