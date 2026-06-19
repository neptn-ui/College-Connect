// User Role Type
export type UserRole = 'student' | 'faculty' | 'admin';

// User definition
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  phone: string;
}

// Classroom schedule item
export interface ClassSchedule {
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '10:30'
  room: string;
}

// Classroom definition
export interface Classroom {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  facultyName: string;
  semester: string;
  section: string;
  studentCount: number;
  schedule: ClassSchedule[];
}

// Assignment definition
export interface Assignment {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  dueDate: string; // ISO date
  type: 'homework' | 'project' | 'quiz' | 'exam';
  fileUrl?: string;
  createdAt: string;
  createdBy: string; // faculty id
}

// Submission definition
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string; // added for easy UI rendering
  fileUrl: string;
  fileName?: string; // name of uploaded file
  status: 'submitted' | 'pending' | 'graded';
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

// Attendance record
export interface Attendance {
  id: string;
  classroomId: string;
  studentId: string;
  date: string; // ISO date format (YYYY-MM-DD)
  status: 'present' | 'absent' | 'late';
}

// Direct or Group Message definition
export interface Message {
  id: string;
  senderId: string;
  senderName: string; // convenient UI helper
  senderAvatar?: string;
  receiverId: string | null; // null if group message
  groupId: string | null; // null if direct message
  content: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  readAt?: string;
}

// Collaboration Group definition
export interface Group {
  id: string;
  name: string;
  description: string;
  type: 'study' | 'class';
  creatorId: string;
  members: string[]; // user ids
  isPublic: boolean;
  createdAt: string;
}

// Notification definition
export interface Notification {
  id: string;
  userId: string;
  type: 'assignment_posted' | 'assignment_graded' | 'new_message' | 'attendance_marked';
  title: string;
  message: string;
  relatedId: string; // assignment id, message id, etc.
  read: boolean;
  createdAt: string;
}

// Lost & Found item definition
export interface LostFoundItem {
  id: string;
  photoUrl?: string;
  title: string;
  description: string;
  location: string;
  datePosted: string; // ISO date
  contactInfo: string;
  type: 'lost' | 'found';
  category: string;
  postedBy: string; // user id
  posterName: string;
}

// Notes & Classroom Materials definition
export interface ClassroomMaterial {
  id: string;
  classroomId: string;
  name: string;
  fileUrl: string;
  fileSize?: string;
  uploadDate: string;
  uploaderName: string;
}
