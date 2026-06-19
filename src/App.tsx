import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { StudentDashboard } from './pages/StudentDashboard';
import { Classroom } from './pages/Classroom';
import { Attendance } from './pages/Attendance';
import { Timetable } from './pages/Timetable';
import { Messages } from './pages/Messages';
import { Groups } from './pages/Groups';
import { LostFound } from './pages/LostFound';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { Settings } from './pages/Settings';

// Route Guard to verify authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'student' | 'faculty' }> = ({ children, allowedRole }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    // Prevent cross role page viewing, redirect to correct role dashboard
    return <Navigate to={currentUser.role === 'faculty' ? '/teacher-dashboard' : '/student-dashboard'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student Dashboards */}
          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRole="student">
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Teacher Dashboards */}
          <Route path="/teacher-dashboard" element={
            <ProtectedRoute allowedRole="faculty">
              <Layout>
                <TeacherDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Shared Pages wrapped in sidebar layouts */}
          <Route path="/classroom" element={
            <ProtectedRoute>
              <Layout>
                <Classroom />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/attendance" element={
            <ProtectedRoute>
              <Layout>
                <Attendance />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/timetable" element={
            <ProtectedRoute>
              <Layout>
                <Timetable />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/messages" element={
            <ProtectedRoute>
              <Layout>
                <Messages />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/groups" element={
            <ProtectedRoute>
              <Layout>
                <Groups />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/lost-found" element={
            <ProtectedRoute>
              <Layout>
                <LostFound />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
