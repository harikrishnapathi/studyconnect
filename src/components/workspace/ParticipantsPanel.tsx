import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  UserPlus, 
  ShieldAlert, 
  Flame, 
  BookOpen, 
  Globe, 
  Star, 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  Video, 
  Sparkles,
  MapPin,
  Clock,
  Shield
} from 'lucide-react';

export const ParticipantsPanel: React.FC = () => {
  const { 
    user, 
    activePartner, 
    friendRequests, 
    sendFriendRequest, 
    addToLearningCircle, 
    learningCircle, 
    blockUser, 
    reportUser, 
    showToast 
  } = useApp();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  if (!activePartner) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-950 border border-slate-800 text-slate-500">
          <UserCheck className="w-8 h-8" />
        </div>
        <h3 className="text-white font-bold text-lg">No Active Study Partner</h3>
        <p className="text-slate-400 text-xs max-w-sm">Use the Intelligent Matching Engine to connect with a compatible study partner.</p>
      </div>
    );
  }

  const isFriend = learningCircle.some(p => p.id === activePartner.id);
  const isPendingFriend = friendRequests.includes(activePartner.id);

  const handleSendReport = () => {
    if (!reportReason.trim()) {
      showToast('Please specify a reason for the report.', 'warning');
      return;
    }
    reportUser(activePartner.id, reportReason);
    setReportModalOpen(false);
    setReportReason('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900/90 border border-slate-800 rounded-3xl overflow-y-auto p-6 space-y-6 shadow-2xl">
      
      {/* Participant Profile Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left z-10">
          <div className="relative">
            <img
              src={activePartner.avatar}
              alt={activePartner.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-2xl"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-black text-white">{activePartner.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold">
                {activePartner.skillLevel}
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-md">{activePartner.bio}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {activePartner.country}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> {activePartner.language}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5" /> {activePartner.streakDays} Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2 z-10 w-full md:w-auto">
          {!isFriend && (
            <button
              onClick={() => {
                sendFriendRequest(activePartner.id);
                addToLearningCircle(activePartner);
              }}
              disabled={isPendingFriend}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isPendingFriend ? 'Request Sent' : 'Send Friend Request'}</span>
            </button>
          )}

          {isFriend && (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>In Learning Circle</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid Stats & Subject Compatibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Academic Profile */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Primary Focus & Subjects</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300">Current Target Goal:</p>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white font-medium">
              🎯 {activePartner.goal}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300">Enrolled Subjects:</p>
            <div className="flex flex-wrap gap-2">
              {activePartner.subjects.map(s => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Metrics & Peer Rating */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>StudyConnect Peer Reputation</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-2xl font-black text-amber-400">★ {activePartner.rating}</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Peer Rating</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-2xl font-black text-indigo-400">{activePartner.studyHoursTotal}h</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Study Logged</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Preferred Learning Style:</span>
            <span className="font-bold text-slate-200">{activePartner.studyStyle}</span>
          </div>
        </div>
      </div>

      {/* Safety & Moderation Controls */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-slate-400" />
          <div>
            <h4 className="text-white font-bold text-xs">Safety & Moderation Options</h4>
            <p className="text-[11px] text-slate-500">Report inappropriate behavior or block user from matching.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition-all"
          >
            Report User
          </button>

          <button
            onClick={() => blockUser(activePartner.id)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 transition-all"
          >
            Block User
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm border-b border-slate-800 pb-3">
              <ShieldAlert className="w-5 h-5" />
              <span>Report {activePartner.name}</span>
            </div>

            <textarea
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
              placeholder="Please describe the issue (spam, inappropriate language, harassment, absence, etc.)..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReport}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
