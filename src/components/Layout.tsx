import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Menu, X, Bell, Sun, Moon, LogOut, 
  LayoutDashboard, BookOpen, Calendar, MessageSquare, 
  CheckSquare, Users, Search, HelpCircle, Settings, User, Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, notifications, markNotificationsAsRead, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) {
    return <>{children}</>;
  }

  const unreadNotifs = notifications.filter(n => !n.read);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardRoute = currentUser.role === 'faculty' ? '/teacher-dashboard' : '/student-dashboard';

  const navItems = [
    { name: 'Dashboard', path: dashboardRoute, icon: LayoutDashboard },
    { name: 'Classroom', path: '/classroom', icon: BookOpen },
    { name: 'Timetable', path: '/timetable', icon: Calendar },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Attendance', path: '/attendance', icon: CheckSquare },
    { name: 'Groups', path: '/groups', icon: Users },
    { name: 'Lost & Found', path: '/lost-found', icon: HelpCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-transparent text-white">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 sidebar-glass border-r border-white/[0.06] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col justify-between`}>
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06]">
            <Link to={dashboardRoute} className="flex items-center gap-2.5" onClick={() => setIsSidebarOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-lg shadow-purple-500/15">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">CollegeConnect</span>
            </Link>
            <button 
              className="lg:hidden p-1.5 rounded-xl hover:bg-white/5 cursor-pointer text-[#A1A1AA]"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-lg shadow-purple-500/20' 
                      : 'text-[#A1A1AA] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer / Dev Switches */}
        <div className="p-4 border-t border-white/[0.06] space-y-3">
          <div className="p-3 rounded-xl bg-[#7C3AED]/8 border border-[#7C3AED]/20 flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#A855F7] tracking-wide uppercase">Mock Role Switcher</span>
            <div className="flex gap-2">
              <button 
                onClick={() => { switchRole('student'); navigate('/student-dashboard'); }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${currentUser.role === 'student' ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-purple-500/15' : 'bg-white/5 text-[#A1A1AA] hover:text-white'}`}
              >
                Student
              </button>
              <button 
                onClick={() => { switchRole('faculty'); navigate('/teacher-dashboard'); }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${currentUser.role === 'faculty' ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-purple-500/15' : 'bg-white/5 text-[#A1A1AA] hover:text-white'}`}
              >
                Teacher
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* TOP NAVBAR */}
        <header className="h-16 px-6 glass-panel border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-white cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search bar */}
            <div className="relative hidden md:flex items-center w-64 lg:w-80">
              <Search className="w-4.5 h-4.5 text-[#71717A] absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2 text-sm rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-white/5 text-[#A1A1AA] hover:text-white transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen) markNotificationsAsRead();
                }}
                className="p-2.5 rounded-xl hover:bg-white/5 text-[#A1A1AA] hover:text-white transition-all relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
                ) : null}
              </button>

              {isNotifOpen ? (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 glass-card border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden py-2">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-white/[0.06]">
                      <span className="font-semibold text-sm text-white">Notifications</span>
                      <button 
                        onClick={markNotificationsAsRead}
                        className="text-xs text-[#A855F7] hover:text-[#7C3AED] cursor-pointer transition-colors"
                      >
                        Mark read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-[#71717A]">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-3 border-b border-white/[0.04] hover:bg-white/[0.03] flex gap-2 transition-colors ${!n.read ? 'bg-[#7C3AED]/5' : ''}`}>
                            <div className="w-2 h-2 rounded-full bg-[#A855F7] mt-1.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-white">{n.title}</p>
                              <p className="text-[11px] text-[#A1A1AA] mt-0.5 leading-relaxed">{n.message}</p>
                              <span className="text-[9px] text-[#71717A] block mt-1">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Profile Menu */}
            <div className="flex items-center gap-2 pl-3 border-l border-white/[0.06]">
              {currentUser.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#7C3AED]/50"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6366F1] flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-white max-w-28 truncate leading-tight">{currentUser.name}</p>
                <span className="text-[10px] text-[#71717A] font-medium uppercase tracking-wider">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
