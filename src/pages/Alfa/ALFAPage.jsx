import React, { useState } from "react";
import ALFASection from "./ALFASection";
import ALFAContent from "./ALFAContent";

const ALFAPage = () => {
  const [page, setPage] = useState("home");

  return (
    <div className="w-full min-h-screen bg-[#081420]">

      {/* Top Navigation */}
      <nav className="w-full bg-[#0d1b2a] text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">ALFA</h1>

        <div className="flex gap-6 text-lg">
          <button
            className={`${page === "home" ? "text-yellow-400" : "text-white"} hover:text-yellow-300`}
            onClick={() => setPage("home")}
          >
            Home
          </button>

          <button
            className={`${page === "about" ? "text-yellow-400" : "text-white"} hover:text-yellow-300`}
            onClick={() => setPage("about")}
          >
            About ALFA
          </button>
        </div>
      </nav>

      {/* Page Switching */}
      {page === "home" && <ALFASection onAbout={() => setPage("about")} />}
      {page === "about" && <ALFAContent />}
    </div>
  );
};

export default ALFAPage;
