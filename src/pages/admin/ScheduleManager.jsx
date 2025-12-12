import React, { useState } from "react";
import { Calendar, Clock, Users, Plus, Edit2, Trash2, Video, Bell, CheckCircle } from "lucide-react";

const ScheduleCard = ({ schedule, onEdit, onDelete }) => {
  const [isAttending, setIsAttending] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-lg text-gray-800">{schedule.className}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              schedule.type === "Live" ? "bg-red-100 text-red-800" :
              schedule.type === "Recorded" ? "bg-blue-100 text-blue-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {schedule.type}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{schedule.description}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(schedule)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => onDelete(schedule.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{schedule.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{schedule.time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="text-sm">{schedule.tutor}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Bell className="w-4 h-4" />
          <span className="text-sm">{schedule.duration}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white"></div>
            ))}
            <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs">
              +12
            </div>
          </div>
          <span className="text-sm text-gray-500">Attending</span>
        </div>
        <button
          onClick={() => setIsAttending(!isAttending)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
            isAttending
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          {isAttending ? (
            <>
              <CheckCircle className="w-4 h-4 inline mr-2" />
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

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      className: "React Advanced Patterns",
      description: "Learn advanced React patterns and best practices",
      date: "2024-03-20",
      time: "14:00",
      tutor: "Alex Johnson",
      type: "Live",
      duration: "2 hours",
      attendees: 24
    },
    {
      id: 2,
      className: "JavaScript Fundamentals",
      description: "Master JavaScript basics and core concepts",
      date: "2024-03-21",
      time: "10:00",
      tutor: "Sarah Miller",
      type: "Recorded",
      duration: "1.5 hours",
      attendees: 18
    },
    {
      id: 3,
      className: "CSS Grid & Flexbox",
      description: "Modern CSS layout techniques workshop",
      date: "2024-03-22",
      time: "16:00",
      tutor: "Mike Chen",
      type: "Live",
      duration: "2.5 hours",
      attendees: 32
    }
  ]);

  const [form, setForm] = useState({
    className: "",
    description: "",
    date: "",
    time: "",
    tutor: "",
    type: "Live",
    duration: ""
  });

  const tutors = ["Alex Johnson", "Sarah Miller", "Mike Chen", "Emily Davis"];
  const classTypes = ["Live", "Recorded", "Workshop"];

  const addSchedule = () => {
    if (!form.className || !form.date || !form.time || !form.tutor) {
      alert("Please fill in all required fields");
      return;
    }
    
    const newSchedule = {
      id: Date.now(),
      ...form,
      attendees: Math.floor(Math.random() * 40) + 10
    };
    
    setSchedules([newSchedule, ...schedules]);
    setForm({
      className: "",
      description: "",
      date: "",
      time: "",
      tutor: "",
      type: "Live",
      duration: ""
    });
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const editSchedule = (schedule) => {
    setForm(schedule);
    deleteSchedule(schedule.id);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          📅 Schedule Manager
        </h1>
        <p className="text-gray-600 mt-2">Create and manage class schedules</p>
      </div>

      {/* Create New Schedule */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Create New Schedule</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Class Name *"
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={form.tutor}
            onChange={(e) => setForm({ ...form, tutor: e.target.value })}
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
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
          />
        </div>

        <button
          onClick={addSchedule}
          className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Upcoming Classes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Classes</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {schedules.length} Classes
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {schedules.filter(s => s.type === "Live").length} Live
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={editSchedule}
              onDelete={deleteSchedule}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-gray-600">Classes This Week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">48</p>
              <p className="text-gray-600">Total Attendees</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">36</p>
              <p className="text-gray-600">Total Hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}