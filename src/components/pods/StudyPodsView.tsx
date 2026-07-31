import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyPod, FileAttachment } from '../../types';
import { 
  Users, 
  Plus, 
  MessageSquare, 
  Video, 
  PenTool, 
  FileText, 
  CheckSquare, 
  Megaphone, 
  Pin, 
  Trophy, 
  Flame, 
  Lock, 
  Globe, 
  Send, 
  Paperclip, 
  X, 
  ChevronLeft,
  Calendar,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const StudyPodsView: React.FC = () => {
  const { 
    studyPods, 
    activePod, 
    setActivePod, 
    createPod, 
    joinPod, 
    leavePod, 
    addPodChatMessage, 
    addPodTask, 
    togglePodTask,
    setActiveTab,
    setWorkspaceSubTab,
    showToast,
    user
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pod active subview inside pod details
  const [podSubTab, setPodSubTab] = useState<'chat' | 'tasks' | 'announcements' | 'resources' | 'leaderboard'>('chat');

  // New pod form state
  const [newPodName, setNewPodName] = useState('');
  const [newPodDesc, setNewPodDesc] = useState('');
  const [newPodCategory, setNewPodCategory] = useState('Tech Interviews');
  const [newPodGoal, setNewPodGoal] = useState('');
  const [newPodMaxMembers, setNewPodMaxMembers] = useState(6);

  // Chat input
  const [chatInput, setChatInput] = useState('');

  // Task input
  const [newTaskInput, setNewTaskInput] = useState('');

  const categories = ['All', 'Tech Interviews', 'Competitive Exams', 'Artificial Intelligence', 'Mobile Development', 'Languages', 'Programming'];

  const filteredPods = studyPods.filter(pod => {
    const matchesCat = filterCategory === 'All' || pod.category === filterCategory;
    const matchesQuery = pod.name.toLowerCase().includes(searchQuery.toLowerCase()) || pod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPodName.trim()) return;
    createPod({
      name: newPodName,
      description: newPodDesc,
      category: newPodCategory,
      goal: newPodGoal,
      maxMembers: newPodMaxMembers,
      tags: [newPodCategory, 'StudyPod']
    });
    setShowCreateModal(false);
    setNewPodName('');
    setNewPodDesc('');
    setNewPodGoal('');
  };

  const handleSendPodChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activePod) return;
    addPodChatMessage(activePod.id, chatInput);
    setChatInput('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim() || !activePod) return;
    addPodTask(activePod.id, newTaskInput);
    setNewTaskInput('');
  };

  // Launch workspace interactive session for pod
  const launchPodSession = (type: 'chat' | 'video' | 'whiteboard' | 'notes') => {
    setActiveTab('workspace');
    setWorkspaceSubTab(type);
    showToast(`Launched interactive Study Pod session (${type})! 🎓`, 'success');
  };

  // IF AN ACTIVE POD IS OPEN, RENDER DETAILED POD VIEW
  if (activePod) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6 animate-in fade-in duration-300">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActivePod(null)}
            className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Pods</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => launchPodSession('video')}
              className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Launch Voice/Video</span>
            </button>

            <button
              onClick={() => launchPodSession('whiteboard')}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
            >
              <PenTool className="w-4 h-4" />
              <span>Pod Whiteboard</span>
            </button>
          </div>
        </div>

        {/* Pod Banner Header */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <img src={activePod.coverImage} alt="" className="w-full h-36 object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
          
          <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-16">
            <div className="flex items-center gap-5">
              <img src={activePod.avatar} alt="" className="w-20 h-20 rounded-3xl object-cover border-2 border-indigo-500 shadow-xl" />
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{activePod.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-[10px]">
                    {activePod.category}
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl">{activePod.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    {activePod.streakDays} Day Pod Streak
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-400" />
                    {activePod.members.length} / {activePod.maxMembers} Members
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activePod.myRole ? (
                <button
                  onClick={() => leavePod(activePod.id)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 font-bold text-xs transition-colors"
                >
                  Leave Pod
                </button>
              ) : (
                <button
                  onClick={() => joinPod(activePod.id)}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Join Pod</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pod Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setPodSubTab('chat')}
            className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              podSubTab === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Group Chat</span>
          </button>

          <button
            onClick={() => setPodSubTab('tasks')}
            className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              podSubTab === 'tasks' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Task List ({activePod.taskList.filter(t => !t.completed).length})</span>
          </button>

          <button
            onClick={() => setPodSubTab('announcements')}
            className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              podSubTab === 'announcements' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Announcements</span>
          </button>

          <button
            onClick={() => setPodSubTab('resources')}
            className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              podSubTab === 'resources' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Pin className="w-4 h-4" />
            <span>Pinned Resources</span>
          </button>

          <button
            onClick={() => setPodSubTab('leaderboard')}
            className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              podSubTab === 'leaderboard' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Pod Members ({activePod.members.length})</span>
          </button>
        </div>

        {/* POD TAB CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* MAIN CONTAINER */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SUB-VIEW 1: GROUP CHAT */}
            {podSubTab === 'chat' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-[520px] shadow-xl">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {activePod.chatMessages.length > 0 ? (
                    activePod.chatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-lg ${msg.senderId === 'user-me' ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        <img src={msg.senderAvatar} alt="" className="w-8 h-8 rounded-full border border-slate-700" />
                        <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                          msg.senderId === 'user-me' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'
                        }`}>
                          <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                            <span className="font-bold">{msg.senderName}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                      <MessageSquare className="w-8 h-8" />
                      <p className="text-xs">No chat messages yet in this Pod. Start the discussion!</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendPodChat} className="pt-4 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Message Pod members..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* SUB-VIEW 2: TASK LIST */}
            {podSubTab === 'tasks' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-indigo-400" />
                    <span>Pod Accountability Tasks</span>
                  </h3>
                </div>

                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={e => setNewTaskInput(e.target.value)}
                    placeholder="Add task (e.g. Solve 5 Graph BFS problems)..."
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                  </button>
                </form>

                <div className="space-y-2">
                  {activePod.taskList.map(task => (
                    <div
                      key={task.id}
                      onClick={() => togglePodTask(activePod.id, task.id)}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className="w-4 h-4 rounded accent-indigo-600"
                        />
                        <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                      </div>
                      {task.assignedTo && (
                        <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                          {task.assignedTo}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: ANNOUNCEMENTS */}
            {podSubTab === 'announcements' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-indigo-400" />
                  <span>Pod Announcements</span>
                </h3>
                {activePod.announcements.length > 0 ? (
                  activePod.announcements.map(ann => (
                    <div key={ann.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-indigo-300">{ann.title}</h4>
                        <span className="text-[10px] text-slate-500">{ann.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300">{ann.text}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Posted by {ann.authorName}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">No announcements yet.</p>
                )}
              </div>
            )}

            {/* SUB-VIEW 4: PINNED RESOURCES */}
            {podSubTab === 'resources' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Pin className="w-5 h-5 text-indigo-400" />
                  <span>Shared Pod Notes & Cheat Sheets</span>
                </h3>
                {activePod.pinnedResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activePod.pinnedResources.map(res => (
                      <div key={res.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-indigo-400" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{res.name}</h4>
                            <p className="text-[10px] text-slate-500">{res.size} • Uploaded by {res.uploadedBy}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-6 text-center">No pinned resources in this pod.</p>
                )}
              </div>
            )}

            {/* SUB-VIEW 5: MEMBERS */}
            {podSubTab === 'leaderboard' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-indigo-400" />
                  <span>Pod Members & Study Hours</span>
                </h3>
                <div className="space-y-3">
                  {activePod.members.map((m, idx) => (
                    <div key={m.userId} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-xs text-slate-500 w-4">#{idx + 1}</span>
                        <img src={m.avatar} alt="" className="w-9 h-9 rounded-full border border-slate-700" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{m.name}</h4>
                          <span className="text-[10px] text-indigo-400 font-semibold">{m.role}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-amber-400">{m.studyHoursInPod} Hours</p>
                        <p className="text-[10px] text-slate-500">Joined {m.joinedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR: POD STATS */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">Pod Info</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Goal:</span>
                  <span className="font-bold text-white">{activePod.goal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Visibility:</span>
                  <span className="font-bold text-emerald-400">{activePod.visibility}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Category:</span>
                  <span className="font-bold text-indigo-400">{activePod.category}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {activePod.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-xl bg-slate-950 text-slate-300 text-[10px] border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // DEFAULT VIEW: LIST OF ALL STUDY PODS
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Permanent Learning Groups (3-8 Learners)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Study Pods</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Join intense, high-accountability study cohorts with shared goals, leaderboards, and group whiteboards.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Study Pod</span>
        </button>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search pods..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Study Pods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPods.map(pod => (
          <div
            key={pod.id}
            onClick={() => setActivePod(pod)}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl space-y-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <img src={pod.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-700" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{pod.name}</h3>
                    {pod.myRole && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[9px]">
                        Joined
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-400 font-semibold">{pod.category}</p>
                </div>
              </div>

              <p className="text-slate-400 text-xs line-clamp-2">{pod.description}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {pod.streakDays}d Streak
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  {pod.members.length} / {pod.maxMembers} Members
                </span>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-400 font-bold text-xs transition-colors">
              Open Study Pod
            </button>
          </div>
        ))}
      </div>

      {/* CREATE POD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Create New Study Pod</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Pod Name</label>
                <input
                  type="text"
                  value={newPodName}
                  onChange={e => setNewPodName(e.target.value)}
                  placeholder="e.g. Google Interview 2027 Onsite Prep"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Description</label>
                <textarea
                  value={newPodDesc}
                  onChange={e => setNewPodDesc(e.target.value)}
                  placeholder="Describe your pod's focus and expectations..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Category</label>
                  <select
                    value={newPodCategory}
                    onChange={e => setNewPodCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Max Members (3-8)</label>
                  <input
                    type="number"
                    min={3}
                    max={8}
                    value={newPodMaxMembers}
                    onChange={e => setNewPodMaxMembers(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Primary Goal</label>
                <input
                  type="text"
                  value={newPodGoal}
                  onChange={e => setNewPodGoal(e.target.value)}
                  placeholder="e.g. Solve 100 LeetCode Mediums together by September"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                Create Pod & Invite Members
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
