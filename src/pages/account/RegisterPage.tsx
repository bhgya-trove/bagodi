import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from '../../store/useToastStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = register(name, email, phone, password, 'customer');
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Your BAGODI shopping account has been created.');
      navigate('/home');
    } else {
      setErrorMessage(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-warmWhite flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-charcoal-200 p-8 sm:p-10 shadow-premium">
        <div className="text-center space-y-1 mb-8">
          <span className="font-serif text-3xl font-bold tracking-[0.25em] text-charcoal-900 block">
            BAGODI
          </span>
          <span className="text-[9px] tracking-[0.25em] uppercase text-gold font-bold block">
            SHOPPING MALL · BIDAR
          </span>
          <h1 className="text-xl font-serif font-bold text-charcoal-900 pt-4">
            Create an Account
          </h1>
          <p className="text-xs text-charcoal-500">
            Register to shop and track your orders
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-charcoal-50 border border-charcoal-300 text-charcoal-900 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold text-charcoal-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold text-charcoal-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 00000"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold text-charcoal-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                required
                className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold text-charcoal-900 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-charcoal-400 hover:text-charcoal-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-charcoal-200 focus:outline-none focus:border-gold text-charcoal-900 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold text-xs uppercase tracking-widest font-bold py-3 rounded-lg shadow-sm transition disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-500 pt-6 mt-6 border-t border-charcoal-100">
          <span>Already registered? </span>
          <Link
            to="/login"
            className="font-bold text-charcoal-900 hover:text-gold transition underline underline-offset-2"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
