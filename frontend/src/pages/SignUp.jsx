import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SpendAuraLogoIcon } from '../components/Illustrations';

export const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('₹');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await register({
      username: email.split('@')[0],
      first_name: name,
      email,
      password,
      currency,
    });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCEDF0] via-[#FFF5F7] to-[#FADCE4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 shadow-soft-lg border border-pink-100/80 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-pink-50 mb-1">
            <SpendAuraLogoIcon className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#3A0D22]">Create Account</h1>
          <p className="text-xs text-[#8C6A78]">
            Begin your mindful financial journey with SpendAura
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#581C38] mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sushmitha Rao"
                className="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 text-xs text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#581C38]/20 focus:border-[#581C38]"
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#581C38] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-pink-50/40 text-xs text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#581C38] mb-1">Confirm</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-pink-50/40 text-xs text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#581C38] mb-1">Preferred Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-pink-50/40 text-xs font-bold text-[#581C38] rounded-xl border border-pink-200 focus:outline-none"
            >
              <option value="₹">₹ INR (Indian Rupee)</option>
              <option value="$">$ USD (US Dollar)</option>
              <option value="€">€ EUR (Euro)</option>
              <option value="£">£ GBP (British Pound)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#581C38] hover:bg-[#421229] text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#8C6A78]">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#581C38] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
