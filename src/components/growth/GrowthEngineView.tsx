import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Gift,
  Users,
  Share2,
  QrCode,
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  ShieldCheck,
  Globe,
  Mail,
  MessageSquare,
  BarChart3,
  Copy,
  Check,
  UserPlus,
  Target,
  Bell,
  Heart,
  Smartphone,
  ChevronRight,
  Filter,
  RefreshCw,
  Star,
  Lock,
  Download,
  Eye
} from 'lucide-react';
import {
  Referral,
  ReferralReward,
  Challenge,
  SeasonalEvent,
  LearningMission,
  DailyCheckIn,
  GrowthAnalytics,
  EmailTemplateItem
} from '../../types';

export const GrowthEngineView: React.FC = () => {
  const { user, showToast } = useApp();

  // Navigation Sub-Tabs inside Growth Engine
  const [activeSubTab, setActiveSubTab] = useState<
    | 'overview'
    | 'referrals'
    | 'invite'
    | 'challenges'
    | 'events'
    | 'missions'
    | 'social'
    | 'leaderboards'
    | 'notifications'
    | 'analytics'
  >('overview');

  // Referral State
  const [referralCode, setReferralCode] = useState('ALEX-STUDY-77');
  const [referralLink, setReferralLink] = useState('https://studyconnect.app/invite/ALEX-STUDY-77');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteEmailInput, setInviteEmailInput] = useState('');
  const [inviteUsernameInput, setInviteUsernameInput] = useState('');

  // Challenges State
  const [challengeFilter, setChallengeFilter] = useState<'All' | 'Individual' | 'Friend' | 'Pod' | 'Community' | 'Global'>('All');
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Seasonal Events State
  const [events, setEvents] = useState<SeasonalEvent[]>([]);

  // Missions & Streak State
  const [missions, setMissions] = useState<LearningMission[]>([]);
  const [streakDays, setStreakDays] = useState(6);
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>([]);
  const [claimedCheckIn, setClaimedCheckIn] = useState(false);

  // Leaderboard State
  const [lbCategory, setLbCategory] = useState<'Friends' | 'Communities' | 'Pods' | 'Country' | 'Global'>('Global');
  const [lbTimeframe, setLbTimeframe] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  // Social Feed & Reactions State
  const [milestones, setMilestones] = useState([
    {
      id: 'm-1',
      authorName: 'Dr. Marcus Vance',
      authorAvatar: 'M',
      title: 'Completed 100th Pathology Case Review!',
      time: '15 mins ago',
      reactionsCount: 14,
      userReacted: false
    },
    {
      id: 'm-2',
      authorName: 'Ananya Roy',
      authorAvatar: 'A',
      title: 'Reached 14-Day Study Streak in Python Pod!',
      time: '1 hour ago',
      reactionsCount: 22,
      userReacted: true
    }
  ]);
  const [customReactionMsg, setCustomReactionMsg] = useState('');

  // Push & Email Notification State
  const [testNotificationType, setTestNotificationType] = useState<'Friend Online' | 'Study Reminder' | 'Challenge Reminder' | 'Pod Activity' | 'Achievement' | 'Session Invite'>('Friend Online');
  const [testRecipientEmail, setTestRecipientEmail] = useState(user.email || 'alex@studyconnect.app');
  const [selectedEmailPreview, setSelectedEmailPreview] = useState<EmailTemplateItem | null>(null);

  // Growth Analytics State
  const [analytics, setAnalytics] = useState<GrowthAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Fetch Referral & Growth Data
  useEffect(() => {
    fetchReferrals();
    fetchChallenges();
    fetchEvents();
    fetchMissions();
    fetchLeaderboards();
    fetchAnalytics();
  }, [lbCategory, lbTimeframe]);

  const fetchReferrals = async () => {
    try {
      const res = await fetch('/api/growth/referrals');
      const data = await res.json();
      if (data.success) {
        setReferralCode(data.referralCode);
        setReferralLink(data.referralLink);
        setQrCodeUrl(data.qrCodeUrl);
        setReferrals(data.referrals || []);
        setReferralRewards(data.rewards || []);
      }
    } catch (e) {}
  };

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/growth/challenges');
      const data = await res.json();
      if (data.success) setChallenges(data.challenges || []);
    } catch (e) {}
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/growth/seasonal-events');
      const data = await res.json();
      if (data.success) setEvents(data.events || []);
    } catch (e) {}
  };

  const fetchMissions = async () => {
    try {
      const res = await fetch('/api/growth/missions');
      const data = await res.json();
      if (data.success) {
        setMissions(data.missions || []);
        setStreakDays(data.dailyCheckInStreak || 6);
        setDailyCheckIns(data.dailyCheckIns || []);
      }
    } catch (e) {}
  };

  const fetchLeaderboards = async () => {
    try {
      const res = await fetch(`/api/growth/leaderboards?category=${lbCategory}&timeframe=${lbTimeframe}`);
      const data = await res.json();
      if (data.success) setLeaderboardData(data.leaderboard || []);
    } catch (e) {}
  };

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch('/api/growth/analytics');
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (e) {
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Handlers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendInvite = async (channel: string, targetValue?: string) => {
    try {
      const res = await fetch('/api/growth/referrals/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetValue || inviteEmailInput,
          channel
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setInviteEmailInput('');
        setInviteUsernameInput('');
        fetchReferrals();
      } else {
        showToast(data.error || 'Invite failed', 'warning');
      }
    } catch (e) {
      showToast('Network error while inviting', 'warning');
    }
  };

  const handleClaimReferralReward = async (referralId: string) => {
    try {
      const res = await fetch('/api/growth/referrals/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        fetchReferrals();
      }
    } catch (e) {
      showToast('Reward claim failed', 'warning');
    }
  };

  const handleJoinChallenge = async (chId: string) => {
    try {
      const res = await fetch('/api/growth/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: chId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Enrolled in challenge!`, 'success');
        setChallenges(challenges.map(c => c.id === chId ? { ...c, joined: true } : c));
      }
    } catch (e) {}
  };

  const handleClaimDailyCheckIn = async () => {
    try {
      const res = await fetch('/api/growth/daily-checkin', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setClaimedCheckIn(true);
        showToast(data.message, 'success');
      }
    } catch (e) {}
  };

  const handleSendNotification = async () => {
    try {
      const res = await fetch('/api/growth/notifications/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: testNotificationType,
          recipientEmail: testRecipientEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
      }
    } catch (e) {}
  };

  const handleReactMilestone = (mId: string) => {
    setMilestones(
      milestones.map((m) =>
        m.id === mId
          ? { ...m, reactionsCount: m.userReacted ? m.reactionsCount - 1 : m.reactionsCount + 1, userReacted: !m.userReacted }
          : m
      )
    );
    showToast('Congratulated learner!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Banner & Growth Engine Control Bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50 border-b border-emerald-500/20 px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Prompt 9 Module Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                Anti-Abuse Fraud Protection
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Growth & Retention Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Organically grow StudyConnect. Earn meaningful rewards for authentic study sessions, invite peers, complete seasonal challenges, and celebrate learning milestones.
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-lg">
            <div className="px-3 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Referral Code</span>
              <span className="text-xs font-bold font-mono text-emerald-400">{referralCode}</span>
            </div>
            <div className="px-3 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Check-in Streak</span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                {streakDays} Days
              </span>
            </div>
            <div className="px-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Global Rank</span>
              <span className="text-xs font-bold text-indigo-300">#3 Weekly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 sticky top-14 z-20 backdrop-blur-md overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2">
          {[
            { id: 'overview', label: 'Overview', icon: Trophy },
            { id: 'referrals', label: 'Referral Engine', icon: Share2 },
            { id: 'invite', label: 'Invite Friends', icon: UserPlus },
            { id: 'challenges', label: 'Challenges', icon: Target },
            { id: 'events', label: 'Seasonal Events', icon: Calendar },
            { id: 'missions', label: 'Missions & Streak', icon: CheckCircle2 },
            { id: 'social', label: 'Circle & Reactions', icon: Heart },
            { id: 'leaderboards', label: 'Leaderboards', icon: Award },
            { id: 'notifications', label: 'Push & Emails', icon: Bell },
            { id: 'analytics', label: 'Growth Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">

        {/* 1. OVERVIEW DASHBOARD */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            {/* Growth Metrics Top Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Total Referrals</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">5 Invited</div>
                <p className="text-xs text-emerald-400 mt-1">3 Registered • 2 Session Done</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">XP Earned via Growth</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">1,500 XP</div>
                <p className="text-xs text-slate-400 mt-1">From referrals & missions</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Active Seasonal Event</span>
                  <Calendar className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">Python Week '26</div>
                <p className="text-xs text-indigo-300 mt-1">65% Event Progress</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Security & Anti-Abuse</span>
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-bold text-white">Protected</div>
                <p className="text-xs text-slate-400 mt-1">No fake registrations allowed</p>
              </div>
            </div>

            {/* Quick Actions & Referral Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Meaningful Activity Rewards</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Dual Reward System
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  We reward real learning, not spam. When your invited friend:
                  <strong className="text-white"> Registers</strong> + <strong className="text-white">Completes Profile</strong> + <strong className="text-white">Finishes 1st Study Session</strong>, BOTH of you unlock +500 XP, Custom Themes, and Profile Badges!
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <span className="text-xs text-slate-400 block mb-0.5">Your Referral Link</span>
                    <span className="text-xs font-mono text-emerald-300 font-semibold break-all">{referralLink}</span>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? 'Copied Link' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* Quick Daily Check-In & Streak */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    Daily Check-In
                  </h3>
                  <span className="text-xs font-bold text-amber-400">{streakDays} Days Streak</span>
                </div>

                <p className="text-xs text-slate-400">Claim your daily learning XP bonus to maintain your momentum.</p>

                <div className="flex items-center justify-between gap-1 py-2">
                  {dailyCheckIns.slice(0, 7).map((c, i) => (
                    <div
                      key={i}
                      className={`flex-1 p-2 rounded-lg text-center border text-[11px] ${
                        c.isClaimed
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                          : c.isToday
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold animate-pulse'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      <div>D{c.dayNumber}</div>
                      <div className="font-bold">{c.xpBonus}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleClaimDailyCheckIn}
                  disabled={claimedCheckIn}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {claimedCheckIn ? 'Today Claimed ✓' : 'Claim Today\'s +150 XP'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. REFERRAL SYSTEM & REWARDS ENGINE */}
        {activeSubTab === 'referrals' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Share2 className="w-6 h-6 text-emerald-400" />
                Referral System & Rewards Engine
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Invite friends via Referral Code, Direct Link, QR Code, WhatsApp, Telegram, Email, or SMS. Rewards are triggered only upon meaningful activity completion.
              </p>

              {/* QR Code & Direct Share Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-5">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                    <img src={qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(referralLink)}`} alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-400" /> QR Code Invitation
                    </h4>
                    <p className="text-xs text-slate-400 mb-2">Scan to join StudyConnect directly with your referral code.</p>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      {referralCode}
                    </span>
                  </div>
                </div>

                {/* Instant Social Channels */}
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-white mb-2">Instant Share Channels</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleSendInvite('WhatsApp')}
                      className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </button>

                    <button
                      onClick={() => handleSendInvite('Telegram')}
                      className="p-2.5 rounded-lg bg-sky-600/20 text-sky-300 border border-sky-500/30 font-semibold flex items-center justify-center gap-2 hover:bg-sky-600 hover:text-white transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Telegram
                    </button>

                    <button
                      onClick={() => handleSendInvite('Email')}
                      className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email Invite
                    </button>

                    <button
                      onClick={() => handleSendInvite('SMS')}
                      className="p-2.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5" /> SMS Text
                    </button>
                  </div>
                </div>
              </div>

              {/* Referrals Status Tracking Table */}
              <h3 className="text-sm font-bold text-white mb-3">Your Sent Invitations & Progress</h3>
              <div className="space-y-3">
                {referrals.map((ref) => (
                  <div key={ref.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">{ref.refereeName || ref.refereeEmail}</p>
                      <p className="text-xs text-slate-400">Invited: {ref.createdAt}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        ref.status === 'Rewarded'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : ref.status === 'Registered'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {ref.status}
                      </span>

                      {ref.status !== 'Rewarded' && (
                        <button
                          onClick={() => handleClaimReferralReward(ref.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                        >
                          Verify & Claim Reward
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Unlocked Referral Rewards Gallery */}
              <h3 className="text-sm font-bold text-white mt-8 mb-3">Unlocked Referral Rewards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {referralRewards.map((rw) => (
                  <div key={rw.id} className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">{rw.rewardType}</span>
                    <p className="text-xs font-bold text-white">{rw.rewardTitle}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{rw.rewardValue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. INVITE FRIENDS SUITE */}
        {activeSubTab === 'invite' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-indigo-400" />
                Invite Friends Suite
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Find contacts, invite by Username, Email, QR Code, or custom referral link with rate-limiting fraud protection.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Invite by Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={inviteEmailInput}
                      onChange={(e) => setInviteEmailInput(e.target.value)}
                      placeholder="studypartner@university.edu"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handleSendInvite('Email', inviteEmailInput)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold whitespace-nowrap"
                    >
                      Send Email Invite
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Invite by StudyConnect Username</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteUsernameInput}
                      onChange={(e) => setInviteUsernameInput(e.target.value)}
                      placeholder="@username or handles"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handleSendInvite('Username', inviteUsernameInput)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold whitespace-nowrap"
                    >
                      Send Direct Ping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. STUDY CHALLENGES */}
        {activeSubTab === 'challenges' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-amber-400" />
                  Study Challenges
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Individual, Friend, Pod, Community, and Global challenges designed to foster deliberate practice.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['All', 'Individual', 'Friend', 'Pod', 'Community', 'Global'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setChallengeFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      challengeFilter === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges
                .filter((c) => challengeFilter === 'All' || c.type === challengeFilter)
                .map((ch) => (
                  <div key={ch.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {ch.type} Challenge
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {ch.endDate}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{ch.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{ch.description}</p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
                        <span>Progress ({ch.targetMetric})</span>
                        <span>{ch.currentProgress} / {ch.maxProgress}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, (ch.currentProgress / ch.maxProgress) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-300 font-bold">+{ch.rewardXp} XP</span>
                        <span className="text-slate-400">• Badge: {ch.rewardBadge}</span>
                      </div>

                      {ch.joined ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Enrolled
                        </span>
                      ) : (
                        <button
                          onClick={() => handleJoinChallenge(ch.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                        >
                          Join Challenge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 5. SEASONAL EVENTS */}
        {activeSubTab === 'events' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-400" />
                Seasonal Events & Learning Marathons
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Participate in Python Week, AI Week, Interview Month, UPSC Marathon, Hacktober, and Exam Countdowns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div key={evt.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-3xl mb-2">{evt.bannerIcon}</div>
                    <h3 className="text-base font-bold text-white">{evt.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{evt.tagline}</p>
                    <p className="text-[11px] font-semibold text-purple-300 mt-2">{evt.startDate} – {evt.endDate}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{evt.activeParticipants.toLocaleString()} active learners</span>
                      <span className="text-amber-400 font-bold">+{evt.rewardXp} XP</span>
                    </div>

                    <button
                      onClick={() => showToast(`Enrolled in ${evt.name}!`, 'success')}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                    >
                      {evt.isJoined ? 'Participating ✓' : 'Join Event'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. LEARNING MISSIONS & STREAK */}
        {activeSubTab === 'missions' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                Daily & Weekly Learning Missions
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Complete daily study objectives to earn XP bonuses, maintain your streak, and unlock exclusive decorations.
              </p>

              <div className="space-y-3">
                {missions.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        m.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.completed ? '✓' : m.currentCount}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{m.title}</p>
                        <p className="text-[11px] text-slate-400">{m.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 block mb-1">
                        +{m.xpReward} XP
                      </span>
                      <span className="text-[11px] text-slate-400">{m.currentCount} / {m.targetCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. SOCIAL CIRCLE & REACTION FEED */}
        {activeSubTab === 'social' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-400" />
                Learning Circle Social Feed
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Congratulate study peers, celebrate streak achievements, and share active learning progress.
              </p>

              <div className="space-y-4">
                {milestones.map((m) => (
                  <div key={m.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center">
                          {m.authorAvatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{m.authorName}</p>
                          <p className="text-[11px] text-slate-400">{m.time}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-200">{m.title}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => handleReactMilestone(m.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                          m.userReacted ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${m.userReacted ? 'fill-current text-rose-500' : ''}`} />
                        <span>Congratulate ({m.reactionsCount})</span>
                      </button>

                      <button onClick={() => showToast('Shared milestone to pod!', 'success')} className="text-slate-400 hover:text-white flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5" /> Share Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. MULTI-TIER LEADERBOARDS */}
        {activeSubTab === 'leaderboards' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    Multi-Tier Leaderboards
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Rankings by Friends, Communities, Pods, Country, and Global.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={lbCategory}
                    onChange={(e) => setLbCategory(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    {['Friends', 'Communities', 'Pods', 'Country', 'Global'].map((c) => (
                      <option key={c} value={c}>{c} Leaderboard</option>
                    ))}
                  </select>

                  <select
                    value={lbTimeframe}
                    onChange={(e) => setLbTimeframe(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    {['Weekly', 'Monthly', 'Yearly'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {leaderboardData.map((item) => (
                  <div
                    key={item.rank}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      item.rank === 3
                        ? 'bg-indigo-950/40 border-indigo-500/40 shadow-lg'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        item.rank === 1 ? 'bg-amber-500 text-slate-950' : item.rank === 2 ? 'bg-slate-300 text-slate-950' : item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{item.rank}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          {item.name} <span className="text-xs text-slate-400">{item.country}</span>
                        </p>
                        <p className="text-xs text-slate-400">{item.pod} • {item.badge}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-amber-400">{item.score.toLocaleString()} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 9. PUSH NOTIFICATIONS & EMAILS SYSTEM */}
        {activeSubTab === 'notifications' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Bell className="w-6 h-6 text-indigo-400" />
                Push Notifications & Email Engine
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Test push alerts and inspect transactional email triggers (Welcome, Reminders, Progress Digests, Milestone Certificates).
              </p>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 mb-6">
                <h3 className="text-sm font-bold text-white">Trigger Test Push Notification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Notification Type</label>
                    <select
                      value={testNotificationType}
                      onChange={(e) => setTestNotificationType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    >
                      {['Friend Online', 'Study Reminder', 'Challenge Reminder', 'Pod Activity', 'Achievement', 'Session Invite'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target Email</label>
                    <input
                      type="email"
                      value={testRecipientEmail}
                      onChange={(e) => setTestRecipientEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendNotification}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  Send Push & Email Trigger
                </button>
              </div>

              {/* Email Templates Gallery */}
              <h3 className="text-sm font-bold text-white mb-3">Email Templates Preview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { title: 'Welcome Email', desc: 'Onboarding & referral intro' },
                  { title: 'Weekly Progress', desc: 'Summary of hours & XP gained' },
                  { title: 'Monthly Report', desc: 'Analytics & peak study window' },
                  { title: 'Achievement Certificate', desc: 'Milestone badge reward' },
                  { title: 'Referral Reward', desc: 'Reward unlock alert' }
                ].map((tmpl, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{tmpl.title}</p>
                      <p className="text-[11px] text-slate-400">{tmpl.desc}</p>
                    </div>
                    <button onClick={() => showToast(`Previewing ${tmpl.title}`, 'info')} className="text-slate-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. GROWTH ANALYTICS DASHBOARD */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                    Growth & Retention Analytics
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Track Active Users (DAU/WAU/MAU), Cohort Retention (D1/D7/D30), Referral Conversion Rate, and Session Completion.
                  </p>
                </div>
                <button onClick={fetchAnalytics} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                  <RefreshCw className={`w-4 h-4 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {analytics && (
                <div className="space-y-6">
                  {/* DAU / WAU / MAU Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-medium text-slate-400">Daily Active Users (DAU)</span>
                      <div className="text-2xl font-bold text-white mt-1">{analytics.dau.toLocaleString()}</div>
                      <span className="text-xs text-emerald-400 mt-1 block">↑ 12% vs last week</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-medium text-slate-400">Weekly Active Users (WAU)</span>
                      <div className="text-2xl font-bold text-white mt-1">{analytics.wau.toLocaleString()}</div>
                      <span className="text-xs text-emerald-400 mt-1 block">↑ 18% vs last month</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-medium text-slate-400">Monthly Active Users (MAU)</span>
                      <div className="text-2xl font-bold text-white mt-1">{analytics.mau.toLocaleString()}</div>
                      <span className="text-xs text-emerald-400 mt-1 block">↑ 24% organic growth</span>
                    </div>
                  </div>

                  {/* Cohort Retention & Conversion Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="text-sm font-bold text-white">Cohort Retention Rates</h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-slate-400 mb-1">
                            <span>Day 1 Retention (D1)</span>
                            <span className="text-emerald-400 font-bold">{analytics.retentionD1}%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analytics.retentionD1}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-400 mb-1">
                            <span>Day 7 Retention (D7)</span>
                            <span className="text-emerald-400 font-bold">{analytics.retentionD7}%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analytics.retentionD7}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-400 mb-1">
                            <span>Day 30 Retention (D30)</span>
                            <span className="text-indigo-400 font-bold">{analytics.retentionD30}%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${analytics.retentionD30}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="text-sm font-bold text-white">Growth Funnel Conversion</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between p-2 rounded bg-slate-900">
                          <span className="text-slate-400">Referral Link Conversion</span>
                          <span className="font-bold text-white">{analytics.referralConversionRate}%</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-slate-900">
                          <span className="text-slate-400">Invite Acceptance Rate</span>
                          <span className="font-bold text-white">{analytics.inviteAcceptanceRate}%</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-slate-900">
                          <span className="text-slate-400">Session Completion Rate</span>
                          <span className="font-bold text-white">{analytics.sessionCompletionRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
