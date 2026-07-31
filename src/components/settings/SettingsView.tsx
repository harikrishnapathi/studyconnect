import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillLevel, StudyStyle, CurrentMood } from '../../types';
import { POPULAR_SUBJECTS, LEARNING_GOALS, AVATAR_PRESETS } from '../../data/mockData';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Lock, 
  Save, 
  Globe, 
  Moon, 
  Sun,
  CheckCircle2,
  Bell,
  Shield,
  KeyRound,
  Database,
  Trash2,
  Download,
  HardDrive,
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  AlertTriangle,
  RefreshCw,
  Check,
  X,
  FileSpreadsheet,
  Zap,
  Sparkles
} from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'privacy' | 'storage' | 'danger';

export const SettingsView: React.FC = () => {
  const { user, setUser, theme, setTheme, showToast, blockedUserIds, handleLogout } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile fields
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username || 'alexchen_ai');
  const [email, setEmail] = useState(user.email || 'alex.chen@university.edu');
  const [avatar, setAvatar] = useState(user.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [bio, setBio] = useState(user.bio);
  const [goal, setGoal] = useState(user.goal);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(user.skillLevel);
  const [language, setLanguage] = useState(user.language);
  const [country, setCountry] = useState(user.country || 'United States');
  const [studyStyle, setStudyStyle] = useState<StudyStyle>(user.studyStyle);
  const [currentMood, setCurrentMood] = useState<CurrentMood>(user.currentMood);

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [activeSessions, setActiveSessions] = useState([
    { id: '1', device: 'Chrome on macOS (Current)', location: 'San Francisco, CA', ip: '192.168.1.1', lastActive: 'Active Now', isCurrent: true },
    { id: '2', device: 'StudyConnect iOS App', location: 'San Jose, CA', ip: '172.56.21.9', lastActive: '2 hours ago', isCurrent: false },
    { id: '3', device: 'Firefox on Windows', location: 'Seattle, WA', ip: '73.12.89.44', lastActive: '3 days ago', isCurrent: false }
  ]);

  // Privacy fields
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'circle' | 'private'>('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowPodInvites, setAllowPodInvites] = useState<'everyone' | 'friends' | 'none'>('everyone');
  const [aiConsent, setAiConsent] = useState(true);

  // Storage fields
  const [storageStats, setStorageStats] = useState({
    workspaceDraftsMB: 1.8,
    audioVoiceCacheMB: 4.2,
    chatLogsMB: 2.5,
    aiModelCacheMB: 6.1,
    totalMB: 14.6
  });

  // Danger zone
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      username,
      email,
      avatar,
      bio,
      goal,
      skillLevel,
      language,
      country,
      studyStyle,
      currentMood
    }));
    showToast('Profile settings saved successfully!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'warning');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated successfully!', 'success');
  };

  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('Session revoked successfully.', 'info');
  };

  const handleExportData = () => {
    const exportObject = {
      userProfile: user,
      settings: {
        profileVisibility,
        showOnlineStatus,
        allowPodInvites,
        aiConsent,
        is2FAEnabled
      },
      exportedAt: new Date().toISOString(),
      appName: 'StudyConnect Pro AI'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `studyconnect_data_${user.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Account data exported as JSON file!', 'success');
  };

  const handleClearCache = () => {
    setStorageStats({
      workspaceDraftsMB: 0,
      audioVoiceCacheMB: 0,
      chatLogsMB: 0.1,
      aiModelCacheMB: 0,
      totalMB: 0.1
    });
    showToast('Local application cache and temp buffers cleared!', 'success');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput.trim().toUpperCase() !== 'DELETE') {
      showToast('Please type "DELETE" to confirm account deletion.', 'warning');
      return;
    }

    setIsDeleting(true);
    try {
      await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email })
      }).catch(() => {});

      showToast('Account deleted permanently.', 'info');
      setShowDeleteModal(false);
      handleLogout();
    } catch (err) {
      handleLogout();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300 pb-20">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Settings & Account Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Control Center</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              @{username}
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Manage your public profile, security credentials, data privacy, storage, and account preferences.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Account Data</span>
        </button>
      </div>

      {/* Tabs Header */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Login</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'privacy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Data & Privacy</span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'storage' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Storage & Cache</span>
        </button>

        <button
          onClick={() => setActiveTab('danger')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'danger' ? 'bg-rose-600 text-white shadow-lg' : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone</span>
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                <span>Public Profile Identity</span>
              </div>
              <span className="text-xs text-slate-400 font-normal">Visible across study pods and matching</span>
            </h2>

            <div className="space-y-5 text-xs">
              {/* Avatar Preset & Custom */}
              <div className="space-y-3">
                <label className="font-bold uppercase tracking-wider text-slate-300">Profile Picture / Avatar</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md shrink-0"
                  />
                  <div className="space-y-2 flex-1">
                    <p className="text-slate-400 font-medium">Select a preset avatar or paste an image URL:</p>
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_PRESETS.map((p, idx) => (
                        <img
                          key={idx}
                          src={p}
                          alt={`Preset ${idx}`}
                          onClick={() => setAvatar(p)}
                          className={`w-9 h-9 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform ${
                            avatar === p ? 'ring-2 ring-indigo-400 border-2 border-slate-900' : 'opacity-70'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <input
                        type="url"
                        placeholder="https://example.com/my-photo.png"
                        value={customAvatarUrl}
                        onChange={e => setCustomAvatarUrl(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAvatarUrl) {
                            setAvatar(customAvatarUrl);
                            showToast('Custom avatar URL set!', 'info');
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name, Username, Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-wider text-slate-300">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-wider text-slate-300">Username Handle</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-500 font-mono">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      required
                      className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-wider text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Bio & Target Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-wider text-slate-300">Target Learning Goal</label>
                  <input
                    type="text"
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="e.g. Master USMLE Step 1, Pass System Design"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-wider text-slate-300">Country / Region</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">About / Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>AI Partner Match Preferences</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Discussion Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Study Style</label>
                <select
                  value={studyStyle}
                  onChange={e => setStudyStyle(e.target.value as StudyStyle)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Visual & Diagrams">Visual & Diagrams</option>
                  <option value="Hands-on Practice">Hands-on Practice</option>
                  <option value="Quiz & Active Recall">Quiz & Active Recall</option>
                  <option value="Pomodoro Sprints">Pomodoro Sprints</option>
                  <option value="Deep Focused Quiet">Deep Focused Quiet</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SECURITY */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Password Change Box */}
          <form onSubmit={handleChangePassword} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <span>Change Account Password</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Two-Factor Authentication */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Two-Factor Authentication (2FA)</h2>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                is2FAEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {is2FAEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <p className="text-slate-300 max-w-xl">
                Protect your account with Google Authenticator or Authy. Every login will require a 6-digit security verification code.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (is2FAEnabled) {
                    setIs2FAEnabled(false);
                    showToast('2FA has been disabled.', 'info');
                  } else {
                    setShow2FAModal(true);
                  }
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  is2FAEnabled ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                }`}
              >
                {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA Protection'}
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <span>Active Logged-in Devices</span>
              </div>
              <span className="text-xs text-slate-400 font-normal">{activeSessions.length} Devices active</span>
            </h2>

            <div className="space-y-3 text-xs">
              {activeSessions.map(sess => (
                <div key={sess.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 text-indigo-400">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white flex items-center gap-2">
                        <span>{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold">
                            CURRENT
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400">{sess.location} • IP: {sess.ip} • {sess.lastActive}</p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(sess.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY */}
      {activeTab === 'privacy' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>Data Privacy & Visibility Preferences</span>
          </h2>

          <div className="space-y-6 text-xs text-slate-300">
            {/* Visibility radio */}
            <div className="space-y-3">
              <label className="font-bold uppercase tracking-wider text-slate-200">Profile Visibility</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'public', title: 'Public', desc: 'Visible to all StudyConnect students' },
                  { key: 'circle', title: 'Learning Circle Only', desc: 'Only confirmed partners can see full profile' },
                  { key: 'private', title: 'Incognito / Private', desc: 'Hidden from global directory' }
                ].map(opt => (
                  <div
                    key={opt.key}
                    onClick={() => setProfileVisibility(opt.key as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      profileVisibility === opt.key ? 'bg-indigo-950/40 border-indigo-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{opt.title}</span>
                      {profileVisibility === opt.key && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] mt-1 font-normal opacity-80">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="font-bold text-white">Show Live Online Status</p>
                  <p className="text-[11px] text-slate-400">Allows partners to see when you are in a study pod or available.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowOnlineStatus(!showOnlineStatus);
                    showToast(`Online status visibility set to ${!showOnlineStatus}`, 'info');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    showOnlineStatus ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    showOnlineStatus ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <p className="font-bold text-white">AI Study Analytics Consent</p>
                  <p className="text-[11px] text-slate-400">Allow AI partner matcher to process study goals to generate match scores.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAiConsent(!aiConsent);
                    showToast(`AI Matching consent updated`, 'info');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    aiConsent ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    aiConsent ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Export data */}
            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>Download Complete Account Data</span>
                </p>
                <p className="text-[11px] text-slate-400">Get a copy of your study notes, pod logs, friend list, and activity stats in JSON format.</p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0"
              >
                Export JSON Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORAGE */}
      {activeTab === 'storage' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <span>Local Storage & Cache Usage</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">{storageStats.totalMB.toFixed(1)} MB used</span>
          </h2>

          <div className="space-y-6 text-xs text-slate-300">
            {/* Storage bar */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-slate-200">
                <span>Storage Breakdown</span>
                <span>Max local quota: 50.0 MB</span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex">
                <div style={{ width: `${(storageStats.workspaceDraftsMB / 50) * 100}%` }} className="bg-indigo-500 h-full" title="Workspace Drafts" />
                <div style={{ width: `${(storageStats.audioVoiceCacheMB / 50) * 100}%` }} className="bg-cyan-400 h-full" title="Audio Buffer" />
                <div style={{ width: `${(storageStats.chatLogsMB / 50) * 100}%` }} className="bg-emerald-400 h-full" title="Chat Logs" />
                <div style={{ width: `${(storageStats.aiModelCacheMB / 50) * 100}%` }} className="bg-amber-400 h-full" title="AI Prompts" />
              </div>
            </div>

            {/* Storage Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <div>
                    <p className="font-bold text-white">Workspace Notes & Drafts</p>
                    <p className="text-[11px] text-slate-400">Saved offline notes & whiteboard elements</p>
                  </div>
                </div>
                <span className="font-mono text-slate-300 font-bold">{storageStats.workspaceDraftsMB} MB</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-400" />
                  <div>
                    <p className="font-bold text-white">Voice & Audio Cache</p>
                    <p className="text-[11px] text-slate-400">Temporary pod audio buffers</p>
                  </div>
                </div>
                <span className="font-mono text-slate-300 font-bold">{storageStats.audioVoiceCacheMB} MB</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div>
                    <p className="font-bold text-white">Pod Chat Messages</p>
                    <p className="text-[11px] text-slate-400">Offline message logs</p>
                  </div>
                </div>
                <span className="font-mono text-slate-300 font-bold">{storageStats.chatLogsMB} MB</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <div>
                    <p className="font-bold text-white">AI Gateway Cache</p>
                    <p className="text-[11px] text-slate-400">Gemini response history</p>
                  </div>
                </div>
                <span className="font-mono text-slate-300 font-bold">{storageStats.aiModelCacheMB} MB</span>
              </div>
            </div>

            {/* Clear button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClearCache}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>Clear Local Cache</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DANGER ZONE */}
      {activeTab === 'danger' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/20 border border-rose-500/30 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1 border-b border-rose-500/20 pb-4">
            <h2 className="text-xl font-extrabold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
              <span>Danger Zone - Permanent Actions</span>
            </h2>
            <p className="text-xs text-slate-400">
              Actions taken in this panel are permanent and cannot be reversed.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-extrabold text-white text-sm">Delete StudyConnect Account</p>
              <p className="text-slate-400">
                Permanently delete your profile, study streaks ({user.streakDays} days), learning circle, and custom pod notes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all shrink-0 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      )}

      {/* 2FA SETUP MODAL */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Setup 2-Factor Auth</span>
              </h3>
              <button onClick={() => setShow2FAModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <p className="text-slate-300">1. Scan this QR code in your Authenticator app (Google Authenticator, Authy):</p>
              <div className="flex justify-center p-4 bg-white rounded-2xl w-48 h-48 mx-auto shadow-inner">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/StudyConnect:alex.chen@university.edu?secret=JBSWY3DPEHPK3PXP"
                  alt="2FA QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-200">2. Enter 6-digit Code from Authenticator:</label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFACode}
                  onChange={e => setTwoFACode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 text-center tracking-widest text-lg font-mono rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShow2FAModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (twoFACode.length === 6) {
                    setIs2FAEnabled(true);
                    setShow2FAModal(false);
                    showToast('Two-Factor Authentication activated successfully!', 'success');
                  } else {
                    showToast('Please enter a valid 6-digit verification code.', 'warning');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Verify & Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCOUNT DELETION CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl p-6 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <h3 className="font-extrabold text-lg text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>Confirm Account Deletion</span>
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200">
                Warning: Deleting your account will immediately erase all user profile records, study history, notes, and friend links.
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-200">
                  Type <span className="text-rose-400 font-mono font-extrabold">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationInput}
                  onChange={e => setDeleteConfirmationInput(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 text-center tracking-widest text-sm font-mono rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Keep Account
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmationInput.trim().toUpperCase() !== 'DELETE'}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
