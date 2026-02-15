import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function RightUpdatesStripe() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, "posters"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const snap = await getDocs(q);
      setUpdates(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    load();
  }, []);

  return (
    <div className="w-80 sticky top-24">
      <div className="bg-white shadow-xl rounded-2xl p-6 border">
        <h3 className="font-bold text-lg mb-4">Latest Updates</h3>

        <div className="space-y-4">
          {updates.map(item => (
            <div key={item.id} className="border-b pb-3">
              <p className="font-medium">{item.title}</p>
              <span className="text-xs text-gray-400">
                {item.date || "Recent"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
