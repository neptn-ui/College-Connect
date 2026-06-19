import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckSquare, AlertTriangle, Calendar as CalendarIcon, FileDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Attendance as AttendanceRecord } from '../types';

export const Attendance: React.FC = () => {
  const { currentUser, classrooms, attendanceRecords, markAttendance } = useAuth();
  
  // Faculty State
  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Student list for marking
  const MOCK_STUDENTS = [
    { id: 'stud-01', name: 'Nikhil Kumar', roll: '00115002723' },
    { id: 'stud-02', name: 'Ayush Goel', roll: '00215002723' },
    { id: 'stud-03', name: 'Riya Sen', roll: '00315002723' },
    { id: 'stud-04', name: 'Dev Sharma', roll: '00415002723' },
    { id: 'stud-05', name: 'Ishita Kapoor', roll: '00515002723' }
  ];

  const [studentStatuses, setStudentStatuses] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const initial: Record<string, 'present' | 'absent' | 'late'> = {};
    MOCK_STUDENTS.forEach(s => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  if (!currentUser) return null;

  const isStudent = currentUser.role === 'student';
  const isFaculty = currentUser.role === 'faculty';

  // --- STUDENT VIEW COMPUTATIONS ---
  // Calculates student's attendance stats for each classroom
  const getStudentStats = () => {
    return classrooms.map(cls => {
      const classRecords = attendanceRecords.filter(
        r => r.classroomId === cls.id && r.studentId === currentUser.id
      );
      const totalCount = classRecords.length;
      const attendedCount = classRecords.filter(r => r.status === 'present' || r.status === 'late').length;
      const percent = totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 80; // fallback mock
      
      // Get last record date
      const lastRecord = classRecords[classRecords.length - 1];
      const lastMarked = lastRecord ? new Date(lastRecord.date).toLocaleDateString() : 'N/A';

      return {
        classId: cls.id,
        name: cls.name,
        code: cls.code,
        percent,
        total: totalCount,
        attended: attendedCount,
        lastMarked
      };
    });
  };

  const studentStatsList = getStudentStats();
  const overallAttPercent = studentStatsList.length > 0 
    ? Math.round(studentStatsList.reduce((acc, curr) => acc + curr.percent, 0) / studentStatsList.length)
    : 80;

  // --- FACULTY ACTIONS ---
  const handleMarkStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudentStatuses(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const updated = { ...studentStatuses };
    MOCK_STUDENTS.forEach(s => {
      updated[s.id] = status;
    });
    setStudentStatuses(updated);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const records = Object.keys(studentStatuses).map(sid => ({
      studentId: sid,
      status: studentStatuses[sid]
    }));
    markAttendance(selectedClassId, selectedDate, records);
    alert('Attendance successfully recorded and notifications sent!');
  };

  const handleExportAttendanceReport = () => {
    const list = attendanceRecords.filter(r => r.classroomId === selectedClassId);
    let csv = 'Record ID,Student ID,Date,Status\n';
    list.forEach(r => {
      csv += `${r.id},${r.studentId},${r.date},${r.status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `attendance-report-${selectedClassId}.csv`);
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Attendance Tracker</h1>
        <p className="text-sm text-text-secondary mt-1">Review lecture presence audits or log attendance logs.</p>
      </div>

      {/* STUDENT VIEW */}
      {isStudent && (
        <div className="space-y-6 text-left">
          {/* Main Stat Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect={false} padding="lg" className="md:col-span-1 flex flex-col justify-center items-center text-center space-y-3 bg-brand/5 border-brand/20">
              <CheckSquare className="w-10 h-10 text-brand" />
              <div>
                <span className="text-xs text-text-secondary font-bold uppercase tracking-wider block">Cumulative Attendance</span>
                <span className={`text-4xl font-extrabold block mt-2 ${overallAttPercent < 75 ? 'text-red-500' : 'text-green-500'}`}>
                  {overallAttPercent}%
                </span>
              </div>
              <p className="text-xs text-text-secondary">Needs to remain above 75% for exam eligibility.</p>
            </Card>

            <div className="md:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-text-primary">Classes Audit</h2>
              
              {overallAttPercent < 75 ? (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3 text-xs">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>
                    <strong>Caution:</strong> Your cumulative attendance is below 75%. Please secure additional lecture credits to avoid detention.
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl flex items-center gap-3 text-xs">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>
                    Your cumulative attendance is satisfactory. Excellent consistency!
                  </span>
                </div>
              )}

              {/* Table of Class Attendance */}
              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/5 border-b border-white/10 text-text-secondary uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Subject Code</th>
                      <th className="px-4 py-3">Subject Name</th>
                      <th className="px-4 py-3 text-center">Attended</th>
                      <th className="px-4 py-3 text-center">Percent</th>
                      <th className="px-4 py-3">Last Checked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-text-primary">
                    {studentStatsList.map((stat) => (
                      <tr key={stat.classId} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-semibold text-brand">{stat.code}</td>
                        <td className="px-4 py-3 truncate max-w-[200px]">{stat.name}</td>
                        <td className="px-4 py-3 text-center font-medium">{stat.attended} / {stat.total || 10}</td>
                        <td className={`px-4 py-3 text-center font-bold ${stat.percent < 75 ? 'text-red-500' : 'text-green-500'}`}>
                          {stat.percent}%
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{stat.lastMarked}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FACULTY VIEW */}
      {isFaculty && (
        <form onSubmit={handleSaveAttendance} className="space-y-6 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 dark:border-white/5 rounded-2xl p-4">
            
            {/* Filter selectors */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block" htmlFor="classSel">Select Class</label>
                <select
                  id="classSel"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="glass-input px-3 py-1.5 text-xs rounded-xl"
                >
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id} className="bg-bg-primary text-text-primary">{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block" htmlFor="dateSel">Lecture Date</label>
                <input
                  id="dateSel"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="glass-input px-3 py-1 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleMarkAll('present')} className="text-xs">
                Mark All Present
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleMarkAll('absent')} className="text-xs">
                Mark All Absent
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleExportAttendanceReport} className="text-xs">
                <FileDown className="w-3.5 h-3.5 mr-1" /> Export CSV
              </Button>
            </div>
          </div>

          {/* Student Grid Checklist */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-text-primary">Attendance Roster</h2>
            
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5 border-b border-white/10 text-text-secondary uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="px-6 py-3">Roll Number</th>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3 text-center">Roster Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-text-primary">
                  {MOCK_STUDENTS.map((stud) => {
                    const status = studentStatuses[stud.id] || 'present';
                    return (
                      <tr key={stud.id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 text-text-secondary font-medium">{stud.roll}</td>
                        <td className="px-6 py-3 font-bold">{stud.name}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(stud.id, 'present')}
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${status === 'present' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'border-white/10 text-text-secondary hover:text-text-primary'}`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(stud.id, 'absent')}
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${status === 'absent' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'border-white/10 text-text-secondary hover:text-text-primary'}`}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(stud.id, 'late')}
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${status === 'late' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'border-white/10 text-text-secondary hover:text-text-primary'}`}
                            >
                              <Clock className="w-3.5 h-3.5" /> Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end border-t border-white/10 pt-4">
            <Button type="submit" variant="primary">
              Save Attendance Record
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
