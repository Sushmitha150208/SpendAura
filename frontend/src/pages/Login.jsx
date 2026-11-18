import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SpendAuraLogoIcon } from '../components/Illustrations';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('sushmitha@spendaura.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login({ email, password });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('sushmitha@spendaura.com');
    setPassword('password123');
    await login({ email: 'sushmitha@spendaura.com', password: 'password123' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCEDF0] via-[#FFF5F7] to-[#FADCE4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 shadow-soft-lg border border-pink-100/80 space-y-6">
        {/* Logo and Greeting */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-pink-50 mb-2">
            <SpendAuraLogoIcon className="w-12 h-12" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#3A0D22]">Welcome Back</h1>
          <p className="text-xs text-[#8C6A78]">
            Sign in to access your SpendAura financial dashboard
          </p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="p-3.5 bg-gradient-to-r from-pink-50 to-[#FCE7EE] rounded-2xl border border-pink-200/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-[#581C38] font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Instant Demo Access</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1 bg-[#581C38] text-white text-xs font-bold rounded-xl hover:bg-[#43132A] transition-colors"
          >
            One-Click Login
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
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

          <div>
            <label className="block text-xs font-bold text-[#581C38] mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-pink-50/40 text-xs text-[#3A0D22] rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-[#581C38]/20 focus:border-[#581C38]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 cursor-pointer text-[#6B5561]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-pink-300 text-[#581C38] focus:ring-[#581C38]"
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="font-bold text-[#581C38] hover:text-[#A8325E] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#581C38] hover:bg-[#43132A] text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In to SpendAura'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Sign up link */}
        <div className="text-center pt-2 text-xs text-[#8C6A78]">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#581C38] hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};
