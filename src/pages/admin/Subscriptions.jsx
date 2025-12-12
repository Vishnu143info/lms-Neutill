import React, { useState } from "react";
import { Search, Filter, Download, MoreVertical, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Subscriptions() {
  const [users, setUsers] = useState([
    { 
      name: "John Doe", 
      email: "john@example.com",
      plan: "Free", 
      status: "Active",
      joinDate: "2024-01-15",
      price: "$0",
      features: ["Basic Access", "Limited Content"]
    },
    { 
      name: "Jane Smith", 
      email: "jane@example.com",
      plan: "Premium", 
      status: "Active",
      joinDate: "2024-02-20",
      price: "$29.99",
      features: ["Full Access", "Priority Support", "Downloads"]
    },
    { 
      name: "Robert Johnson", 
      email: "robert@example.com",
      plan: "Platinum", 
      status: "Expired",
      joinDate: "2024-01-05",
      price: "$49.99",
      features: ["Everything", "1-on-1 Sessions", "Certification"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("All");

  const updatePlan = (email, newPlan) => {
    setUsers(
      users.map((u) => {
        if (u.email === email) {
          const price = newPlan === "Free" ? "$0" : 
                       newPlan === "Premium" ? "$29.99" : 
                       newPlan === "Platinum" ? "$49.99" : u.price;
          return { ...u, plan: newPlan, price };
        }
        return u;
      })
    );
  };

  const getPlanColor = (plan) => {
    switch(plan) {
      case "Free": return "bg-blue-100 text-blue-800";
      case "Premium": return "bg-purple-100 text-purple-800";
      case "Platinum": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Active": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Expired": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "All" || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          💳 Subscription Manager
        </h1>
        <p className="text-gray-600 mt-2">Manage user subscriptions and billing</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Plans</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
            <option value="Platinum">Platinum</option>
          </select>
          <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left p-4 font-semibold text-gray-700">User</th>
                <th className="text-left p-4 font-semibold text-gray-700">Plan</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Price</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr 
                  key={index}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">Joined: {user.joinDate}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(user.plan)}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className="font-medium">{user.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-lg">{user.price}<span className="text-gray-500 text-sm">/month</span></p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <select
                        value={user.plan}
                        onChange={(e) => updatePlan(user.email, e.target.value)}
                        className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Free">Free</option>
                        <option value="Premium">Premium</option>
                        <option value="Platinum">Platinum</option>
                      </select>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <p className="text-blue-700 font-semibold mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-800">$1,250.45</p>
          <p className="text-sm text-blue-600 mt-2">This month</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <p className="text-purple-700 font-semibold mb-2">Active Subscriptions</p>
          <p className="text-3xl font-bold text-gray-800">24</p>
          <p className="text-sm text-purple-600 mt-2">+3 this week</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <p className="text-green-700 font-semibold mb-2">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-800">12.5%</p>
          <p className="text-sm text-green-600 mt-2">+2.1% from last month</p>
        </div>
      </div>
    </div>
  );
}