import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaLightbulb, FaUsers, FaBrain, FaRocket, FaStar } from "react-icons/fa";
import "../styles/Home.css"

import { useInView } from "framer-motion";
import { useRef } from "react";




const CARDS = [
  {
    Icon: FaLightbulb,
    title: "Innovation Into Impact",
    description:
      "Neutill Services Private Limited transforms emerging technologies into intelligent, real‑world solutions that create measurable impact.",
    gradient: "from-blue-600 to-cyan-400",
    glow: "rgba(37,99,235,0.35)",
    stars: 3,
  },
  {
    Icon: FaUsers,
    title: "Collaboration for Progress",
    description:
      "We collaborate with students, professionals, universities, startups, and enterprises to build a strong innovation ecosystem.",
    gradient: "from-violet-500 to-fuchsia-400",
    glow: "rgba(139,92,246,0.35)",
    stars: 4,
  },
  {
    Icon: FaBrain,
    title: "Research‑Driven Culture",
    description:
      "Our research‑focused approach promotes continuous learning and drives transformative outcomes for individuals and organizations.",
    gradient: "from-sky-400 to-emerald-300",
    glow: "rgba(56,189,248,0.35)",
    stars: 5,
  },
  {
    Icon: FaRocket,
    title: "Empowering the AI Future",
    description:
      "We equip talent and technology to lead the next generation of responsible, intelligent AI innovation.",
    gradient: "from-pink-500 to-orange-400",
    glow: "rgba(236,72,153,0.35)",
    stars: 4,
  },
];

/* ---------------- Animations ---------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};


const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, type: "spring", stiffness: 90 },
  },
};

const hoverAnimation = {
  y: -12,
  scale: 1.02,
  transition: { type: "spring", stiffness: 300, damping: 18 },
};

/* ---------------- Subcomponents ---------------- */

function FloatingStars({ count }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          aria-hidden
          animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity }}
          className="absolute text-amber-400 text-[10px]"
          style={{
            top: `${20 + i * 12}%`,
            left: `${10 + i * 15}%`,
          }}
        >
          <FaStar />
        </motion.span>
      ))}
    </div>
  );
}

function Card({ item, reduceMotion }) {
  const { Icon, title, description, gradient, glow, stars } = item;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={reduceMotion ? {} : hoverAnimation}
      className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all"
      style={{ boxShadow: `0 10px 25px ${glow}` }}
    >
      <FloatingStars count={stars} />

      <div
        className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
      >
        <Icon size={28} />
      </div>

      <h3 className={`text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {title}
      </h3>

      <p className="mt-4 text-slate-600 leading-relaxed">{description}</p>
    </motion.article>
  );
}

/* ---------------- Main Component ---------------- */

export default function WhatWeDo() {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
const isInView = useInView(ref, { amount: 0.3 });

  return (
   <section className="relative overflow-hidden pt-1 pb-12 px-6">


      {/* Background floating dots */}
      <div className="absolute inset-0 -z-10 opacity-30">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            animate={
              reduceMotion
                ? {}
                : { y: [0, -25, 0], x: [0, 10, 0], rotate: [0, 180, 360] }
            }
            transition={{ duration: 10 + i, repeat: Infinity }}
            className="absolute h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

  <motion.div
  ref={ref}
  variants={containerVariants}
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
  className="mx-auto max-w-6xl"
>

        {/* Header */}
        <header className="mb-3 text-center">
          <h2 className="section-title-platform">What We Do</h2>
          <p className="mx-auto -mt-8 max-w-2xl text-lg text-slate-600">
            Transforming ideas into impactful solutions through innovation,
            collaboration, and advanced technology.
          </p>
        </header>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {CARDS.map((item, i) => (
            <Card key={i} item={item} reduceMotion={reduceMotion} />
          ))}
        </div>

        {/* Footer Icon */}
        <div className="mt-12 flex justify-center">
          <motion.div
            animate={reduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500 bg-clip-text text-3xl text-transparent"
          >
            <FaStar />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
