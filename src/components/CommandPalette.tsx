import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, LayoutDashboard, BookOpen, Calendar, 
  MessageSquare, Settings, User, X, Users, MapPin
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { currentUser, classrooms } = useAuth();

  // Global Ctrl+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);

  // Items to search through
  const items = [
    { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard, action: () => navigate(currentUser?.role === 'faculty' ? '/teacher-dashboard' : '/student-dashboard') },
    { id: 'classroom', title: 'Classroom', icon: BookOpen, action: () => navigate('/classroom') },
    { id: 'timetable', title: 'Timetable', icon: Calendar, action: () => navigate('/timetable') },
    { id: 'attendance', title: 'Attendance', icon: User, action: () => navigate('/attendance') },
    { id: 'messages', title: 'Messages', icon: MessageSquare, action: () => navigate('/messages') },
    { id: 'groups', title: 'Groups', icon: Users, action: () => navigate('/groups') },
    { id: 'lost-found', title: 'Lost & Found', icon: MapPin, action: () => navigate('/lost-found') },
    { id: 'settings', title: 'Settings', icon: Settings, action: () => navigate('/settings') },
    // Add dynamically classes
    ...(classrooms?.map(c => ({
      id: `class-${c.id}`,
      title: `Go to ${c.code}: ${c.name}`,
      icon: BookOpen,
      action: () => navigate('/classroom')
    })) || [])
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          filteredItems[activeIndex].action();
          close();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, activeIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={close} 
      />
      
      <div className="relative w-full max-w-xl glass-panel bg-surface/90 rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-text-secondary mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-lg placeholder:text-text-muted"
            placeholder="Type a command or search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={close} className="p-1 rounded-lg hover:bg-white/10 text-text-secondary cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-sm text-text-secondary">
              No results found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;
              return (
                <div
                  key={item.id}
                  className={`flex items-center px-4 py-3 cursor-pointer rounded-xl transition-colors ${
                    isActive ? 'bg-brand/20 text-brand' : 'text-text-secondary hover:bg-white/5'
                  }`}
                  onClick={() => {
                    item.action();
                    close();
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand' : 'text-text-muted'}`} />
                  <span className={`text-sm font-medium ${isActive ? 'text-text-primary' : ''}`}>
                    {item.title}
                  </span>
                </div>
              );
            })
          )}
        </div>
        
        <div className="px-4 py-3 border-t border-white/10 text-[10px] text-text-muted flex justify-between">
          <span>Use <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10">↓</kbd> to navigate</span>
          <span><kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10">Enter</kbd> to select</span>
          <span><kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
