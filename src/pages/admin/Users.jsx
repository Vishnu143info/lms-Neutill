import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  UserCheck,
  UserX,
  Edit,
  MessageSquare,
  Clock,
  Star,
  Mail as MailIcon,
  Send
} from "lucide-react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

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
          status: data.status || "active",
          rating: data.rating || 4.5
        };
      });

      setUsers(allUsers);
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

  const toggleSelectUser = (id) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
  };

  const selectAllUsers = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(user => user.id)));
    }
  };

  // Send email to a single user
  const sendEmailToUser = (user) => {
    const subject = `Message from Admin - ${user.name}`;
    const body = `Dear ${user.name},\n\nWe hope this message finds you well.\n\n[Your message here]\n\nBest regards,\nAdmin Team\naskneutill@gmail.com`;
    
    const mailtoLink = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=askneutill@gmail.com`;
    
    window.open(mailtoLink, '_blank');
  };

  // Send bulk email to selected users
  const sendBulkEmail = () => {
    if (selectedUsers.size === 0) {
      alert("Please select users to send email");
      return;
    }

    const selectedUserDetails = users.filter(user => selectedUsers.has(user.id));
    
    // Create list of recipients
    const recipients = selectedUserDetails.map(user => user.email).join(',');
    
    // Create list of user names for the email body
    const userNames = selectedUserDetails.map(user => user.name).join(', ');
    
    const subject = "Important Announcement from Admin";
    const body = `Dear Users,\n\nThis message is for: ${userNames}\n\n[Your bulk message here]\n\nThis email has been sent to all selected users.\n\nBest regards,\nAdmin Team\naskneutill@gmail.com`;
    
    const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=askneutill@gmail.com`;
    
    window.open(mailtoLink, '_blank');
  };

  // Send quick message template
  const sendQuickMessage = (user, template) => {
    let subject = "";
    let body = "";
    
    switch(template) {
      case 'welcome':
        subject = `Welcome to Our Platform, ${user.name}!`;
        body = `Dear ${user.name},\n\nWelcome to our platform! We're excited to have you on board.\n\nIf you have any questions or need assistance, please don't hesitate to reach out to us at askneutill@gmail.com.\n\nBest regards,\nAdmin Team`;
        break;
        
      case 'account_activated':
        subject = `Your Account Has Been Activated - ${user.name}`;
        body = `Dear ${user.name},\n\nYour account has been successfully activated! You can now access all features of our platform.\n\nIf you have any questions, feel free to contact us at askneutill@gmail.com.\n\nBest regards,\nAdmin Team`;
        break;
        
      case 'account_deactivated':
        subject = `Account Status Update - ${user.name}`;
        body = `Dear ${user.name},\n\nYour account has been temporarily deactivated. If you believe this is a mistake or would like to reactivate your account, please contact us at askneutill@gmail.com.\n\nBest regards,\nAdmin Team`;
        break;
        
      default:
        subject = `Message from Admin`;
        body = `Dear ${user.name},\n\nWe hope this message finds you well.\n\n[Your custom message here]\n\nBest regards,\nAdmin Team\naskneutill@gmail.com`;
    }
    
    const mailtoLink = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=askneutill@gmail.com`;
    
    window.open(mailtoLink, '_blank');
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

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Role,Status,Joined\n" 
      + users.map(user => 
          `"${user.name}","${user.email}","${user.role}","${user.approved ? 'Active' : 'Inactive'}","${user.createdAt.toLocaleDateString()}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
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

        {/* Bulk Actions Bar */}
        {selectedUsers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 mb-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">{selectedUsers.size}</span>
                </div>
                <p className="text-white font-medium">
                  {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={sendBulkEmail}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  <MailIcon className="w-4 h-4" />
                  <span>Send Email to All</span>
                </button>
                
                {/* Quick Templates for Bulk */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium">
                    <span>Quick Templates</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 hidden group-hover:block">
                    <button
                      onClick={() => {
                        const selectedUserDetails = users.filter(user => selectedUsers.has(user.id));
                        selectedUserDetails.forEach(user => sendQuickMessage(user, 'welcome'));
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Send Welcome Email
                    </button>
                    <button
                      onClick={() => {
                        const selectedUserDetails = users.filter(user => selectedUsers.has(user.id));
                        selectedUserDetails.forEach(user => sendQuickMessage(user, 'account_activated'));
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Send Activation Email
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedUsers(new Set())}
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRole("all");
                setSelectedStatus("all");
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
                          onClick={() => setSelectedRole(role)}
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
                          onClick={() => setSelectedStatus(status)}
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

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectAllUsers}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="p-4 text-left font-semibold text-gray-900">User</th>
                <th className="p-4 text-left font-semibold text-gray-900">Contact</th>
                <th className="p-4 text-left font-semibold text-gray-900">Role</th>
                <th className="p-4 text-left font-semibold text-gray-900">Status</th>
                <th className="p-4 text-left font-semibold text-gray-900">Joined</th>
                <th className="p-4 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
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
                          checked={selectedUsers.has(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
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
                            <div className="flex items-center space-x-1 mt-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-xs text-gray-600">{user.rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last login: {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                          </div>
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

                      {/* Joined Date */}
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {user.createdAt.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleApproval(user.id, user.approved)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.approved
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={user.approved ? "Deactivate" : "Activate"}
                          >
                            {user.approved ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                          </button>

                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          {/* Email Dropdown */}
                          <div className="relative group">
                            <button
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Send Message"
                            >
                              <MessageSquare className="w-5 h-5" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 hidden group-hover:block">
                              <button
                                onClick={() => sendEmailToUser(user)}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                              >
                                <Send className="w-4 h-4" />
                                <span>Custom Email</span>
                              </button>
                              <button
                                onClick={() => sendQuickMessage(user, 'welcome')}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Send Welcome
                              </button>
                              <button
                                onClick={() => sendQuickMessage(user, 'account_activated')}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Account Activated
                              </button>
                              <button
                                onClick={() => sendQuickMessage(user, 'account_deactivated')}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Account Deactivated
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-5 h-5" />
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

        {/* Table Footer */}
        {filteredUsers.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of{" "}
                  <span className="font-semibold text-gray-900">{users.length}</span> users
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-gray-600">Inactive</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 text-sm">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    1
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 text-sm">
                    2
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 text-sm">
                    Next
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