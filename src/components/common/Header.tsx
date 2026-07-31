import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home,
  Sparkles, 
  BookOpen, 
  Users, 
  LayoutGrid, 
  BarChart3, 
  Flame, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Radio,
  Clock,
  Zap,
  Bell,
  Globe,
  Trophy,
  Crown,
  Server,
  Rocket,
  Activity,
  Search,
  X,
  Check,
  Download
} from 'lucide-react';
import { SafetyModal } from '../safety/SafetyModal';
import { StudyStatus } from '../../types';

export const Header: React.FC = () => {
  const { 
    user, 
    activeTab, 
    setActiveTab, 
    activePartner, 
    sessionDuration,
    theme,
    setTheme,
    setHasCompletedOnboarding,
    handleLogout,
    notifications,
    markNotificationRead,
    studyStatus,
    setStudyStatus,
    showToast
  } = useApp();

  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const statusColors: Record<StudyStatus, string> = {
    'Available': 'bg-emerald-400',
    'In Session': 'bg-indigo-500 animate-pulse',
    'Do Not Disturb': 'bg-rose-500',
    'Looking for Pod': 'bg-amber-400 animate-bounce',
    'Busy': 'bg-rose-500',
    'Away': 'bg-amber-500',
    'Offline': 'bg-slate-500'
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                StudyConnect
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              "Never Study Alone Again."
            </p>
          </div>
        </div>

        {/* Middle: Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-800/90">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'home' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('matching')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'matching' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Match</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-ecosystem')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ai-ecosystem' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Ecosystem</span>
          </button>

          <button
            onClick={() => setActiveTab('growth-engine')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'growth-engine' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Growth Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('business-platform')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'business-platform' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Business & Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'infrastructure' ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span>Infrastructure</span>
          </button>

          <button
            onClick={() => setActiveTab('production-readiness')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'production-readiness' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch & QA</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
              activeTab === 'workspace' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Workspace</span>
            {activePartner && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>}
          </button>

          <button
            onClick={() => setActiveTab('pods')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'pods' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Study Pods</span>
          </button>

          <button
            onClick={() => setActiveTab('communities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'communities' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Communities</span>
          </button>

          <button
            onClick={() => setActiveTab('circle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'circle' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Circle</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'feed' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'leaderboards' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboards</span>
          </button>
        </nav>

        {/* Right Tools & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Status Badge Selector */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:border-slate-700 transition-all"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${statusColors[studyStatus]}`} />
              <span className="hidden sm:inline">{studyStatus}</span>
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs text-slate-200">
                {(['Available', 'In Session', 'Do Not Disturb', 'Looking for Pod'] as StudyStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      setStudyStatus(st);
                      setShowStatusMenu(false);
                      showToast(`Status updated to "${st}"`, 'info');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors text-left font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusColors[st]}`} />
                      <span>{st}</span>
                    </div>
                    {studyStatus === st && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-xs text-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-white">Notifications</h4>
                  <span className="text-[10px] text-slate-400">{unreadNotifsCount} unread</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        n.read ? 'bg-slate-950/40 border-slate-800/60 opacity-60' : 'bg-indigo-950/30 border-indigo-500/30 font-semibold'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="text-indigo-400 font-bold">{n.title}</span>
                        <span>{n.timestamp}</span>
                      </div>
                      <p className="text-slate-200 text-xs mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Study Streak Badge */}
          <div 
            onClick={() => setActiveTab('stats')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold cursor-pointer hover:scale-105 transition-transform"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{user.streakDays}d</span>
          </div>

          {/* Safety Center Button */}
          <button
            onClick={() => setShowSafetyModal(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
            title="Safety & Moderation Shield"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'oled' : theme === 'oled' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={`Current theme: ${theme}`}
          >
            {theme === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Settings Icon Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-xl transition-colors ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Profile & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Profile Menu dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-full border border-slate-700/80 hover:border-indigo-500 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs text-slate-200">
                <div className="p-3 border-b border-slate-800">
                  <p className="font-bold text-sm text-white">{user.name}</p>
                  <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-semibold text-[10px]">
                      {user.skillLevel}
                    </span>
                    <span className="text-slate-400 text-[10px]">{user.studyHoursTotal} hrs logged</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-bold text-indigo-300"
                  >
                    <ShieldAlert className="w-4 h-4 text-indigo-400" />
                    <span>Admin Ecosystem Console</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setHasCompletedOnboarding(false);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/80 transition-colors text-left font-medium text-amber-400"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Re-run Profile Onboarding</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 transition-colors text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSafetyModal && <SafetyModal onClose={() => setShowSafetyModal(false)} />}
    </header>
  );
};
