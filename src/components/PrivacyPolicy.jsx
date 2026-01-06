import React from "react";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Cookie, 
  Users,
  Bell,
  Download,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles,
  UserCheck
} from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const policySections = [
    {
      id: 1,
      icon: Database,
      title: "Information We Collect",
      content: "We may collect personal information such as name, email address, contact details, payment information, and learning activity data to provide you with the best possible learning experience.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      examples: ["Name & Email", "Contact Details", "Payment Info", "Learning Activity"]
    },
    {
      id: 2,
      icon: Users,
      title: "How We Use Your Information",
      content: "Your information is used to provide access to courses, manage subscriptions, personalize learning experiences, process payments, and continuously improve our services.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      examples: ["Course Access", "Personalization", "Payment Processing", "Service Improvement"]
    },
    {
      id: 3,
      icon: Shield,
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, or misuse through encryption, secure servers, and regular security audits.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      examples: ["Encryption", "Secure Servers", "Regular Audits", "Access Controls"]
    },
    {
      id: 4,
      icon: Eye,
      title: "Third-Party Services",
      content: "We may use trusted third-party services (such as payment gateways and analytics providers) to operate the Platform. These providers are contractually obligated to protect your data.",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      examples: ["Payment Gateways", "Analytics", "Hosting Services", "Email Providers"]
    },
    {
      id: 5,
      icon: Cookie,
      title: "Cookies & Tracking",
      content: "We use cookies and similar technologies to enhance user experience, analyze platform usage, and improve functionality. You can control cookie preferences through your browser settings.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      examples: ["Essential Cookies", "Analytics", "Preferences", "Functionality"]
    },
    {
      id: 6,
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, update, or request deletion of your personal information. You may also opt out of certain communications and control your data preferences.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      examples: ["Access Data", "Update Info", "Request Deletion", "Opt-Out"]
    },
    {
      id: 7,
      icon: Bell,
      title: "Policy Updates",
      content: "This Privacy Policy may be updated periodically. We'll notify you of significant changes, and continued use of the Platform signifies acceptance of the revised policy.",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      examples: ["Email Notifications", "In-Platform Alerts", "Date Stamps", "Change Logs"]
    }
  ];

  const dataProtectionPrinciples = [
    { icon: Lock, text: "Data Minimization", desc: "We only collect what's necessary" },
    { icon: Shield, text: "Purpose Limitation", desc: "Data used only for specified purposes" },
    { icon: Eye, text: "Transparency", desc: "Clear communication about data use" },
    { icon: Users, text: "User Control", desc: "You control your data" },
    { icon: CheckCircle, text: "Accountability", desc: "We take responsibility for your data" }
  ];

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your privacy is our priority. This policy explains how we protect and handle your personal information.
          </p>
          
          {/* Last Updated Badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Last updated: {lastUpdated}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Introduction Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border border-blue-100 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="lg:w-1/3">
              <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-900">Important Notice</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Our Commitment to Your Privacy
              </h2>
              <p className="text-gray-700">
                This Privacy Policy explains how we collect, use, and protect your personal information when you use our Learning Management System ("Platform").
              </p>
            </div>
            
            <div className="lg:w-2/3 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Key Principles We Follow
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {dataProtectionPrinciples.map((principle, index) => {
                  const Icon = principle.icon;
                  return (
                    <div 
                      key={index}
                      className="text-center p-4 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-100 hover:border-blue-200 transition-colors duration-300"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-3">
                        <Icon className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{principle.text}</h4>
                      <p className="text-xs text-gray-600">{principle.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Policy Sections */}
        <div className="space-y-8 mb-16">
          {policySections.map((section) => {
            const Icon = section.icon;
            return (
              <div 
                key={section.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200"
              >
                {/* Section Header */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Icon & Title */}
                    <div className="lg:w-1/3">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 ${section.bgColor} rounded-xl border ${section.borderColor} shadow-sm`}>
                          <Icon className={`w-8 h-8 ${section.color}`} />
                        </div>
                        <div>
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full mb-1">
                            {section.id}
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {section.title}
                          </h2>
                        </div>
                      </div>
                      
                      {/* Examples Tags */}
                      <div className="flex flex-wrap gap-2">
                        {section.examples.map((example, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full ${section.bgColor} ${section.color} border ${section.borderColor}`}
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Right Column - Content */}
                    <div className="lg:w-2/3">
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {section.content}
                      </p>
                      
                      {/* Additional Info */}
                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Why This Matters</h4>
                            <p className="text-gray-600 text-sm">
                              This ensures we maintain the highest standards of data protection while providing you with a seamless learning experience.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100 mb-6">
            <Lock className="w-4 h-4 text-blue-500" />
            <p className="text-gray-700 text-sm font-medium">
              We never sell your personal data to third parties
            </p>
          </div>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            By continuing to use this Platform, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <span>© {new Date().getFullYear()} Learning Management System</span>
            <span className="hidden sm:inline">•</span>
            <span>Version 2.1</span>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Data Processing Agreement</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">DPO Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;