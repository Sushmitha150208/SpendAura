import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SpendAuraLogoIcon } from '../components/Illustrations';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCEDF0] via-[#FFF5F7] to-[#FADCE4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 shadow-soft-lg border border-pink-100/80 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-pink-50 mb-1">
            <SpendAuraLogoIcon className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#3A0D22]">Reset Password</h1>
          <p className="text-xs text-[#8C6A78]">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900">Check your inbox</h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              We've dispatched a password reset link to <strong>{email}</strong>. Follow the instructions to recover your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#581C38] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 text-xs text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#581C38]/20 focus:border-[#581C38]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#581C38] hover:bg-[#421229] text-white text-xs font-bold rounded-2xl shadow-md transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#581C38] hover:text-[#A8325E]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
