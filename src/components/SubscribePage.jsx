import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Zap, Star, TrendingUp, Loader2, Shield, Sparkles, Award, Clock, ChevronRight, Gem, Crown, Target, Rocket } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Confetti from "react-confetti";

export default function SubscribePage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const q = query(collection(db, "subscriptionPlans"), orderBy("price", "asc"));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            currency: data.currency || "₹",
            period: data.billing === "yearly" ? "per year" : "per month",
            isPopular: data.popular || false,
            color: getPlanColor(data.name),
            iconName: getIconName(data.name),
            gradient: getGradient(data.name),
            badge: getBadge(data.name),
          };
        });
        setPlans(fetched);
        if (fetched.length > 0) {
          const defaultIndex = fetched.length === 1 ? 0 : 1;
          setSelectedPlanId(fetched[defaultIndex]?.id || fetched[0].id);
          if (fetched[defaultIndex]?.isPopular) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }
        }
      } catch (err) {
        console.error("Error:", err);
        setPlans(getFallbackPlans());
        setSelectedPlanId("premium");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getPlanColor = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("free") || lowerName.includes("starter")) 
      return "text-gray-600";
    if (lowerName.includes("pro") || lowerName.includes("premium")) 
      return "text-blue-600";
    if (lowerName.includes("platinum") || lowerName.includes("elite")) 
      return "text-amber-600";
    return "text-blue-600";
  };

  const getGradient = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("free") || lowerName.includes("starter")) 
      return "from-gray-100 via-gray-50 to-white";
    if (lowerName.includes("pro") || lowerName.includes("premium")) 
      return "from-blue-50 via-indigo-50 to-white";
    if (lowerName.includes("platinum") || lowerName.includes("elite")) 
      return "from-amber-50 via-orange-50 to-white";
    return "from-blue-50 via-indigo-50 to-white";
  };

  const getIconName = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("free") || lowerName.includes("starter")) return "Star";
    if (lowerName.includes("pro") || lowerName.includes("premium")) return "Rocket";
    if (lowerName.includes("platinum") || lowerName.includes("elite")) return "Crown";
    return "Award";
  };

  const getBadge = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("free")) return "Great Start";
    if (lowerName.includes("pro")) return "Most Value";
    if (lowerName.includes("elite")) return "Ultimate";
    return "Recommended";
  };

  const getIconComponent = (iconName) => {
    switch(iconName) {
      case "Star": return Star;
      case "Rocket": return Rocket;
      case "Crown": return Crown;
      case "Target": return Target;
      case "Gem": return Gem;
      default: return Award;
    }
  };

  const getFallbackPlans = () => {
    return [
      {
        id: "free",
        name: "Starter",
        price: 0,
        currency: "₹",
        billing: "monthly",
        period: "per month",
        features: ["Basic Dashboard Access", "Limited Learning Modules", "Community Support", "Email Support", "Basic Analytics"],
        description: "Perfect for getting started",
        color: "text-gray-600",
        gradient: "from-gray-100 via-gray-50 to-white",
        iconName: "Star",
        badge: "Great Start",
        isPopular: false,
        savings: 0,
      },
      {
        id: "premium",
        name: "Pro Learner",
        price: 799,
        currency: "₹",
        billing: "monthly",
        period: "per month",
        features: [
          "Full Dashboard Access",
          "All Learning Modules",
          "Personalized Study Schedule",
          "AI Resume Builder",
          "Priority Email & Chat Support",
          "Advanced Analytics Dashboard",
          "Certificate of Completion",
          "Progress Tracking",
        ],
        description: "Most popular choice for serious learners",
        color: "text-blue-600",
        gradient: "from-blue-50 via-indigo-50 to-white",
        iconName: "Rocket",
        badge: "Most Value",
        isPopular: true,
        savings: 299,
      },
      {
        id: "platinum",
        name: "Elite Scholar",
        price: 1499,
        currency: "₹",
        billing: "monthly",
        period: "per month",
        features: [
          "All Pro Features",
          "1-on-1 Tutor Sessions (4/month)",
          "Personalized Career Roadmap",
          "Premium Certificate Program",
          "24/7 Priority Support",
          "Advanced AI Analytics",
          "Interview Preparation",
          "Mentorship Program",
          "Early Feature Access",
          "Custom Learning Paths",
        ],
        description: "Maximum learning potential with premium support",
        color: "text-amber-600",
        gradient: "from-amber-50 via-orange-50 to-white",
        iconName: "Crown",
        badge: "Ultimate",
        isPopular: false,
        savings: 599,
      },
    ];
  };

  const handleSelectPlan = (plan) => {
    const cleanPlan = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      billing: plan.billing,
      period: plan.period,
      features: plan.features,
      description: plan.description,
      isPopular: plan.isPopular,
      color: plan.color,
      iconName: plan.iconName,
    };

    localStorage.setItem("selectedPlan", JSON.stringify(cleanPlan));
    navigate("/checkout", { state: { plan: cleanPlan } });
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <Sparkles className="w-6 h-6 text-blue-600 animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800">Loading Amazing Plans</p>
          <p className="text-sm text-gray-500 mt-1">Finding the perfect fit for you...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Enhanced Header */}
      <div className="-pt-3 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="max-w-4xl mx-auto relative mt-10">
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h1>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
            Select the perfect plan that matches your ambitions. Start with our free tier, 
            upgrade when you're ready to accelerate.
          </p>
          
          {/* Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">99%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
            
          </div> */}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="px-4 md:px-6 pb-20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = getIconComponent(plan.iconName);
              const isSelected = selectedPlanId === plan.id;
              const isHovered = hoveredPlan === plan.id;
              const priceDisplay = plan.price === 0 ? "Free" : `${plan.currency}${plan.price}`;
              const monthlyPrice = plan.billing === "yearly" ? Math.round(plan.price / 12) : plan.price;

              return (
                <div
                  key={plan.id}
                  className={`relative transition-all duration-300 ${
                    plan.isPopular ? "md:-translate-y-4" : ""
                  }`}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {/* Plan Card */}
                  <div
                    className={`relative bg-gradient-to-b ${plan.gradient} rounded-3xl p-8 transition-all duration-300 border-2 ${
                      isSelected 
                        ? "border-blue-500 shadow-2xl scale-[1.02]" 
                        : plan.isPopular 
                          ? "border-blue-400 shadow-xl" 
                          : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
                    } ${isHovered && !isSelected ? "scale-[1.01]" : ""}`}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    {/* Glow Effect for Popular Plan */}
                   {plan.isPopular && (
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl pointer-events-none"></div>
)}


                    {/* Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                        plan.isPopular 
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                          : "bg-white text-gray-700 border border-gray-200"
                      }`}>
                        {plan.badge}
                      </div>
                    </div>

                    {/* Plan Icon with Animation */}
                    <div className="relative mx-auto mb-8">
                      <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${
                        plan.isPopular 
                          ? "from-blue-500 to-purple-600" 
                          : plan.color.includes("gray") 
                            ? "from-gray-400 to-gray-600" 
                            : plan.color.includes("amber") 
                              ? "from-amber-400 to-orange-500" 
                              : "from-blue-400 to-indigo-500"
                      } flex items-center justify-center shadow-lg ${
                        isHovered ? "animate-pulse" : ""
                      }`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      {plan.isPopular && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-800 fill-yellow-800" />
                        </div>
                      )}
                    </div>

                    {/* Plan Name & Description */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
                    </div>

                    {/* Price with Animation */}
                    <div className="text-center mb-8 relative">
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-5xl font-bold text-gray-900">{priceDisplay}</span>
                        {plan.price > 0 && (
                          <span className="text-gray-500 text-lg">/{plan.billing}</span>
                        )}
                      </div>
                      
                      {plan.price > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            ≈ {plan.currency}{monthlyPrice} per month
                          </p>
                          {plan.savings > 0 && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                              <span>Save ₹{plan.savings}</span>
                              <TrendingUp className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="mb-10 space-y-4">
                      <div className="text-sm font-medium text-gray-500 mb-2">WHAT'S INCLUDED:</div>
                      {plan.features?.slice(0, 8).map((feature, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-1"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSelected || plan.isPopular
                              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.features?.length > 8 && (
                        <div className="text-center pt-2">
                          <span className="text-xs text-gray-500">+ {plan.features.length - 8} more features</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan);
                      }}
                      className={`w-full py-4 text-white rounded-xl font-bold text-sm transition-all duration-300 ${
                        plan.isPopular || isSelected
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                          : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black shadow hover:shadow-md"
                      } flex items-center justify-center gap-2`}
                    >
                      {plan.price === 0 ? (
                        <>
                          Start Free Trial
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Get {plan.name}
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ Section */}
          {/* <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "Can I switch plans later?",
                  a: "Yes! You can upgrade or downgrade your plan at any time."
                },
                {
                  q: "Is there a free trial?",
                  a: "All paid plans come with a 7-day free trial. No credit card required."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, UPI, and net banking."
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes, cancel anytime with no questions asked."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="font-semibold text-gray-900 mb-2">{item.q}</div>
                  <div className="text-sm text-gray-600">{item.a}</div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}