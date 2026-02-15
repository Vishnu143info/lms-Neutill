import React, { useState } from "react";
import { motion } from "framer-motion";

import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import {
  FaMapMarkerAlt,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { SiX } from "react-icons/si"; // 🖤 Import X (Twitter rebrand) icon

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
   await addDoc(collection(db, "contacts"), {
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  message: formData.message,
  receivedBy: "askneutill@gmail.com", // ← added
  createdAt: serverTimestamp(),
});

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    setShowPopup(true); // ⭐ show popup
  } catch (error) {
    console.error(error);
  }
};



  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      style={{
        background: "linear-gradient(180deg, #10182A 0%, #0E1627 100%);",
    
       
    
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <h2 className="contact-title-magical"
        
      >
        Get in Touch
      </h2>

      {/* Main Contact Container */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
          maxWidth: "1200px",
          width: "100%",
          

        }}
      >
        {/* LEFT SIDE — Map + Office Info */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{
            flex: "1 1 500px",
            background: "#fff",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            minHeight: "550px",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#001f3f" }}>
            We'd love to hear from you!
          </h2>
          <p style={{ color: "#555", marginBottom: "20px" }}>
            Please let us know what you are looking for and we will get in touch
            with you.
          </p>
          <hr style={{ border: "none", borderTop: "1px solid #ddd", marginBottom: "20px" }} />

          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <FaMapMarkerAlt size={22} color="#e63946" style={{ marginRight: "10px" }} />
            <h4 style={{ fontSize: "1.1rem", color: "#001f3f" }}>Office Location</h4>
          </div>
          <p style={{ color: "#333", marginBottom: "20px" }}>
            34/49, 3rd Cross, Muthurayaswami Layout, Sunkadakatte, Bangalore-560091
          </p>

          {/* Google Map */}
          <div
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
          <iframe
  title="Office Location"
  src="https://www.google.com/maps?q=12.990944,77.506500&z=15&output=embed"
  width="100%"
  height="300"
  style={{ border: 0 }}
  loading="lazy"
></iframe>

          </div>
        </motion.div>

        {/* RIGHT SIDE — Contact Form */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{
            flex: "1 1 500px",
            background: "#fff",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            minHeight: "550px",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label style={{ fontWeight: "600", color: "#001f3f" }}>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: "600", color: "#001f3f" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: "600", color: "#001f3f" }}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
              <small style={{ color: "#888" }}>Enter 10 digit mobile number</small>
            </div>

            <div>
              <label style={{ fontWeight: "600", color: "#001f3f" }}>Message</label>
              <textarea
                name="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  resize: "none",
                }}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: "#e63946",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>

    {showPopup && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    }}
  >
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "16px",
        textAlign: "center",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ color: "#001f3f" }}>✅ Message Sent!</h2>
      <p style={{ color: "#555", marginTop: "10px" }}>
        Thank you for contacting us. We’ll get back to you soon.
      </p>

      <button
        onClick={() => setShowPopup(false)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#e63946",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Close
      </button>
    </motion.div>
  </motion.div>
)}


      
    </motion.section>
  );
};

export default ContactUs;
