import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Mail, Lock, User, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      signup(name, email, role);
      setIsLoading(false);
      navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050510] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="glow-orb-violet" style={{ width: 500, height: 500, top: -100, right: '15%' }} />
      <div className="glow-orb-purple" style={{ width: 400, height: 400, bottom: -100, left: '15%' }} />

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-2xl p-8 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] items-center justify-center mx-auto mb-2 shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Create Your Account</h2>
            <p className="text-xs text-[#A1A1AA]">Register as a Student or Faculty member</p>
          </div>

          {error ? (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="name">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#71717A] absolute left-3 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Ayush Goel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="email">Email address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#71717A] absolute left-3 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. ayush.stud@ipu.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="password">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#71717A] absolute left-3 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="role">Role on Campus</label>
              <div className="relative flex items-center">
                <ShieldCheck className="w-4 h-4 text-[#71717A] absolute left-3 pointer-events-none" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'faculty')}
                  className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl appearance-none cursor-pointer"
                >
                  <option value="student" className="bg-[#0D0D1A] text-white">Student (Submit work, check attendance)</option>
                  <option value="faculty" className="bg-[#0D0D1A] text-white">Faculty (Grade papers, mark attendance)</option>
                </select>
              </div>
            </div>

            {/* Agree Terms */}
            <div className="flex items-start">
              <input
                id="agree"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-white/15 text-[#7C3AED] focus:ring-[#7C3AED]/40 bg-white/5 cursor-pointer"
              />
              <label htmlFor="agree" className="ml-2 text-xs font-medium text-[#A1A1AA] cursor-pointer leading-relaxed">
                I agree to the{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Terms and Conditions placeholder."); }} className="text-[#A855F7] hover:text-[#7C3AED] font-semibold transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy Policy placeholder."); }} className="text-[#A855F7] hover:text-[#7C3AED] font-semibold transition-colors">Privacy Policy</a>
              </label>
            </div>

            <Button type="submit" loading={isLoading} fullWidth variant="primary">
              Create Account
            </Button>
          </form>

          <div className="text-center pt-3 border-t border-white/5">
            <p className="text-xs text-[#A1A1AA]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#A855F7] hover:text-[#7C3AED] font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
