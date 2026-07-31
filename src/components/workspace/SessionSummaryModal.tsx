import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Clock, 
  MessageSquare, 
  Folder, 
  Edit3, 
  Flame, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Share2
} from 'lucide-react';

export const SessionSummaryModal: React.FC = () => {
  const { 
    showSessionSummary, 
    setShowSessionSummary, 
    sessionDuration, 
    chatMessages, 
    sessionFiles, 
    whiteboardElements, 
    sessionNotes, 
    user, 
    activePartner, 
    friendRequests, 
    sendFriendRequest, 
    addToLearningCircle, 
    setActiveTab,
    showToast 
  } = useApp();

  if (!showSessionSummary) return null;

  const minutes = Math.floor(sessionDuration / 60);
  const seconds = sessionDuration % 60;

  const isFriend = activePartner ? friendRequests.includes(activePartner.id) : false;

  const handleCloseAndLeave = () => {
    setShowSessionSummary(false);
    setActiveTab('home');
    showToast('Session summary saved! See you on your next study round.', 'success');
  };

  const handleContinueChat = () => {
    setShowSessionSummary(false);
    setActiveTab('workspace');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        
        {/* Background Decorative Glow */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Study Session Completed! 🎉</h2>
          <p className="text-xs text-slate-400">
            Great work collaborating with <span className="text-indigo-400 font-bold">{activePartner?.name || 'your partner'}</span> on {user.subjects[0] || 'your study topic'}.
          </p>
        </div>

        {/* Core Session Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <Clock className="w-5 h-5 text-indigo-400 mx-auto" />
            <span className="text-lg font-black text-white">{minutes}m {seconds}s</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Duration</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <MessageSquare className="w-5 h-5 text-cyan-400 mx-auto" />
            <span className="text-lg font-black text-white">{chatMessages.length}</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Messages</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <Folder className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-lg font-black text-white">{sessionFiles.length}</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Files Shared</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <Edit3 className="w-5 h-5 text-amber-400 mx-auto" />
            <span className="text-lg font-black text-white">{whiteboardElements.length}</span>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Canvas Edits</p>
          </div>
        </div>

        {/* Achievement Badges & Streak Update */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Study Streak Increased!</p>
              <p className="text-[11px] text-slate-400">🔥 Current Streak: <span className="text-amber-400 font-bold">{user.streakDays + 1} Days</span></p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+150 XP</span>
          </div>
        </div>

        {/* Friend Request Action */}
        {activePartner && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-950 border border-indigo-500/20 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <img
                src={activePartner.avatar}
                alt={activePartner.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-white">Connect with {activePartner.name}</p>
                <p className="text-[11px] text-slate-400">Add to your permanent Learning Circle</p>
              </div>
            </div>

            <button
              onClick={() => {
                sendFriendRequest(activePartner.id);
                addToLearningCircle(activePartner);
              }}
              disabled={isFriend}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              {isFriend ? <CheckCircle2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{isFriend ? 'Connected' : 'Add Friend'}</span>
            </button>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 relative z-10">
          <button
            onClick={handleContinueChat}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            Continue Session
          </button>

          <button
            onClick={handleCloseAndLeave}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
          >
            <span>Return to Home Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
