import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  User, Plus, Trash2, BookOpen 
} from 'lucide-react';
import { Classroom } from '../types';

export const Timetable: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, classrooms, updateProfile } = useAuth();
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  
  // Faculty form states
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassRoom, setNewClassRoom] = useState('');
  const [newClassDay, setNewClassDay] = useState('Monday');
  const [newClassStart, setNewClassStart] = useState('09:00');
  const [newClassEnd, setNewClassEnd] = useState('10:30');

  // Hardcode schedule days & hour slots
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const TIME_SLOTS = [
    { start: '08:00', label: '08:00 AM' },
    { start: '09:00', label: '09:00 AM' },
    { start: '10:00', label: '10:00 AM' },
    { start: '11:00', label: '11:00 AM' },
    { start: '12:00', label: '12:00 PM' },
    { start: '13:00', label: '01:00 PM' },
    { start: '14:00', label: '02:00 PM' },
    { start: '15:00', label: '03:00 PM' },
    { start: '16:00', label: '04:00 PM' },
    { start: '17:00', label: '05:00 PM' }
  ];

  if (!currentUser) return null;

  const isStudent = currentUser.role === 'student';
  const isFaculty = currentUser.role === 'faculty';

  // Highlight today helper
  const getTodayDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };
  const todayDayName = getTodayDayName();

  // Helper to extract active slot coordinates
  const findClassAtSlot = (day: string, startTime: string) => {
    return classrooms.find(cls => 
      cls.schedule.some(s => s.day === day && s.startTime === startTime)
    );
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName || !newClassCode) return;
    
    // In demo context, we mock insert schedule into active classroom database
    classrooms.push({
      id: `class-${Date.now()}`,
      name: newClassName,
      code: newClassCode,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      semester: '5th Sem',
      section: 'CSE-A',
      studentCount: 42,
      schedule: [{
        day: newClassDay,
        startTime: newClassStart,
        endTime: newClassEnd,
        room: newClassRoom
      }]
    });

    setShowAddClassModal(false);
    setNewClassName('');
    setNewClassCode('');
    setNewClassRoom('');
    alert('Class slot scheduled successfully!');
  };

  const handleDeleteClass = (classId: string) => {
    if (confirm('Are you sure you want to remove this class slot?')) {
      // simulated pop
      alert('Class slot removed from schedule (simulated).');
      setSelectedClass(null);
    }
  };

  // Color mapper based on code hash
  const getClassColor = (code: string) => {
    const hash = code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const colors = [
      'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
      'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
      'bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400',
      'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400',
      'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400'
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Campus Timetable</h1>
          <p className="text-sm text-text-secondary mt-1">Review lecture schedules, labs, and office hours.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Week/Month Switch */}
          <div className="flex bg-white/5 border border-white/10 dark:border-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${viewMode === 'week' ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${viewMode === 'month' ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Monthly Calendar
            </button>
          </div>

          {isFaculty ? (
            <Button variant="primary" size="sm" onClick={() => setShowAddClassModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Lecture
            </Button>
          ) : null}
        </div>
      </div>

      {viewMode === 'week' ? (
        /* WEEKLY SCHEDULE GRID */
        <div className="space-y-2">
          <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto p-4">
            <div className="min-w-[800px] grid grid-cols-6 gap-2">
              
              {/* Corner Header slot */}
              <div className="p-3 text-center text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                Time Slots
              </div>
              
              {/* Days Header */}
              {DAYS.map(d => {
                const isToday = d === todayDayName;
                return (
                  <div 
                    key={d} 
                    className={`p-3 text-center text-xs font-bold rounded-xl border flex flex-col justify-center gap-0.5 ${isToday ? 'bg-brand/10 border-brand text-brand' : 'bg-white/5 border-white/5 text-text-secondary'}`}
                  >
                    <span>{d}</span>
                    {isToday ? <span className="text-[9px] uppercase font-bold tracking-wider">Today</span> : null}
                  </div>
                );
              })}

              {/* Grid rows */}
              {TIME_SLOTS.map(slot => (
                <React.Fragment key={slot.start}>
                  {/* Time column */}
                  <div className="p-2 text-center text-[11px] font-bold text-text-secondary border-r border-white/5 flex items-center justify-center">
                    {slot.label}
                  </div>
                  
                  {/* Days columns */}
                  {DAYS.map(day => {
                    const cls = findClassAtSlot(day, slot.start);
                    const scheduleItem = cls?.schedule.find(s => s.day === day && s.startTime === slot.start);

                    return (
                      <div 
                        key={`${day}-${slot.start}`} 
                        className="min-h-20 p-1.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 flex flex-col transition-all cursor-pointer justify-center"
                        onClick={() => cls && setSelectedClass(cls)}
                      >
                        {cls && scheduleItem ? (
                          <div className={`p-2 rounded-lg border text-left h-full flex flex-col justify-between text-xs transition-transform hover:scale-[1.02] ${getClassColor(cls.code)}`}>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-extrabold tracking-wide uppercase block opacity-80">{cls.code}</span>
                              <span className="font-bold line-clamp-1 leading-snug">{cls.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] opacity-90 mt-2">
                              <span className="font-semibold">{scheduleItem.room}</span>
                              <span>{scheduleItem.startTime}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}

            </div>
          </div>
        </div>
      ) : (
        /* MONTHLY CALENDAR VIEW PLACEHOLDER */
        <Card hoverEffect={false} padding="lg" className="text-center p-16 text-text-secondary text-sm space-y-4">
          <CalendarIcon className="w-12 h-12 text-brand mx-auto animate-pulse" />
          <h2 className="text-lg font-bold text-text-primary">Monthly Roster Agenda</h2>
          <p className="max-w-md mx-auto text-xs">
            Viewing standard month calendars. This grid combines assignment deadlines, hackathon listings, lost item reports, and exams dates in one global tracking board.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setViewMode('week')}>
            Return to Weekly Grid
          </Button>
        </Card>
      )}

      {/* Class detail modal */}
      <Modal
        isOpen={selectedClass !== null}
        onClose={() => setSelectedClass(null)}
        title={selectedClass?.name || 'Class Details'}
      >
        {selectedClass ? (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs font-bold text-brand uppercase tracking-wider">{selectedClass.code}</span>
                <h3 className="text-xl font-bold text-text-primary mt-1">{selectedClass.name}</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-xl bg-white/10 border border-white/10 text-text-secondary">
                {selectedClass.semester} ({selectedClass.section})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card hoverEffect={false} padding="sm" className="flex items-center gap-3 border-white/5">
                <MapPin className="w-5 h-5 text-brand shrink-0" />
                <div>
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Lecture Venue</span>
                  <span className="text-sm font-bold text-text-primary">{selectedClass.schedule[0]?.room || 'Block B - Lab 4'}</span>
                </div>
              </Card>

              <Card hoverEffect={false} padding="sm" className="flex items-center gap-3 border-white/5">
                <User className="w-5 h-5 text-brand shrink-0" />
                <div>
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Instructor</span>
                  <span className="text-sm font-bold text-text-primary">{selectedClass.facultyName}</span>
                </div>
              </Card>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Weekly Schedule Slots</h4>
              <div className="space-y-1">
                {selectedClass.schedule.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex justify-between items-center text-text-primary">
                    <span className="font-semibold">{s.day}s</span>
                    <span className="text-brand font-bold">{s.startTime} - {s.endTime}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-white/10">
              {isFaculty && selectedClass.facultyId === currentUser.id ? (
                <Button 
                  variant="danger" 
                  onClick={() => handleDeleteClass(selectedClass.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Cancel Slot
                </Button>
              ) : null}
              <Button 
                variant="primary" 
                onClick={() => { setSelectedClass(null); navigate('/classroom'); }}
              >
                <BookOpen className="w-4 h-4 mr-2" /> Enter Classroom
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Add Slot Modal (Teacher Action) */}
      <Modal
        isOpen={showAddClassModal}
        onClose={() => setShowAddClassModal(false)}
        title="Schedule Class Lecture Slot"
      >
        <form onSubmit={handleAddClass} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="cName">Subject Title</label>
              <input
                id="cName"
                type="text"
                required
                placeholder="e.g. Compiler Design"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="cCode">Subject Code</label>
              <input
                id="cCode"
                type="text"
                required
                placeholder="e.g. CSE-307"
                value={newClassCode}
                onChange={(e) => setNewClassCode(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="cRoom">Room Number</label>
              <input
                id="cRoom"
                type="text"
                required
                placeholder="e.g. Block B - 101"
                value={newClassRoom}
                onChange={(e) => setNewClassRoom(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="cDay">Lecture Day</label>
              <select
                id="cDay"
                value={newClassDay}
                onChange={(e) => setNewClassDay(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl cursor-pointer"
              >
                {DAYS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="cStart">Start Hour</label>
              <select
                id="cStart"
                value={newClassStart}
                onChange={(e) => setNewClassStart(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl cursor-pointer"
              >
                {TIME_SLOTS.map(t => (
                  <option key={t.start} value={t.start}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="cEnd">End Hour</label>
              <select
                id="cEnd"
                value={newClassEnd}
                onChange={(e) => setNewClassEnd(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl cursor-pointer"
              >
                {TIME_SLOTS.map(t => (
                  <option key={t.start} value={t.start}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={() => setShowAddClassModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Schedule Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
