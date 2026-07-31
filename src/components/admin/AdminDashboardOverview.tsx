import React from 'react';
import { 
  Users, 
  Activity, 
  Radio, 
  Video, 
  FileText, 
  Globe, 
  ShieldAlert, 
  DollarSign, 
  Cpu, 
  Server, 
  Zap,
  TrendingUp,
  UserCheck,
  Award,
  Clock
} from 'lucide-react';
import { AdminOverviewStats, ServerHealthMetrics } from '../../types';

interface AdminDashboardOverviewProps {
  stats: AdminOverviewStats;
  health: ServerHealthMetrics;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({ stats, health, onNavigateTab }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Quick Server Health Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE SYSTEM HEALTH: OPERATIONAL</span>
            </span>
            <span className="text-xs text-slate-400">AWS / Cloud Run Cluster</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">StudyConnect Platform Overview</h2>
          <p className="text-xs text-slate-300">
            Real-time analytics across <span className="font-bold text-indigo-300">124,850 learners</span> and active peer study sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">CPU Load</div>
            <div className="text-sm font-extrabold text-emerald-400">{health.cpuUsagePercent}%</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">RAM Usage</div>
            <div className="text-sm font-extrabold text-cyan-400">{health.memoryUsagePercent}%</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">API Latency</div>
            <div className="text-sm font-extrabold text-indigo-400">{health.apiLatencyMs} ms</div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid (12 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Learners */}
        <div 
          onClick={() => onNavigateTab('users')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Learners</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.totalLearners.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>+12.4% this month</span>
          </div>
        </div>

        {/* Learners Online */}
        <div 
          onClick={() => onNavigateTab('users')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Learners Online</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.learnersOnline.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Active WebSockets</span>
          </div>
        </div>

        {/* DAU */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Daily Active Users</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.dailyActiveUsers.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">22.7% of total audience</div>
        </div>

        {/* Study Sessions Today */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sessions Today</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.studySessionsToday.toLocaleString()}</div>
          <div className="text-[10px] text-indigo-300 font-semibold">Avg 48 mins / session</div>
        </div>

        {/* Voice Calls Today */}
        <div 
          onClick={() => onNavigateTab('health')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Voice Calls</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.voiceCallsToday.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Peer WebRTC Rooms</div>
        </div>

        {/* Video Calls Today */}
        <div 
          onClick={() => onNavigateTab('health')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Video Calls</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.videoCallsToday.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">HD Peer Streams</div>
        </div>

        {/* Files Uploaded */}
        <div 
          onClick={() => onNavigateTab('files')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Files Shared</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.filesUploaded.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-bold">100% Virus Scanned</div>
        </div>

        {/* Global Communities */}
        <div 
          onClick={() => onNavigateTab('communities')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Communities</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.communitiesCreated}</div>
          <div className="text-[10px] text-slate-400">{stats.studyPodsCreated} Study Pods</div>
        </div>

        {/* Pending Reports */}
        <div 
          onClick={() => onNavigateTab('moderation')}
          className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 hover:border-rose-500/60 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">Pending Reports</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400">{stats.pendingReports}</div>
          <div className="text-[10px] text-rose-300 font-semibold">Requires Moderation</div>
        </div>

        {/* Banned Accounts */}
        <div 
          onClick={() => onNavigateTab('users')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Banned Accounts</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.bannedAccounts}</div>
          <div className="text-[10px] text-slate-400">0.03% enforcement rate</div>
        </div>

        {/* Revenue Monthly */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Monthly Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">${stats.monthlyRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-300 font-bold">+18.5% MoM</div>
        </div>

        {/* Premium Subscribers */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 shadow-xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">PRO Subscribers</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-300">{stats.premiumSubscribers.toLocaleString()}</div>
          <div className="text-[10px] text-indigo-400 font-semibold">$12.99 / mo tier</div>
        </div>
      </div>

      {/* Quick Admin Actions Row */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Quick Management Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('moderation')}
            className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Review Moderation Queue ({stats.pendingReports})</span>
          </button>
          <button
            onClick={() => onNavigateTab('support')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Open Support Tickets ({stats.openSupportTickets})</span>
          </button>
          <button
            onClick={() => onNavigateTab('support')}
            className="px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Send System Announcement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
