import React, { useState } from "react";
import { 
  MessageSquare, 
  User, 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  Archive
} from "lucide-react";

const QueryCard = ({ query, onReply, onMarkResolved, onDelete }) => {
  const [replyText, setReplyText] = useState(query.reply || "");
  const [isReplying, setIsReplying] = useState(false);

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReply(query.id, replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              {query.student.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{query.student}</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-500">{query.time}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  query.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                  query.status === "Resolved" ? "bg-green-100 text-green-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {query.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="ml-12">
            <p className="text-gray-800 mb-4">{query.question}</p>
            
            {query.reply && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-700">Your Reply</span>
                </div>
                <p className="text-gray-700">{query.reply}</p>
              </div>
            )}
            
            {isReplying && !query.reply && (
              <div className="mb-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows="3"
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSendReply}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Reply
                  </button>
                  <button
                    onClick={() => setIsReplying(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          {!query.reply && !isReplying && (
            <button 
              onClick={() => setIsReplying(true)}
              className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-orange-600"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => onMarkResolved(query.id)}
            className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(query.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function StudentQueries() {
  const [queries, setQueries] = useState([
    { 
      id: 1, 
      student: "John Doe", 
      question: "I'm having trouble understanding React hooks. Could you explain useState and useEffect with examples?",
      time: "2 minutes ago",
      status: "Pending",
      reply: ""
    },
    { 
      id: 2, 
      student: "Sarah Miller", 
      question: "The assignment deadline is approaching. Can I get an extension for the JavaScript project?",
      time: "15 minutes ago",
      status: "Pending",
      reply: ""
    },
    { 
      id: 3, 
      student: "Alex Johnson", 
      question: "I've completed the CSS assignment. Could you review my code and provide feedback?",
      time: "1 hour ago",
      status: "Resolved",
      reply: "Great work on the CSS assignment! Your responsive design looks excellent. One suggestion: consider using CSS Grid for the main layout instead of multiple flex containers."
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const replyToQuery = (id, reply) => {
    setQueries(queries.map(q => 
      q.id === id ? { ...q, reply, status: "Resolved" } : q
    ));
  };

  const markResolved = (id) => {
    setQueries(queries.map(q => 
      q.id === id ? { ...q, status: "Resolved" } : q
    ));
  };

  const deleteQuery = (id) => {
    setQueries(queries.filter(q => q.id !== id));
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || query.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: queries.length,
    pending: queries.filter(q => q.status === "Pending").length,
    resolved: queries.filter(q => q.status === "Resolved").length,
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          📩 Student Queries
        </h1>
        <p className="text-gray-600 mt-2">Respond to student questions and provide support</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
          <p className="text-blue-700 font-semibold mb-2">Total Queries</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-2xl border border-yellow-200">
          <p className="text-yellow-700 font-semibold mb-2">Pending</p>
          <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
          <p className="text-green-700 font-semibold mb-2">Resolved</p>
          <p className="text-2xl font-bold text-gray-800">{stats.resolved}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Archived">Archived</option>
          </select>
          <button className="px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Queries List */}
      <div className="space-y-6">
        {filteredQueries.map((query) => (
          <QueryCard
            key={query.id}
            query={query}
            onReply={replyToQuery}
            onMarkResolved={markResolved}
            onDelete={deleteQuery}
          />
        ))}
      </div>

      {/* Response Time Stats */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-gray-800">Response Time Analytics</h3>
            <p className="text-sm text-gray-600">Average time to respond to student queries</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">24 min</p>
            <p className="text-sm text-green-600">↓ 8% from last week</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Within 30 minutes</span>
            <span className="font-medium text-gray-800">85%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Within 1 hour</span>
            <span className="font-medium text-gray-800">92%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Within 24 hours</span>
            <span className="font-medium text-gray-800">98%</span>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <MessageSquare className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-gray-800 mb-2">Quick Responses</h3>
          <p className="text-gray-600 text-sm">Save common replies as templates to respond faster</p>
          <button className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Create Template
          </button>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <Eye className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-bold text-gray-800 mb-2">Query Insights</h3>
          <p className="text-gray-600 text-sm">Most common questions: React Hooks, JavaScript Async, CSS Layouts</p>
          <button className="mt-4 px-4 py-2 bg-white text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}