import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { 
  FileText, Download, Upload, Search, 
  Plus, Calendar, Mail, FileDown, CheckCircle, Clock 
} from 'lucide-react';
import { Assignment, ClassroomMaterial, Submission } from '../types';

export const Classroom: React.FC = () => {
  const { 
    currentUser, classrooms, assignments, submissions, 
    materials, addAssignment, addMaterial, submitAssignment, gradeSubmission 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'assignments' | 'materials'>('assignments');
  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Forms
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newType, setNewType] = useState<'homework' | 'project' | 'quiz' | 'exam'>('homework');
  const [newMatName, setNewMatName] = useState('');
  const [newMatUrl, setNewMatUrl] = useState('');

  // Submit file form
  const [submitFileName, setSubmitFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Grading form
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [isGrading, setIsGrading] = useState(false);

  if (!currentUser) return null;

  const isStudent = currentUser.role === 'student';
  const isFaculty = currentUser.role === 'faculty';

  // Filter classroom
  const activeClass = classrooms.find(c => c.id === selectedClassId);

  // Filter data by selected class
  const classAssignments = assignments.filter(a => a.classroomId === selectedClassId);
  const classMaterials = materials.filter(m => m.classroomId === selectedClassId && m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Active student submissions
  const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id);

  const handlePostAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;
    addAssignment(selectedClassId, newTitle, newDesc, newDueDate, newType);
    setShowAddAssignmentModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    alert('Assignment posted successfully!');
  };

  const handlePostMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName || !newMatUrl) return;
    addMaterial(selectedClassId, newMatName, newMatUrl);
    setShowAddMaterialModal(false);
    setNewMatName('');
    setNewMatUrl('');
    alert('Material uploaded successfully!');
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !submitFileName) return;
    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(
        activeAssignment.id,
        `https://ipu.edu.in/submissions/${submitFileName}`,
        submitFileName
      );
      setIsSubmitting(false);
      setSubmitFileName('');
      setActiveAssignment(null);
      alert('Assignment submitted successfully!');
    }, 800);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    setIsGrading(true);
    setTimeout(() => {
      gradeSubmission(selectedSubmission.id, gradeScore, gradeFeedback);
      setIsGrading(false);
      setSelectedSubmission(null);
      setGradeFeedback('');
      alert('Grade saved and released!');
    }, 800);
  };

  // Mock Exports for faculty
  const handleExportGrades = () => {
    if (!activeAssignment) return;
    const list = submissions.filter(s => s.assignmentId === activeAssignment.id);
    let csv = 'Student ID,Name,Status,Submitted At,Grade,Feedback\n';
    list.forEach(s => {
      csv += `${s.studentId},${s.studentName || 'Student'},${s.status},${s.submittedAt},${s.grade || 'N/A'},"${s.feedback || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${activeAssignment.title}-grades.csv`);
    a.click();
  };

  const handleDownloadAll = () => {
    alert("Downloading all student submissions as ZIP (simulated).");
  };

  return (
    <div className="space-y-6">
      {/* Classroom Header and Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Campus Classroom</h1>
          <p className="text-sm text-text-secondary mt-1">Access lecture files, assignments, and submit coursework.</p>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="glass-input px-4 py-2.5 text-sm rounded-xl appearance-none pr-8 cursor-pointer font-medium"
          >
            {classrooms.map((cls) => (
              <option key={cls.id} value={cls.id} className="bg-bg-primary text-text-primary">
                {cls.code} - {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex justify-between items-center bg-white/5 border border-white/10 dark:border-white/5 rounded-2xl p-1.5 max-w-md">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'assignments' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Assignments
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'materials' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Notes & Materials
        </button>
      </div>

      {/* Main Tab Content Panels */}
      {activeTab === 'assignments' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-left">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Task Submissions</h2>
              <p className="text-xs text-text-secondary">Complete syllabus assignments and view progress markers.</p>
            </div>
            {isFaculty ? (
              <Button variant="primary" size="sm" onClick={() => setShowAddAssignmentModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Post Assignment
              </Button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {classAssignments.length === 0 ? (
              <Card hoverEffect={false} className="p-8 text-center text-text-secondary text-sm">
                No assignments found for this class.
              </Card>
            ) : (
              classAssignments.map((assign) => {
                let status: 'pending' | 'submitted' | 'graded' = 'pending';
                let grade: number | undefined = undefined;

                if (isStudent) {
                  const sub = studentSubmissions.find(s => s.assignmentId === assign.id);
                  if (sub) {
                    status = sub.status;
                    grade = sub.grade;
                  }
                } else {
                  // Faculty view: count status
                  const submissionsForAssign = submissions.filter(s => s.assignmentId === assign.id);
                  const gradedCount = submissionsForAssign.filter(s => s.status === 'graded').length;
                  const totalSub = submissionsForAssign.length;
                }

                return (
                  <Card 
                    key={assign.id} 
                    padding="md"
                    onClick={() => setActiveAssignment(assign)}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left cursor-pointer hover:border-brand/40"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-brand uppercase tracking-wider px-2 py-0.5 rounded bg-brand/10 border border-brand/20">
                          {assign.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-text-secondary">Due {new Date(assign.dueDate).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-text-primary text-sm leading-snug">{assign.title}</h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      {isStudent ? (
                        <>
                          {status === 'graded' ? (
                            <span className="text-xs font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-xl">
                              Graded: {grade}/100
                            </span>
                          ) : status === 'submitted' ? (
                            <span className="text-xs font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-xl">
                              Submitted
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-xl">
                              Pending
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs font-bold text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded-xl">
                          {submissions.filter(s => s.assignmentId === assign.id).length} submissions
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Materials tab */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Class Materials & Slides</h2>
              <p className="text-xs text-text-secondary">Download PDF guides, lecture handouts, and reference sheets.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex items-center flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input pl-9 pr-3 py-1.5 text-xs rounded-xl w-full sm:w-48"
                />
              </div>
              {isFaculty ? (
                <Button variant="primary" size="sm" onClick={() => setShowAddMaterialModal(true)}>
                  <Plus className="w-4.5 h-4.5 mr-1" /> Upload
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classMaterials.length === 0 ? (
              <Card hoverEffect={false} className="p-8 text-center text-text-secondary text-sm md:col-span-2">
                No lecture materials found matching the filters.
              </Card>
            ) : (
              classMaterials.map((mat) => (
                <Card 
                  key={mat.id} 
                  padding="md" 
                  className="flex justify-between items-start gap-4 text-left border border-white/5 hover:border-brand/40 cursor-pointer"
                  onClick={() => alert(`Downloading ${mat.name} (simulated).`)}
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-text-primary text-sm flex items-center gap-2 line-clamp-1">
                      <FileText className="w-4 h-4 text-brand shrink-0" />
                      {mat.name}
                    </h3>
                    <div className="flex gap-3 text-[11px] text-text-secondary pt-1">
                      <span>Uploader: {mat.uploaderName}</span>
                      <span>•</span>
                      <span>{mat.fileSize || '1.0 MB'}</span>
                    </div>
                  </div>
                  <button 
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-brand hover:bg-brand/10 transition-colors cursor-pointer"
                    aria-label="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Assignment Detail Modal: Students & Faculty views */}
      <Modal
        isOpen={activeAssignment !== null}
        onClose={() => setActiveAssignment(null)}
        title={activeAssignment?.title || 'Assignment Detail'}
      >
        {activeAssignment ? (
          <div className="space-y-6 text-left">
            <div className="space-y-2 border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold text-brand uppercase tracking-wider px-2 py-0.5 rounded bg-brand/10 border border-brand/20">
                {activeAssignment.type.toUpperCase()}
              </span>
              <p className="text-sm text-text-secondary leading-relaxed mt-2">{activeAssignment.description}</p>
              <div className="flex gap-4 text-xs text-text-secondary pt-2">
                <span>Created by: {activeClass?.facultyName || 'Professor'}</span>
                <span>•</span>
                <span className="text-red-400 font-semibold">Due: {new Date(activeAssignment.dueDate).toLocaleString()}</span>
              </div>
            </div>

            {/* IF STUDENT VIEW */}
            {isStudent && (() => {
              const sub = studentSubmissions.find(s => s.assignmentId === activeAssignment.id);
              return (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Submission Portal</h3>
                  
                  {sub ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                          <div>
                            <p className="text-xs font-semibold text-text-primary">Coursework Submitted</p>
                            <p className="text-[10px] text-text-secondary mt-0.5">File: <a href={sub.fileUrl} className="text-brand hover:underline font-semibold">{sub.fileName}</a></p>
                          </div>
                        </div>
                        <span className="text-[10px] text-text-secondary font-medium">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {sub.status === 'graded' ? (
                        <div className="p-4 rounded-xl border border-brand/20 bg-brand/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-brand uppercase tracking-wider">Faculty Feedback</span>
                            <span className="text-sm font-bold text-green-500">Marks: {sub.grade}/100</span>
                          </div>
                          <p className="text-xs text-text-primary italic">"{sub.feedback}"</p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-text-secondary italic">
                          Awaiting teacher grading evaluation.
                        </div>
                      )}

                      {/* Resubmit form */}
                      <form onSubmit={handleSubmitWork} className="space-y-3 pt-3 border-t border-white/5">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Resubmit Work</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="resubmitted-file.pdf"
                            value={submitFileName}
                            onChange={(e) => setSubmitFileName(e.target.value)}
                            className="glass-input flex-1 px-3 py-1.5 text-xs rounded-xl"
                          />
                          <Button type="submit" variant="primary" size="sm" disabled={!submitFileName} loading={isSubmitting}>
                            Resubmit
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitWork} className="space-y-4">
                      <div className="border border-dashed border-white/10 p-5 rounded-2xl text-center space-y-2 relative">
                        <input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSubmitFileName(e.target.files[0].name);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-6 h-6 text-brand mx-auto" />
                        <p className="text-xs font-semibold text-text-primary">Click to select files for submission</p>
                      </div>

                      {submitFileName ? (
                        <div className="p-2.5 rounded-lg bg-brand/5 border border-brand/20 flex justify-between text-xs items-center">
                          <span className="text-brand font-semibold truncate max-w-sm">{submitFileName}</span>
                          <span className="text-[10px] text-text-secondary">Ready</span>
                        </div>
                      ) : null}

                      <Button type="submit" variant="primary" fullWidth disabled={!submitFileName} loading={isSubmitting}>
                        Submit Assignment
                      </Button>
                    </form>
                  )}
                </div>
              );
            })()}

            {/* IF FACULTY VIEW */}
            {isFaculty && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Submissions Ledger</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadAll} className="text-xs py-1">
                      <FileDown className="w-3.5 h-3.5 mr-1" /> Download ZIP
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportGrades} className="text-xs py-1">
                      <FileDown className="w-3.5 h-3.5 mr-1" /> Export CSV
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {submissions.filter(s => s.assignmentId === activeAssignment.id).length === 0 ? (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center text-xs text-text-secondary italic">
                      No submissions received yet.
                    </div>
                  ) : (
                    submissions
                      .filter(s => s.assignmentId === activeAssignment.id)
                      .map((sub) => (
                        <div 
                          key={sub.id} 
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setGradeScore(sub.grade || 90);
                            setGradeFeedback(sub.feedback || '');
                          }}
                          className="p-3 bg-white/5 border border-white/10 hover:border-brand/40 rounded-xl flex justify-between items-center transition-all cursor-pointer"
                        >
                          <div className="text-left space-y-0.5">
                            <p className="text-xs font-bold text-text-primary">{sub.studentName || 'Student'}</p>
                            <p className="text-[10px] text-brand hover:underline font-semibold truncate max-w-[200px]">
                              {sub.fileName}
                            </p>
                          </div>
                          <div>
                            {sub.status === 'graded' ? (
                              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2.5 py-0.5 rounded-lg border border-green-500/20">
                                {sub.grade}/100
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20">
                                Ungraded
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/10">
              <Button variant="secondary" onClick={() => setActiveAssignment(null)}>
                Close Window
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Grade Submission Modal (Teacher Action) */}
      <Modal
        isOpen={selectedSubmission !== null}
        onClose={() => setSelectedSubmission(null)}
        title={`Grade: ${selectedSubmission?.studentName}`}
      >
        {selectedSubmission ? (
          <form onSubmit={handleGradeSubmit} className="space-y-4 text-left">
            <p className="text-xs text-text-secondary">Submitted File: <a href={selectedSubmission.fileUrl} className="text-brand font-semibold hover:underline">{selectedSubmission.fileName}</a></p>
            <p className="text-xs text-text-secondary">Time Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="score">Grade (Score / 100)</label>
              <input
                id="score"
                type="number"
                min="0"
                max="100"
                value={gradeScore}
                onChange={(e) => setGradeScore(Number(e.target.value))}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="feedback">Feedback Remarks</label>
              <textarea
                id="feedback"
                rows={3}
                placeholder="Good logic. Code clean. Ensure edge cases are handled..."
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
              <Button type="button" variant="secondary" onClick={() => setSelectedSubmission(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isGrading}>
                Save Grade
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>

      {/* Add Assignment Modal (Teacher Only) */}
      <Modal
        isOpen={showAddAssignmentModal}
        onClose={() => setShowAddAssignmentModal(false)}
        title="Post New Assignment"
      >
        <form onSubmit={handlePostAssignment} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="assignTitle">Assignment Title</label>
            <input
              id="assignTitle"
              type="text"
              required
              placeholder="e.g. Heap Sort Implementation"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="assignDesc">Description Requirements</label>
            <textarea
              id="assignDesc"
              rows={3}
              required
              placeholder="Detail assignment instructions, inputs, and submission files format..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm rounded-xl resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="assignDue">Due Date</label>
              <input
                id="assignDue"
                type="datetime-local"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="assignType">Task Type</label>
              <select
                id="assignType"
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="homework">Homework</option>
                <option value="project">Project</option>
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={() => setShowAddAssignmentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Post to Class
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Material Modal (Teacher Only) */}
      <Modal
        isOpen={showAddMaterialModal}
        onClose={() => setShowAddMaterialModal(false)}
        title="Upload Class Lecture Material"
      >
        <form onSubmit={handlePostMaterial} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="matName">Material Display Name</label>
            <input
              id="matName"
              type="text"
              required
              placeholder="e.g. Unit 3 - Compiler Syntax Analysis.pdf"
              value={newMatName}
              onChange={(e) => setNewMatName(e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="matLink">Resource Link (PDF / Slide URL)</label>
            <input
              id="matLink"
              type="url"
              required
              placeholder="https://example.com/lecture.pdf"
              value={newMatUrl}
              onChange={(e) => setNewMatUrl(e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm rounded-xl"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={() => setShowAddMaterialModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Upload Material
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
