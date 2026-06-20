import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { 
  Users, FileText, CheckCircle, BarChart3, 
  Plus, FileSpreadsheet, ArrowRight, UserCheck, Calendar 
} from 'lucide-react';
import { Assignment, Submission } from '../types';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, classrooms, assignments, submissions, 
    addAssignment, gradeSubmission 
  } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'grades' | 'analytics'>('overview');
  
  // Grading Modal State
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [isGrading, setIsGrading] = useState(false);

  // Classroom selection (for overview/analytics filters)
  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0]?.id || '');

  if (!currentUser) return null;

  // Taught classes
  const myClasses = classrooms.filter(c => c.facultyId === currentUser.id || c.facultyId === 'fac-01');
  const activeClass = classrooms.find(c => c.id === selectedClassId) || classrooms[0];

  // Assignments for this teacher's class
  const teacherAssignments = assignments.filter(a => myClasses.some(c => c.id === a.classroomId));

  // Compute Stats
  const totalStudents = myClasses.reduce((acc, c) => acc + c.studentCount, 0);
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted').length;
  
  const gradedCount = submissions.filter(s => s.status === 'graded').length;
  const avgGrade = gradedCount > 0 
    ? Math.round(submissions.filter(s => s.status === 'graded').reduce((acc, s) => acc + (s.grade || 0), 0) / gradedCount)
    : 85;

  // Grade Book Row Items (Students list)
  const STUDENTS_LIST = [
    { id: 'stud-01', name: 'Nikhil Kumar' },
    { id: 'stud-02', name: 'Ayush Goel' },
    { id: 'stud-03', name: 'Riya Sen' },
    { id: 'stud-04', name: 'Dev Sharma' },
    { id: 'stud-05', name: 'Ishita Kapoor' }
  ];

  const handleGradeCellClick = (studentId: string, assignmentId: string) => {
    // Locate or create submission mock
    const sub = submissions.find(s => s.studentId === studentId && s.assignmentId === assignmentId);
    const mockSub: Submission = sub || {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId,
      studentName: STUDENTS_LIST.find(st => st.id === studentId)?.name || 'Student',
      fileUrl: '#',
      fileName: 'offline-submission.pdf',
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
    setSelectedSub(mockSub);
    setGradeInput(mockSub.grade || 90);
    setFeedbackInput(mockSub.feedback || '');
  };

  const handleGradeFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    setIsGrading(true);
    setTimeout(() => {
      gradeSubmission(selectedSub.id, gradeInput, feedbackInput);
      setIsGrading(false);
      setSelectedSub(null);
      toast.success('Grade updated and saved!');
    }, 800);
  };

  const handleExportGradeBook = () => {
    let csv = 'Student ID,Student Name';
    teacherAssignments.forEach(a => {
      csv += `,${a.title}`;
    });
    csv += '\n';

    STUDENTS_LIST.forEach(st => {
      csv += `${st.id},${st.name}`;
      teacherAssignments.forEach(a => {
        const sub = submissions.find(s => s.studentId === st.id && s.assignmentId === a.id);
        csv += `,${sub ? (sub.grade || 'Submitted') : 'Pending'}`;
      });
      csv += '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'gradebook-export.csv');
    a.click();
    toast.success('Gradebook exported successfully!');
  };

  // SVG Chart Computations for Analytics tab
  // 1. Grade distribution (Histogram)
  const gradeDistribution = [
    { range: '90-100', count: 18, pct: 40 },
    { range: '80-89', count: 15, pct: 33 },
    { range: '70-79', count: 9, pct: 20 },
    { range: '60-69', count: 4, pct: 7 },
    { range: '<60', count: 0, pct: 0 }
  ];

  // 2. Trendlines (student performance over weeks)
  // We can render SVG polyline
  const trendPoints = "10,90 80,75 150,85 220,60 290,50";

  return (
    <div className="space-y-6">
      {/* Overview Greeting */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 text-left">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Faculty Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">Prof. Ramesh Sharma &bull; Dept. of Computer Science</p>
          </div>

          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => navigate('/classroom')}>
              <Plus className="w-4 h-4 mr-2" /> Post Assignment
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/attendance')}>
              <UserCheck className="w-4 h-4 mr-2" /> Log Attendance
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Navigation tabs */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="flex bg-white/5 border border-white/10 dark:border-white/5 rounded-2xl p-1.5 max-w-lg">
          {(['overview', 'assignments', 'grades', 'analytics'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer capitalize ${activeTab === tab ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* TABS INNER PAGES */}
      {activeTab === 'overview' && (
        <div className="space-y-6 text-left">
          {/* Quick stats board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ScrollReveal direction="up" delay={0.3}>
              <Card hoverEffect={true} padding="sm" className="flex items-center gap-4 h-full">
                <div className="p-3 rounded-xl bg-brand/10 text-brand">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Total Students</span>
                  <span className="text-2xl font-extrabold text-text-primary block mt-0.5">
                    <AnimatedCounter value={totalStudents} />
                  </span>
                </div>
              </Card>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <Card hoverEffect={true} padding="sm" className="flex items-center gap-4 h-full">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Pending Grading</span>
                  <span className="text-2xl font-extrabold text-text-primary block mt-0.5">
                    <AnimatedCounter value={pendingSubmissions} /> <span className="text-sm font-normal">Submissions</span>
                  </span>
                </div>
              </Card>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.5}>
              <Card hoverEffect={true} padding="sm" className="flex items-center gap-4 h-full">
                <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Average Grade</span>
                  <span className="text-2xl font-extrabold text-text-primary block mt-0.5">
                    <AnimatedCounter value={avgGrade} suffix="%" />
                  </span>
                </div>
              </Card>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.6}>
              <Card hoverEffect={true} padding="sm" className="flex items-center gap-4 h-full">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Taught Subjects</span>
                  <span className="text-2xl font-extrabold text-text-primary block mt-0.5">
                    <AnimatedCounter value={myClasses.length} /> <span className="text-sm font-normal">active</span>
                  </span>
                </div>
              </Card>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Taught classes list */}
            <div className="lg:col-span-2 space-y-3">
              <ScrollReveal direction="left" delay={0.3}>
                <h2 className="text-lg font-bold text-text-primary">Taught Lectures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myClasses.map((cls) => (
                    <Card key={cls.id} padding="md" className="space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-brand uppercase tracking-wider">{cls.code}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-text-secondary border border-white/10">
                          {cls.semester}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-sm leading-snug line-clamp-1">{cls.name}</h3>
                        <p className="text-xs text-text-secondary mt-1">{cls.studentCount} Students registered</p>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                        <span className="text-text-secondary font-medium">Room: {cls.schedule[0]?.room}</span>
                        <button 
                          onClick={() => navigate('/classroom')}
                          className="text-brand hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                        >
                          Enter <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Recent Activity Log */}
            <div className="space-y-3">
              <ScrollReveal direction="right" delay={0.4}>
                <h2 className="text-lg font-bold text-text-primary">Recent Logs</h2>
                <Card hoverEffect={false} padding="md" className="space-y-4">
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 mt-1.5 rounded-full bg-brand shrink-0" />
                      <div>
                        <p className="text-text-primary font-bold">New Assignment Posted</p>
                        <p className="text-[11px] text-text-secondary mt-0.5">Posted Red-Black tree insertion analysis guidelines in CSE-301.</p>
                        <span className="text-[9px] text-text-secondary block mt-0.5">June 19, 10:00 AM</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0" />
                      <div>
                        <p className="text-text-primary font-bold">Grades Published</p>
                        <p className="text-[11px] text-text-secondary mt-0.5">Released marks for "Responsive Portal" homework assignment.</p>
                        <span className="text-[9px] text-text-secondary block mt-0.5">June 18, 04:30 PM</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                      <div>
                        <p className="text-text-primary font-bold">Attendance Logged</p>
                        <p className="text-[11px] text-text-secondary mt-0.5">Marked student attendance roll for Advanced DS lecture.</p>
                        <span className="text-[9px] text-text-secondary block mt-0.5">June 17, 11:30 AM</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <ScrollReveal direction="up">
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-primary">Active Curriculum Tasks</h2>
              <Button variant="primary" size="sm" onClick={() => navigate('/classroom')}>
                <Plus className="w-4 h-4 mr-2" /> Post Assignment
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {teacherAssignments.length === 0 ? (
                <Card hoverEffect={false} className="p-8 text-center text-text-secondary text-sm">
                  No assignments posted.
                </Card>
              ) : (
                teacherAssignments.map(a => {
                  const subCount = submissions.filter(s => s.assignmentId === a.id).length;
                  const gradedSubCount = submissions.filter(s => s.assignmentId === a.id && s.status === 'graded').length;
                  const cls = classrooms.find(c => c.id === a.classroomId);

                  return (
                    <Card 
                      key={a.id} 
                      padding="md"
                      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand/40 cursor-pointer"
                      onClick={() => navigate('/classroom')}
                    >
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-brand uppercase tracking-wider px-2 py-0.5 rounded bg-brand/10 border border-brand/20">{cls?.code || 'CSE'}</span>
                          <span className="text-xs text-text-secondary">Due {new Date(a.dueDate).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-bold text-text-primary text-sm leading-snug">{a.title}</h3>
                      </div>

                      <div className="flex gap-4 items-center shrink-0">
                        <div className="text-right">
                          <span className="text-xs text-text-secondary block">Submissions Received</span>
                          <span className="text-sm font-bold text-text-primary">{subCount} total &bull; {gradedSubCount} graded</span>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">
                          Grade Board
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </ScrollReveal>
      )}

      {activeTab === 'grades' && (
        <ScrollReveal direction="up">
          <div className="space-y-4 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Evaluation Ledger</h2>
                <p className="text-xs text-text-secondary">Direct matrix of assignment evaluations. Click cell boxes to release grades.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportGradeBook}>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Gradebook (CSV)
              </Button>
            </div>

            <div className="glass-panel border border-white/10 rounded-2xl overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[700px]">
                <thead className="bg-white/5 border-b border-white/10 text-text-secondary font-bold text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    {teacherAssignments.map(a => (
                      <th key={a.id} className="px-6 py-4 truncate max-w-[150px]">{a.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-text-primary">
                  {STUDENTS_LIST.map(st => (
                    <tr key={st.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-bold">{st.name}</td>
                      {teacherAssignments.map(a => {
                        const sub = submissions.find(s => s.studentId === st.id && s.assignmentId === a.id);
                        
                        return (
                          <td 
                            key={a.id} 
                            className="px-6 py-4"
                            onClick={() => handleGradeCellClick(st.id, a.id)}
                          >
                            {sub ? (
                              sub.status === 'graded' ? (
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-xl border border-green-500/20 cursor-pointer block text-center w-fit">
                                  {sub.grade}/100
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20 cursor-pointer block text-center w-fit">
                                  Ungraded
                                </span>
                              )
                            ) : (
                              <span className="text-xs text-text-secondary italic cursor-pointer block">
                                Pending
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      )}

      {activeTab === 'analytics' && (
        <ScrollReveal direction="up">
          <div className="space-y-6 text-left">
            {/* Class selector */}
            <div className="flex gap-2 bg-white/5 border border-white/10 dark:border-white/5 rounded-2xl p-4 items-center">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Select Class Analytics:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="glass-input px-3 py-1.5 text-xs rounded-xl"
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.id} className="bg-bg-primary text-text-primary">{c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grade Distribution Bar Graph (CSS bars) */}
              <Card hoverEffect={false} padding="lg" className="space-y-4">
                <div>
                  <h3 className="font-bold text-text-primary">Grade Distribution</h3>
                  <p className="text-xs text-text-secondary mt-0.5">Histogram range for recent CSE external reports.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {gradeDistribution.map(dist => (
                    <div key={dist.range} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-secondary">
                        <span>Marks: {dist.range}</span>
                        <span>{dist.count} Students ({dist.pct}%)</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-linear-to-r from-brand to-[#958ef0] rounded-full transition-all duration-500"
                          style={{ width: `${dist.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Performance trendline */}
              <Card hoverEffect={false} padding="lg" className="space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-text-primary">Performance Trendline</h3>
                  <p className="text-xs text-text-secondary mt-0.5">Average score fluctuation over syllabus chapters.</p>
                </div>

                {/* Responsive SVG Polyline graph */}
                <div className="w-full flex items-center justify-center pt-2">
                  <svg viewBox="0 0 300 100" className="w-full h-32 text-brand">
                    {/* Grid Lines */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    
                    {/* Trend Path */}
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      points={trendPoints}
                      className="drop-shadow-[0_2px_8px_rgba(127,119,221,0.4)]"
                    />
                    
                    {/* Points circles */}
                    <circle cx="10" cy="90" r="4" fill="currentColor" />
                    <circle cx="80" cy="75" r="4" fill="currentColor" />
                    <circle cx="150" cy="85" r="4" fill="currentColor" />
                    <circle cx="220" cy="60" r="4" fill="currentColor" />
                    <circle cx="290" cy="50" r="4" fill="currentColor" />
                  </svg>
                </div>

                <div className="flex justify-between text-[9px] font-bold text-text-secondary uppercase tracking-wider pt-2 border-t border-white/5">
                  <span>Ch.1 Basics</span>
                  <span>Ch.2 Search</span>
                  <span>Ch.3 Sorting</span>
                  <span>Ch.4 Graphs</span>
                  <span>Ch.5 Tries</span>
                </div>
              </Card>

              {/* Attendance patterns */}
              <Card hoverEffect={false} padding="lg" className="lg:col-span-2 space-y-4">
                <div>
                  <h3 className="font-bold text-text-primary">Attendance Patterns</h3>
                  <p className="text-xs text-text-secondary mt-0.5">Average weekly presence metrics across section cohorts.</p>
                </div>

                <div className="grid grid-cols-5 gap-3 pt-2 text-center">
                  {[
                    { w: 'Week 1', val: 94 },
                    { w: 'Week 2', val: 91 },
                    { w: 'Week 3', val: 88 },
                    { w: 'Week 4', val: 82 },
                    { w: 'Week 5', val: 87 }
                  ].map(item => (
                    <div key={item.w} className="space-y-2">
                      <span className="text-[10px] text-text-secondary font-medium block">{item.w}</span>
                      <div className="h-28 w-full bg-white/5 border border-white/5 rounded-xl flex items-end overflow-hidden p-1">
                        <div 
                          className="w-full bg-linear-to-t from-brand to-[#a099ff] rounded-lg transition-all"
                          style={{ height: `${item.val}%` }}
                          title={`${item.val}% attendance`}
                        />
                      </div>
                      <span className="text-xs font-bold text-text-primary block">{item.val}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Manual grade editor modal */}
      <Modal
        isOpen={selectedSub !== null}
        onClose={() => setSelectedSub(null)}
        title={`Evaluation Sheet: ${selectedSub?.studentName}`}
      >
        {selectedSub ? (
          <form onSubmit={handleGradeFormSubmit} className="space-y-4 text-left">
            <p className="text-xs text-text-secondary">Submitted File: <span className="text-brand font-semibold">{selectedSub.fileName}</span></p>
            <p className="text-xs text-text-secondary">Submission Date: {new Date(selectedSub.submittedAt).toLocaleString()}</p>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="gradeNum">Grade Score (Marks / 100)</label>
              <input
                id="gradeNum"
                type="number"
                min="0"
                max="100"
                value={gradeInput}
                onChange={(e) => setGradeInput(Number(e.target.value))}
                required
                className="glass-input w-full px-3 py-2 text-sm rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="feedText">Feedback Comments</label>
              <textarea
                id="feedText"
                rows={3}
                placeholder="Give descriptive grading remarks..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
              <Button type="button" variant="secondary" onClick={() => setSelectedSub(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isGrading}>
                Save & Release Grade
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
};
