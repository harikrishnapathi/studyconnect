import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillLevel, StudyStyle, CurrentMood } from '../../types';
import { POPULAR_SUBJECTS, LEARNING_GOALS, AVATAR_PRESETS } from '../../data/mockData';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Lock, 
  Save, 
  Globe, 
  Moon, 
  Sun,
  CheckCircle2,
  Bell
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, setUser, theme, setTheme, showToast, blockedUserIds } = useApp();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);
  const [goal, setGoal] = useState(user.goal);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(user.skillLevel);
  const [language, setLanguage] = useState(user.language);
  const [studyStyle, setStudyStyle] = useState<StudyStyle>(user.studyStyle);
  const [currentMood, setCurrentMood] = useState<CurrentMood>(user.currentMood);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      avatar,
      bio,
      goal,
      skillLevel,
      language,
      studyStyle,
      currentMood
    }));
    showToast('Profile settings updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-1">
        <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Profile & Account Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Manage Your Profile</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Update your learning preferences, avatar, privacy, and theme settings.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Public Identity</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-slate-300">Avatar Selection</label>
              <div className="flex flex-wrap items-center gap-3">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                />
                <div className="flex flex-wrap gap-2">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt={`Preset ${idx}`}
                      onClick={() => setAvatar(p)}
                      className={`w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform ${
                        avatar === p ? 'ring-2 ring-indigo-400' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-wider text-slate-300">Target Learning Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-slate-300">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Matching Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-slate-300">Skill Level</label>
              <select
                value={skillLevel}
                onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-slate-300">Discussion Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Mandarin">Mandarin</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Safety Status */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Security & Privacy</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Encrypted Sessions</p>
                <p className="text-[11px] text-slate-400">JWT Authentication & WebRTC Encryption Active</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Bell className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Blocked Users</p>
                <p className="text-[11px] text-slate-400">{blockedUserIds.length} Accounts Blocked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
