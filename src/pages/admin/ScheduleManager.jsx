import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Plus, Edit2, Trash2, Video, Bell, CheckCircle, X } from "lucide-react";

// 🔹 Your Firebase instance
import { db } from "../../firebase";




import {
    collection,
    deleteDoc,
    doc,
    setDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    where        // ✅ ADD THIS
} from "firebase/firestore";






const Toast = ({ message, type = "success", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500"
    };

    const icon = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️"
    };

    return (
        <div className={`fixed top-6 right-6 ${bgColor[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn z-50 min-w-[300px] max-w-md`}>
            <span className="text-lg">{icon[type]}</span>
            <span className="flex-1">{message}</span>
            <button 
                onClick={onClose}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// Add this to your global CSS or style tag
const addStyles = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
.animate-slideIn {
    animation: slideIn 0.3s ease-out;
}
`;

// --- ScheduleCard Component (UI for each schedule item) ---
const ScheduleCard = ({ schedule, onEdit, onDelete }) => {
    const [isAttending, setIsAttending] = useState(false);

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        try {
            const [hours, minutes] = timeString.split(':');
            return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit'
            });
        } catch {
            return timeString;
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Video className="w-4 h-4 text-blue-500" />
                        <h3 className="font-bold text-lg text-gray-800">{schedule.className}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            schedule.type === "Live" ? "bg-red-100 text-red-800" :
                            schedule.type === "Recorded" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                        } flex-shrink-0`}>
                            {schedule.type}
                        </span>
                    </div>
                    <p className="text-gray-600 text-sm">{schedule.description}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                    <button 
                        onClick={() => onEdit(schedule)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Schedule"
                    >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                        onClick={() => onDelete(schedule.id)} 
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Schedule"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{formatDate(schedule.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{formatTime(schedule.time)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate" title={schedule.tutor}>{schedule.tutor}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Bell className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{schedule.duration}</span>
                </div>
            </div>

            {/* Attendance & Join Button */}
            {/* <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-2">
                 
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center text-xs text-white">
                        {schedule.attendees || 0}+
                    </div>
                    <span className="text-sm text-gray-500">Attendees</span>
                </div>
                
                <button
                    onClick={() => setIsAttending(!isAttending)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                        isAttending
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                >
                    {isAttending ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Attending
                        </>
                    ) : (
                        "Join Class"
                    )}
                </button>
            </div> */}
        </div>
    );
};

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{message}</p>
                
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main ScheduleManager Component ---
export default function ScheduleManager() {
    const [schedules, setSchedules] = useState([]); 
    const [form, setForm] = useState({
  id: null,
  className: "",
  description: "",
  date: "",
  time: "",
  tutor: "",
  type: "Live",
  duration: "",
  meetingUrl: ""   // ✅ ADD THIS
});
    const [isEditing, setIsEditing] = useState(false);
    const [tutors, setTutors] = useState([]);
    const [toast, setToast] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        scheduleId: null
    });

    const classTypes = ["Live", "Recorded", "Workshop"];
useEffect(() => {
  const fetchTutors = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "tutor"),
        where("approved", "==", true)
      );

      const snapshot = await getDocs(q);

      console.log("Tutor count:", snapshot.size);

      if (snapshot.empty) {
        showToast("No approved tutors found", "warning");
        setTutors([]);
        return;
      }

      const tutorsList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().profile?.name || "Unnamed Tutor"
      }));

      setTutors(tutorsList);
    } catch (error) {
      console.error("Tutor fetch error:", error);
      showToast("Failed to load tutors", "error");
    }
  };

  fetchTutors();
}, []);






    // Show toast notification
    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    // Close toast
    const closeToast = () => {
        setToast(null);
    };

    // Show delete confirmation modal
    const confirmDelete = (scheduleId) => {
        setDeleteModal({
            isOpen: true,
            scheduleId
        });
    };

    // Handle actual deletion
    const handleDeleteConfirm = async () => {
        try {
            await deleteDoc(doc(db, "schedules", deleteModal.scheduleId));
            showToast("Schedule deleted successfully!", "success");
        } catch (error) {
            console.error("Error deleting document: ", error);
            showToast(`Failed to delete schedule: ${error.message}`, "error");
        } finally {
            setDeleteModal({ isOpen: false, scheduleId: null });
        }
    };

    // Fetch schedules
    useEffect(() => {
        const q = query(
            collection(db, "schedules"),
            orderBy("date", "asc")
        );

        const unsubscribeSchedules = onSnapshot(
            q,
            (snapshot) => {
                const fetchedSchedules = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Sort by date + time
                fetchedSchedules.sort((a, b) => {
                    if (a.date < b.date) return -1;
                    if (a.date > b.date) return 1;
                    if (a.time < b.time) return -1;
                    if (a.time > b.time) return 1;
                    return 0;
                });

                setSchedules(fetchedSchedules);
            },
            (error) => {
                console.error("Error fetching schedules:", error);
                showToast("Error fetching schedules", "error");
            }
        );

        return () => unsubscribeSchedules();
    }, []);

    // Add or Update Schedule
    const handleScheduleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }
        
        if (!form.className || !form.date || !form.time || !form.tutor) {
            showToast("Please fill in all required fields", "warning");
            return;
        }
        
        let docRef;
        let finalDocId;

        if (isEditing && form.id) {
            docRef = doc(db, "schedules", form.id);
            finalDocId = form.id;
        } else {
            docRef = doc(collection(db, "schedules"));
            finalDocId = docRef.id;
        }

       const scheduleData = {
  documentId: finalDocId,
  className: form.className,
  description: form.description,
  date: form.date,
  time: form.time,
  tutor: form.tutor,
  type: form.type,
  duration: form.duration,
  meetingUrl: form.meetingUrl,   // ✅ SAVE
  attendees: form.attendees || Math.floor(Math.random() * 40) + 10
};

        try {
            await setDoc(docRef, scheduleData);
            
            showToast(
                `Schedule ${isEditing ? 'updated' : 'added'} successfully!`,
                "success"
            );

        } catch (error) {
            console.error("Error writing document: ", error);
            showToast(`Failed to save schedule: ${error.message}`, "error");
        } finally {
            setForm({ className: "", description: "", date: "", time: "", tutor: "", type: "Live", duration: "", id: null, attendees: null });
            setIsEditing(false);
        }
    };

    // Function to populate the form for editing
    const editSchedule = (schedule) => {
        setForm(schedule);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle Enter key press in form fields
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleScheduleSubmit();
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <style>{addStyles}</style>
            
            {/* Toast Notification */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
            
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, scheduleId: null })}
                onConfirm={handleDeleteConfirm}
                title="Delete Schedule"
                message="Are you sure you want to delete this schedule? This action cannot be undone."
            />

            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                     Schedule Manager
                </h1>
                <p className="text-gray-600 mt-2">Create and manage class schedules</p>
            </div>

            {/* Create/Edit Schedule Form */}
            <form onSubmit={handleScheduleSubmit}>
                <div className={`rounded-2xl p-6 mb-8 border transition-all duration-300 ${isEditing ? 'bg-yellow-50 border-yellow-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg ${isEditing ? 'bg-yellow-200' : 'bg-blue-100'}`}>
                            {isEditing ? <Edit2 className="w-5 h-5 text-yellow-800" /> : <Plus className="w-5 h-5 text-blue-600" />}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Schedule" : "Create New Schedule"}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Class Name *"
                            value={form.className}
                            onChange={(e) => setForm({ ...form, className: e.target.value })}
                            onKeyDown={handleKeyDown}
                            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <input
                            type="text"
                            placeholder="Description (Optional)"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            onKeyDown={handleKeyDown}
                            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            onKeyDown={handleKeyDown}
                            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <input
                            type="time"
                            value={form.time}
                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                            onKeyDown={handleKeyDown}
                            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                      <select
  value={form.tutor}
  onChange={(e) => setForm({ ...form, tutor: e.target.value })}
  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="" disabled>
    {tutors.length === 0 ? "No tutors available" : "Select Tutor *"}
  </option>

  {tutors.map((tutor) => (
    <option key={tutor.id} value={tutor.name}>
      {tutor.name}
    </option>
  ))}
</select>


                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            onKeyDown={handleKeyDown}
                            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {classTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Duration (e.g., 2 hours)"
                            value={form.duration}
                            onChange={(e) => setForm({ ...form, duration: e.target.value })}
                            onKeyDown={handleKeyDown}
                            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent lg:col-span-1"
                        />
                        <input
  type="url"
  placeholder="Meeting Link (Zoom / GMeet)"
  value={form.meetingUrl}
  onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
                    </div>


                    <div className="mt-6 flex items-center">
                        <button
                            type="submit"
                            className={`font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                                isEditing
                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                            }`}
                        >
                            {isEditing ? (
                                <>
                                    <Edit2 className="w-4 h-4" />
                                    Save Changes
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Add Schedule
                                </>
                            )}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({ className: "", description: "", date: "", time: "", tutor: "", type: "Live", duration: "", id: null, attendees: null });
                                    setIsEditing(false);
                                    showToast("Edit cancelled", "info");
                                }}
                                className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* --- SCHEDULE LIST DISPLAY --- */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-indigo-500" />
                    Upcoming Schedules ({schedules.length})
                </h2>
                
                {schedules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schedules.map(schedule => (
                            <ScheduleCard 
                                key={schedule.id} 
                                schedule={schedule}
                                onEdit={editSchedule} 
                                onDelete={confirmDelete} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-10 bg-white rounded-xl shadow border border-dashed border-gray-300">
                        <p className="text-gray-500">No schedules found. Click "Add Schedule" to create one!</p>
                    </div>
                )}
            </div>
        </div>
    );
}