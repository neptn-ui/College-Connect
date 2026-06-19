import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Mail, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';

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

    // Simulate signup request
    setTimeout(() => {
      signup(name, email, role);
      setIsLoading(false);
      navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-brand/5 to-transparent">
      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <Card hoverEffect={false} padding="lg" className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 items-center justify-center text-brand font-bold text-xl mx-auto mb-2">
            C
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Create Your Account</h2>
          <p className="text-xs text-text-secondary">Register as a Student or Faculty member</p>
        </div>

        {error ? (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-center">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="name">Full Name</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
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
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="email">Email address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
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
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="password">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
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

          {/* Role Selection Option */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="role">Role on Campus</label>
            <div className="relative flex items-center">
              <ShieldCheck className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'faculty')}
                className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl appearance-none cursor-pointer"
              >
                <option value="student" className="bg-bg-primary text-text-primary">Student (Submit work, check attendance)</option>
                <option value="faculty" className="bg-bg-primary text-text-primary">Faculty (Grade papers, mark attendance)</option>
              </select>
            </div>
          </div>

          {/* Agree Terms Checkbox */}
          <div className="flex items-start">
            <input
              id="agree"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-white/15 text-brand focus:ring-brand/40 bg-white/5 cursor-pointer"
            />
            <label htmlFor="agree" className="ml-2 text-xs font-medium text-text-secondary cursor-pointer selection:bg-transparent leading-relaxed">
              I agree to the{' '}
              <a href="#" onClick={(e) => {e.preventDefault(); alert("Terms and Conditions placeholder.");}} className="text-brand hover:underline font-semibold">Terms of Service</a>
              {' '}and{' '}
              <a href="#" onClick={(e) => {e.preventDefault(); alert("Privacy Policy placeholder.");}} className="text-brand hover:underline font-semibold">Privacy Policy</a>
            </label>
          </div>

          <Button type="submit" loading={isLoading} fullWidth variant="primary">
            Create Account
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-xs text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-brand hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
