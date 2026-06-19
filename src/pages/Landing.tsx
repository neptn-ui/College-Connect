import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  CheckSquare, BookOpen, Users, HelpCircle, 
  Calendar, MessageSquare, Sun, Moon, ArrowRight, Shield
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleDemo = (role: 'student' | 'faculty') => {
    login(role === 'student' ? 'nikhil.stud@ipu.edu.in' : 'rsharma@ipu.edu.in', role);
    navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
  };

  const features = [
    { 
      title: 'Attendance Tracking', 
      desc: 'Seamless checking & marking interfaces. Alerts for threshold limits under 75%.', 
      icon: CheckSquare 
    },
    { 
      title: 'Classroom Hub', 
      desc: 'Submit assignments, download reference materials, and view faculty grading feedback.', 
      icon: BookOpen 
    },
    { 
      title: 'Collab & Groups', 
      desc: 'Create or join public study rooms and class-based work groups in seconds.', 
      icon: Users 
    },
    { 
      title: 'Lost & Found', 
      desc: 'Report or retrieve misplaced campus goods instantly with location logs.', 
      icon: HelpCircle 
    },
    { 
      title: 'Interactive Timetable', 
      desc: 'A live scheduling calendar containing teacher contact details and links.', 
      icon: Calendar 
    },
    { 
      title: 'Instant Messaging', 
      desc: 'Direct chats, study channels, and automatic smart responses.', 
      icon: MessageSquare 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER NAVBAR */}
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-white/10 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-linear-to-tr from-brand to-[#958ef0] flex items-center justify-center text-white font-bold text-lg">C</span>
          <span className="font-bold text-lg text-text-primary">CollegeConnect</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="flex-1 max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24 text-center space-y-8 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold uppercase tracking-wider animate-pulse">
          <Shield className="w-3.5 h-3.5" /> All-in-One Campus Portal
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-text-primary leading-tight">
          Everything Your <span className="bg-linear-to-r from-brand to-[#a8a1ff] bg-clip-text text-transparent">Campus Needs</span> in One Place
        </h1>
        <p className="text-base md:text-xl text-text-secondary max-w-2xl leading-relaxed">
          No more juggling classroom folders, chat apps, and paper logs. Track attendance, complete tasks, study together, and receive faculty updates from a premium glass-morphic interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button variant="primary" size="lg" onClick={() => handleDemo('student')} className="group">
            Explore Student Demo <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => handleDemo('faculty')}>
            Launch Faculty Demo
          </Button>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-bold text-text-primary">Packed with Smart Utilities</h2>
          <p className="text-sm md:text-base text-text-secondary max-w-xl mx-auto">
            Engineered explicitly for IPU students and faculty to bypass administration hurdles and stay synchronized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} padding="md" className="space-y-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">{feat.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* DEMO CTA ROLES SECTION */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 space-y-6 text-left flex flex-col justify-between border-brand/20 bg-brand/[0.02]">
          <div className="space-y-4">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">For Students</span>
            <h3 className="text-2xl font-extrabold text-text-primary">Simplify your college workspace</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Submit class submissions on-time, view feedback charts, track attendance criteria to stay above 75%, download lecture slides, and chat with team groups.
            </p>
          </div>
          <Button variant="outline" onClick={() => handleDemo('student')} className="w-fit mt-4">
            Launch Student View
          </Button>
        </Card>

        <Card className="p-8 space-y-6 text-left flex flex-col justify-between border-brand/20 bg-brand/[0.02]">
          <div className="space-y-4">
            <span className="text-xs font-bold text-brand uppercase tracking-wider">For Teachers</span>
            <h3 className="text-2xl font-extrabold text-text-primary">Effortless class monitoring</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Post learning files, grade submissions on a responsive ledger, mark daily attendance in one tap, and review performance analytics charts.
            </p>
          </div>
          <Button variant="primary" onClick={() => handleDemo('faculty')} className="w-fit mt-4">
            Launch Faculty View
          </Button>
        </Card>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-12 border-y border-white/10">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <span className="text-2xl md:text-4xl font-extrabold text-brand block">5000+</span>
            <span className="text-xs md:text-sm text-text-secondary font-medium uppercase mt-1 block">Active Students</span>
          </div>
          <div>
            <span className="text-2xl md:text-4xl font-extrabold text-brand block">200+</span>
            <span className="text-xs md:text-sm text-text-secondary font-medium uppercase mt-1 block">Expert Faculty</span>
          </div>
          <div>
            <span className="text-2xl md:text-4xl font-extrabold text-brand block">50+</span>
            <span className="text-xs md:text-sm text-text-secondary font-medium uppercase mt-1 block">Active Classes</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-12 px-6 border-t border-white/10 glass-panel text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-brand flex items-center justify-center text-white font-bold text-sm">C</span>
            <span className="text-sm font-semibold text-text-primary">CollegeConnect</span>
          </div>
          <p className="text-xs text-text-secondary">&copy; 2026 CollegeConnect. Built for IPU Students and Faculty.</p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/login')} className="text-xs text-text-secondary hover:text-brand transition-colors cursor-pointer">Sign In</button>
            <button onClick={() => navigate('/signup')} className="text-xs text-text-secondary hover:text-brand transition-colors cursor-pointer">Get Started</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
