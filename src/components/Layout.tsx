import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Menu, X, Bell, Sun, Moon, LogOut, 
  LayoutDashboard, BookOpen, Calendar, MessageSquare, 
  CheckSquare, Users, Search, HelpCircle, Settings, User
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
    return <>{children}</>; // No layout for landing/auth pages
  }

  const unreadNotifs = notifications.filter(n => !n.read);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine dashboard route based on role
  const dashboardRoute = currentUser.role === 'faculty' ? '/teacher-dashboard' : '/student-dashboard';

  // Navigation Items
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
    <div className="min-h-screen flex text-text-primary">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-white/10 dark:border-white/5 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col justify-between`}>
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <Link to={dashboardRoute} className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
              <span className="w-8 h-8 rounded-lg bg-linear-to-tr from-brand to-[#958ef0] flex items-center justify-center text-white font-bold text-lg">C</span>
              <span className="font-bold text-lg bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">CollegeConnect</span>
            </Link>
            <button 
              className="lg:hidden p-1.5 rounded-xl hover:bg-white/10 cursor-pointer"
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
                      ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                      : 'text-text-secondary hover:bg-white/10 dark:hover:bg-white/5 hover:text-text-primary'
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
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* Fast Switch Role Badge for development convenience */}
          <div className="p-3 rounded-xl bg-brand/10 border border-brand/20 flex flex-col gap-2">
            <span className="text-xs font-semibold text-brand tracking-wide uppercase">Mock Role Switcher</span>
            <div className="flex gap-2">
              <button 
                onClick={() => { switchRole('student'); navigate('/student-dashboard'); }}
                className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${currentUser.role === 'student' ? 'bg-brand text-white' : 'bg-white/5 text-text-secondary hover:text-text-primary'}`}
              >
                Student
              </button>
              <button 
                onClick={() => { switchRole('faculty'); navigate('/teacher-dashboard'); }}
                className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${currentUser.role === 'faculty' ? 'bg-brand text-white' : 'bg-white/5 text-text-secondary hover:text-text-primary'}`}
              >
                Teacher
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* TOP NAVBAR */}
        <header className="h-16 px-6 glass-panel border-b border-white/10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-text-primary cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search bar */}
            <div className="relative hidden md:flex items-center w-64 lg:w-80">
              <Search className="w-4.5 h-4.5 text-text-secondary absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/35 text-text-primary placeholder:text-text-secondary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Panel */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen) markNotificationsAsRead();
                }}
                className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                ) : null}
              </button>

              {/* Notification dropdown */}
              {isNotifOpen ? (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 glass-panel border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-white/10">
                      <span className="font-semibold text-sm">Notifications</span>
                      <button 
                        onClick={markNotificationsAsRead}
                        className="text-xs text-brand hover:underline cursor-pointer"
                      >
                        Mark read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-text-secondary">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-3 border-b border-white/5 hover:bg-white/5 flex gap-2 transition-colors ${!n.read ? 'bg-brand/5' : ''}`}>
                            <div className="w-2 h-2 rounded-full bg-brand mt-1.5 shrink-0 opacity-80" />
                            <div>
                              <p className="text-xs font-semibold text-text-primary">{n.title}</p>
                              <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{n.message}</p>
                              <span className="text-[9px] text-text-secondary block mt-1">
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
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              {currentUser.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-brand"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand">
                  <User className="w-4 h-4 text-brand" />
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-text-primary max-w-28 truncate leading-tight">{currentUser.name}</p>
                <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};
