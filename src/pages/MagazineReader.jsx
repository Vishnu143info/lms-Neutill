import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiBookmark, FiMoon, FiSun } from "react-icons/fi";

export default function MagazineReader() {
  const { state } = useLocation();
  const article = state?.poster;

  const [progress, setProgress] = useState(0);
  const [dark, setDark] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (window.scrollY / total) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!article)
    return <div className="text-center py-20 text-gray-500">No article found</div>;

  return (
    <div className={dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>

      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-cyan-500 z-50"
        style={{ width: `${progress}%` }}
      />

      {/* Header */}
      <div className="sticky top-0 backdrop-blur bg-white/70 border-b z-40">
        <div className="max-w-4xl mx-auto flex justify-between px-6 py-3">

          <span className="font-bold">Tech Manthana</span>

          <div className="flex gap-4 items-center">
            <button onClick={() => setSaved(!saved)}>
              <FiBookmark className={saved ? "text-cyan-500" : ""}/>
            </button>

            <button onClick={() => setDark(!dark)}>
              {dark ? <FiSun /> : <FiMoon />}
            </button>
          </div>

        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-extrabold mb-6">
          {article.title}
        </h1>

        {article.fileUrl && (
          <img
            src={article.fileUrl}
            alt={article.title}
            className="rounded-2xl mb-10 shadow-xl"
          />
        )}

        <div className="leading-relaxed whitespace-pre-line text-lg">
          {article.description || article.excerpt}
        </div>

      </article>
    </div>
  );
}
