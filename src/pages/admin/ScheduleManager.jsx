import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Plus, Edit2, Trash2, Video, Bell, CheckCircle } from "lucide-react";

// --- IMPORTANT: Firebase Imports from your local file ---
import {
    db,
    collection,
    deleteDoc,
    doc,
    setDoc, 
    query,
    onSnapshot,
    orderBy,
} from "../../firebase"; 

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
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-2">
                    {/* Simplified attendee count display */}
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
            </div>
        </div>
    );
};

// --- Main ScheduleManager Component ---

export default function ScheduleManager() {
    const [schedules, setSchedules] = useState([]); 
    const [form, setForm] = useState({
        id: null, // Firestore Document ID (for editing/deleting)
        className: "",
        description: "",
        date: "",
        time: "",
        tutor: "",
        type: "Live",
        duration: ""
    });
    const [isEditing, setIsEditing] = useState(false);

    const tutors = ["Alex Johnson", "Sarah Miller", "Mike Chen", "Emily Davis"];
    const classTypes = ["Live", "Recorded", "Workshop"];

    // Function to sort the array by time (HH:MM format)
    const sortByTime = (a, b) => {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
    };

    // 1. Real-time Data Fetching (Read Operation)
    useEffect(() => {
        // Query the 'schedules' collection, ordered ONLY by date in Firestore
        // This avoids the need for a composite index and prevents data from being skipped.
        const q = query(collection(db, "schedules"), orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Schedules successfully fetched. Count:", snapshot.docs.length);
            
            let fetchedSchedules = snapshot.docs.map(doc => ({
                id: doc.id, // Store Firestore's external document ID
                ...doc.data()
            }));

            // Secondary sorting by time is done in React (client-side)
            // Group by date and sort each group by time to handle same-day schedules correctly.
            // A simpler overall time sort is often sufficient if dates are already ordered:
            const sortedSchedules = fetchedSchedules.sort((a, b) => {
                // Primary sort by date (already handled by Firestore, but good practice)
                if (a.date < b.date) return -1;
                if (a.date > b.date) return 1;

                // Secondary sort by time (client-side)
                return sortByTime(a, b);
            });
            
            setSchedules(sortedSchedules);
        }, (error) => {
            console.error("Error fetching schedules: ", error);
            // Check the console for this error. If present, Firebase setup or rules are the issue.
        });

        return () => unsubscribe(); // Cleanup function to detach listener
    }, []);

    // 2. Add or Update Schedule (Write Operation)
    const handleScheduleSubmit = async (e) => {
        if (e) {
            e.preventDefault(); // Prevent form submission reload
        }
        
        if (!form.className || !form.date || !form.time || !form.tutor) {
            alert("Please fill in all required fields");
            return;
        }
        
        let docRef;
        let finalDocId;

        if (isEditing && form.id) {
            // Case 1: Editing existing document
            docRef = doc(db, "schedules", form.id);
            finalDocId = form.id;
        } else {
            // Case 2: Creating a new document (pre-generate ID)
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
            attendees: form.attendees || Math.floor(Math.random() * 40) + 10 
        };

        try {
            await setDoc(docRef, scheduleData);
            
            console.log(`Schedule ${isEditing ? 'updated' : 'added'} successfully with ID: ${finalDocId}!`);
            alert(`Schedule ${isEditing ? 'updated' : 'added'} successfully!`);

        } catch (error) {
            console.error("Error writing document: ", error);
            alert(`Failed to save schedule: ${error.message}`);
        } finally {
            // Reset form
            setForm({ className: "", description: "", date: "", time: "", tutor: "", type: "Live", duration: "", id: null, attendees: null });
            setIsEditing(false);
        }
    };

    // 3. Delete Schedule (Delete Operation)
    const deleteSchedule = async (id) => {
        if (!window.confirm("Are you sure you want to delete this schedule?")) {
            return;
        }
        try {
            await deleteDoc(doc(db, "schedules", id));
            console.log("Schedule deleted successfully!");
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert(`Failed to delete schedule: ${error.message}`);
        }
    };

    // Function to populate the form for editing
    const editSchedule = (schedule) => {
        setForm(schedule);
        setIsEditing(true);
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                    📅 Schedule Manager
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
                            onKeyDown={handleKeyDown}
                            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Tutor *</option>
                            {tutors.map((tutor) => (
                                <option key={tutor} value={tutor}>{tutor}</option>
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
                        {/* Map over the schedules array and render a ScheduleCard for each */}
                        {schedules.map(schedule => (
                            <ScheduleCard 
                                key={schedule.id} 
                                schedule={schedule}
                                onEdit={editSchedule} 
                                onDelete={deleteSchedule} 
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