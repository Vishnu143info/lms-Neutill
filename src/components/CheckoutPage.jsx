import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Shield,
  CreditCard,
  Smartphone,
  ArrowLeft,
  Lock,
  Zap,
  Crown,
  Globe,
  BadgeCheck,
  Sparkles,
  Gift,
} from "lucide-react";
import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Animated card effect
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  /* ================= LOAD PLAN ================= */
  useEffect(() => {
    if (location.state?.plan) {
      setSelectedPlan(location.state.plan);
      localStorage.setItem(
        "selectedPlan",
        JSON.stringify(location.state.plan)
      );
    } else {
      const savedPlan = localStorage.getItem("selectedPlan");
      if (savedPlan) {
        setSelectedPlan(JSON.parse(savedPlan));
      } else {
        navigate("/subscribe");
      }
    }

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
    });
  }, [location, navigate]);

  /* ================= FORM ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter your full name");
      return false;
    }
    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address");
      return false;
    }
    if (formData.phone.length < 10) {
      alert("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  /* ================= PAYMENT ================= */
  const handlePayment = async () => {
    if (!validateForm()) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Calculate expiry
      const now = new Date();
      let expiresAt = null;

      if (selectedPlan.billing === "monthly") {
        expiresAt = new Date(now.setMonth(now.getMonth() + 1));
      } else if (selectedPlan.billing === "yearly") {
        expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));
      }

      // 🔥 SAVE SUBSCRIPTION AND USER INFO TO FIRESTORE
      await setDoc(
        doc(db, "users", user.uid),
        {
          // User profile information
          name: formData.name.trim(),  // ✅ Store name in Firestore
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          
          // Subscription details
          subscription: {
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            price: selectedPlan.price,
            currency: selectedPlan.currency || "₹",
            billing: selectedPlan.billing,
            features: selectedPlan.features,
            status: "active",
            paymentMethod,
            subscribedAt: serverTimestamp(),
            expiresAt: expiresAt ? expiresAt.toISOString() : null,
          },
          
          // User metadata
          lastUpdated: serverTimestamp(),
          profileCompleted: true,
        },
        { merge: true }
      );

      // Also update local storage
      localStorage.setItem(
        "userSubscription",
        JSON.stringify({
          planId: selectedPlan.id,
          status: "active",
          planName: selectedPlan.name,
        })
      );

      // Update user info in local storage
      const currentUserData = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...currentUserData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      }));

      // Simulate payment delay with visual feedback
      await new Promise((r) => setTimeout(r, 1500));

      navigate("/payment-success", {
  state: { 
    plan: selectedPlan, 
    planName: selectedPlan.name
  },
});
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700">Loading your checkout...</p>
        </div>
      </div>
    );
  }

  const priceText = `${selectedPlan.currency || "₹"}${selectedPlan.price}`;
  const isYearly = selectedPlan.billing === "yearly";

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto pt-16 md:pt-24 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/subscribe")}
            className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-gray-700">Back to Plans</span>
          </button>
          
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Secure Checkout</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-4">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 text-lg">
            One step away from unlocking premium features
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* PLAN SUMMARY CARD */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
              {/* Plan Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {isYearly ? (
                      <Crown className="w-8 h-8 text-amber-500" />
                    ) : (
                      <Zap className="w-8 h-8 text-blue-500" />
                    )}
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-blue-700">
                      {priceText}
                      <span className="text-sm text-gray-500 font-normal ml-2">
                        / {selectedPlan.billing}
                      </span>
                    </span>
                    {isYearly && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        Save 20%
                      </span>
                    )}
                  </div>
                </div>
                
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {selectedPlan.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl hover:from-blue-100/50 hover:to-purple-100/50 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Plan Badge */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Premium Benefits Included</p>
                    <p className="text-sm text-gray-600">Priority support • Advanced analytics</p>
                  </div>
                </div>
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group ${
                    paymentMethod === "upi"
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentMethod === "upi" ? "bg-blue-500" : "bg-gray-100"
                    }`}>
                      <Smartphone className={`w-6 h-6 ${
                        paymentMethod === "upi" ? "text-white" : "text-gray-600"
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">UPI Payment</p>
                      <p className="text-sm text-gray-600">Instant & secure</p>
                    </div>
                  </div>
                  {paymentMethod === "upi" && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group ${
                    paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentMethod === "card" ? "bg-blue-500" : "bg-gray-100"
                    }`}>
                      <CreditCard className={`w-6 h-6 ${
                        paymentMethod === "card" ? "text-white" : "text-gray-600"
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard</p>
                    </div>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CHECKOUT CARD */}
          <div className="lg:col-span-1">
            <div 
              className="sticky top-24 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-100"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
                setCardTilt({ x, y });
              }}
              onMouseLeave={() => setCardTilt({ x: 0, y: 0 })}
              style={{
                transform: `perspective(1000px) rotateX(${cardTilt.y}deg) rotateY(${-cardTilt.x}deg)`,
                transition: 'transform 0.3s ease-out',
              }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Checkout</h2>
                <p className="text-gray-600">Enter your details to proceed</p>
                <p className="text-sm text-gray-500 mt-2">
                  Your information will be saved to your account
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be saved to your profile
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50/50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Plan</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Billing</span>
                    <span className="font-medium">{selectedPlan.billing}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-700">{priceText}</p>
                        <p className="text-sm text-gray-600">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform ${
                    loading 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Lock className="w-5 h-5" />
                      Pay {priceText} Now
                    </div>
                  )}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">256-bit SSL Secured</span>
                  </div>
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>

                {/* Guarantee */}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}