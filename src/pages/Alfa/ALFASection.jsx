import React, { useState } from "react";
import { FaDatabase, FaRobot, FaThLarge } from "react-icons/fa";
import { motion } from "framer-motion";

const ALFASection = ({ onCardClick }) => {
  const [mode, setMode] = useState("yellow");

  const modes = {
    red: {
      title: "ALFA Agent",
      sub: "AI-driven task execution",
      icon: <FaRobot className="text-red-400 text-6xl" />,
    },
    yellow: {
      title: "Work Space",
      sub: "Assisted Learning For All",
      icon: <FaThLarge className="text-yellow-300 text-6xl" />,
    },
    purple: {
      title: "Source of Truth",
      sub: "Central knowledge repository",
      icon: <FaDatabase className="text-purple-400 text-6xl" />,
    },
  };

  const active = modes[mode];
  const order = ["yellow", "purple", "red"];
  const i = order.indexOf(mode);
  const right1 = modes[order[(i + 1) % 3]];
  const right2 = modes[order[(i + 2) % 3]];

  return (
    <section className="w-full h-screen bg-[#081420] flex justify-center items-center p-4">
      <div className="w-full max-w-[1600px] h-[90vh] bg-[#0d1b2a] rounded-xl shadow-2xl pb-6">

        {/* TOP BAR */}
        <div className="h-12 bg-[#132235] rounded-t-xl flex items-center gap-3 px-4">
          <span onClick={() => setMode("red")} className="w-4 h-4 bg-red-500 rounded-full cursor-pointer" />
          <span onClick={() => setMode("yellow")} className="w-4 h-4 bg-yellow-400 rounded-full cursor-pointer" />
          <span onClick={() => setMode("purple")} className="w-4 h-4 bg-purple-500 rounded-full cursor-pointer" />
        </div>

        <div className="flex gap-6 p-6 h-[calc(100%-3rem)]">

          {/* LEFT MAIN CARD */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onCardClick}
            className="flex-[1.7] bg-[#0e1c2c] rounded-xl p-10 relative text-white border border-[#1e2f47] cursor-pointer hover:bg-[#112233] duration-300"
          >
            <h1 className="text-5xl font-bold mb-3">{active.title}</h1>
            <p className="opacity-80 mb-10">{active.sub}</p>

            {active.icon}

            <h2 className="text-2xl mt-6">{active.title}</h2>

            {/* Progress Circle */}
            <div className="absolute bottom-8 right-8 w-24 h-24 border-8 border-[#0f1520] border-l-green-400 rounded-full flex justify-center items-center">
              <span className="text-xl text-yellow-200">50%</span>
            </div>
          </motion.div>

          {/* RIGHT CARDS */}
          <div className="flex flex-col gap-6 flex-[1]">

            {[right1, right2].map((item, idx) => (
              <div
                key={idx}
                onClick={onCardClick}
                className="bg-[#0e1c2c] rounded-xl p-10 text-center text-white border border-[#1e2f47] flex-1 flex flex-col justify-center cursor-pointer hover:bg-[#112233] duration-300"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl">{item.title}</h3>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
};

export default ALFASection;
