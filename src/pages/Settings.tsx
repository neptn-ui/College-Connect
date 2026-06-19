import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  User, Bell, Shield, Palette, LogOut, 
  Check, Save, RefreshCw 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!currentUser) return null;

  // Profile Form States
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [profilePic, setProfilePic] = useState(currentUser.profilePicture || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Notification States
  const [notifAssignPosted, setNotifAssignPosted] = useState(true);
  const [notifAssignGraded, setNotifAssignGraded] = useState(true);
  const [notifNewMsg, setNotifNewMsg] = useState(true);
  const [notifAttendance, setNotifAttendance] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  // Privacy States
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [whoCanMessage, setWhoCanMessage] = useState<'anyone' | 'classmates' | 'faculty'>('anyone');
  const [shareData, setShareData] = useState(true);

  // Theme customizer states
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      updateProfile(name, email, phone, profilePic);
      setIsSavingProfile(false);
      alert('Profile updated successfully!');
    }, 800);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRoleSwap = (role: 'student' | 'faculty') => {
    switchRole(role);
    navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">System Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage credentials, preferences, notifications, and active testing roles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card hoverEffect={false} padding="lg" className="text-left space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <User className="w-5 h-5 text-brand" />
              <h2 className="text-lg font-bold text-text-primary">Profile Customization</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-6 pb-2">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-brand"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center border-2 border-brand">
                    <User className="w-8 h-8 text-brand" />
                  </div>
                )}
                <div className="space-y-2 flex-1 w-full text-left">
                  <label className="text-xs font-semibold text-text-secondary" htmlFor="picUrl">Profile Picture URL</label>
                  <input
                    id="picUrl"
                    type="url"
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="glass-input w-full px-4 py-2 text-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary" htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="glass-input w-full px-4 py-2 text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="glass-input w-full px-4 py-2 text-sm rounded-xl"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-text-secondary" htmlFor="emailAddr">Email address</label>
                  <input
                    id="emailAddr"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="glass-input w-full px-4 py-2 text-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <Button type="submit" variant="primary" loading={isSavingProfile}>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Quick Swapper Settings helper */}
          <Card hoverEffect={false} padding="lg" className="text-left space-y-4 border-brand/20 bg-brand/[0.02]">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-brand" />
              <h2 className="text-lg font-bold text-text-primary">Instant Demo Swapper</h2>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Easily toggle between Student and Faculty modes to review submissions, grade papers, mark attendance sheets, or browse chats.
            </p>
            <div className="flex gap-4 pt-2">
              <Button 
                variant="outline" 
                onClick={() => handleRoleSwap('student')}
                className={currentUser.role === 'student' ? 'border-brand bg-brand/10' : ''}
              >
                Switch to Student View
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleRoleSwap('faculty')}
                className={currentUser.role === 'faculty' ? 'bg-brand' : ''}
              >
                Switch to Teacher View
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Side: Preference checklists */}
        <div className="space-y-6">
          {/* Notifications Toggles */}
          <Card hoverEffect={false} padding="lg" className="text-left space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Bell className="w-5 h-5 text-brand" />
              <h2 className="text-base font-bold text-text-primary">Alert Preferences</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-start cursor-pointer selection:bg-transparent">
                <input
                  type="checkbox"
                  checked={notifAssignPosted}
                  onChange={(e) => setNotifAssignPosted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white/15 text-brand focus:ring-brand/40 bg-white/5 cursor-pointer"
                />
                <span className="ml-3 text-xs font-semibold text-text-primary block">
                  New Assignments Posted
                  <span className="text-[10px] text-text-secondary font-normal block mt-0.5">Receive alert when teachers create new work</span>
                </span>
              </label>

              <label className="flex items-start cursor-pointer selection:bg-transparent">
                <input
                  type="checkbox"
                  checked={notifAssignGraded}
                  onChange={(e) => setNotifAssignGraded(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white/15 text-brand focus:ring-brand/40 bg-white/5 cursor-pointer"
                />
                <span className="ml-3 text-xs font-semibold text-text-primary block">
                  Submissions Graded
                  <span className="text-[10px] text-text-secondary font-normal block mt-0.5">Alert when assignment marks are published</span>
                </span>
              </label>

              <label className="flex items-start cursor-pointer selection:bg-transparent">
                <input
                  type="checkbox"
                  checked={notifNewMsg}
                  onChange={(e) => setNotifNewMsg(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white/15 text-brand focus:ring-brand/40 bg-white/5 cursor-pointer"
                />
                <span className="ml-3 text-xs font-semibold text-text-primary block">
                  New Direct Messages
                  <span className="text-[10px] text-text-secondary font-normal block mt-0.5">Alert on direct message or group tag</span>
                </span>
              </label>

              <label className="flex items-start cursor-pointer selection:bg-transparent">
                <input
                  type="checkbox"
                  checked={notifAttendance}
                  onChange={(e) => setNotifAttendance(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white/15 text-brand focus:ring-brand/40 bg-white/5 cursor-pointer"
                />
                <span className="ml-3 text-xs font-semibold text-text-primary block">
                  Daily Attendance Logged
                  <span className="text-[10px] text-text-secondary font-normal block mt-0.5">Alert when attendance sheets are submitted</span>
                </span>
              </label>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-text-primary">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 rounded text-brand cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-text-primary">Push Alerts (Browser)</span>
                <input
                  type="checkbox"
                  checked={pushNotif}
                  onChange={(e) => setPushNotif(e.target.checked)}
                  className="w-4 h-4 rounded text-brand cursor-pointer"
                />
              </label>
            </div>
          </Card>

          {/* Privacy settings */}
          <Card hoverEffect={false} padding="lg" className="text-left space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Shield className="w-5 h-5 text-brand" />
              <h2 className="text-base font-bold text-text-primary">Privacy & Security</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-text-primary">Public profile details</span>
                <input
                  type="checkbox"
                  checked={isProfilePublic}
                  onChange={(e) => setIsProfilePublic(e.target.checked)}
                  className="w-4 h-4 rounded text-brand cursor-pointer"
                />
              </label>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block" htmlFor="whoMsg">Who can message you</label>
                <select
                  id="whoMsg"
                  value={whoCanMessage}
                  onChange={(e) => setWhoCanMessage(e.target.value as any)}
                  className="glass-input w-full px-3 py-1.5 text-xs rounded-xl"
                >
                  <option value="anyone">Everyone on campus</option>
                  <option value="classmates">Classmates only</option>
                  <option value="faculty">Faculty members only</option>
                </select>
              </div>

              <label className="flex items-center justify-between cursor-pointer pt-2">
                <span className="text-xs font-medium text-text-primary">Share crash reports</span>
                <input
                  type="checkbox"
                  checked={shareData}
                  onChange={(e) => setShareData(e.target.checked)}
                  className="w-4 h-4 rounded text-brand cursor-pointer"
                />
              </label>
            </div>
          </Card>

          {/* Theme Display Customizer */}
          <Card hoverEffect={false} padding="lg" className="text-left space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Palette className="w-5 h-5 text-brand" />
              <h2 className="text-base font-bold text-text-primary">Theme & Appearance</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-primary">Dark Mode Style</span>
                <Button variant="secondary" size="sm" onClick={toggleTheme} className="text-xs py-1">
                  Toggle {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block" htmlFor="fontSlid">Font Sizing</label>
                <div className="flex gap-2">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${fontSize === sz ? 'bg-brand/10 border-brand text-brand' : 'border-white/10 text-text-secondary hover:text-text-primary'}`}
                    >
                      {sz.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Button variant="danger" size="md" fullWidth onClick={handleLogout} className="mt-4">
            <LogOut className="w-4 h-4 mr-2" /> Logout of CollegeConnect
          </Button>
        </div>
      </div>
    </div>
  );
};
