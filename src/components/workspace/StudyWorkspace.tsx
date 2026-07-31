import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChatPanel } from './ChatPanel';
import { VideoCallPanel } from './VideoCallPanel';
import { WhiteboardPanel } from './WhiteboardPanel';
import { StudyToolsPanel } from './StudyToolsPanel';
import { SessionNotesPanel } from './SessionNotesPanel';
import { FilesPanel } from './FilesPanel';
import { ParticipantsPanel } from './ParticipantsPanel';
import { SessionSummaryModal } from './SessionSummaryModal';
import { 
  MessageSquare, 
  Video, 
  PenTool, 
  Wrench, 
  Users, 
  Flame, 
  Clock, 
  Radio, 
  ShieldAlert,
  Sparkles,
  FileText,
  Folder,
  Maximize2,
  Minimize2,
  Activity
} from 'lucide-react';

export const StudyWorkspace: React.FC = () => {
  const { 
    activePartner, 
    workspaceSubTab, 
    setWorkspaceSubTab, 
    sessionDuration, 
    endStudySession,
    setActiveTab,
    isFocusMode,
    setIsFocusMode,
    showToast
  } = useApp();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`max-w-7xl mx-auto p-3 lg:p-6 space-y-4 animate-in fade-in duration-300 ${isFocusMode ? 'py-2' : ''}`}>
      
      {/* Session Summary End Modal */}
      <SessionSummaryModal />

      {/* Workspace Top Bar */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md transition-all ${
        isFocusMode ? 'py-2.5 border-indigo-500/30' : ''
      }`}>
        
        {/* Partner Info & Status */}
        <div className="flex items-center gap-3">
          <img
            src={activePartner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={activePartner?.name}
            className="w-11 h-11 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                {activePartner ? `Session with ${activePartner.name}` : 'General Study Workspace'}
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Subject: <span className="text-indigo-400 font-semibold">{activePartner?.subjects[0] || 'Learning'}</span> • {activePartner?.studyStyle}
            </p>
          </div>
        </div>

        {/* SubTab Navigation Controls */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
          <button
            id="workspace-tab-chat"
            onClick={() => setWorkspaceSubTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              workspaceSubTab === 'chat'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>

          <button
            id="workspace-tab-whiteboard"
            onClick={() => setWorkspaceSubTab('whiteboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              workspaceSubTab === 'whiteboard'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-cyan-300" />
            <span>Whiteboard</span>
          </button>

          <button
            id="workspace-tab-notes"
            onClick={() => setWorkspaceSubTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              workspaceSubTab === 'notes'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-300" />
            <span>Session Notes</span>
          </button>

          <button
            id="workspace-tab-files"
            onClick={() => setWorkspaceSubTab('files')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              workspaceSubTab === 'files'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-emerald-300" />
            <span>Files</span>
          </button>

          <button
            id="workspace-tab-video"
            onClick={() => setWorkspaceSubTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              workspaceSubTab === 'video'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-indigo-300" />
            <span>Voice & Video</span>
          </button>

          <button
            id="workspace-tab-participants"
            onClick={() => setWorkspaceSubTab('participants')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              workspaceSubTab === 'participants'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Partner Info</span>
          </button>

          <button
            id="workspace-tab-tools"
            onClick={() => setWorkspaceSubTab('tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              workspaceSubTab === 'tools'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pomodoro & Code</span>
          </button>
        </div>

        {/* Right Status & Controls */}
        <div className="flex items-center gap-3 justify-end">
          {/* Live Ping & Timer */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300 font-mono font-medium">
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-xl border border-emerald-500/20">
              <Activity className="w-3 h-3" /> 14ms ping
            </span>
            <span className="flex items-center gap-1 font-bold text-white bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> {formatTime(sessionDuration)}
            </span>
          </div>

          {/* Focus Mode Toggle */}
          <button
            onClick={() => {
              setIsFocusMode(!isFocusMode);
              showToast(isFocusMode ? 'Exited Focus Mode' : 'Entered Focus Mode 🧘‍♂️', 'info');
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
              isFocusMode 
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' 
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Focus Mode"
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* End Session Button */}
          <button
            id="btn-end-session"
            onClick={() => endStudySession()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-bold transition-colors shadow-md"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Render Active SubPanel */}
      <div>
        {workspaceSubTab === 'chat' && <ChatPanel />}
        {workspaceSubTab === 'video' && <VideoCallPanel />}
        {workspaceSubTab === 'whiteboard' && <WhiteboardPanel />}
        {workspaceSubTab === 'notes' && <SessionNotesPanel />}
        {workspaceSubTab === 'files' && <FilesPanel />}
        {workspaceSubTab === 'participants' && <ParticipantsPanel />}
        {workspaceSubTab === 'tools' && <StudyToolsPanel />}
      </div>
    </div>
  );
};

