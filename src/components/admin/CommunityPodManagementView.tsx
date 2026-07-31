import React, { useState } from 'react';
import { 
  Globe, 
  Users, 
  Plus, 
  Trash2, 
  Archive, 
  RotateCcw, 
  ShieldCheck, 
  UserPlus, 
  Pin, 
  Megaphone, 
  Eye,
  Check,
  X
} from 'lucide-react';
import { GlobalCommunity, StudyPod } from '../../types';

interface CommunityPodManagementViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CommunityPodManagementView: React.FC<CommunityPodManagementViewProps> = ({ onShowToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'communities' | 'pods'>('communities');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Tech & Code');

  // Sample Communities Admin State
  const [communities, setCommunities] = useState<GlobalCommunity[]>([
    { id: 'comm-1', name: 'Software Engineering & System Design', description: 'Global community for software developers, algorithms, and microservices.', membersCount: 14200, category: 'Tech & Code', joined: true, icon: '💻', coverImage: '', topContributors: [], pinnedResources: [], posts: [] },
    { id: 'comm-2', name: 'Medical & USMLE Scholars', description: 'High-yield board exam prep, Anki card exchange, and case studies.', membersCount: 8900, category: 'Medical', joined: false, icon: '🩺', coverImage: '', topContributors: [], pinnedResources: [], posts: [] },
    { id: 'comm-3', name: 'Global Language Exchange', description: 'Practice Spanish, German, French, Japanese with native speakers.', membersCount: 18500, category: 'Languages', joined: true, icon: '🌐', coverImage: '', topContributors: [], pinnedResources: [], posts: [] },
    { id: 'comm-4', name: 'Competitive Coding & Olympiads', description: 'ACM ICPC, LeetCode, Codeforces daily practice.', membersCount: 22100, category: 'Coding', joined: false, icon: '⚡', coverImage: '', topContributors: [], pinnedResources: [], posts: [] }
  ]);

  // Sample Pods Admin State
  const [pods, setPods] = useState<StudyPod[]>([
    {
      id: 'pod-1',
      name: 'LeetCode 75 Grind Squad',
      description: 'Daily DSA problem solving & mock whiteboard interviews.',
      category: 'Tech Interviews',
      goal: 'Solve 75 curated LeetCode problems by end of month',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      coverImage: '',
      members: [],
      maxMembers: 6,
      visibility: 'Public',
      streakDays: 14,
      tags: ['DSA', 'Algorithms', 'Python', 'Java'],
      announcements: [],
      pinnedResources: [],
      taskList: [],
      scheduledSessions: [],
      chatMessages: []
    },
    {
      id: 'pod-2',
      name: 'UPSC Aspirants Daily Target',
      description: 'Targeted current affairs review, answer writing practice, and peer evaluation.',
      category: 'Competitive Exams',
      goal: 'Master GS Paper 1-4 syllabus & daily answer evaluation',
      avatar: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80',
      coverImage: '',
      members: [],
      maxMembers: 8,
      visibility: 'Public',
      streakDays: 28,
      tags: ['UPSC', 'CurrentAffairs', 'GS1', 'India'],
      announcements: [],
      pinnedResources: [],
      taskList: [],
      scheduledSessions: [],
      chatMessages: []
    },
    {
      id: 'pod-3',
      name: 'PyTorch & LLM Fine-Tuning Circle',
      description: 'Hands-on code walkthroughs for Transformer architectures and LoRA fine-tuning.',
      category: 'Artificial Intelligence',
      goal: 'Train & deploy 3 open-source LLMs on custom datasets',
      avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150&auto=format&fit=crop&q=80',
      coverImage: '',
      members: [],
      maxMembers: 6,
      visibility: 'Public',
      streakDays: 9,
      tags: ['AI', 'PyTorch', 'DeepLearning', 'Transformers'],
      announcements: [],
      pinnedResources: [],
      taskList: [],
      scheduledSessions: [],
      chatMessages: []
    }
  ]);

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    if (activeSubTab === 'communities') {
      const newComm: GlobalCommunity = {
        id: `comm-${Date.now()}`,
        name: newTitle,
        description: newDesc || 'Official StudyConnect learning community.',
        membersCount: 1,
        category: newCategory,
        joined: true,
        icon: '📚',
        coverImage: '',
        topContributors: [],
        pinnedResources: [],
        posts: []
      };
      setCommunities([newComm, ...communities]);
      onShowToast(`Global Community "${newTitle}" created successfully!`, 'success');
    } else {
      const newPodItem: StudyPod = {
        id: `pod-${Date.now()}`,
        name: newTitle,
        description: newDesc || 'Dedicated study pod.',
        category: newCategory,
        goal: 'Peer collaboration & daily goals',
        avatar: '',
        coverImage: '',
        members: [],
        maxMembers: 6,
        visibility: 'Public',
        streakDays: 1,
        tags: [newCategory],
        announcements: [],
        pinnedResources: [],
        taskList: [],
        scheduledSessions: [],
        chatMessages: []
      };
      setPods([newPodItem, ...pods]);
      onShowToast(`Study Pod "${newTitle}" created successfully!`, 'success');
    }

    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteCommunity = (id: string, name: string) => {
    setCommunities(prev => prev.filter(c => c.id !== id));
    onShowToast(`Community "${name}" deleted by admin.`, 'error');
  };

  const handleDeletePod = (id: string, name: string) => {
    setPods(prev => prev.filter(p => p.id !== id));
    onShowToast(`Study Pod "${name}" deleted by admin.`, 'error');
  };

  const handleAssignModerator = (name: string) => {
    onShowToast(`Assigned Platform Moderator to "${name}"`, 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & SubTab Selector */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Communities & Study Pods Admin</h2>
          <p className="text-xs text-slate-400">Oversee global hub topics, assign moderators, enforce rules, and archive inactive pods.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveSubTab('communities')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'communities' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Communities ({communities.length})
            </button>
            <button
              onClick={() => setActiveSubTab('pods')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'pods' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Study Pods ({pods.length})
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create {activeSubTab === 'communities' ? 'Community' : 'Pod'}</span>
          </button>
        </div>
      </div>

      {/* Communities Directory Grid */}
      {activeSubTab === 'communities' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {communities.map((comm) => (
            <div key={comm.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{comm.name}</h3>
                    <span className="text-[11px] font-bold text-cyan-400">{comm.category}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-slate-950 text-slate-300 font-bold text-xs border border-slate-800">
                  {comm.membersCount.toLocaleString()} members
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{comm.description}</p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleAssignModerator(comm.name)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Assign Moderator</span>
                </button>

                <button
                  onClick={() => handleDeleteCommunity(comm.id, comm.name)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                  title="Delete Community"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Study Pods Directory Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pods.map((pod) => (
            <div key={pod.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                    {pod.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">🔥 {pod.streakDays}d streak</span>
                </div>

                <h3 className="font-extrabold text-white text-sm">{pod.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{pod.description}</p>

                <div className="flex flex-wrap gap-1">
                  {pod.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-400 border border-slate-800 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-400">{pod.members?.length || 0}/{pod.maxMembers} members</span>

                <button
                  onClick={() => handleDeletePod(pod.id, pod.name)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                  title="Archive / Delete Pod"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Community / Pod */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleCreateNew} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-white">Create New {activeSubTab === 'communities' ? 'Community' : 'Study Pod'}</h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Stanford AI Scholars"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                placeholder="Overview and target goals..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
