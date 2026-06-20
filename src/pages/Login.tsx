import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(email, role);
      setIsLoading(false);
      if (success) {
        navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
      } else {
        setError('Invalid credentials.');
      }
    }, 1000);
  };

  const handleQuickLogin = (selectedRole: 'student' | 'faculty') => {
    const defaultEmail = selectedRole === 'student' ? 'nikhil.stud@ipu.edu.in' : 'rsharma@ipu.edu.in';
    setIsLoading(true);
    setTimeout(() => {
      login(defaultEmail, selectedRole);
      setIsLoading(false);
      navigate(selectedRole === 'student' ? '/student-dashboard' : '/teacher-dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050510] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="glow-orb-purple" style={{ width: 500, height: 500, top: -150, left: '20%' }} />
      <div className="glow-orb-indigo" style={{ width: 400, height: 400, bottom: -100, right: '10%' }} />

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
            <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to CollegeConnect</h2>
            <p className="text-xs text-[#A1A1AA]">Enter credentials or choose a quick demo template</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-white/5 border border-white/8 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${role === 'student' ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-purple-500/20' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              Student Account
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${role === 'faculty' ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-purple-500/20' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              Faculty Account
            </button>
          </div>

          {error ? (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center">
              {error}
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="email">Email address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#71717A] absolute left-3 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder={role === 'student' ? 'nikhil.stud@ipu.edu.in' : 'rsharma@ipu.edu.in'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="password">Password</label>
                <a href="#" onClick={(e) => {e.preventDefault(); alert("Password recovery is disabled in demo mode.");}} className="text-[11px] text-[#7C3AED] hover:text-[#A855F7] transition-colors">Forgot password?</a>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#71717A] absolute left-3 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 rounded-lg text-[#71717A] hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/15 text-[#7C3AED] focus:ring-[#7C3AED]/40 bg-white/5 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-xs font-medium text-[#A1A1AA] cursor-pointer">
                Remember my session
              </label>
            </div>

            <Button type="submit" loading={isLoading} fullWidth variant="primary">
              Sign In
            </Button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="flex-shrink mx-4 text-[#71717A] text-[10px] uppercase font-bold tracking-wider">Quick Demo</span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Demo Fast Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={() => handleQuickLogin('student')} className="text-xs">
              Student Demo
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => handleQuickLogin('faculty')} className="text-xs">
              Faculty Demo
            </Button>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => alert("OAuth is disabled in demo mode.")}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-white cursor-pointer transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.479 0-6.3-2.821-6.3-6.3 0-3.478 2.821-6.3 6.3-6.3 1.606 0 3.061.604 4.177 1.6L21.23 4.54C19.01 2.54 16.03 1.2 12.24 1.2 6.033 1.2 1 6.233 1 12.43s5.033 11.23 11.24 11.23c6.033 0 10.74-4.24 10.74-11.23 0-.74-.067-1.44-.194-2.145H12.24z"/></svg> Google
            </button>
            <button 
              type="button"
              onClick={() => alert("OAuth is disabled in demo mode.")}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-white cursor-pointer transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> GitHub
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#A1A1AA]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#A855F7] hover:text-[#7C3AED] font-semibold transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
