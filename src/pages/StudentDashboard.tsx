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
  Calendar, CheckSquare, Award, AlertTriangle, 
  ArrowRight, FileText, Upload, User, CheckCircle
} from 'lucide-react';
import { Assignment, Submission } from '../types';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, classrooms, assignments, submissions, 
    attendanceRecords, submitAssignment 
  } = useAuth();
  const toast = useToast();

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) return null;

  // 1. Calculate dynamic statistics
  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);
  const completedCount = mySubmissions.length;
  
  // Calculate attendance %
  const myAttendance = attendanceRecords.filter(r => r.studentId === currentUser.id);
  const presentCount = myAttendance.filter(r => r.status === 'present' || r.status === 'late').length;
  const attendancePercent = myAttendance.length > 0 
    ? Math.round((presentCount / myAttendance.length) * 100) 
    : 84; // default mock fallback

  // 2. Filter classes for Today (Monday for demo representation)
  // Let's grab classes scheduled on Mon / Wed
  const upcomingClasses = classrooms.slice(0, 3);

  // 3. Filter pending assignments
  const pendingAssignments = assignments.filter(assign => {
    const isSubmitted = mySubmissions.some(sub => sub.assignmentId === assign.id);
    return !isSubmitted;
  });

  // 4. Graded assignments
  const gradedSubmissions = mySubmissions.filter(s => s.status === 'graded');

  // 5. Announcements mock data
  const announcements = [
    {
      id: 1,
      title: 'End Term Practical Examinations Schedule',
      body: 'The datesheets for external labs have been published. Check your notice board in IT Block.',
      date: 'June 19, 2026',
      author: 'Dr. Sunita Verma'
    },
    {
      id: 2,
      title: 'Hackathon Registration Open: IPU Innovates',
      body: 'Submit your ideas before June 24. Cash prizes up to Rs. 50,000 for top Web & AI projects.',
      date: 'June 18, 2026',
      author: 'Prof. Amit Gupta'
    },
    {
      id: 3,
      title: 'Rescheduled Class Notice',
      body: 'The advanced DS class on Monday 22nd June will begin at 09:30 AM instead of 09:00 AM due to a department briefing.',
      date: 'June 17, 2026',
      author: 'Prof. Ramesh Sharma'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFileName(e.target.files[0].name);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !uploadFileName) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(
        selectedAssignment.id,
        `https://ipu.edu.in/submissions/${uploadFileName}`,
        uploadFileName
      );
      setIsSubmitting(false);
      setSelectedAssignment(null);
      setUploadFileName('');
      toast.success('Assignment submitted successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-linear-to-r from-brand/10 to-brand-light/10 border border-brand/20">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Here is what's happening on your campus today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/timetable')}>
              View Timetable
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/classroom')}>
              Go to Classroom
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Stat */}
        <ScrollReveal direction="up" delay={0.2}>
          <Card hoverEffect={true} padding="sm" className="flex items-center gap-4 relative overflow-hidden h-full">
            <div className={`p-3 rounded-xl ${attendancePercent < 75 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-text-secondary font-medium uppercase tracking-wider block">Attendance</span>
              <span className="text-2xl font-bold text-text-primary mt-0.5">
                <AnimatedCounter value={attendancePercent} suffix="%" />
              </span>
            </div>
            {attendancePercent < 75 ? (
              <div className="absolute right-3 top-3 text-red-500" title="Attendance under 75%!">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
            ) : null}
          </Card>
        </ScrollReveal>

        {/* GPA Stat */}
        <ScrollReveal direction="up" delay={0.3}>
          <Card hoverEffect={true} padding="sm" className="flex items-center gap-4 h-full">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-text-secondary font-medium uppercase tracking-wider block">SGPA</span>
              <span className="text-2xl font-bold text-text-primary mt-0.5">
                <AnimatedCounter value={8.84} decimals={2} />
              </span>
            </div>
          </Card>
        </ScrollReveal>

        {/* Completed Assignments */}
        <ScrollReveal direction="up" delay={0.4}>
          <Card hoverEffect={true} padding="sm" className="flex items-center gap-4 h-full">
            <div className="p-3 rounded-xl bg-brand/10 text-brand">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-text-secondary font-medium uppercase tracking-wider block">Assignments</span>
              <span className="text-2xl font-bold text-text-primary mt-0.5">
                <AnimatedCounter value={completedCount} /> <span className="text-sm font-normal">Completed</span>
              </span>
            </div>
          </Card>
        </ScrollReveal>

        {/* Classes Today */}
        <ScrollReveal direction="up" delay={0.5}>
          <Card hoverEffect={true} padding="sm" className="flex items-center gap-4 h-full">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-text-secondary font-medium uppercase tracking-wider block">Today's Classes</span>
              <span className="text-2xl font-bold text-text-primary mt-0.5">
                <AnimatedCounter value={upcomingClasses.length} /> <span className="text-sm font-normal">Scheduled</span>
              </span>
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {attendancePercent < 75 ? (
        <ScrollReveal direction="up">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              <strong>Attendance Warning:</strong> Your overall attendance is {attendancePercent}%, which is below the mandatory 75% limit set by GGSIPU. Please contact your coordinator.
            </span>
          </div>
        </ScrollReveal>
      ) : null}

      {/* Main Content Layout splits 2:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Classes & Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes */}
          <ScrollReveal direction="left" delay={0.2}>
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-text-primary">Today's Lectures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingClasses.map((cls) => (
                  <Card 
                    key={cls.id} 
                    padding="md" 
                    onClick={() => navigate('/classroom')} 
                    className="space-y-3 text-left hover:border-brand/40 cursor-pointer"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-brand uppercase tracking-wider">{cls.code}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 text-text-secondary">
                        {cls.schedule[0]?.room || 'Lab'}
                      </span>
                    </div>
                    <h3 className="font-bold text-text-primary text-sm leading-snug line-clamp-1">{cls.name}</h3>
                    <div className="flex justify-between items-center text-xs text-text-secondary pt-2 border-t border-white/5">
                      <span>{cls.facultyName}</span>
                      <span className="font-medium text-brand">{cls.schedule[0]?.startTime} - {cls.schedule[0]?.endTime}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Pending Tasks */}
          <ScrollReveal direction="left" delay={0.3}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-text-primary">Pending Assignments</h2>
                <button 
                  onClick={() => navigate('/classroom')}
                  className="text-xs text-brand hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  All Assignments <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {pendingAssignments.length === 0 ? (
                <Card hoverEffect={false} className="text-center p-8 text-text-secondary text-sm">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  All assignments submitted! You are caught up.
                </Card>
              ) : (
                <div className="space-y-3">
                  {pendingAssignments.slice(0, 3).map((assign) => (
                    <div 
                      key={assign.id}
                      className="p-4 rounded-xl glass-panel hover:bg-white/5 transition-colors border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">{assign.title}</h4>
                        <p className="text-xs text-text-secondary mt-1">Due Date: {new Date(assign.dueDate).toLocaleDateString()} at {new Date(assign.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => setSelectedAssignment(assign)}
                        className="shrink-0"
                      >
                        Submit Work
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Recent Grades */}
          <ScrollReveal direction="left" delay={0.4}>
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-text-primary">Recent Gradebook</h2>
              {gradedSubmissions.length === 0 ? (
                <Card hoverEffect={false} className="text-center p-6 text-text-secondary text-xs">
                  No recent grades available.
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gradedSubmissions.slice(0, 2).map((sub) => {
                    const assign = assignments.find(a => a.id === sub.assignmentId);
                    return (
                      <Card 
                        key={sub.id} 
                        padding="md"
                        onClick={() => setSelectedSubmission(sub)}
                        className="text-left cursor-pointer space-y-3 hover:border-green-500/30"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-text-secondary">Grade & Feedback</span>
                          <span className="text-sm font-bold text-green-500">{sub.grade}/100</span>
                        </div>
                        <h4 className="text-sm font-bold text-text-primary line-clamp-1">{assign?.title || 'Assignment'}</h4>
                        <p className="text-xs text-text-secondary line-clamp-2 italic">"{sub.feedback}"</p>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Right Side: Announcements panel */}
        <div className="space-y-6">
          <ScrollReveal direction="right" delay={0.2}>
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-text-primary">Announcements</h2>
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <Card key={ann.id} hoverEffect={true} padding="md" className="text-left border border-white/5 space-y-2 bg-white/[0.01]">
                    <h4 className="text-xs font-semibold text-brand tracking-wide uppercase">{ann.author}</h4>
                    <h3 className="font-bold text-text-primary text-sm leading-snug">{ann.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{ann.body}</p>
                    <span className="text-[10px] text-text-secondary block pt-1 border-t border-white/5">{ann.date}</span>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Assignment Submit Modal */}
      <Modal
        isOpen={selectedAssignment !== null}
        onClose={() => { setSelectedAssignment(null); setUploadFileName(''); }}
        title={`Submit Work: ${selectedAssignment?.title}`}
      >
        {selectedAssignment ? (
          <form onSubmit={handleUploadSubmit} className="space-y-6">
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold text-brand uppercase tracking-wider">Assignment Description</span>
              <p className="text-sm text-text-secondary leading-relaxed">{selectedAssignment.description}</p>
              <p className="text-xs text-red-400 mt-2 font-medium">Due Date: {new Date(selectedAssignment.dueDate).toLocaleString()}</p>
            </div>

            {/* File Upload Box */}
            <div className="border-2 border-dashed border-white/10 dark:border-white/5 rounded-2xl p-6 text-center hover:border-brand/40 transition-colors relative cursor-pointer">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-text-secondary mx-auto mb-3" />
              <p className="text-sm font-semibold text-text-primary">Click to select files or drag-and-drop</p>
              <p className="text-xs text-text-secondary mt-1">PDF, DOCX, ZIP, or code files up to 10MB</p>
            </div>

            {uploadFileName ? (
              <div className="p-3 bg-brand/5 border border-brand/20 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-brand truncate max-w-sm">{uploadFileName}</span>
                <span className="text-[10px] text-text-secondary font-medium">Ready</span>
              </div>
            ) : null}

            <div className="flex gap-3 justify-end pt-2 border-t border-white/10">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => { setSelectedAssignment(null); setUploadFileName(''); }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!uploadFileName}
                loading={isSubmitting}
              >
                Submit Assignment
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>

      {/* Grade Feedback Details Modal */}
      <Modal
        isOpen={selectedSubmission !== null}
        onClose={() => setSelectedSubmission(null)}
        title="Grade Details"
      >
        {selectedSubmission ? (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Evaluation Status</h4>
                <p className="text-sm font-bold text-green-500 mt-1 uppercase">Graded & Released</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Final Marks</h4>
                <p className="text-2xl font-black text-green-500 mt-1">{selectedSubmission.grade} <span className="text-xs text-text-secondary font-normal">/ 100</span></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-brand uppercase tracking-wider block">Faculty Feedback</span>
              <p className="text-sm text-text-primary leading-relaxed italic">"{selectedSubmission.feedback}"</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Submission History</span>
              <p className="text-xs text-text-secondary">Submitted File: <a href={selectedSubmission.fileUrl} className="text-brand hover:underline font-semibold">{selectedSubmission.fileName || 'submission.zip'}</a></p>
              <p className="text-xs text-text-secondary">Time Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <Button 
                variant="secondary" 
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
