import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  User,
  Calendar,
  Shield,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  UserCheck,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Added

// Remove the emailjs import and sendMail function since we'll redirect instead

export default function Users() {
  const navigate = useNavigate(); // Added
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const toggleUserSelection = (user) => {
  setSelectedUsers((prev) => {
    const exists = prev.find((u) => u.id === user.id);
    if (exists) {
      return prev.filter((u) => u.id !== user.id);
    }
    return [...prev, user];
  });
};

const isUserSelected = (id) =>
  selectedUsers.some((u) => u.id === id);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const allUsers = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
  return {
  id: docSnap.id,
  role: data.role || "student",
  approved: data.approved || false,
  name: data.profile?.name || data.name || "Unnamed User",
  email: data.profile?.email || data.email || "No email",
  phone: data.profile?.phone || data.phone || "N/A",
  createdAt: data.createdAt?.toDate() || new Date(),
  lastLogin: data.lastLogin?.toDate() || null,
  rating: data.rating || 4.5,

 planName: data.planName ?? data.subscription?.planName ?? "Free",
price: data.price ?? data.subscription?.price ?? 0,
paymentMethod: data.paymentMethod ?? data.subscription?.paymentMethod ?? "-",
planStatus: data.status ?? data.subscription?.status ?? "inactive",

};


      });

      // Sort users by createdAt (newest first)
      const sortedUsers = allUsers.sort((a, b) => b.createdAt - a.createdAt);
      setUsers(sortedUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleApproval = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "users", id), {
        approved: !currentStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating approval:", error);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDoc(doc(db, "users", id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Function to handle sending mail - redirects to mail page
  const handleSendMail = (user) => {
    navigate("/send-mail", { 
      state: { 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          rating: user.rating,
          approved: user.approved,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "active" && user.approved) ||
      (selectedStatus === "inactive" && !user.approved);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate pagination
  useEffect(() => {
    const total = Math.ceil(filteredUsers.length / itemsPerPage);
    setTotalPages(total);
    
    // Reset to first page if current page exceeds total pages
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length, itemsPerPage, currentPage]);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const currentPageUsers = getCurrentPageData();

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Role,Status,Joined,Last Login,Rating\n" 
      + filteredUsers.map(user => 
          `"${user.name}","${user.email}","${user.role}","${user.approved ? 'Active' : 'Inactive'}","${user.createdAt.toLocaleDateString()}","${user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}","${user.rating}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const RoleBadge = ({ role }) => {
    const config = {
      student: { color: "bg-blue-100 text-blue-700", icon: <User className="w-3 h-3" /> },
      tutor: { color: "bg-purple-100 text-purple-700", icon: <Shield className="w-3 h-3" /> },
      admin: { color: "bg-red-100 text-red-700", icon: <ShieldCheck className="w-3 h-3" /> },
      consumer: { color: "bg-green-100 text-green-700", icon: <UserCheck className="w-3 h-3" /> }
    };
    
    const { color, icon } = config[role] || config.student;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
        {icon}
        <span className="uppercase">{role}</span>
      </div>
    );
  };

  const StatusBadge = ({ approved }) => {
    return (
      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
        approved 
          ? "bg-green-100 text-green-700" 
          : "bg-amber-100 text-amber-700"
      }`}>
        {approved ? (
          <>
            <CheckCircle className="w-3 h-3" />
            <span>Active</span>
          </>
        ) : (
          <>
            <Clock className="w-3 h-3" />
            <span>Inactive</span>
          </>
        )}
      </div>
    );
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage all registered users in the system</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium shadow-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRole("all");
                setSelectedStatus("all");
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <div className="flex flex-wrap gap-2">
                      {["all", "student", "tutor", "admin", "consumer"].map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setSelectedRole(role);
                            setCurrentPage(1);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedRole === role
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {["all", "active", "inactive"].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatus(status);
                            setCurrentPage(1);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedStatus === status
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Bulk Actions Bar */}
{selectedUsers.length > 0 && (
  <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4">
    <div className="text-sm font-medium text-blue-700">
      {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
    </div>

    <button
      onClick={() =>
      navigate("/dashboard/admin/send-mail", {
  state: { users: selectedUsers }
})
      }
      className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
    >
      <Mail className="w-4 h-4" />
      <span>Send Mail</span>
    </button>
  </div>
)}


      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50 border-b border-gray-200">
  <tr>
    
    {/* Select All Checkbox */}
    <th className="">
      <input
        type="checkbox"
        checked={
          selectedUsers.length === currentPageUsers.length &&
          currentPageUsers.length > 0
        }
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedUsers(currentPageUsers);
          } else {
            setSelectedUsers([]);
          }
        }}
        className="w-4 h-4"
      />
    </th>

    <th className="p-4 text-left font-semibold text-gray-900">User</th>
   <th className="p-4 text-left font-semibold text-gray-900">
  Plan
</th>

    <th className="p-4 text-left font-semibold text-gray-900">Role</th>
    <th className="p-4 text-left font-semibold text-gray-900">Status</th>
    <th className="p-4 text-left font-semibold text-gray-900">Joined</th>
    <th className="p-4 text-left font-semibold text-gray-900">Actions</th>
  </tr>
</thead>


            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {currentPageUsers.length > 0 ? (
                  currentPageUsers.map((user) => (
                <motion.tr
  key={user.id}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="hover:bg-gray-50 transition-colors"
>
  {/* Checkbox */}
  <td className="p-4">
    <input
      type="checkbox"
      checked={isUserSelected(user.id)}
      onChange={() => toggleUserSelection(user)}
      onClick={(e) => e.stopPropagation()}
      className="w-4 h-4"
    />
  </td>

  {/* User Info */}
  <td className="p-4">
    <div className="flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        user.approved
          ? "bg-gradient-to-br from-green-100 to-emerald-100"
          : "bg-gradient-to-br from-gray-100 to-gray-200"
      }`}>
        <User className={`w-6 h-6 ${
          user.approved ? "text-green-600" : "text-gray-400"
        }`} />
      </div>

      <div>
        <p className="font-bold text-gray-900">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </div>
  </td>


  {/* Plan */}
{/* Plan Column */}
<td className="p-4">
  <div className="space-y-2">
    <p className="font-semibold  text-gray-800">
      {user.planName || "Free"}
    </p>

    <p className="text-xs text-gray-500">
      ₹{user.price ?? 0} • {user.paymentMethod || "-"}
    </p>

    <span
      className={`text-xs px-2 py-1 rounded-full font-semibold ${
        user.planStatus === "active"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {user.planStatus || "inactive"}
    </span>
  </div>
</td>




  {/* Role */}
  <td className="p-4">
    <RoleBadge role={user.role} />
  </td>

  {/* Status */}
  <td className="p-4">
    <StatusBadge approved={user.approved} />
  </td>

  {/* Joined */}
  <td className="p-4">
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-700">
        {user.createdAt.toLocaleDateString()}
      </span>
    </div>
  </td>

  {/* Actions */}
  <td className="p-4">
    <div className="flex items-center space-x-2">
      <Link
  to="/dashboard/admin/send-mail"
  state={{ user }}
>

        <Mail className="w-5 h-5" />
      </Link>

      <button
        onClick={() => handleToggleApproval(user.id, user.approved)}
        className={`p-2 rounded-lg ${
          user.approved
            ? "text-red-600 hover:bg-red-50"
            : "text-green-600 hover:bg-green-50"
        }`}
      >
        {user.approved ? <XCircle /> : <CheckCircle />}
      </button>

      <button
        onClick={() => handleDelete(user.id, user.name)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
      >
        <Trash2 />
      </button>
    </div>
  </td>
</motion.tr>

                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-12">

                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedRole("all");
                            setSelectedStatus("all");
                          }}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table Footer with Dynamic Pagination */}
        {filteredUsers.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              {/* Left side - Results per page selector */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing items per page
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="text-sm text-gray-600">per page</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                  </span> of <span className="font-semibold text-gray-900">{filteredUsers.length}</span> users
                </div>
              </div>

              {/* Right side - Pagination controls */}
              <div className="flex items-center space-x-2">
                {/* Status indicators */}
                <div className="hidden md:flex items-center space-x-4 mr-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-gray-600">Inactive</span>
                  </div>
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center space-x-1">
                  {/* First page */}
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronsLeft className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Previous page */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Page numbers */}
                  {renderPageNumbers()}

                  {/* Next page */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Last page */}
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronsRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}