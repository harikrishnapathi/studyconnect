import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyPartner } from '../../types';
import { 
  Users, 
  MessageSquare, 
  Trash2, 
  Search, 
  UserPlus, 
  Globe, 
  Flame, 
  CheckCircle2,
  Video
} from 'lucide-react';

export const LearningCircleView: React.FC = () => {
  const { learningCircle, removeFromLearningCircle, startStudySession, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const filteredCircle = learningCircle.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    showToast(`StudyConnect invite link sent to ${inviteEmail}! 📩`, 'success');
    setInviteEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Learning Circle Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your Trusted Study Friends</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Study partners you have connected with and saved to your permanent circle.
          </p>
        </div>

        {/* Send Direct Invite Form */}
        <form onSubmit={handleSendInvite} className="flex gap-2">
          <input
            id="input-invite-email"
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="Invite classmate by email..."
            className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite</span>
          </button>
        </form>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          id="input-search-circle"
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter Learning Circle by name or subject..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Friends Cards Grid */}
      {filteredCircle.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircle.map(partner => (
            <div
              key={partner.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 shadow-xl space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                      partner.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                    }`} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{partner.name}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">{partner.goal}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {partner.country}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        {partner.streakDays}d
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-slate-400">Current Focus: </span>
                  <span>{partner.currentFocusSubject || partner.subjects[0]}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => startStudySession(partner)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Start Session</span>
                </button>

                <button
                  onClick={() => removeFromLearningCircle(partner.id)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800"
                  title="Remove from Learning Circle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <p className="text-slate-400 text-sm">No partners in your Learning Circle match this query.</p>
        </div>
      )}
    </div>
  );
};
