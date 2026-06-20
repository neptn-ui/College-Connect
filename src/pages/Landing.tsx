import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import {
  CheckSquare, BookOpen, Users, HelpCircle,
  Calendar, MessageSquare, ArrowRight, Shield,
  Sparkles, Zap, Globe, Star, ChevronRight,
  GraduationCap, Trophy, Briefcase, PartyPopper,
  Network, BookMarked
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleDemo = (role: 'student' | 'faculty') => {
    login(role === 'student' ? 'nikhil.stud@ipu.edu.in' : 'rsharma@ipu.edu.in', role);
    navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
  };

  const features = [
    {
      title: 'Attendance Tracking',
      desc: 'Real-time check-ins with smart alerts when you drop below 75%. Never miss a threshold again.',
      icon: CheckSquare,
      wide: true,
    },
    {
      title: 'Classroom Hub',
      desc: 'Submit assignments, download materials, and get instant grading feedback — all in one place.',
      icon: BookOpen,
      wide: false,
    },
    {
      title: 'Study Groups & Clubs',
      desc: 'Create or join study rooms, hackathon teams, and campus clubs in seconds.',
      icon: Users,
      wide: false,
    },
    {
      title: 'Lost & Found',
      desc: 'Report or recover misplaced items instantly with location pins and photo uploads.',
      icon: HelpCircle,
      wide: false,
    },
    {
      title: 'Smart Timetable',
      desc: 'Live scheduling calendar with room numbers, faculty contacts, and class links.',
      icon: Calendar,
      wide: false,
    },
    {
      title: 'Instant Messaging',
      desc: 'Direct chats, study channels, and group conversations with your entire batch.',
      icon: MessageSquare,
      wide: true,
    },
  ];

  const stats = [
    { number: 5000, suffix: '+', label: 'Active Students', icon: GraduationCap },
    { number: 200, suffix: '+', label: 'Expert Faculty', icon: Star },
    { number: 50, suffix: '+', label: 'Active Classes', icon: BookMarked },
    { number: 120, suffix: '+', label: 'Campus Clubs', icon: Trophy },
  ];

  const campusFeatures = [
    { icon: GraduationCap, label: 'Student Profiles' },
    { icon: Users, label: 'Study Groups' },
    { icon: Trophy, label: 'Hackathons' },
    { icon: PartyPopper, label: 'Campus Events' },
    { icon: Briefcase, label: 'Internships' },
    { icon: Network, label: 'Networking' },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-hidden">
      {/* ── Ambient Glow Orbs ────────────────────────────────── */}
      <div className="glow-orb" style={{ width: 600, height: 600, top: -200, left: '30%' }} />
      <div className="glow-orb" style={{ width: 500, height: 500, top: 400, right: -100, opacity: 0.7 }} />
      <div className="glow-orb" style={{ width: 700, height: 700, bottom: -200, left: -150, opacity: 0.6 }} />

      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'navbar-scrolled' : ''
        }`}
        style={{
          background: scrolled ? undefined : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center shadow-lg shadow-brand/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">CollegeConnect</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-white transition-colors cursor-pointer">Features</a>
            <a href="#campus" className="text-sm text-text-secondary hover:text-white transition-colors cursor-pointer">Campus</a>
            <a href="#stats" className="text-sm text-text-secondary hover:text-white transition-colors cursor-pointer">Stats</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="badge-pill mx-auto mb-8 animate-pulse-glow" style={{ width: 'fit-content' }}>
              <Shield className="w-3.5 h-3.5" />
              Built for IPU Students & Faculty
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] max-w-5xl mx-auto">
              <span className="gradient-text-white">Connect, Collaborate</span>
              <br />
              <span className="gradient-text">and Grow</span>
              <span className="gradient-text-white"> Across Campus</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="mt-6 md:mt-8 text-base md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              No more juggling classroom folders, chat apps, and paper logs. Your all-in-one campus platform for attendance, assignments, collaboration, and campus life.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
                onClick={() => handleDemo('student')}
                className="group flex-row-reverse"
              >
                Explore as Student
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={<ChevronRight className="w-5 h-5 text-text-secondary" />}
                onClick={() => handleDemo('faculty')}
                className="flex-row-reverse"
              >
                Launch Faculty Demo
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="scale" delay={0.5}>
            <div className="mt-16 md:mt-20 relative">
              <div className="absolute inset-0 -top-10 -bottom-10 -left-10 -right-10">
                <div className="glow-orb" style={{ width: '80%', height: '100%', top: '10%', left: '10%', filter: 'blur(80px)' }} />
              </div>

              <div className="relative dashboard-glow rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden bg-surface">
                <div className="flex items-center gap-2 px-5 py-3.5 bg-base border-b border-white/5">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="mx-auto max-w-md h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                      <span className="text-xs text-[#71717A]">collegeconnect.vercel.app/dashboard</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-12 gap-4 min-h-[350px] md:min-h-[420px] text-left">
                  <div className="col-span-3 hidden md:flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-white/80">CollegeConnect</span>
                    </div>
                    {['Dashboard', 'Attendance', 'Classroom', 'Timetable', 'Messages', 'Groups'].map((item, i) => (
                      <div key={item} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs ${i === 0 ? 'bg-brand/15 text-brand font-medium' : 'text-[#71717A]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-brand' : 'bg-[#71717A]/30'}`} />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="col-span-12 md:col-span-9 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white/90">Good morning, Nikhil 👋</div>
                        <div className="text-[10px] text-[#71717A]">B.Tech CSE · Semester 6</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-light" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Attendance', value: '87%', color: 'text-emerald-500' },
                        { label: 'Assignments', value: '12/15', color: 'text-brand' },
                        { label: 'Messages', value: '24 new', color: 'text-brand-light' },
                      ].map(s => (
                        <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/5 p-3 md:p-4">
                          <div className="text-[10px] text-[#71717A] mb-1">{s.label}</div>
                          <div className={`text-sm md:text-lg font-bold ${s.color}`}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 md:p-4 space-y-2">
                        <div className="text-[10px] text-[#71717A] uppercase font-semibold tracking-wider">Upcoming</div>
                        {['Data Structures Quiz', 'ML Lab Assignment', 'Club Meeting'].map(t => (
                          <div key={t} className="flex items-center gap-2 text-[10px] md:text-xs text-[#A1A1AA]">
                            <div className="w-1 h-1 rounded-full bg-brand" />
                            {t}
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 md:p-4 space-y-2">
                        <div className="text-[10px] text-[#71717A] uppercase font-semibold tracking-wider">Study Groups</div>
                        {['🔥 DSA Grind Squad', '🎨 UI/UX Design', '🤖 AI Research'].map(t => (
                          <div key={t} className="flex items-center gap-2 text-[10px] md:text-xs text-[#A1A1AA]">
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="gradient-divider mx-auto max-w-4xl" />

      {/* ── Campus Life Section ───────────────────────────────── */}
      <section id="campus" className="relative py-20 md:py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal direction="up">
            <div className="badge-pill mx-auto mb-6" style={{ width: 'fit-content' }}>
              <Globe className="w-3.5 h-3.5" /> Campus Ecosystem
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              More than just <span className="gradient-text">academics</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-14 text-sm md:text-base">
              From hackathon teams to internship boards — everything college life demands, unified in one platform.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {campusFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <ScrollReveal key={f.label} direction="up" delay={i * 0.1}>
                  <div className="group glass-card rounded-2xl p-6 flex flex-col items-center gap-3 cursor-default h-full">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-brand/10 border border-brand/20">
                      <Icon className="w-6 h-6 text-brand icon-glow" />
                    </div>
                    <span className="text-xs font-semibold text-text-secondary group-hover:text-white transition-colors">
                      {f.label}
                    </span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="gradient-divider mx-auto max-w-4xl" />

      {/* ── Features Bento Grid ──────────────────────────────── */}
      <section id="features" className="relative py-20 md:py-28 px-6 lg:px-8">
        <div className="glow-orb" style={{ width: 500, height: 500, top: '20%', right: '-10%' }} />

        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-14">
              <div className="badge-pill mx-auto mb-6" style={{ width: 'fit-content' }}>
                <Zap className="w-3.5 h-3.5" /> Powerful Features
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <span className="gradient-text-white">Packed with</span>{' '}
                <span className="gradient-text">smart utilities</span>
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto text-sm md:text-base">
                Engineered for IPU students and faculty to bypass admin hurdles and stay in sync.
              </p>
            </div>
          </ScrollReveal>

          <div className="bento-grid">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <ScrollReveal key={feat.title} direction="up" delay={i * 0.1} className={feat.wide ? 'bento-wide' : ''}>
                  <div className={`group glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[200px] h-full relative overflow-hidden`}>
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-brand/10 blur-xl" />

                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand/10 border border-brand/20 group-hover:border-brand/40 transition-colors">
                        <Icon className="w-6 h-6 text-brand-light icon-glow" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white">{feat.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
                    </div>

                    <div className="relative z-10 mt-6">
                      <span className="text-xs font-medium text-brand flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                        Learn more <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="gradient-divider mx-auto max-w-4xl" />

      {/* ── Stats Section ────────────────────────────────────── */}
      <section id="stats" className="relative py-20 md:py-28 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <ScrollReveal key={stat.label} direction="up" delay={i * 0.1}>
                  <div className="glass-card rounded-2xl p-6 md:p-8 text-center h-full flex flex-col justify-center items-center">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-brand-light icon-glow" />
                    </div>
                    <div className="text-3xl md:text-4xl stat-number mb-2">
                      <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs md:text-sm text-text-secondary font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="gradient-divider mx-auto max-w-4xl" />

      {/* ── CTA Roles Section ────────────────────────────────── */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollReveal direction="left">
            <div className="glass-card rounded-2xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group h-full">
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-brand/10 blur-[60px] group-hover:bg-brand/20 transition-all" />
              <div className="relative z-10 space-y-5">
                <span className="badge-pill">
                  <GraduationCap className="w-3.5 h-3.5" /> For Students
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Simplify your college workspace
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Submit assignments on time, track attendance to stay above 75%, download lecture slides, join hackathon teams, and chat with study groups.
                </p>
              </div>
              <div className="mt-8">
                <Button variant="outline" onClick={() => handleDemo('student')} icon={<ArrowRight className="w-4 h-4" />} className="flex-row-reverse">
                  Launch Student View
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="glass-card rounded-2xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group h-full">
              <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-brand-light/10 blur-[60px] group-hover:bg-brand-light/20 transition-all" />
              <div className="relative z-10 space-y-5">
                <span className="badge-pill">
                  <BookOpen className="w-3.5 h-3.5" /> For Teachers
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Effortless class management
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Post learning materials, grade submissions on a responsive ledger, mark daily attendance in one tap, and review performance analytics charts.
                </p>
              </div>
              <div className="mt-8">
                <Button variant="primary" onClick={() => handleDemo('faculty')} icon={<ArrowRight className="w-4 h-4" />} className="flex-row-reverse">
                  Launch Faculty View
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="relative border-t border-white/5 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">CollegeConnect</span>
          </div>

          <p className="text-xs text-[#71717A]">
            &copy; 2026 CollegeConnect. Built for IPU Students and Faculty.
          </p>

          <div className="flex gap-6">
            <button onClick={() => navigate('/login')} className="text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Sign In</button>
            <button onClick={() => navigate('/signup')} className="text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">Get Started</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
