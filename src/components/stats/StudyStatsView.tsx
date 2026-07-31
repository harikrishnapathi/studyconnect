import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Flame, 
  Clock, 
  Trophy, 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle2, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const StudyStatsView: React.FC = () => {
  const { user, achievements } = useApp();

  const [leaderboardTab, setLeaderboardTab] = useState<'global' | 'friends'>('global');

  // Sample weekly study hours data for Recharts
  const weeklyData = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 4.2 },
    { day: 'Wed', hours: 5.0 },
    { day: 'Thu', hours: 2.8 },
    { day: 'Fri', hours: 6.1 },
    { day: 'Sat', hours: 7.4 },
    { day: 'Sun', hours: 4.0 }
  ];

  // Sample subject distribution data for Pie Chart
  const subjectDistribution = [
    { name: 'Algorithms & CS', value: 45, color: '#6366f1' },
    { name: 'USMLE Cardiology', value: 25, color: '#06b6d4' },
    { name: 'Physics & Calc', value: 20, color: '#10b981' },
    { name: 'System Design', value: 10, color: '#f59e0b' }
  ];

  // Leaderboard data
  const globalLeaderboard = [
    { rank: 1, name: 'Dr. Marcus Vance', hours: 285, streak: 42, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { rank: 2, name: 'Aarav Sharma', hours: 210, streak: 31, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { rank: 3, name: 'Sophia Lin', hours: 198, streak: 14, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { rank: 4, name: 'Elena Rostova', hours: 142, streak: 19, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { rank: 5, name: user.name + ' (You)', hours: user.studyHoursTotal, streak: user.streakDays, avatar: user.avatar, isMe: true }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-indigo-400" />
            <span>Study Analytics & Progress</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Learning Performance</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Track your total study hours, active streak, subject mastery, and unlocked badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm">
            <Flame className="w-5 h-5 fill-amber-400 text-amber-500 animate-bounce" />
            <span>{user.streakDays}-Day Active Streak</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Total Study Hours</p>
          <p className="text-2xl sm:text-3xl font-black text-white">{user.studyHoursTotal} hrs</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Current Streak</p>
          <p className="text-2xl sm:text-3xl font-black text-white">{user.streakDays} Days</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Topics Mastered</p>
          <p className="text-2xl sm:text-3xl font-black text-white">{user.subjects.length}</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Learning Circle</p>
          <p className="text-2xl sm:text-3xl font-black text-white">{user.learningCircleCount} Friends</p>
        </div>
      </div>

      {/* Recharts Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Hours Bar Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Weekly Study Time Breakdown</span>
              </h3>
              <p className="text-xs text-slate-400">Hours spent in collaborative 1-on-1 and group study sessions</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Pie Chart (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Subject Time Share</h3>
            <p className="text-xs text-slate-400">Distribution across learning domains</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {subjectDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gamified Badges & Achievements */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>StudyConnect Badges & Trophies</span>
            </h3>
            <p className="text-xs text-slate-400">Earn recognition as you build consistent study habits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                ach.unlocked
                  ? 'bg-gradient-to-tr from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/40'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                {ach.icon}
              </span>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                  {ach.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{ach.description}</p>

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400"
                      style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global & Friends Leaderboard */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Study Leaderboard</h3>
            <p className="text-xs text-slate-400">Top learners sorted by total study hours logged</p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setLeaderboardTab('global')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                leaderboardTab === 'global' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setLeaderboardTab('friends')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                leaderboardTab === 'friends' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Circle Only
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {globalLeaderboard.map(item => (
            <div
              key={item.rank}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                item.isMe
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  item.rank === 1 ? 'bg-amber-400 text-slate-950' : item.rank === 2 ? 'bg-slate-300 text-slate-950' : item.rank === 3 ? 'bg-amber-700 text-white' : 'text-slate-500'
                }`}>
                  #{item.rank}
                </span>

                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />

                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <p className="text-[11px] text-amber-400 font-bold">{item.streak}-Day Streak</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-white">{item.hours} hrs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
