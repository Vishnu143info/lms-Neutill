import React from "react";

const ALFAContent = () => {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-20 text-gray-900">
      <div className="max-w-5xl mx-auto space-y-12">

        <h1 className="text-5xl font-bold text-center text-[#081420]">🎓 ALFA: Assisted Learning Platform for All</h1>

        {/* PAGE 1 */}
        <div>
          <h2 className="text-3xl font-semibold">Page 1: Learning Reimagined</h2>
          <p className="mt-3 text-lg">
            ALFA is our AI-powered LMS designed to democratize learning. Built for students, educators, and enterprises.
          </p>

          <ul className="list-disc ml-8 mt-3 space-y-2 text-lg">
            <li>Personalized learning paths</li>
            <li>AI-driven assessments & feedback</li>
            <li>Gamified modules & certifications</li>
            <li>Multilingual content & accessibility</li>
            <li>Adaptive, engaging learning experiences</li>
          </ul>
        </div>

        {/* PAGE 2 */}
        <div>
          <h2 className="text-3xl font-semibold">Page 2: Scalable, Smart, Secure</h2>

          <ul className="list-disc ml-8 mt-3 space-y-2 text-lg">
            <li>Bulk enrollment & role-based access</li>
            <li>SCORM-compliant content</li>
            <li>AI-proctored exams & analytics</li>
            <li>Integration with HRMS, ERP, and CRM</li>
            <li>Optimized for enterprise & education workflows</li>
          </ul>
        </div>

        {/* DASHBOARD */}
        <div>
          <h2 className="text-3xl font-semibold text-[#081420]">Consumer Learning Dashboard</h2>

          <ul className="list-disc ml-8 mt-3 space-y-2 text-lg">
            <li>Student profile – name, contact, email ID</li>
            <li>Content access – PDFs, videos, live classes</li>
            <li>Schedule & calendar sync</li>
            <li>Notes making & homework completion</li>
            <li>3-window interface — Editor • Source of Truth • Bot</li>
            <li>Completion indicators + email notifications</li>
            <li>Hands-on projects</li>
            <li>Resume builder & outsourcing support</li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default ALFAContent;
