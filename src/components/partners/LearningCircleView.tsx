import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyPartner, PendingFriendRequest } from '../../types';
import { 
  Users, 
  MessageSquare, 
  Trash2, 
  Search, 
  UserPlus, 
  Globe, 
  Flame, 
  Video,
  Check,
  X,
  Calendar,
  Clock,
  ShieldAlert,
  Star,
  UserCheck,
  Share2
} from 'lucide-react';

export const LearningCircleView: React.FC = () => {
  const { 
    learningCircle, 
    removeFromLearningCircle, 
    startStudySession, 
    pendingFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    scheduleStudySession,
    blockUser,
    reportUser,
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'circle' | 'requests' | 'schedule'>('circle');
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  // Schedule Modal State inside Circle
  const [selectedPartnerForSchedule, setSelectedPartnerForSchedule] = useState<StudyPartner | null>(null);
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleSubject, setScheduleSubject] = useState('Data Structures & Algorithms');
  const [scheduleDate, setScheduleDate] = useState('2026-08-01');
  const [scheduleTime, setScheduleTime] = useState('18:00');
  const [scheduleType, setScheduleType] = useState<'Video' | 'Voice' | 'Whiteboard'>('Video');

  const filteredCircle = learningCircle.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    showToast(`StudyConnect Learning Partner invite sent to ${inviteEmail}! 📩`, 'success');
    setInviteEmail('');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartnerForSchedule) return;
    scheduleStudySession({
      title: scheduleTitle || `Study Session with ${selectedPartnerForSchedule.name}`,
      subject: scheduleSubject,
      inviteeNames: [selectedPartnerForSchedule.name],
      date: scheduleDate,
      time: scheduleTime,
      sessionType: scheduleType
    });
    setSelectedPartnerForSchedule(null);
    setScheduleTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Learning Partners Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your Learning Circle</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Long-term study relationships, trusted mentors, and active study accountability partners.
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
            <span>Invite Partner</span>
          </button>
        </form>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('circle')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeSubTab === 'circle'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>My Learning Circle ({learningCircle.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('requests')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all relative ${
            activeSubTab === 'requests'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Pending Requests</span>
          {pendingFriendRequests.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingFriendRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* SUB-TAB 1: MY CIRCLE */}
      {activeSubTab === 'circle' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-partner"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Learning Partners by name or subject..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

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

                      <div className="space-y-0.5">
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
                            {partner.streakDays}d Streak
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {partner.subjects.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-300 text-[10px] font-medium border border-slate-700/50">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => startStudySession(partner)}
                      className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Session</span>
                    </button>

                    <button
                      onClick={() => setSelectedPartnerForSchedule(partner)}
                      className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center transition-colors"
                      title="Schedule Study Session"
                    >
                      <Calendar className="w-4 h-4 text-indigo-400" />
                    </button>

                    <button
                      onClick={() => removeFromLearningCircle(partner.id)}
                      className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove from Learning Circle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Learning Partners Found</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Search with a different term or find new matches using the AI Match Engine.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PENDING REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="space-y-6">
          {pendingFriendRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingFriendRequests.map(req => (
                <div key={req.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center gap-4">
                    <img src={req.sender.avatar} alt={req.sender.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700" />
                    <div>
                      <h3 className="text-base font-bold text-white">{req.sender.name}</h3>
                      <p className="text-xs text-indigo-400 font-medium">{req.sender.goal}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{req.createdAt}</p>
                    </div>
                  </div>
                  {req.message && (
                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 italic">
                      "{req.message}"
                    </p>
                  )}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => acceptFriendRequest(req.id)}
                      className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Partner</span>
                    </button>
                    <button
                      onClick={() => declineFriendRequest(req.id)}
                      className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
              <UserCheck className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">All Caught Up!</h3>
              <p className="text-slate-400 text-xs">You have no pending Learning Partner requests.</p>
            </div>
          )}
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {selectedPartnerForSchedule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Schedule Study Session</h3>
              </div>
              <button onClick={() => setSelectedPartnerForSchedule(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Learning Partner</label>
                <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <img src={selectedPartnerForSchedule.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <span className="text-xs font-bold text-white">{selectedPartnerForSchedule.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Session Topic / Goal</label>
                <input
                  type="text"
                  value={scheduleTitle}
                  onChange={e => setScheduleTitle(e.target.value)}
                  placeholder="e.g. Graph Algorithms & LeetCode BFS"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Session Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Video', 'Voice', 'Whiteboard'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setScheduleType(t)}
                      className={`py-2 rounded-2xl text-xs font-bold transition-colors ${
                        scheduleType === t ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                Confirm Schedule
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
