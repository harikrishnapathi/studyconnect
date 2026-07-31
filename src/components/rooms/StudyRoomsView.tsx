import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyRoom } from '../../types';
import { MOCK_STUDY_ROOMS, POPULAR_SUBJECTS } from '../../data/mockData';
import { 
  Users, 
  Plus, 
  Search, 
  Lock, 
  Globe, 
  Sparkles, 
  Tag, 
  X,
  Radio,
  Clock
} from 'lucide-react';

export const StudyRoomsView: React.FC = () => {
  const { studyRooms, startStudySession, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Room Form State
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomSubject, setNewRoomSubject] = useState(POPULAR_SUBJECTS[0]);
  const [newRoomMax, setNewRoomMax] = useState(6);
  const [newRoomTags, setNewRoomTags] = useState('LeetCode, Python, DeepWork');

  const filteredRooms = studyRooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || room.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    const created: StudyRoom = {
      id: `room-${Date.now()}`,
      title: newRoomTitle.trim(),
      subject: newRoomSubject,
      hostName: 'You',
      hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      participantCount: 1,
      maxParticipants: newRoomMax,
      studyStyle: 'Small Group Discussion',
      tags: newRoomTags.split(',').map(t => t.trim()),
      isPrivate: false
    };

    studyRooms.unshift(created);
    setShowCreateModal(false);
    showToast(`Study Room "${created.title}" created! Live and ready.`, 'success');

    // Instantly join room
    startStudySession({
      id: `host-room-${created.id}`,
      name: created.title,
      avatar: created.hostAvatar,
      bio: `Host of ${created.title}`,
      email: 'room@studyconnect.app',
      goal: created.subject,
      subjects: [created.subject],
      skillLevel: 'Advanced',
      language: 'English',
      timezone: 'Global',
      country: 'Online',
      studyStyle: created.studyStyle,
      currentMood: 'Want to Teach',
      studyHoursTotal: 50,
      streakDays: 12,
      learningCircleCount: 20,
      rating: 4.9,
      isOnline: true
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Global Group Study Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Study Rooms</h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Join public group study sessions or host your own focused co-working room.
          </p>
        </div>

        <button
          id="btn-create-room"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Host Study Room</span>
        </button>
      </div>

      {/* Search & Subject Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-rooms"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search study rooms by topic or keyword..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedSubject('All')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSubject === 'All'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Topics
          </button>
          {POPULAR_SUBJECTS.slice(0, 4).map((sub, i) => (
            <button
              key={i}
              onClick={() => setSelectedSubject(sub)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Study Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRooms.map(room => (
          <div
            key={room.id}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl space-y-5 transition-all hover:scale-[1.01] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                  {room.subject}
                </span>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">{room.participantCount}/{room.maxParticipants}</span>
                  <span>Seats</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">{room.title}</h3>

              {/* Host info */}
              <div className="flex items-center gap-2.5 pt-1">
                <img
                  src={room.hostAvatar}
                  alt={room.hostName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                />
                <span className="text-xs text-slate-300">Hosted by <strong className="text-white">{room.hostName}</strong></span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {room.tags.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-medium">{room.studyStyle}</span>

              <button
                onClick={() => {
                  startStudySession({
                    id: `room-partner-${room.id}`,
                    name: room.hostName,
                    avatar: room.hostAvatar,
                    bio: `Host of ${room.title}`,
                    email: 'host@studyconnect.app',
                    goal: room.subject,
                    subjects: [room.subject],
                    skillLevel: 'Advanced',
                    language: 'English',
                    timezone: 'UTC',
                    country: 'Global',
                    studyStyle: room.studyStyle,
                    currentMood: 'Want to Teach',
                    studyHoursTotal: 120,
                    streakDays: 14,
                    learningCircleCount: 40,
                    rating: 4.9,
                    isOnline: true
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
              >
                Join Study Room
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Host Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleCreateRoom} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Host a New Study Room</h3>
              </div>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Room Title</label>
                <input
                  type="text"
                  value={newRoomTitle}
                  onChange={e => setNewRoomTitle(e.target.value)}
                  placeholder="e.g. ⚡ 50-Min Deep Work Pomodoro (Math & CS)"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Subject Topic</label>
                <select
                  value={newRoomSubject}
                  onChange={e => setNewRoomSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white"
                >
                  {POPULAR_SUBJECTS.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Max Seats (2 to 12)</label>
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={newRoomMax}
                  onChange={e => setNewRoomMax(parseInt(e.target.value) || 4)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newRoomTags}
                  onChange={e => setNewRoomTags(e.target.value)}
                  placeholder="LeetCode, Python, DeepWork"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg"
              >
                Launch Room
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
