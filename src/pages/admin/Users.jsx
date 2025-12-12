import React, { useState } from "react";
import { Search, Filter, Mail, Phone, Calendar, CheckCircle, XCircle, MoreVertical, Send, Edit } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Student", status: "Active", joinDate: "2024-01-15", phone: "+1 234 567 8900" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Tutor", status: "Active", joinDate: "2024-02-20", phone: "+1 234 567 8901" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Admin", status: "Inactive", joinDate: "2024-01-05", phone: "+1 234 567 8902" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "Student", status: "Active", joinDate: "2024-03-10", phone: "+1 234 567 8903" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const updateRole = (id, newRole) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const toggleStatus = (id) => {
    setUsers(users.map((u) => 
      u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u
    ));
  };

  const getRoleColor = (role) => {
    switch(role) {
      case "Admin": return "bg-red-100 text-red-800";
      case "Tutor": return "bg-blue-100 text-blue-800";
      case "Student": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "text-green-500" : "text-red-500";
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    const matchesStatus = filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          👥 User Management
        </h1>
        <p className="text-gray-600 mt-2">Manage all platform users and their roles</p>
      </div>

      {/* Filters and Stats */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Tutor">Tutor</option>
            <option value="Student">Student</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-gray-600 text-sm mb-2">Total Users</p>
          <p className="text-2xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-gray-600 text-sm mb-2">Active Users</p>
          <p className="text-2xl font-bold text-gray-800">{users.filter(u => u.status === "Active").length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-gray-600 text-sm mb-2">Tutors</p>
          <p className="text-2xl font-bold text-gray-800">{users.filter(u => u.role === "Tutor").length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-gray-600 text-sm mb-2">Admins</p>
          <p className="text-2xl font-bold text-gray-800">{users.filter(u => u.role === "Admin").length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left p-4 font-semibold text-gray-700">User</th>
                <th className="text-left p-4 font-semibold text-gray-700">Role</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getRoleColor(user.role)}`}
                    >
                      <option value="Student">Student</option>
                      <option value="Tutor">Tutor</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                      {user.status === "Active" ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-600">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Joined: {user.joinDate}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600">
                        <Send className="w-4 h-4" />
                      </button>
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
    </div>
  );
}