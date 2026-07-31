import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_PARTNERS, MOCK_STUDY_ROOMS } from '../../data/mockData';
import { 
  Sparkles, 
  Search, 
  Flame, 
  Clock, 
  Users, 
  Zap, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Radio, 
  Plus, 
  ArrowRight, 
  Star, 
  Globe, 
  Play, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  ShieldCheck,
  ChevronRight,
  Video
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { user, setQuickMatchOpen, startStudySession, setActiveTab, addToLearningCircle, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Good Evening');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [liveCounters, setLiveCounters] = useState<Array<{ category: string; activeLearners: number; icon: string }>>([
    { category: 'Programming', activeLearners: 3420, icon: '💻' },
    { category: 'Engineering', activeLearners: 1890, icon: '⚙️' },
    { category: 'Medical', activeLearners: 1240, icon: '🩺' },
    { category: 'Languages', activeLearners: 980, icon: '🌐' },
    { category: 'Competitive Exams', activeLearners: 2750, icon: '📚' },
    { category: 'Business', activeLearners: 810, icon: '📈' },
    { category: 'Artificial Intelligence', activeLearners: 2140, icon: '🤖' }
  ]);

  // Determine time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Fetch dynamic home dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/learning-dashboard');
        const data = await res.json();
        if (data.success && data.dashboard) {
          setDashboardData(data.dashboard);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboard();
  }, []);

  // Simulate real-time ticking counters for global activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounters(prev =>
        prev.map(item => ({
          ...item,
          activeLearners: item.activeLearners + Math.floor(Math.random() * 7) - 3
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const userSubjects = user.subjects && user.subjects.length > 0 ? user.subjects : [];
  const defaultRecent = ['Data Structures & Algorithms', 'Python', 'Machine Learning', 'USMLE Step 1'];
  
  // Combine user setup subjects with general subjects, eliminating duplicates
  const recentSubjects = Array.from(new Set([...userSubjects, ...defaultRecent]));

  const topUserSubject = userSubjects[0] || 'Data Structures & Algorithms';
  const userGoal = user.goal || 'Understand Concepts & Problem Solving';

  const filteredPartners = MOCK_PARTNERS.filter(p => {
    if (searchQuery) {
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO GREETING & SEARCH BAR */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Smart Recommendation Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {greeting}, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              What would you like to learn today?
            </p>
          </div>

          {/* Quick Match Primary Trigger CTA */}
          <button
            onClick={() => setQuickMatchOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Zap className="w-5 h-5 fill-white text-white" />
            <span>Find Study Partner</span>
            <ChevronRight className="w-4 h-4 text-cyan-200" />
          </button>
        </div>

        {/* Search Anything Bar */}
        <div className="relative max-w-3xl relative z-10">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything (Subjects, Skills, Study Partner Names, Exams)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
        </div>

        {/* Recent Subjects Quick Chips */}
        <div className="space-y-2 relative z-10">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recent Subjects
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSubjects.map((sub: string, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(sub);
                  showToast(`Filtered by ${sub}`, 'info');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>{sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CONTINUE LEARNING & STUDY STREAK WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Continue Learning Active Card (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Play className="w-4 h-4 fill-indigo-400 text-indigo-400" />
              <span>Continue Learning</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Last active 25m ago</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                  {topUserSubject}
                </span>
                <span className="text-xs text-slate-400">• Goal: {userGoal}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{topUserSubject} Interactive Practice</h3>
              <p className="text-xs text-slate-400">Partner: Elena Rostova • 3/5 Session Tasks Completed</p>
            </div>

            <button
              onClick={() => setActiveTab('workspace')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all shrink-0 flex items-center gap-2"
            >
              <span>Resume Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Study Streak & Statistics (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              <span>Your Study Streak</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold">
              {user.streakDays || 12} Days 🔥
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-lg font-extrabold text-white">2.5h</div>
              <div className="text-[10px] text-slate-400 font-medium">Daily</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-lg font-extrabold text-indigo-400">14.8h</div>
              <div className="text-[10px] text-slate-400 font-medium">Weekly</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-lg font-extrabold text-cyan-400">58.2h</div>
              <div className="text-[10px] text-slate-400 font-medium">Monthly</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Today's Goal (2.5h / 3.0h)</span>
              <span className="text-indigo-400 font-bold">83%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full w-[83%]" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. RECOMMENDED STUDY PARTNERS (AI Matchmaking) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Recommended Study Partners</h2>
            <p className="text-xs text-slate-400">Matched via AI compatibility engine based on your goals & subject focus.</p>
          </div>
          <button
            onClick={() => setActiveTab('matching')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Matches</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPartners.length === 0 ? (
            <div className="col-span-full p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No Study Partners Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No active partners found matching your search. Click "Find Study Partner" to scan or invite peers to your network!
              </p>
              <button
                onClick={() => setQuickMatchOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all inline-flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Launch Match Engine</span>
              </button>
            </div>
          ) : (
            filteredPartners.slice(0, 3).map((partner, idx) => (
              <div
                key={partner.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all space-y-4 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-indigo-500/50"
                      />
                      {partner.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {partner.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{partner.country} • {partner.language}</p>
                    </div>
                  </div>

                  {/* Compatibility Score Badge */}
                  <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-xs">
                    {98 - idx * 3}% Match
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {partner.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {partner.subjects.map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-semibold text-slate-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => startStudySession(partner)}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Start Session</span>
                  </button>

                  <button
                    onClick={() => addToLearningCircle(partner)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                    title="Add to Circle"
                  >
                    <UserPlus className="w-4 h-4 text-indigo-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. TRENDING STUDY ROOMS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Trending Study Rooms</h2>
            <p className="text-xs text-slate-400">Join active audio/video co-working spaces live right now.</p>
          </div>
          <button
            onClick={() => setActiveTab('rooms')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Explore All Rooms</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {MOCK_STUDY_ROOMS.length === 0 ? (
            <div className="col-span-full p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No Active Rooms Right Now</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No public study rooms are currently open. Create a new study room or launch a session with a partner!
              </p>
              <button
                onClick={() => setActiveTab('rooms')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Study Room</span>
              </button>
            </div>
          ) : (
            MOCK_STUDY_ROOMS.slice(0, 2).map(room => (
              <div
                key={room.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 shadow-xl space-y-4 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                      {room.subject}
                    </span>
                    <h4 className="text-sm font-bold text-white">{room.title}</h4>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{room.participantCount}/{room.maxParticipants}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <img
                      src={room.hostAvatar}
                      alt={room.hostName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <span className="text-xs text-slate-300 font-medium">Host: {room.hostName}</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('rooms');
                      showToast(`Joined ${room.title}`, 'success');
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. GLOBAL ACTIVITY COUNTERS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌍</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Learners Studying Right Now</h3>
              <p className="text-xs text-slate-400">Live active sessions updating in real time across domain fields.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hidden sm:inline-block">
            Global Network Live
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {liveCounters.map((cat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-center space-y-1 hover:border-indigo-500/40 transition-colors"
            >
              <div className="text-xl">{cat.icon}</div>
              <div className="text-sm font-extrabold text-white animate-pulse">
                {cat.activeLearners.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate">
                {cat.category}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
