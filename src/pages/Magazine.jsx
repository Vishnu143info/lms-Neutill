import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Magazine = () => {
  const navigate = useNavigate();

  const [currentMagazine, setCurrentMagazine] = useState(null);
const [magazines, setMagazines] = useState([]);
  
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  /* 🔥 FETCH MAGAZINES */
  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const q = query(
          collection(db, "contents"),
          where("type", "==", "Magazine"),
          orderBy("date", "desc")
        );

        const snap = await getDocs(q);

        const magazines = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

       if (magazines.length > 0) {
  setMagazines(magazines);
  setSelectedMagazine(magazines[0]);
}

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  const otherMagazines = magazines.filter(
  mag => mag.id !== selectedMagazine?.id
);


  const onLoadSuccess = ({ numPages }) => setNumPages(numPages);

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#667eea_0%,#764ba2_50%,#6b8cff_100%)] flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent mx-auto mb-6"></div>
          <p className="text-white text-2xl font-light">Loading amazing magazines...</p>
          <p className="text-white/60 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#0f0c29_0%,#302b63_50%,#24243e_100%)] py-12 px-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header with Unique Design */}
        <div className="text-center mb-16 relative">
          <div className="inline-block relative">
            <h1 className="text-7xl font-black text-white mb-4 relative z-10">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300">
                Digital Magazine
              </span>
              <br />
              <span className="text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-green-300">
                Library
              </span>
            </h1>
            <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-[40px]"></div>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 rounded-full"></div>
          <p className="text-gray-300 text-xl mt-6 max-w-2xl mx-auto font-light">
            Discover inspiring stories and insights from our curated collection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE - Current Magazine */}
          <div className="lg:w-2/3">
            {selectedMagazine && (
              <div
  onClick={() => navigate("/subscribe")}
  className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer"
>

                {/* Magazine Title with Enhanced Styling */}
                <div className="mb-8 relative">
                  <div className="absolute -left-4 top-0 w-2 h-16 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                  <h2 className="text-4xl font-bold text-white mb-3 pl-4">
                    {selectedMagazine.name || "Featured Magazine"}
                  </h2>
                  {/* <p className="text-gray-300 text-lg pl-4 font-light">
                    {selectedMagazine.description || "Explore the latest edition of our digital magazine"}
                  </p> */}
                </div>

                {/* Cover Image with Enhanced Styling */}
                {selectedMagazine?.imageUrl ? (
                  <div className="mb-8 group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-[32px] blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    <img
                      src={selectedMagazine.imageUrl}
                      alt="Magazine Cover"
                      className="relative w-full h-[450px] object-fill rounded-[30px] shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500"
                    />
                    
                    <div className="absolute inset-0 rounded-[30px] bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                      <span className="text-white font-semibold">✨ Featured Edition</span>
                    </div>
{/* ✅ CATEGORY + DESCRIPTION BELOW IMAGE */}
<div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">

  {selectedMagazine?.category && (
    <span className="inline-block mb-3 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full">
      {selectedMagazine.category}
    </span>
  )}

  {selectedMagazine?.description && (
    <p className="text-gray-300 leading-relaxed break-words whitespace-pre-line">
      {selectedMagazine.description}
    </p>
  )}

</div>



                  </div>

                  
                ) : (
                  <div className="h-[450px] flex items-center justify-center text-gray-400 bg-white/5 rounded-[30px] border-2 border-dashed border-white/20">
  
  
                    <div className="text-center">
                      <svg className="w-20 h-20 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-white/60">No Cover Image Available</p>
                    </div>

                    
                  </div>
                  
                  
                  
                )}

<div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-left">
  <h5 className="text-white font-semibold mb-3">How it works:</h5>

  <ol className="space-y-2 text-sm text-gray-200 list-decimal list-inside">
    <li>Sign up to get your personal portal for easy access.</li>
    <li>Enjoy free access to available magazines.</li>
    <li>View all free files directly from your portal.</li>
    <li>Subscribe anytime to unlock premium content.</li>
  </ol>
</div>

                {/* Action Buttons with Enhanced Design */}
                {/* <div className="flex gap-4">
                  <button
                    onClick={() => setShowPopup(true)}
                    className="group flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Magazine
                  </button>
                  <button
                    onClick={() => window.open(selectedMagazine.previewUrl, '_blank')}
                    className="group flex-1 bg-white/10 text-white px-6 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border-2 border-white/20 flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Quick Preview
                  </button>
                </div> */}
              </div>
            )}
          </div>

          {/* RIGHT SIDE - More Magazines with Unique Design */}
          <div className="lg:w-1/3">
            <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-6 border border-white/20 shadow-2xl sticky top-4">
              
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  More Magazines
                </h3>
                <span className="text-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full font-semibold">
                  {otherMagazines.length} Available
                </span>
              </div>

              {/* Magazine List */}
              {otherMagazines.length > 0 ? (
                <div className="space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                  {otherMagazines.map((mag, index) => (
                    <div
                      key={mag.id}
                      onClick={() => setSelectedMagazine(mag)}
                      className={`group relative bg-white/5 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:bg-white/10 border-2 ${
                        selectedMagazine?.id === mag.id 
                          ? 'border-blue-400 bg-white/15 shadow-2xl' 
                          : 'border-transparent hover:border-white/30'
                      }`}
                    >
                      {/* Gradient Border on Hover */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      
                      <div className="flex gap-4 relative z-10">
                        {/* Magazine Thumbnail with Unique Shape */}
                        <div className="w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0 transform group-hover:scale-105 transition-all duration-300 shadow-xl">
                          {mag.imageUrl ? (
  <img
    src={mag.imageUrl}
    alt={mag.name}
    className="w-full h-full object-fill"
  />
) : null}



                        </div>
                        
                        {/* Magazine Info */}
                     <div className="flex-1 min-w-0">

<h4 className="text-white font-bold text-md leading-snug break-words">
  {mag.name}
</h4>

{mag.category && (
  <span className="inline-block mt-2 text-xs bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white px-3 py-1 rounded-full">
    {mag.category}
  </span>
)}

<p className="text-gray-300 text-sm mt-2 leading-relaxed line-clamp-2">
  {mag.description || "No description available"}
</p>


</div>

                      </div>

                      {/* Read More Indicator */}
                      <div className="mt-3 flex justify-end items-center gap-1 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Read more</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-6 border-2 border-white/20">
                    <svg className="w-14 h-14 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-white text-xl mb-2">No other magazines available</p>
                  <p className="text-gray-400">Check back later for more content</p>
                </div>
              )}

              {/* Enhanced Subscribe CTA */}
              <div className="mt-8 pt-6 border-t-2 border-white/20">
                <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                  <div className="relative z-10">
                    <h4 className="text-white font-bold text-xl mb-3">Get Unlimited Access</h4>
                    <p className="text-gray-200 text-sm mb-4 leading-relaxed">
                      Subscribe now to unlock all magazines and get exclusive access to premium content
                    </p>
                    <button
                      onClick={() => navigate("/subscribe")}
                      className="w-full bg-white text-gray-900 px-4 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 group"
                    >
                      View Subscription Plans
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Download Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-xl">
            <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-10 rounded-[50px] text-center max-w-md w-full mx-4 border-2 border-white/20 shadow-2xl transform animate-fadeIn relative overflow-hidden">
              
              {/* Background Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>
              
              {/* Lock Icon with Enhanced Design */}
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-24 h-24 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:rotate-6 transition-transform">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <h2 className="text-3xl font-black text-white mb-3">
                  Premium Content
                </h2>

                <p className="text-gray-300 mb-8 text-lg">
                  Sign up now to download this magazine and get access to our entire collection!
                </p>

                {/* Benefits with Icons */}
                <div className="space-y-4 mb-8 text-left bg-white/5 rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 text-gray-200">
                    <div className="bg-green-500/20 p-2 rounded-xl">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="flex-1">Unlimited magazine downloads</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-200">
                    <div className="bg-green-500/20 p-2 rounded-xl">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="flex-1">Access to all back issues</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-200">
                    <div className="bg-green-500/20 p-2 rounded-xl">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="flex-1">Exclusive subscriber content</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/signup")}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-2xl"
                  >
                    Sign Up Free
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="flex-1 bg-white/10 text-white px-6 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border-2 border-white/20"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #60a5fa, #a78bfa);
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #3b82f6, #8b5cf6);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default Magazine;