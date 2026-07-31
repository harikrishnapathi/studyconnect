import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Globe, 
  FileText, 
  Megaphone, 
  BarChart3, 
  Server, 
  LogOut, 
  Search, 
  KeyRound, 
  UserCheck, 
  Activity, 
  Lock, 
  Radio, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

import { AdminUser, AdminOverviewStats, ServerHealthMetrics } from '../../types';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { UserManagementView } from './UserManagementView';
import { ModerationQueueView } from './ModerationQueueView';
import { CommunityPodManagementView } from './CommunityPodManagementView';
import { FileContentModerationView } from './FileContentModerationView';
import { AnnouncementsSupportView } from './AnnouncementsSupportView';
import { AnalyticsRevenueView } from './AnalyticsRevenueView';
import { RealtimeSystemSecurityView } from './RealtimeSystemSecurityView';
import { AdminLoginModal } from './AdminLoginModal';

export const AdminPortal: React.FC = () => {
  const { setActiveTab: setAppActiveTab, showToast } = useApp();

  const [adminTab, setAdminTab] = useState<string>('overview');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>({
    id: 'admin-001',
    name: 'Sarah Connor',
    email: 'admin@studyconnect.global',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Super Admin',
    permissions: [
      'MANAGE_USERS', 'BAN_ACCOUNTS', 'MODERATE_CONTENT', 
      'MANAGE_PODS', 'MANAGE_COMMUNITIES', 'VIEW_ANALYTICS', 
      'MANAGE_ANNOUNCEMENTS', 'SUPPORT_DESK', 'SECURITY_AUDIT'
    ],
    mfaEnabled: true,
    lastLogin: 'Just now',
    status: 'Active'
  });

  // Global Admin Search Query
  const [globalSearch, setGlobalSearch] = useState('');

  // Overview Stats & Server Health
  const [overviewStats, setOverviewStats] = useState<AdminOverviewStats>({
    totalLearners: 124850,
    learnersOnline: 3420,
    dailyActiveUsers: 28400,
    monthlyActiveUsers: 94200,
    studySessionsToday: 4120,
    voiceCallsToday: 1850,
    videoCallsToday: 1240,
    filesUploaded: 18900,
    communitiesCreated: 340,
    studyPodsCreated: 1280,
    pendingReports: 14,
    bannedAccounts: 48,
    monthlyRevenue: 84500,
    premiumSubscribers: 6200,
    openSupportTickets: 23
  });

  const [serverHealth, setServerHealth] = useState<ServerHealthMetrics>({
    cpuUsagePercent: 24,
    memoryUsagePercent: 48,
    activeWebSockets: 3420,
    dbConnections: 142,
    redisStatus: 'Healthy',
    apiLatencyMs: 24,
    errorRatePercent: 0.02,
    liveVoiceCalls: 312,
    liveVideoCalls: 184,
    filesUploadedToday: 840,
    serverStatus: 'Operational'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [sRes, hRes] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/server-health')
      ]);
      const sData = await sRes.json();
      const hData = await hRes.json();
      if (sData.stats) setOverviewStats(sData.stats);
      if (hData.health) setServerHealth(hData.health);
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'moderation', label: 'Moderation Queue', icon: ShieldAlert, badge: overviewStats.pendingReports },
    { id: 'communities', label: 'Communities & Pods', icon: Globe },
    { id: 'files', label: 'Files & Content', icon: FileText },
    { id: 'support', label: 'Announcements & Tickets', icon: Megaphone, badge: overviewStats.openSupportTickets },
    { id: 'analytics', label: 'Revenue & Growth', icon: BarChart3 },
    { id: 'security', label: 'System Telemetry', icon: Server }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-12">
      {/* Admin Portal Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-xl px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & RBAC Role */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">StudyConnect Admin</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold uppercase">
                  {currentAdmin?.role || 'Super Admin'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise Administration & Moderation Console</p>
            </div>
          </div>

          {/* Global Search & Admin Account Bar */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Global admin search..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Admin Profile & Role Switcher */}
            {currentAdmin && (
              <div 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2.5 p-1.5 px-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
              >
                <img
                  src={currentAdmin.avatar}
                  alt={currentAdmin.name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-500/50"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-none">{currentAdmin.name}</div>
                  <div className="text-[9px] text-emerald-400 font-bold">2FA Active</div>
                </div>
              </div>
            )}

            <button
              onClick={() => setAppActiveTab('home')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Admin Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6 flex-1">
        {/* Navigation Tab Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-extrabold">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {adminTab === 'overview' && (
          <AdminDashboardOverview 
            stats={overviewStats} 
            health={serverHealth} 
            onNavigateTab={(t) => setAdminTab(t)} 
          />
        )}

        {adminTab === 'users' && (
          <UserManagementView onShowToast={showToast} />
        )}

        {adminTab === 'moderation' && (
          <ModerationQueueView onShowToast={showToast} />
        )}

        {adminTab === 'communities' && (
          <CommunityPodManagementView onShowToast={showToast} />
        )}

        {adminTab === 'files' && (
          <FileContentModerationView onShowToast={showToast} />
        )}

        {adminTab === 'support' && (
          <AnnouncementsSupportView onShowToast={showToast} />
        )}

        {adminTab === 'analytics' && (
          <AnalyticsRevenueView onShowToast={showToast} />
        )}

        {adminTab === 'security' && (
          <RealtimeSystemSecurityView onShowToast={showToast} />
        )}
      </div>

      {/* Admin Login & RBAC Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(admin) => {
          setCurrentAdmin(admin);
          showToast(`Authenticated as ${admin.role} (${admin.name})`, 'success');
        }}
      />
    </div>
  );
};
