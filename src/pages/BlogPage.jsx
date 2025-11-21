import React from "react";
import "../styles/TechManthana.css";

// Import the PDF
import ShaktiF from "../assets/Blog1.pdf";

const BlogPage = () => {
  return (
    <div className="blog-page-container">
      <h1 className="blog-page-title">Tech Manthana Blog</h1>

      <p className="blog-page-content">
        Welcome to the Tech Manthana Blog — a space where we share insights,
        ideas, stories, and updates from our upskilling and outsourcing initiatives.
      </p>

      {/* Blog Buttons */}
      <div className="blog-buttons">
        <button
          className="blog-button"
          onClick={() => window.open(ShaktiF, "_blank")}
        >
          Blog 1 – Shakti: The Journey of Empowerment (PDF)
        </button>
      </div>

      <p className="blog-page-content">More blog articles are coming soon!</p>
    </div>
  );
};

export default BlogPage;
