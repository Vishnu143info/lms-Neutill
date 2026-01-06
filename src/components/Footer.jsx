import React from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUpRight,
  Users,
  Globe,
  Shield,
  Building,
  Clock,
  X
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
const location = useLocation();

const handleQuickLink = (link) => {
  if (link.type === "scroll") {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(link.to)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document
        .getElementById(link.to)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  } else {
    navigate(link.to);
  }
};

  /* ---------- DATA ---------- */
const quickLinks = [
  { name: "Home", type: "scroll", to: "hero" },
  { name: "What We Do", type: "scroll", to: "whatwedo" },
  { name: "Services", type: "scroll", to: "services" },
  { name: "Industries", type: "scroll", to: "industries" },
  { name: "Contact", type: "scroll", to: "contact" },

  // ✅ Legal Pages
  { name: "Terms & Conditions", type: "route", to: "/terms" },
  { name: "Privacy Policy", type: "route", to: "/privacy" }
];



  // ✅ 9 SERVICES
  const services = [
    "Cloud Consulting",
    "AI & Machine Learning",
    "Generative AI",
    "Internet of Things",
    "ALFA Platform",
    "Supply Chain & Logistics",
    "Upskilling & Outsourcing",
    "Content Management",
    "Research & Development"
  ];

  // ✅ 6 INDUSTRIES
  const industries = [
    "Information Technology",
    "Education",
    "Finance & Banking",
    "Health Care",
    "Agriculture",
    "Defence"
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
   { icon: FaXTwitter, href: "#", label: "X" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "askneutill@gmail.com",
      href: "mailto:askneutill@gmail.com",
      desc: "Email Support"
    },
    {
      icon: Phone,
      text: "+91 93531 11818",
      href: "tel:+919353111818",
      desc: "Phone Support"
    },
    {
      icon: Building,
      text: " 34/49, 3rd Cross, Muthurayaswami Layout, Sunkadakatte, Bangalore-560091",
      href: "#",
      desc: "Global Offices"
    },
    {
      icon: Clock,
      text: "Mon – Fri : 9AM – 6PM",
      href: "#",
      desc: "Business Hours"
    }
  ];

  /* ---------- HELPERS ---------- */

  const toSlug = (text) =>
    text
      .toLowerCase()
      .replace(/&/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  /* ---------- UI ---------- */

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

          {/* COMPANY */}
          <div className="lg:col-span-3 space-y-5">
          
<div className="">
  {/* Logo */}
 

  {/* Brand Content */}
  <div className="items-center -mt-5">
     <img
    src={logo}
    alt="Neutill Services Logo"
    className="h-30 w-auto object-contain"
  />
   <p className="text-sm text-gray-400">
  Technology • Innovation • Growth
</p>
<p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
  Building modern digital experiences and technology platforms that
  transform ideas into impactful, scalable products for tomorrow’s
  businesses.
</p>

  </div>
</div>

            
          </div>

          {/* QUICK LINKS */}
         <div className="lg:col-span-2">
  <h3 className="text-lg font-bold text-white mb-5 flex items-center">
    <ArrowUpRight className="w-5 h-5 text-blue-400 mr-2" />
    Quick Links
  </h3>

  <div className="space-y-3">
    {quickLinks.map((link, i) => (
      <button
        key={i}
        onClick={() => handleQuickLink(link)}
        className="block text-left w-full text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all"
      >
        {link.name}
      </button>
    ))}
  </div>
</div>


          {/* SERVICES */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Services
            </h3>
            <div className="space-y-3">
              {services.map((service, i) => (
                <Link
                  key={i}
                  to={`/services/${toSlug(service)}`}
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {service}
                </Link>
              ))}
            </div>
          </div>

          {/* INDUSTRIES */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Industries
            </h3>
            <div className="space-y-3">
              {industries.map((industry, i) => (
                <Link
                  key={i}
                  to={`/industries/${toSlug(industry)}`}
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {industry}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-5">Contact</h3>
            <div className="space-y-4">
              {contactInfo.map((info, i) => (
                <a
                  key={i}
                  href={info.href}
                  className="flex items-start gap-3 group"
                >
                  <info.icon className="w-4 h-4 text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-300 group-hover:text-white">
                      {info.text}
                    </p>
                    <p className="text-xs text-gray-500">{info.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800 pt-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400">
            © {currentYear}{" "}
            <span className="text-white font-semibold">
              Neutill Services
            </span>. All Rights Reserved.
          </p>

          <div className="flex gap-4">
            {socialLinks.map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                >
                  <Icon className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
              );
            })}
          </div>

         
        </div>
        

        <p className="text-xs text-gray-600 text-center mt-6 mb-10 flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> by Innomatrics Tech
        </p>
      </div>
    </footer>
  );
};

export default Footer;
