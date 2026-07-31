import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserProfile, 
  SkillLevel, 
  StudyStyle, 
  CurrentMood 
} from '../../types';
import { 
  POPULAR_SUBJECTS, 
  LEARNING_GOALS, 
  AVATAR_PRESETS 
} from '../../data/mockData';
import { 
  User, 
  Target, 
  BookOpen, 
  Layers, 
  Globe, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Check
} from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { user, setUser, setHasCompletedOnboarding, setActiveTab, showToast } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form state initialized from current user
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio);
  const [goal, setGoal] = useState(user.goal || LEARNING_GOALS[0]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(user.subjects || [POPULAR_SUBJECTS[0]]);
  const [customSubject, setCustomSubject] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(user.skillLevel || 'Intermediate');
  const [language, setLanguage] = useState(user.language || 'English');
  const [studyStyle, setStudyStyle] = useState<StudyStyle>(user.studyStyle || '1-on-1 Deep Focus');
  const [currentMood, setCurrentMood] = useState<CurrentMood>(user.currentMood || 'Need Help');

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      setSelectedSubjects([...selectedSubjects, customSubject.trim()]);
      setCustomSubject('');
    }
  };

  const handleFinish = () => {
    const updatedUser: UserProfile = {
      ...user,
      name,
      avatar,
      bio,
      goal,
      subjects: selectedSubjects,
      skillLevel,
      language,
      studyStyle,
      currentMood
    };

    setUser(updatedUser);
    setHasCompletedOnboarding(true);
    setActiveTab('matching');
    showToast(`Profile setup complete! Finding your AI study partners... 🚀`, 'success');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Progress Bar Header */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="text-indigo-400">Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Personal Profile */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
                <User className="w-3.5 h-3.5" />
                <span>Personal Profile</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Tell us about yourself</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                How should fellow study partners identify you?
              </p>
            </div>

            {/* Avatar Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Choose Avatar
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                <img 
                  src={avatar} 
                  alt="Current Avatar" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-lg shadow-indigo-500/30"
                />
                <div className="flex flex-wrap gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt={`Avatar preset ${idx}`}
                      onClick={() => setAvatar(preset)}
                      className={`w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform ${
                        avatar === preset ? 'ring-2 ring-indigo-400' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Full Name
              </label>
              <input
                id="input-onboard-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            {/* Bio Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Short Bio / Study Focus
              </label>
              <textarea
                id="input-onboard-bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="e.g. CS Senior preparing for LeetCode Mediums and System Design interviews."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Learning Goal */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
                <Target className="w-3.5 h-3.5" />
                <span>Primary Learning Goal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">What are you grinding for?</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Select your major objective so our AI can pair you with peers on the same track.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEARNING_GOALS.map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => setGoal(g)}
                  className={`p-4 rounded-2xl border text-left text-xs font-medium transition-all flex items-start justify-between gap-3 ${
                    goal === g
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{g}</span>
                  {goal === g && <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Subjects & Skill Level */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Subjects & Skill Level</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">What subjects are you studying?</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Select one or more topics. You can also add custom subjects below.
              </p>
            </div>

            {/* Popular Subjects Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Popular Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SUBJECTS.map((sub, idx) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSubject(sub)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Subject Input */}
            <form onSubmit={handleAddCustomSubject} className="flex gap-2">
              <input
                type="text"
                value={customSubject}
                onChange={e => setCustomSubject(e.target.value)}
                placeholder="Add another topic (e.g. Quantum Computing)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Add Topic
              </button>
            </form>

            {/* Skill Level Selection */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Skill Level in these Topics
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSkillLevel(lvl)}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                      skillLevel === lvl
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Preferred Language & Timezone */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                <Globe className="w-3.5 h-3.5" />
                <span>Language & Region</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Preferred Language & Time</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Matches are prioritized based on fluent language communication and active timezone.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Primary Discussion Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="Mandarin">Mandarin (中文)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                  <option value="Portuguese">Portuguese (Português)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Timezone & Availability Sync</span>
                </div>
                <p>
                  StudyConnect automatically detects your current availability status so partners know when you are ready to hop into a live voice/video study room.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Study Style & Mood */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>Study Style & Current Intention</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">How do you study best?</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Select your preferred interaction format and what you need right now.
              </p>
            </div>

            {/* Study Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Preferred Study Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  [
                    '1-on-1 Deep Focus',
                    'Small Group Discussion',
                    'Silent Pomodoro Co-working',
                    'Mock Interview & Quiz',
                    'Pair Programming',
                    'Concept Teaching & Revision'
                  ] as StudyStyle[]
                ).map(st => (
                  <button
                    key={st}
                    onClick={() => setStudyStyle(st)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      studyStyle === st
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Mood */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Right Now, I am looking to:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  ['Need Help', 'Want to Teach', 'Exam Crunch', 'Casual Discussion', 'Project Partner'] as CurrentMood[]
                ).map(m => (
                  <button
                    key={m}
                    onClick={() => setCurrentMood(m)}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                      currentMood === m
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-800/80 mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              id="btn-onboard-next"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-onboard-finish"
              onClick={handleFinish}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-xl shadow-emerald-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Match Engine</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
