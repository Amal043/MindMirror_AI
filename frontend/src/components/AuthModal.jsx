import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * AuthModal Component
 * Interactive Sensory-Calm Login & Signup Modal connected to MongoDB Atlas!
 */
export const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser } = useSensory();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password || (!isLoginTab && !name)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLoginTab ? '/api/auth/login' : '/api/auth/signup';
      const bodyPayload = isLoginTab 
        ? { email, password } 
        : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      // Store Auth token & User state
      if (data.token && data.user) {
        loginUser(data.user, data.token);
        setSuccessMessage(isLoginTab ? `Welcome back, ${data.user.name}! 🌸` : `Account created! Welcome, ${data.user.name}! 🌱`);
        
        setTimeout(() => {
          setIsLoading(false);
          onClose();
        }, 1200);
      }

    } catch (err) {
      console.error('[Auth Error]:', err);
      setErrorMessage(err.message || 'Something went wrong. Please check your connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      
      {/* Modal Container */}
      <div className="w-full max-w-md bg-[#FDFBF7] border border-[#E5E0D3] rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F3EFE6] hover:bg-[#EADECE] text-[#6B7280] flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
          title="Close Modal"
        >
          ✕
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8DFF5] border border-[#DDD6FE] flex items-center justify-center text-2xl shadow-inner">
            🌸
          </div>
          <h2 className="text-2xl font-extrabold text-[#1F2937]">
            {isLoginTab ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-[#6B7280]">
            {isLoginTab 
              ? 'Log in to access your practice journal & personalized settings.'
              : 'Join MindMirror AI for stress-free communication rehearsal.'}
          </p>
        </div>

        {/* Tab Toggle (Log In / Sign Up) */}
        <div className="flex bg-[#F3EFE6] p-1 rounded-2xl border border-[#E5E0D3]">
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isLoginTab ? 'bg-white text-[#5C5B99] shadow-sm' : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isLoginTab ? 'bg-white text-[#5C5B99] shadow-sm' : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold text-center animate-shake">
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#6EE7B7] text-[#065F46] text-xs font-bold text-center animate-bounce">
            ✨ {successMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Full Name Input (Signup only) */}
          {!isLoginTab && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#374151] block">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Amal Srivastava"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLoginTab}
                className="w-full px-4 py-3 bg-white border border-[#E5E0D3] rounded-2xl text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#5C5B99] shadow-sm"
              />
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] block">Email Address</label>
            <input
              type="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border border-[#E5E0D3] rounded-2xl text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#5C5B99] shadow-sm"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-[#E5E0D3] rounded-2xl text-xs text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#5C5B99] shadow-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 bg-[#5C5B99] hover:bg-[#494787] text-white font-bold text-sm rounded-2xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 btn-press"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Connecting to MongoDB Atlas...</span>
              </>
            ) : (
              <span>{isLoginTab ? 'Log In to MindMirror' : 'Create Free Account'} &rarr;</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <p className="text-[11px] text-[#6B7280] text-center pt-2">
          🔒 Secure authentication stored on MongoDB Atlas Cloud.
        </p>

      </div>
    </div>
  );
};
