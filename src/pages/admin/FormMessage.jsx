import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Search, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FormMessages() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMsg, setViewMsg] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, snap => {
      setMessages(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // select row
  const toggleSelect = (msg) => {
    setSelected(prev =>
      prev.find(x => x.id === msg.id)
        ? prev.filter(x => x.id !== msg.id)
        : [...prev, msg]
    );
  };

  const isSelected = id => selected.some(x => x.id === id);

  // filter search
  const filtered = messages.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  // pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  // send mail
  const sendMail = (users) => {
    navigate("/dashboard/admin/send-mail", {
      state: { users }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Enquiry Messages
          </h1>
          <p className="text-gray-600 mt-1">
            Manage contact form enquiries
          </p>
        </div>

        <button
          onClick={() => {
            setSearch("");
            setPage(1);
          }}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Reset
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="relative">
          <Search className="absolute top-3 left-3 text-gray-400" size={18}/>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* BULK BAR */}
      {selected.length > 0 && (
        <div className="mb-4 flex justify-between items-center bg-blue-50 border border-blue-200 rounded-xl p-4">
          <span className="text-blue-700 font-medium">
            {selected.length} selected
          </span>

          <button
            onClick={() => sendMail(selected)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            <Mail size={16}/>
            Send Mail
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selected.length === current.length && current.length > 0}
                  onChange={e =>
                    setSelected(e.target.checked ? current : [])
                  }
                />
              </th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Message</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {current.length > 0 ? (
                current.map(msg => (
                  <motion.tr
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected(msg.id)}
                        onChange={() => toggleSelect(msg)}
                      />
                    </td>

                    <td className="p-4">
                      <p className="font-semibold">{msg.name}</p>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                    </td>

                    <td className="p-4">{msg.phone}</td>

                    <td className="p-4 max-w-xs truncate">
                      {msg.message}
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {msg.createdAt?.toDate().toLocaleString() || "Now"}
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => setViewMsg(msg)}
                        className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                      >
                        View
                      </button>

                      <button
                        onClick={() => sendMail([msg])}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                      >
                        <Mail size={18}/>
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-10">
                    <AlertCircle className="mx-auto mb-3 text-gray-400"/>
                    <p>No messages found</p>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
     <AnimatePresence>
  {viewMsg && (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full h-[80vh] flex flex-col relative"
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        transition={{ duration: 0.25 }}
      >

        {/* HEADER */}
        <div className="flex justify-between items-start border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {viewMsg.name}
            </h2>
            <p className="text-sm text-gray-500">{viewMsg.email}</p>
          </div>

          <button
            onClick={() => setViewMsg(null)}
            className="text-gray-400 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              <span className="font-semibold text-gray-700">Phone:</span><br/>
              {viewMsg.phone}
            </p>

            <p>
              <span className="font-semibold text-gray-700">Date:</span><br/>
              {viewMsg.createdAt?.toDate().toLocaleString()}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-2 text-lg">
              Message
            </p>

            <div className="bg-gray-50 border rounded-xl p-4 text-gray-700 whitespace-pre-line break-words leading-relaxed">
              {viewMsg.message}
            </div>
          </div>

        </div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
