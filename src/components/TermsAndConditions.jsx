import React from "react";
import { 
  Shield, 
  FileText, 
  Lock, 
  BookOpen, 
  CreditCard, 
  AlertCircle,
  CheckCircle,
  Users,
  Calendar,
  Sparkles
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";



const TermsAndConditions = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const navigate = useNavigate();
const location = useLocation();

  const handleContactSupport = () => {
  if (location.pathname !== "/") {
    navigate("/");
    setTimeout(() => {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  } else {
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  }
};


  const termsSections = [
    {
      id: 1,
      icon: Users,
      title: "User Accounts",
      content: "Users must provide accurate and complete registration details. You are responsible for maintaining the confidentiality of your account credentials and all activities conducted under your account.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: 2,
      icon: Shield,
      title: "Platform Usage",
      content: "The Platform is intended for educational purposes only. Users must not misuse the system, upload harmful content, or violate any applicable laws or regulations.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: 3,
      icon: BookOpen,
      title: "Course Content & Intellectual Property",
      content: "All course materials, including videos, text, graphics, and assessments, are the intellectual property of the Platform or respective instructors and may not be copied or redistributed without permission.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: 4,
      icon: CreditCard,
      title: "Payments & Subscriptions",
      content: "Certain features or courses may require payment. All transactions are processed through secure third-party payment gateways. Refunds are subject to the Platform's refund policy.",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      id: 5,
      icon: AlertCircle,
      title: "Account Suspension & Termination",
      content: "The Platform reserves the right to suspend or terminate user accounts that violate these Terms or engage in abusive behavior.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      id: 6,
      icon: Lock,
      title: "Limitation of Liability",
      content: "The Platform is provided 'as is' without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Platform.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      id: 7,
      icon: FileText,
      title: "Changes to Terms",
      content: "We reserve the right to update these Terms at any time. Continued use of the Platform constitutes acceptance of the updated Terms.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    }
  ];

  const importantPoints = [
    "By accessing the Platform, you agree to these Terms",
    "Keep your account credentials secure",
    "Respect intellectual property rights",
    "Payments are processed securely",
    "Terms may be updated periodically"
  ];

  return (
    <div className="min-h-screen mt-1 bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to our Learning Management System. Please read these Terms carefully before using our Platform.
          </p>
          
          {/* Last Updated */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Introduction Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-10 border border-blue-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Agreement</h2>
              <p className="text-gray-700">
                By accessing or using this Learning Management System ("Platform"), you agree to comply with and be bound by these Terms & Conditions. 
                If you do not agree, please refrain from using the Platform.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Important Points */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Key Points to Remember
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {importantPoints.map((point, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-800">{point}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Terms Sections */}
        <div className="space-y-8">
          {termsSections.map((section) => {
            const Icon = section.icon;
            return (
              <div 
                key={section.id}
                className={`group relative ${section.bgColor} border ${section.borderColor} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Section number badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                  <span className="font-bold text-gray-700">{section.id}</span>
                </div>
                
                {/* Content */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className={`p-3 ${section.bgColor} rounded-xl border ${section.borderColor}`}>
                        <Icon className={`w-8 h-8 ${section.color}`} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  
                  <div className="md:w-3/4">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                </div>
                
                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 ${section.borderColor} border-t border-r rounded-tr-2xl opacity-20`}></div>
              </div>
            );
          })}
        </div>

        {/* Contact & Support Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms & Conditions, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
             <button
  onClick={handleContactSupport}
  className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
>
  Contact Support
</button>

           
            </div>
          </div>
          
        
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            By continuing to use this Platform, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms & Conditions.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
            <span>© {new Date().getFullYear()} Learning Management System</span>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;