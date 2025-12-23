import React, { useState } from "react";

// Import PDF
import ShaktiF from "../assets/Blog1.pdf";

// Import Images
import Banner1 from "../assets/banner1fortm.jpeg";
import Banner2 from "../assets/banner2fortm.jpeg";

const BlogPage = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  const articles = [
    {
      title: "Shakti: The Journey of Empowerment",
      description: "Explore the transformative journey of empowerment through technology and skill development initiatives.",
      type: "PDF Download",
      isNew: true,
      color: "from-blue-600 to-indigo-700",
      readTime: "5 min read",
      category: "Technology & Empowerment",
      date: "Dec 15, 2024",
      icon: "📘",
      author: "Tech Manthana Team",
      authorRole: "Research & Development"
    },
    {
      title: "Future of Remote Work in Tech",
      description: "How distributed teams are reshaping the technology industry landscape with advanced collaboration tools.",
      type: "Coming Soon",
      isNew: false,
      color: "from-emerald-600 to-teal-700",
      readTime: "8 min read",
      category: "Future of Work",
      date: "Jan 2025",
      icon: "🚀",
      author: "Industry Experts",
      authorRole: "Remote Work Specialists"
    },
    {
      title: "AI in Skill Development",
      description: "Revolutionizing how we learn and upskill in the digital age with personalized AI-powered learning paths.",
      type: "Coming Soon",
      isNew: true,
      color: "from-purple-600 to-pink-700",
      readTime: "7 min read",
      category: "AI & Education",
      date: "Jan 2025",
      icon: "🤖",
      author: "AI Research Team",
      authorRole: "Machine Learning"
    },
  ];

  const topics = [
    { name: "Artificial Intelligence", count: 24, icon: "🤖" },
    { name: "Web Development", count: 18, icon: "🌐" },
    { name: "Data Science", count: 32, icon: "📊" },
    { name: "Cloud Computing", count: 22, icon: "☁️" },
    { name: "Cybersecurity", count: 16, icon: "🔒" },
    { name: "DevOps", count: 14, icon: "⚙️" },
    { name: "UI/UX Design", count: 19, icon: "🎨" },
    { name: "Blockchain", count: 11, icon: "⛓️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/30 py-12 px-4 mt-20 sm:px-6 lg:px-8">
      {/* Professional Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-100/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ================= HERO SECTION WITH LEFT IMAGE ================= */}
        <div className="mb-20 relative group">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Image */}
              <div className="relative h-full min-h-[500px]">
                <img
                  src={Banner1}
                  alt="Tech Manthana Upskilling Platform"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium">Live Platform</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3">Transform Your Career Path</h2>
                  <p className="text-gray-200">Interactive learning with real-world projects</p>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="p-12 lg:p-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-lg mx-auto">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-blue-600 tracking-wider">WELCOME TO TECH MANTHANA</span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tech Journey</span> With Expert Insights
                  </h1>
                  
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Discover cutting-edge technology trends, career development strategies, and innovative learning approaches through our curated content library.
                  </p>
                  
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">Industry-leading research papers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                      <span className="text-gray-700">Practical skill development guides</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-gray-700">Expert interviews and case studies</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      Explore Content
                    </button>
                    <button className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                      Watch Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CAREER ROADMAP SECTION WITH LEFT CONTENT ================= */}
        <div className="mb-20 relative group">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Content */}
              <div className="p-12 lg:p-16 bg-gradient-to-br from-white to-blue-50/50 order-2 lg:order-1">
                <div className="max-w-lg mx-auto">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🚀</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 tracking-wider">CAREER DEVELOPMENT</span>
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Growth Roadmap</span> to Success
                  </h2>
                  
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Navigate your professional journey with our structured career pathways, skill assessments, and personalized growth recommendations.
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    {[
                      { icon: "🎯", title: "Skill Assessment", desc: "Identify your strengths and areas for improvement" },
                      { icon: "📈", title: "Learning Path", desc: "Structured courses and practical projects" },
                      { icon: "🤝", title: "Mentorship", desc: "Guidance from industry experts" },
                      { icon: "🏆", title: "Achievement", desc: "Certifications and portfolio building" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{item.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    Explore Career Pathways
                  </button>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="relative h-full min-h-[500px] order-1 lg:order-2">
                <img
                  src={Banner2}
                  alt="Tech Manthana Career Growth Roadmap"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-emerald-900/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <span className="text-sm font-medium">Interactive Dashboard</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Track Your Progress</h3>
                  <p className="text-gray-200">Visual analytics and milestone tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FEATURED ARTICLES ================= */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
              </div>
              <p className="text-gray-600">Curated insights from industry leaders and innovators</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold px-5 py-2.5 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
              View All Articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Article Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${article.color} flex items-center justify-center text-white font-bold`}>
                        {article.icon}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">{article.category}</span>
                        <div className="text-sm text-gray-400">{article.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {article.isNew && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {article.description}
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                      TM
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{article.author}</div>
                      <div className="text-xs text-gray-500">{article.authorRole}</div>
                    </div>
                  </div>
                </div>
                
                {/* Article Footer */}
                <div className="p-6 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    {article.type === "PDF Download" ? (
                      <button
                        onClick={() => window.open(ShaktiF, "_blank")}
                        className="group/btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 group-hover/btn:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download PDF</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-100 text-gray-400 font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Coming Soon</span>
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 md:hidden">
            <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold px-6 py-3 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300">
              View All Articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ================= POPULAR TOPICS ================= */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-10">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Explore Popular Topics</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">Browse our most discussed technology categories and trending subjects</p>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {topics.map((topic, index) => (
                <div 
                  key={index}
                  className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200/50 hover:border-blue-200 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {topic.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{topic.name}</h4>
                  <div className="text-sm text-gray-500 bg-gray-100 group-hover:bg-blue-50 px-3 py-1 rounded-full inline-block transition-colors">
                    {topic.count} articles
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= STATISTICS SECTION ================= */}
        {/* <div className="mb-20">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
            <div className="relative z-10 p-12 md:p-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Thousands</span> of Professionals
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Join our growing community of tech enthusiasts, learners, and industry experts
                </p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { value: "50K+", label: "Monthly Readers", color: "text-blue-400", icon: "👥" },
                  { value: "200+", label: "Expert Authors", color: "text-emerald-400", icon: "✍️" },
                  { value: "1M+", label: "Downloads", color: "text-purple-400", icon: "📥" },
                  { value: "4.9★", label: "User Rating", color: "text-amber-400", icon: "⭐" }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className={`text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-300 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        {/* ================= NEWSLETTER ================= */}
        <div className="mb-20">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative z-10 p-10 md:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Stay Ahead with Our Newsletter
                  </h3>
                  
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Get weekly insights, industry reports, and exclusive content delivered directly to your inbox. Be the first to know about new articles, webinars, and career opportunities.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      "Weekly tech trend analysis",
                      "Exclusive webinar invites",
                      "Early access to new content",
                      "Career opportunity alerts"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-200/50 p-8 shadow-lg">
                  {isSubscribed ? (
                    <div className="text-center py-10">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">Welcome Aboard! 🎉</h4>
                      <p className="text-gray-600">
                        Thank you for subscribing. Check your email for verification and welcome resources.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xl font-bold text-gray-900 mb-6">Start Your Journey</h4>
                      <form onSubmit={handleSubscribe} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Professional Interest
                          </label>
                          <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none">
                            <option>Software Development</option>
                            <option>Data Science</option>
                            <option>Cloud Computing</option>
                            <option>Cybersecurity</option>
                            <option>UI/UX Design</option>
                            <option>DevOps</option>
                          </select>
                        </div>
                        
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                        >
                          Subscribe Now
                        </button>
                      </form>
                      
                      <p className="text-gray-500 text-sm text-center mt-6">
                        No spam. Unsubscribe anytime with one click.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="text-center pt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">TM</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Tech Manthana Blog</span>
                <p className="text-sm text-gray-500">Empowering Tech Professionals</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Articles</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Authors</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Categories</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
            </div>
            
            <div className="flex items-center gap-4">
              {['twitter', 'linkedin', 'github'].map((platform) => (
                <a key={platform} href="#" className="w-10 h-10 rounded-full border border-gray-300 hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-300">
                  <span className="sr-only">{platform}</span>
                </a>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Tech Manthana Blog. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Empowering the next generation of tech innovators through knowledge sharing and skill development
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;