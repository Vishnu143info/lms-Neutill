import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TechManthana.css";
import Img1 from "../assets/Banner1.jpeg";
import Img2 from "../assets/Banner2.jpeg";

const Techmanthana = () => {
  const navigate = useNavigate();

  const handlePageClick = () => {
    // Navigate to the tech-manthana/blog page
    navigate("/tech-manthana/blog");
  };

  return (
    <div className="tech-container" onClick={handlePageClick}>
      {/* Top Banner */}
      <div className="text-center mb-12 md:mb-16 relative px-4">
  <div className="inline-block relative">
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 relative z-10 mt-10">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300">
        Digital Magazine
      </span>
      <br />
      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-green-300">
        Tech Manthana

      </span>
    </h1>

    <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-[40px]"></div>
  </div>

  <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 rounded-full"></div>

  <p className="text-gray-300 text-base sm:text-lg md:text-xl mt-6 max-w-2xl mx-auto font-light">
    Discover inspiring stories and insights from our curated collection
  </p>
</div>



      {/* Bottom Images Section */}
      <div className="tech-content flex flex-col md:flex-row items-center">

        <div className="tech-card">
          <img
            src={Img1}
            alt="Daily Upskilling Dosage"
          />
        </div>

        <div className="tech-card">
          <img
            src={Img2}
            alt="Career Growth Roadmap"
          />
        </div>
      </div>
    </div>
  );
};

export default Techmanthana;