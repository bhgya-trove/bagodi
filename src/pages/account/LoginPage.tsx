import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from '../../store/useToastStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!cleanPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const result = login(cleanEmail, cleanPassword);
    setIsSubmitting(false);

    if (result.success) {
      const currentUser = useAuthStore.getState().user;
      toast.success(`Welcome to BAGODI, ${currentUser?.name || 'Customer'}!`);
      if (currentUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } else {
      setErrorMessage(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-warmWhite flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-charcoal-200 p-8 sm:p-10 shadow-premium">
        {/* Brand Header */}
        <div className="text-center space-y-1 mb-8">
          <span className="font-serif text-3xl font-bold tracking-[0.25em] text-charcoal-900 block">
            BAGODI
          </span>
          <span className="text-[9px] tracking-[0.25em] uppercase text-gold font-bold block">
            SHOPPING MALL · BIDAR
          </span>
          <h1 className="text-xl font-serif font-bold text-charcoal-900 pt-4">
            Welcome Back
          </h1>
          <p className="text-xs text-charcoal-500">
            Sign in to access your shopping account and orders
          </p>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-charcoal-50 border border-charcoal-300 text-charcoal-900 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Clean Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-charcoal-800 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold text-charcoal-900 bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-charcoal-800 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast.info('To reset your password, please contact the BAGODI Mall helpdesk in Bidar.')}
                className="text-[11px] text-gold hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold text-charcoal-900 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-charcoal-400 hover:text-charcoal-700 p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold text-xs uppercase tracking-widest font-bold py-3 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Create Account Link */}
        <div className="text-center text-xs text-charcoal-500 pt-6 mt-6 border-t border-charcoal-100">
          <span>New to BAGODI Shopping Mall? </span>
          <Link
            to="/register"
            className="font-bold text-charcoal-900 hover:text-gold transition underline underline-offset-2"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
