import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';


import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaUserTag, 
  FaCheckCircle,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaUserPlus
} from 'react-icons/fa';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('consumer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // For multi-step form

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const isTutor = role === 'tutor';

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      profile: {
        name,
        email,
        role
      },
      role,
      approved: !isTutor, // ✅ auto-approved for consumer
      status: isTutor ? 'pending' : 'active',
      createdAt: serverTimestamp()
    });

    if (isTutor) {
      // ⏳ Tutor waits for approval
      setWaitingApproval(true);
    } else {
      // ✅ Consumer goes directly to login
      navigate('/login');
    }

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const passwordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = passwordStrength(password);
  const getStrengthColor = (strength) => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen mt-24 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {!waitingApproval ? (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative"
            >
              {/* Glowing Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20"></div>
              
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                {/* Header */}
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,20 C20,0 40,40 60,30 C80,20 100,50 100,100 L0,100 Z" fill="white" />
                    </svg>
                  </div>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"
                  />

                  <div className="relative z-10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6"
                    >
                      <FaUserPlus className="text-white text-3xl" />
                    </motion.div>
                    
                    <h2 className="text-3xl font-bold text-white mb-3">
                      Join Our Community
                    </h2>
                    <p className="text-emerald-100/90 text-lg">
                      Create your account in seconds
                    </p>
                  </div>
                </motion.div>

                {/* Form Content */}
                <div className="p-8">
                  {/* Progress Steps */}
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            step >= num 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {num}
                          </div>
                          {num < 3 && (
                            <div className={`w-12 h-1 ${
                              step > num ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-r-lg"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaUser className="inline mr-2 text-green-500" />
                        Full Name
                      </label>
                      <div className="relative group">
                        <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors z-10" />
                        <input
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300 group-hover:border-green-300 bg-white"
                        />
                      </div>
                    </motion.div>

                    {/* Email Input */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2 text-green-500" />
                        Email Address
                      </label>
                      <div className="relative group">
                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors z-10" />
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300 group-hover:border-green-300 bg-white"
                        />
                      </div>
                    </motion.div>

                    {/* Password Input with Strength Meter */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaLock className="inline mr-2 text-green-500" />
                        Password
                      </label>
                      <div className="relative group">
                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors z-10" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-300 group-hover:border-green-300 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      
                      {/* Password Strength Meter */}
                      {password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3"
                        >
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Password Strength</span>
                            <span>{strength}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${strength}%` }}
                              className={`h-full ${getStrengthColor(strength)} transition-all duration-500`}
                            />
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {password.length < 8 && 'At least 8 characters • '}
                            {!/[A-Z]/.test(password) && 'One uppercase letter • '}
                            {!/[0-9]/.test(password) && 'One number • '}
                            {!/[^A-Za-z0-9]/.test(password) && 'One special character'}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Role Selection */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaUserTag className="inline mr-2 text-green-500" />
                        I want to join as
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRole('consumer')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            role === 'consumer'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">👤</div>
                            <div className="font-semibold">Consumer</div>
                            <div className="text-sm text-gray-600 mt-1">Find tutors & learn</div>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRole('tutor')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            role === 'tutor'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">🎓</div>
                            <div className="font-semibold">Tutor</div>
                            <div className="text-sm text-gray-600 mt-1">Teach & earn</div>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Terms Agreement */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-start space-x-3"
                    >
                      <input
                        type="checkbox"
                        required
                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <label className="text-sm text-gray-600">
                        I agree to the{' '}
                        <Link
  to="/terms"
  className="text-green-600 hover:text-green-800 font-medium"
>
  Terms of Service
</Link>{' '}
                        and{' '}
                        <Link
  to="/privacy"
  className="text-green-600 hover:text-green-800 font-medium"
>
  Privacy Policy
</Link>
                      </label>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="pt-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg ${
                          loading
                            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-xl'
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <FaUserPlus />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>

                  {/* Login Link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 pt-6 border-t border-gray-100 text-center"
                  >
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        className="text-green-600 hover:text-green-800 font-semibold transition-colors inline-flex items-center space-x-1 group"
                      >
                        <span>Sign In</span>
                        <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
                      </Link>
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl blur opacity-20"></div>
              
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center border border-white/20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-8"
                >
                  <FaCheckCircle className="text-white text-5xl" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    Account Created Successfully! 🎉
                  </h2>
                  <div className="space-y-4 text-gray-600 text-lg mb-8">
                    <p>Your account is now pending admin approval.</p>
                    <p>You'll receive an email notification once your account is approved.</p>
                    <div className="inline-flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-yellow-700">
                        Approval usually takes 24-48 hours
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300"
                  >
                    <span>Go to Login</span>
                    <FaArrowLeft className="transform rotate-180" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SignUp;