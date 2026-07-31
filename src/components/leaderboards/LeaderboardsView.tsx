import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Globe, 
  Flame, 
  Award, 
  Users, 
  Medal, 
  Calendar,
  Sparkles
} from 'lucide-react';

export const LeaderboardsView: React.FC = () => {
  const { leaderboards, user } = useApp();

  const [activeScope, setActiveScope] = useState<'Global' | 'Country' | 'Partners' | 'Pods'>('Global');
  const [activeTimeframe, setActiveTimeframe] = useState<'Weekly' | 'Monthly' | 'All Time'>('Weekly');

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          <span>Peer Accountability Rankings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Study Leaderboards</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Celebrate top scholars based on verified study hours, streak consistency, and active peer mentoring.
        </p>
      </div>

      {/* Scope and Timeframe Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Scope Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['Global', 'Country', 'Partners', 'Pods'] as const).map(scope => (
            <button
              key={scope}
              onClick={() => setActiveScope(scope)}
              className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all whitespace-nowrap ${
                activeScope === scope
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {scope}
            </button>
          ))}
        </div>

        {/* Timeframe Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 self-start md:self-auto">
          {(['Weekly', 'Monthly', 'All Time'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                activeTimeframe === tf ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {leaderboards.slice(0, 3).map((item, idx) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border shadow-2xl relative flex flex-col items-center text-center space-y-3 ${
              idx === 0
                ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 md:-translate-y-2'
                : idx === 1
                ? 'bg-slate-900 border-slate-700'
                : 'bg-slate-900 border-amber-900/30'
            }`}
          >
            <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center ${
              idx === 0 ? 'bg-amber-400 text-slate-950 shadow-lg' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
            }`}>
              #{item.rank}
            </div>

            <img src={item.avatar} alt="" className="w-20 h-20 rounded-3xl object-cover border-2 border-slate-700 shadow-xl" />

            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white">{item.name}</h3>
              <p className="text-xs text-indigo-400 font-semibold">{item.country}</p>
            </div>

            <div className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-amber-400 font-bold text-[10px]">
              {item.badge}
            </div>

            <div className="pt-2 border-t border-slate-800/80 w-full flex items-center justify-around text-xs">
              <div>
                <p className="font-black text-white">{item.hoursLogged} hrs</p>
                <p className="text-[10px] text-slate-500">Studied</p>
              </div>
              <div>
                <p className="font-black text-amber-400 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  {item.streakDays}d
                </p>
                <p className="text-[10px] text-slate-500">Streak</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Complete Rankings</h3>
        
        {leaderboards.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              item.name.includes('You')
                ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`font-black text-sm w-6 text-center ${
                item.rank <= 3 ? 'text-amber-400' : 'text-slate-500'
              }`}>
                #{item.rank}
              </span>

              <img src={item.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover border border-slate-700" />

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{item.name}</span>
                  {item.name.includes('You') && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[9px] font-bold">
                      You
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-slate-400">{item.country}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div className="text-right hidden sm:block">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-amber-400 text-[10px] font-bold border border-slate-800">
                  {item.badge}
                </span>
              </div>

              <div className="text-right">
                <p className="font-bold text-white">{item.hoursLogged} Hours</p>
                <p className="text-[10px] text-amber-400 font-semibold">{item.streakDays} Day Streak</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
