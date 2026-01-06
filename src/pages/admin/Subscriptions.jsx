import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "../../firebase";
import { 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  ListChecks, 
  Loader2,
  Edit2,
  Trash2,
  Save,
  X,
  Star
} from "lucide-react";

export default function Subscriptions() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [plan, setPlan] = useState({
    name: "",
    price: "",
    billing: "monthly",
    features: "",
    description: "",
    popular: false,
    currency: "₹"
  });

  // Fetch existing plans
  useEffect(() => {
    const q = query(
      collection(db, "subscriptionPlans"),
      orderBy("order", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const plansArray = [];
      querySnapshot.forEach((doc) => {
        plansArray.push({ id: doc.id, ...doc.data() });
      });
      setPlans(plansArray);
    }, (error) => {
      console.error("Error fetching plans:", error);
      setError("Failed to load plans. Please refresh the page.");
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlan({ 
      ...plan, 
      [name]: type === 'checkbox' ? checked : value 
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate inputs
      if (!plan.name.trim()) {
        throw new Error("Plan name is required");
      }
      
      if (!plan.price || Number(plan.price) <= 0) {
        throw new Error("Please enter a valid price");
      }

      // Clean up features
      const featuresArray = plan.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f !== "");

      if (featuresArray.length === 0) {
        throw new Error("Please add at least one feature");
      }

      const planData = {
        name: plan.name.trim(),
        price: Number(plan.price),
        billing: plan.billing,
        features: featuresArray,
        description: plan.description?.trim() || "",
        popular: plan.popular,
        currency: plan.currency,
        updatedAt: Timestamp.now(),
        isActive: true,
        order: plan.billing === "monthly" ? 1 : plan.billing === "yearly" ? 2 : 3
      };

      if (editingId) {
        // Update existing plan
        await updateDoc(doc(db, "subscriptionPlans", editingId), planData);
        setSuccess("Plan updated successfully!");
      } else {
        // Add new plan
        planData.createdAt = Timestamp.now();
        const docRef = await addDoc(collection(db, "subscriptionPlans"), planData);
        console.log("Plan added with ID: ", docRef.id);
        setSuccess("Plan added successfully!");
      }

      // Reset form
      setPlan({
        name: "",
        price: "",
        billing: "monthly",
        features: "",
        description: "",
        popular: false,
        currency: "₹"
      });
      setEditingId(null);

      setTimeout(() => setSuccess(false), 5000);

    } catch (error) {
      console.error("Error saving plan:", error);
      setError(error.message || "Failed to save plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (planToEdit) => {
    setEditingId(planToEdit.id);
    setPlan({
      name: planToEdit.name,
      price: planToEdit.price.toString(),
      billing: planToEdit.billing,
      features: planToEdit.features.join("\n"),
      description: planToEdit.description || "",
      popular: planToEdit.popular || false,
      currency: planToEdit.currency || "₹"
    });
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await deleteDoc(doc(db, "subscriptionPlans", id));
      setSuccess("Plan deleted successfully!");
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error deleting plan:", error);
      setError("Failed to delete plan. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPlan({
      name: "",
      price: "",
      billing: "monthly",
      features: "",
      description: "",
      popular: false,
      currency: "₹"
    });
  };

  const formatPrice = (plan) => {
    return `${plan.currency}${plan.price} / ${plan.billing}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {editingId ? "Edit Subscription Plan" : "Add Subscription Plan"}
          </h1>
          <p className="text-gray-600 mt-2">
            {editingId ? "Update existing plan details" : "Create new subscription plans for your users"}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Error occurred</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6 mb-8"
        >
          {/* Plan Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Pro Learner, Elite Scholar"
              value={plan.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
          </div>

          {/* Price and Billing Cycle */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Price</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {plan.currency}
                </div>
                <input
                  type="number"
                  name="price"
                  placeholder="799"
                  value={plan.price}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Billing Cycle</span>
              </label>
              <select
                name="billing"
                value={plan.billing}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
          </div>

          {/* Currency and Popular Plan */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={plan.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              >
                <option value="₹">₹ (Rupee)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (Euro)</option>
                <option value="£">£ (Pound)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="popular"
                name="popular"
                checked={plan.popular}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <label htmlFor="popular" className="text-gray-700 font-medium">
                Mark as Popular Plan
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Short description of the plan"
              value={plan.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              <span>Features (One per line)</span>
            </label>
            <textarea
              name="features"
              rows={6}
              placeholder="Full Dashboard Access&#10;All Learning Modules&#10;Study Schedule&#10;Resume Builder&#10;Priority Support"
              value={plan.features}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter each feature on a new line. Empty lines will be ignored.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {editingId ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {editingId ? "Update Plan" : "Save Plan"}
                </>
              )}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="px-6 py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            )}
          </div>

          {/* Form Note */}
          <div className="text-center text-sm text-gray-500">
            <p>The plan will be saved to your Firestore database under "subscriptionPlans" collection.</p>
          </div>
        </form>

        {/* Existing Plans Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Existing Plans</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No subscription plans yet</h3>
              <p className="text-gray-500">Create your first plan using the form above</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((planItem) => (
                <div 
                  key={planItem.id}
                  className={`relative border rounded-xl p-5 transition-all hover:shadow-lg ${
                    planItem.popular 
                      ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Popular Badge */}
                  {planItem.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-bold">
                        <Star className="w-3 h-3" />
                        <span>POPULAR</span>
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{planItem.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(planItem)}
                        </span>
                        {planItem.popular && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                            Best Value
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(planItem)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(planItem.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {planItem.description && (
                    <p className="text-gray-600 text-sm mb-4">{planItem.description}</p>
                  )}

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {planItem.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {planItem.features.length > 4 && (
                        <li className="text-xs text-gray-500 pl-5">
                          +{planItem.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="capitalize">{planItem.billing} billing</span>
                      <span>Last updated: {planItem.updatedAt?.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Plan Preview (only when creating new) */}
       
      </div>
    </div>
  );
}