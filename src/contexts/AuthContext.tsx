import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Classroom, Assignment, Submission, 
  Attendance, Message, Group, Notification, 
  LostFoundItem, ClassroomMaterial, UserRole 
} from '../types';

interface AuthContextType {
  currentUser: User | null;
  classrooms: Classroom[];
  assignments: Assignment[];
  submissions: Submission[];
  attendanceRecords: Attendance[];
  messages: Message[];
  groups: Group[];
  notifications: Notification[];
  lostFoundItems: LostFoundItem[];
  materials: ClassroomMaterial[];
  
  // Actions
  login: (email: string, role: UserRole) => boolean;
  signup: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (name: string, email: string, phone: string, profilePicture?: string) => void;
  
  // Classroom actions
  addAssignment: (classroomId: string, title: string, description: string, dueDate: string, type: Assignment['type']) => void;
  addMaterial: (classroomId: string, name: string, fileUrl: string) => void;
  
  // Submission actions
  submitAssignment: (assignmentId: string, fileUrl: string, fileName: string) => void;
  gradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  
  // Attendance actions
  markAttendance: (classroomId: string, date: string, records: { studentId: string; status: Attendance['status'] }[]) => void;
  
  // Message actions
  sendMessage: (receiverId: string | null, groupId: string | null, content: string, fileUrl?: string, fileName?: string) => void;
  
  // Group actions
  createGroup: (name: string, description: string, type: 'study' | 'class', isPublic: boolean, memberIds: string[]) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  
  // Lost & Found actions
  postLostFoundItem: (title: string, description: string, location: string, contactInfo: string, type: 'lost' | 'found', category: string) => void;
  
  // Notification actions
  markNotificationsAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// MOCK CONSTANTS FOR INITIAL LOAD
const MOCK_USERS: Record<UserRole, User> = {
  student: {
    id: 'stud-01',
    name: 'Nikhil Kumar',
    email: 'nikhil.stud@ipu.edu.in',
    role: 'student',
    profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    phone: '+91 98765 43210'
  },
  faculty: {
    id: 'fac-01',
    name: 'Prof. Ramesh Sharma',
    email: 'rsharma@ipu.edu.in',
    role: 'faculty',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    phone: '+91 98111 22233'
  },
  admin: {
    id: 'adm-01',
    name: 'Admin Controller',
    email: 'admin@ipu.edu.in',
    role: 'admin',
    phone: '+91 99999 88888'
  }
};

const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'class-01',
    name: 'Advanced Data Structures & Algorithms',
    code: 'CSE-301',
    facultyId: 'fac-01',
    facultyName: 'Prof. Ramesh Sharma',
    semester: '5th Sem',
    section: 'CSE-A',
    studentCount: 48,
    schedule: [
      { day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Block B - 302' },
      { day: 'Wednesday', startTime: '11:00', endTime: '12:30', room: 'Block B - 302' }
    ]
  },
  {
    id: 'class-02',
    name: 'Web Engineering & Technologies',
    code: 'CSE-303',
    facultyId: 'fac-01',
    facultyName: 'Prof. Ramesh Sharma',
    semester: '5th Sem',
    section: 'CSE-A',
    studentCount: 48,
    schedule: [
      { day: 'Tuesday', startTime: '10:00', endTime: '11:30', room: 'Lab 4 - IT Block' },
      { day: 'Thursday', startTime: '14:00', endTime: '15:30', room: 'Lab 4 - IT Block' }
    ]
  },
  {
    id: 'class-03',
    name: 'Database Management Systems',
    code: 'CSE-305',
    facultyId: 'fac-02',
    facultyName: 'Dr. Sunita Verma',
    semester: '5th Sem',
    section: 'CSE-A',
    studentCount: 45,
    schedule: [
      { day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Block A - 105' },
      { day: 'Friday', startTime: '10:00', endTime: '11:30', room: 'Block A - 105' }
    ]
  },
  {
    id: 'class-04',
    name: 'Compiler Design',
    code: 'CSE-307',
    facultyId: 'fac-03',
    facultyName: 'Prof. Amit Gupta',
    semester: '5th Sem',
    section: 'CSE-A',
    studentCount: 42,
    schedule: [
      { day: 'Monday', startTime: '13:00', endTime: '14:30', room: 'Block B - 101' },
      { day: 'Thursday', startTime: '09:00', endTime: '10:30', room: 'Block B - 101' }
    ]
  }
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-01',
    classroomId: 'class-01',
    title: 'Red-Black Tree Insertion & Deletion',
    description: 'Implement a working Red-Black Tree in C++ or Java with visualization of child rotations and node recolorings. Submit the complete code along with a brief analysis report in PDF.',
    dueDate: '2026-06-25T23:59:00Z',
    type: 'homework',
    createdAt: '2026-06-15T09:00:00Z',
    createdBy: 'fac-01'
  },
  {
    id: 'assign-02',
    classroomId: 'class-02',
    title: 'Responsive Glassmorphism Student Portal',
    description: 'Build a landing page prototype using Tailwind CSS. Your implementation must feature high-quality blur filters, custom SVG elements, dynamic themes (light/dark toggle), and fluid responsive properties.',
    dueDate: '2026-06-22T23:59:00Z',
    type: 'project',
    createdAt: '2026-06-18T10:00:00Z',
    createdBy: 'fac-01'
  },
  {
    id: 'assign-03',
    classroomId: 'class-03',
    title: 'SQL Normalization & Index Tuning',
    description: 'Solve the relational normalization sheets and design optimized B-Tree indexing queries for the provided schema. Highlight execution plans.',
    dueDate: '2026-06-29T23:59:00Z',
    type: 'homework',
    createdAt: '2026-06-19T08:00:00Z',
    createdBy: 'fac-02'
  }
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-01',
    assignmentId: 'assign-01',
    studentId: 'stud-01',
    studentName: 'Nikhil Kumar',
    fileUrl: 'https://ipu.edu.in/submissions/nikhil-rb-tree.pdf',
    fileName: 'nikhil-rb-tree.pdf',
    status: 'graded',
    submittedAt: '2026-06-18T14:32:00Z',
    grade: 92,
    feedback: 'Excellent work implementing rotations. The explanation was clear and the edge cases were covered well.'
  },
  {
    id: 'sub-02',
    assignmentId: 'assign-02',
    studentId: 'stud-01',
    studentName: 'Nikhil Kumar',
    fileUrl: 'https://ipu.edu.in/submissions/nikhil-glassmorphism.zip',
    fileName: 'nikhil-glassmorphism.zip',
    status: 'submitted',
    submittedAt: '2026-06-19T22:15:00Z'
  }
];

const INITIAL_ATTENDANCE: Attendance[] = [
  // Class-01
  { id: 'att-01', classroomId: 'class-01', studentId: 'stud-01', date: '2026-06-15', status: 'present' },
  { id: 'att-02', classroomId: 'class-01', studentId: 'stud-01', date: '2026-06-17', status: 'present' },
  { id: 'att-03', classroomId: 'class-01', studentId: 'stud-02', date: '2026-06-15', status: 'absent' },
  // Class-02
  { id: 'att-04', classroomId: 'class-02', studentId: 'stud-01', date: '2026-06-16', status: 'present' },
  { id: 'att-05', classroomId: 'class-02', studentId: 'stud-01', date: '2026-06-18', status: 'absent' },
  // Class-03
  { id: 'att-06', classroomId: 'class-03', studentId: 'stud-01', date: '2026-06-17', status: 'present' },
  // Class-04
  { id: 'att-07', classroomId: 'class-04', studentId: 'stud-01', date: '2026-06-15', status: 'absent' },
  { id: 'att-08', classroomId: 'class-04', studentId: 'stud-01', date: '2026-06-18', status: 'absent' }
];

const INITIAL_GROUPS: Group[] = [
  {
    id: 'grp-01',
    name: 'Algorithm Ninjas',
    description: 'Preparing for placements and discussing advanced data structure assignments.',
    type: 'study',
    creatorId: 'stud-01',
    members: ['stud-01', 'stud-02', 'stud-03'],
    isPublic: true,
    createdAt: '2026-06-01T09:00:00Z'
  },
  {
    id: 'grp-02',
    name: 'Vite & Tailwind Engineers',
    description: 'Class project group for building cool frontend portals.',
    type: 'class',
    creatorId: 'stud-01',
    members: ['stud-01', 'stud-04'],
    isPublic: true,
    createdAt: '2026-06-05T12:00:00Z'
  },
  {
    id: 'grp-03',
    name: 'Compiler Design Study Prep',
    description: 'Helping each other with grammar rules and parsing tables.',
    type: 'study',
    creatorId: 'stud-03',
    members: ['stud-02', 'stud-03'],
    isPublic: false,
    createdAt: '2026-06-10T14:00:00Z'
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-01',
    senderId: 'fac-01',
    senderName: 'Prof. Ramesh Sharma',
    receiverId: 'stud-01',
    groupId: null,
    content: 'Hi Nikhil, the code you submitted for the RB Tree works perfectly. Can you demonstrate it to the class on Monday?',
    createdAt: '2026-06-19T09:30:00Z',
    readAt: '2026-06-19T10:00:00Z'
  },
  {
    id: 'msg-02',
    senderId: 'stud-01',
    senderName: 'Nikhil Kumar',
    receiverId: 'fac-01',
    groupId: null,
    content: 'Yes Professor, I would be happy to show the visualizer. I will make sure the slides are ready.',
    createdAt: '2026-06-19T10:15:00Z'
  },
  {
    id: 'msg-03',
    senderId: 'stud-02',
    senderName: 'Ayush Goel',
    receiverId: null,
    groupId: 'grp-01',
    content: 'Hey guys, did anyone figure out the delete operation for Red-Black trees? The double black case is killing me.',
    createdAt: '2026-06-19T18:00:00Z'
  },
  {
    id: 'msg-04',
    senderId: 'stud-01',
    senderName: 'Nikhil Kumar',
    receiverId: null,
    groupId: 'grp-01',
    content: 'Check the standard CLRS book rules. I also uploaded a cheat sheet in our resources folder.',
    createdAt: '2026-06-19T18:10:00Z'
  }
];

const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-01',
    title: 'Boat Airdopes 141 Case',
    description: 'Found a black charging case for Boat earbuds near the C-Block elevator. It has a red scratch on the logo.',
    location: 'C-Block, 3rd Floor Elevator Lobby',
    datePosted: '2026-06-19T11:00:00Z',
    contactInfo: 'Nikhil: +91 98765 43210',
    type: 'found',
    category: 'Electronics',
    postedBy: 'stud-01',
    posterName: 'Nikhil Kumar'
  },
  {
    id: 'lf-02',
    title: 'Parker Fountain Pen',
    description: 'Lost my silver Parker pen during the CD exam in Room 204. It has a gold clip and sentimental value.',
    location: 'Room 204, Block B',
    datePosted: '2026-06-18T16:00:00Z',
    contactInfo: 'Ayush: ayush@ipu.edu.in',
    type: 'lost',
    category: 'Stationery',
    postedBy: 'stud-02',
    posterName: 'Ayush Goel'
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'not-01',
    userId: 'stud-01',
    type: 'assignment_graded',
    title: 'Assignment Graded',
    message: 'Your submission for "Red-Black Tree" has been graded by Prof. Ramesh Sharma. Score: 92/100.',
    relatedId: 'assign-01',
    read: false,
    createdAt: '2026-06-19T15:00:00Z'
  },
  {
    id: 'not-02',
    userId: 'stud-01',
    type: 'assignment_posted',
    title: 'New Assignment Posted',
    message: 'Dr. Sunita Verma posted a new assignment: "SQL Normalization & Index Tuning" in DBMS.',
    relatedId: 'assign-03',
    read: false,
    createdAt: '2026-06-19T08:00:00Z'
  },
  {
    id: 'not-03',
    userId: 'stud-01',
    type: 'new_message',
    title: 'New Message from Faculty',
    message: 'Prof. Ramesh Sharma sent you a message: "Hi Nikhil, the code you..."',
    relatedId: 'fac-01',
    read: true,
    createdAt: '2026-06-19T09:30:00Z'
  }
];

const INITIAL_MATERIALS: ClassroomMaterial[] = [
  {
    id: 'mat-01',
    classroomId: 'class-01',
    name: 'Red-Black Tree Animations Slide.pdf',
    fileUrl: 'https://ipu.edu.in/resources/rb-tree-slides.pdf',
    fileSize: '3.4 MB',
    uploadDate: '2026-06-15T09:10:00Z',
    uploaderName: 'Prof. Ramesh Sharma'
  },
  {
    id: 'mat-02',
    classroomId: 'class-02',
    name: 'Tailwind CSS Glassmorphism CheatSheet.pdf',
    fileUrl: 'https://ipu.edu.in/resources/tailwind-glassmorphism.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-06-18T10:15:00Z',
    uploaderName: 'Prof. Ramesh Sharma'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or use initial templates
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cc_user');
    return saved ? JSON.parse(saved) : MOCK_USERS.student; // Default logged in as student
  });

  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem('cc_classrooms');
    return saved ? JSON.parse(saved) : INITIAL_CLASSROOMS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('cc_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('cc_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('cc_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('cc_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('cc_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('cc_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(() => {
    const saved = localStorage.getItem('cc_lostfound');
    return saved ? JSON.parse(saved) : INITIAL_LOST_FOUND;
  });

  const [materials, setMaterials] = useState<ClassroomMaterial[]>(() => {
    const saved = localStorage.getItem('cc_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cc_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cc_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem('cc_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('cc_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('cc_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('cc_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('cc_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('cc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cc_lostfound', JSON.stringify(lostFoundItems));
  }, [lostFoundItems]);

  useEffect(() => {
    localStorage.setItem('cc_materials', JSON.stringify(materials));
  }, [materials]);

  // LOGIN & AUTH
  const login = (email: string, role: UserRole): boolean => {
    // Basic mock checks, assign user by matching role
    const matchedUser = MOCK_USERS[role];
    if (matchedUser) {
      setCurrentUser({
        ...matchedUser,
        email: email || matchedUser.email
      });
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, role: UserRole) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      phone: '+91 99999 99999',
      profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const matchedUser = MOCK_USERS[role];
    if (matchedUser) {
      setCurrentUser(matchedUser);
      
      // Auto trigger notification for visual flair
      const notif: Notification = {
        id: `not-${Date.now()}`,
        userId: matchedUser.id,
        type: 'new_message',
        title: 'Profile Swapped',
        message: `Swapped role view to ${role.toUpperCase()} mode. Welcome back, ${matchedUser.name}!`,
        relatedId: 'system',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const updateProfile = (name: string, email: string, phone: string, profilePicture?: string) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? {
      ...prev,
      name,
      email,
      phone,
      profilePicture: profilePicture || prev.profilePicture
    } : null);
  };

  // ASSIGNMENTS & MATERIALS
  const addAssignment = (classroomId: string, title: string, description: string, dueDate: string, type: Assignment['type']) => {
    const newAssign: Assignment = {
      id: `assign-${Date.now()}`,
      classroomId,
      title,
      description,
      dueDate,
      type,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || 'fac-01'
    };

    setAssignments(prev => [newAssign, ...prev]);

    // Send notifications to students in the classroom
    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      userId: 'stud-01', // for demo, student gets it
      type: 'assignment_posted',
      title: 'New Class Assignment',
      message: `New assignment posted in class: "${title}". Due date: ${new Date(dueDate).toLocaleDateString()}`,
      relatedId: newAssign.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addMaterial = (classroomId: string, name: string, fileUrl: string) => {
    const newMat: ClassroomMaterial = {
      id: `mat-${Date.now()}`,
      classroomId,
      name,
      fileUrl,
      fileSize: '1.5 MB',
      uploadDate: new Date().toISOString(),
      uploaderName: currentUser?.name || 'Prof. Ramesh Sharma'
    };
    setMaterials(prev => [newMat, ...prev]);
  };

  // SUBMISSIONS
  const submitAssignment = (assignmentId: string, fileUrl: string, fileName: string) => {
    if (!currentUser) return;
    
    // Check if submission already exists
    const existingIndex = submissions.findIndex(
      s => s.assignmentId === assignmentId && s.studentId === currentUser.id
    );

    const newSub: Submission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      assignmentId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      fileUrl,
      fileName,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      setSubmissions(prev => {
        const copy = [...prev];
        copy[existingIndex] = newSub;
        return copy;
      });
    } else {
      setSubmissions(prev => [...prev, newSub]);
    }
  };

  const gradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        // Trigger notification for student
        const newNotif: Notification = {
          id: `not-${Date.now()}`,
          userId: s.studentId,
          type: 'assignment_graded',
          title: 'Assignment Graded',
          message: `Your assignment has been graded. Score: ${grade}/100.`,
          relatedId: s.assignmentId,
          read: false,
          createdAt: new Date().toISOString()
        };
        setNotifications(n => [newNotif, ...n]);

        return {
          ...s,
          grade,
          feedback,
          status: 'graded'
        };
      }
      return s;
    }));
  };

  // ATTENDANCE
  const markAttendance = (classroomId: string, date: string, records: { studentId: string; status: Attendance['status'] }[]) => {
    const formattedRecords: Attendance[] = records.map(r => ({
      id: `att-${Date.now()}-${r.studentId}`,
      classroomId,
      studentId: r.studentId,
      date,
      status: r.status
    }));

    // Filter out existing records for this class on this date to prevent duplicates
    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => !(r.classroomId === classroomId && r.date === date));
      return [...filtered, ...formattedRecords];
    });

    // Notify the main student for UI flair
    const target = records.find(r => r.studentId === 'stud-01');
    if (target) {
      const newNotif: Notification = {
        id: `not-${Date.now()}`,
        userId: 'stud-01',
        type: 'attendance_marked',
        title: 'Attendance Marked',
        message: `Your attendance has been marked as ${target.status.toUpperCase()} for class on ${date}.`,
        relatedId: classroomId,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // MESSAGES
  const sendMessage = (receiverId: string | null, groupId: string | null, content: string, fileUrl?: string, fileName?: string) => {
    if (!currentUser) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.profilePicture,
      receiverId,
      groupId,
      content,
      fileUrl,
      fileName,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);

    // Simulated auto-reply in groups after 3 seconds for active interaction
    if (groupId && content.toLowerCase().includes('help')) {
      setTimeout(() => {
        const botMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: 'system-bot',
          senderName: 'StudyBot',
          receiverId: null,
          groupId,
          content: 'Hey there! Need help? You can check Class Notes & Materials or ask our teacher during office hours!',
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, botMsg]);
      }, 2500);
    }
  };

  // GROUPS
  const createGroup = (name: string, description: string, type: 'study' | 'class', isPublic: boolean, memberIds: string[]) => {
    if (!currentUser) return;
    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name,
      description,
      type,
      creatorId: currentUser.id,
      members: Array.from(new Set([currentUser.id, ...memberIds])),
      isPublic,
      createdAt: new Date().toISOString()
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const joinGroup = (groupId: string) => {
    if (!currentUser) return;
    setGroups(prev => prev.map(g => {
      if (g.id === groupId && !g.members.includes(currentUser.id)) {
        return {
          ...g,
          members: [...g.members, currentUser.id]
        };
      }
      return g;
    }));
  };

  const leaveGroup = (groupId: string) => {
    if (!currentUser) return;
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(m => m !== currentUser.id)
        };
      }
      return g;
    }));
  };

  // LOST & FOUND
  const postLostFoundItem = (title: string, description: string, location: string, contactInfo: string, type: 'lost' | 'found', category: string) => {
    if (!currentUser) return;
    const newItem: LostFoundItem = {
      id: `lf-${Date.now()}`,
      title,
      description,
      location,
      contactInfo,
      type,
      category,
      datePosted: new Date().toISOString(),
      postedBy: currentUser.id,
      posterName: currentUser.name,
      photoUrl: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=300&q=80'
    };
    setLostFoundItems(prev => [newItem, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AuthContext.Provider value={{
      currentUser, classrooms, assignments, submissions, attendanceRecords,
      messages, groups, notifications, lostFoundItems, materials,
      login, signup, logout, switchRole, updateProfile,
      addAssignment, addMaterial, submitAssignment, gradeSubmission,
      markAttendance, sendMessage, createGroup, joinGroup, leaveGroup,
      postLostFoundItem, markNotificationsAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
