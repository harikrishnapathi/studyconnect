import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserProfile,
  LearnerRole,
  StudyStyleOption,
  CurrentPurposeOption,
  SubjectSkillMap,
  NotificationPreferences,
  IntelligentOnboardingData
} from '../../types';
import { 
  Camera, 
  Image as ImageIcon, 
  UserCheck, 
  Target, 
  BookOpen, 
  Search, 
  Sliders, 
  Layers, 
  Clock, 
  Globe, 
  Bell, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus, 
  X,
  Trophy,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface IntelligentOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const LEARNER_ROLES: LearnerRole[] = [
  'School Student',
  'College Student',
  'University Student',
  'Working Professional',
  'Teacher',
  'Researcher',
  'Other'
];

const PRESET_LEARNING_GOALS = [
  'Crack Google Interview',
  'Learn Python',
  'Learn React Native',
  'Learn Java',
  'Learn AI',
  'Machine Learning',
  'Become Full Stack Developer',
  'UPSC',
  'GATE',
  'NEET',
  'CAT',
  'IELTS',
  'GRE',
  'TOEFL',
  'Data Science',
  'Web Development',
  'Mobile Development',
  'Cyber Security',
  'Cloud Computing',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Medical',
  'Finance',
  'Law'
];

const SUBJECT_CATEGORIES = [
  { name: 'Everything', subjects: [] },
  { name: 'Programming', subjects: ['Data Structures & Algorithms', 'Python', 'React Native', 'Java', 'JavaScript', 'C++', 'System Design', 'Rust', 'Go'] },
  { name: 'Technology', subjects: ['Machine Learning', 'Artificial Intelligence', 'Cloud Computing (AWS/GCP)', 'Cyber Security', 'DevOps & Docker', 'Blockchain'] },
  { name: 'Engineering', subjects: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Robotics'] },
  { name: 'Science', subjects: ['Physics', 'Organic Chemistry', 'Calculus & Linear Algebra', 'Molecular Biology', 'Astronomy', 'Statistics'] },
  { name: 'Medical', subjects: ['USMLE Step 1', 'Anatomy & Physiology', 'Pharmacology', 'NEET PG Prep', 'Biochemistry'] },
  { name: 'Competitive Exams', subjects: ['UPSC CSE', 'GATE CS', 'CAT Quant & DILR', 'GRE Verbal', 'IELTS Academic', 'GMAT'] },
  { name: 'Commerce & Business', subjects: ['Financial Accounting', 'Corporate Finance', 'Macroeconomics', 'Product Management', 'Marketing Strategy'] },
  { name: 'Languages', subjects: ['English Fluency', 'Spanish B2', 'German A1-B2', 'Japanese N3', 'French Conversations', 'Mandarin Basics'] }
];

const ALL_SUBJECTS = Array.from(new Set(SUBJECT_CATEGORIES.flatMap(c => c.subjects)));

const STUDY_STYLES: { title: StudyStyleOption; desc: string }[] = [
  { title: 'One-to-One', desc: 'Direct focused 1-on-1 collaboration with matched peer' },
  { title: 'Small Group', desc: 'Interactive study room with 3-5 motivated learners' },
  { title: 'Community', desc: 'Open discussion forums & peer knowledge exchanges' },
  { title: 'Silent Study', desc: 'Pomodoro timer co-working session with camera on' },
  { title: 'Discussion', desc: 'Active debate, concept Q&A, and problem breakdowns' },
  { title: 'Project Collaboration', desc: 'Build open-source projects or assignments together' },
  { title: 'Mock Interview', desc: 'Technical & behavioral practice interviews with feedback' },
  { title: 'Teaching Others', desc: 'Reinforce your knowledge by explaining to peers' }
];

const CURRENT_PURPOSES: CurrentPurposeOption[] = [
  'Study',
  'Revise',
  'Teach',
  'Practice Interviews',
  'Solve Problems',
  'Find Project Partners',
  'Learn Something New'
];

const LANGUAGES = [
  'English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam', 'Kannada', 
  'Marathi', 'Bengali', 'Spanish', 'German', 'French', 'Japanese', 
  'Chinese', 'Arabic'
];

const AVAILABILITY_OPTIONS = [
  'Morning', 'Afternoon', 'Evening', 'Night', 'Weekend Only', 'Flexible'
];

const AVATAR_GALLERY = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
];

export const IntelligentOnboarding: React.FC<IntelligentOnboardingProps> = ({ onComplete }) => {
  const { user, setUser, showToast } = useApp();

  const [step, setStep] = useState<number>(1);

  // Onboarding Data State
  const [profilePhoto, setProfilePhoto] = useState<string>(
    user.avatar || AVATAR_GALLERY[0]
  );
  const [learnerRole, setLearnerRole] = useState<LearnerRole>('University Student');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([PRESET_LEARNING_GOALS[0], PRESET_LEARNING_GOALS[1]]);
  const [customGoal, setCustomGoal] = useState('');

  // Step 4 & 5 Subjects & Skill Levels
  const [selectedCategory, setSelectedCategory] = useState('Everything');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [chosenSubjects, setChosenSubjects] = useState<string[]>(['Data Structures & Algorithms', 'Python']);
  const [skillLevels, setSkillLevels] = useState<Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>>({
    'Data Structures & Algorithms': 'Intermediate',
    'Python': 'Beginner'
  });

  // Step 6 Preferred Study Style
  const [selectedStudyStyles, setSelectedStudyStyles] = useState<StudyStyleOption[]>(['One-to-One', 'Discussion']);

  // Step 7 Current Purpose
  const [currentPurpose, setCurrentPurpose] = useState<CurrentPurposeOption>('Study');

  // Step 8 Preferred Languages
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);

  // Step 9 Availability & Timezone
  const [availability, setAvailability] = useState<string[]>(['Evening', 'Flexible']);
  const [detectedTimezone, setDetectedTimezone] = useState<string>('');

  // Step 10 Notifications
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    friendRequests: true,
    studyReminders: true,
    messages: true,
    calls: true,
    learningGoals: true,
    achievements: true
  });

  // Final Celebration State
  const [isPreparing, setIsPreparing] = useState(false);

  // Auto detect timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC-5 (EST)';
      setDetectedTimezone(tz);
    } catch {
      setDetectedTimezone('UTC-8 (PST)');
    }
  }, []);

  // Save progress locally automatically
  useEffect(() => {
    const onboardingDraft = {
      profilePhoto,
      learnerRole,
      selectedGoals,
      chosenSubjects,
      skillLevels,
      selectedStudyStyles,
      currentPurpose,
      selectedLanguages,
      availability,
      notifications
    };
    localStorage.setItem('studyconnect_onboarding_draft', JSON.stringify(onboardingDraft));
  }, [
    profilePhoto, learnerRole, selectedGoals, chosenSubjects, skillLevels, 
    selectedStudyStyles, currentPurpose, selectedLanguages, availability, notifications
  ]);

  // Subject Filtering
  const filteredSubjects = useMemo(() => {
    let pool = ALL_SUBJECTS;
    if (selectedCategory !== 'Everything') {
      const cat = SUBJECT_CATEGORIES.find(c => c.name === selectedCategory);
      pool = cat ? cat.subjects : ALL_SUBJECTS;
    }

    if (subjectSearch.trim()) {
      return pool.filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase()));
    }
    return pool;
  }, [selectedCategory, subjectSearch]);

  const toggleGoal = (g: string) => {
    if (selectedGoals.includes(g)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter(x => x !== g));
      }
    } else {
      setSelectedGoals([...selectedGoals, g]);
    }
  };

  const handleAddCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (customGoal.trim() && !selectedGoals.includes(customGoal.trim())) {
      setSelectedGoals([...selectedGoals, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  const toggleSubject = (sub: string) => {
    if (chosenSubjects.includes(sub)) {
      if (chosenSubjects.length > 1) {
        setChosenSubjects(chosenSubjects.filter(s => s !== sub));
        const copy = { ...skillLevels };
        delete copy[sub];
        setSkillLevels(copy);
      }
    } else {
      setChosenSubjects([...chosenSubjects, sub]);
      setSkillLevels(prev => ({ ...prev, [sub]: 'Intermediate' }));
    }
  };

  const toggleStudyStyle = (st: StudyStyleOption) => {
    if (selectedStudyStyles.includes(st)) {
      if (selectedStudyStyles.length > 1) {
        setSelectedStudyStyles(selectedStudyStyles.filter(s => s !== st));
      }
    } else {
      setSelectedStudyStyles([...selectedStudyStyles, st]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const toggleAvailability = (av: string) => {
    if (availability.includes(av)) {
      if (availability.length > 1) {
        setAvailability(availability.filter(a => a !== av));
      }
    } else {
      setAvailability([...availability, av]);
    }
  };

  const handleFinalLaunch = async () => {
    setIsPreparing(true);

    const subjectMapList: SubjectSkillMap[] = chosenSubjects.map(sub => ({
      subject: sub,
      category: 'General',
      skillLevel: skillLevels[sub] || 'Intermediate'
    }));

    const fullProfileData: UserProfile = {
      ...user,
      avatar: profilePhoto,
      goal: selectedGoals[0] || 'Learn & Excel',
      subjects: chosenSubjects,
      skillLevel: skillLevels[chosenSubjects[0]] || 'Intermediate',
      language: selectedLanguages[0] || 'English',
      timezone: detectedTimezone,
      studyStyle: (selectedStudyStyles[0] || '1-on-1 Deep Focus') as any,
      currentMood: (currentPurpose === 'Solve Problems' ? 'Need Help' : 'Casual Discussion') as any,
      bio: `${learnerRole} focused on ${selectedGoals.slice(0, 2).join(' & ')}.`
    };

    try {
      await fetch('/api/profile/update-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          profileData: {
            profilePhoto,
            learnerRole,
            selectedGoals,
            subjects: subjectMapList,
            studyStyles: selectedStudyStyles,
            currentPurpose,
            selectedLanguages,
            availability,
            detectedTimezone,
            notifications
          }
        })
      });
    } catch (e) {
      console.log('Saved onboarding profile state locally');
    }

    setTimeout(() => {
      setUser(fullProfileData);
      showToast('Intelligent Onboarding Complete! Welcome to StudyConnect 🚀', 'success');
      onComplete(fullProfileData);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 flex flex-col justify-center items-center bg-gradient-to-b from-[#0b0f19] via-slate-950 to-[#07090e]">
      
      <div className="w-full max-w-3xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Progress Bar (Netflix/Duolingo style) */}
        {step <= 10 && (
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="text-indigo-400 font-extrabold uppercase tracking-wider">
                Step {step} of 10
              </span>
              <span>{Math.round((step / 10) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${(step / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Profile Photo */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>Step 1: Profile Photo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Choose Your Profile Avatar</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                A profile photo helps study partners recognize you during live voice and video sessions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              <div className="relative">
                <img
                  src={profilePhoto}
                  alt="Profile Avatar"
                  className="w-28 h-28 rounded-3xl object-cover border-4 border-indigo-500 shadow-2xl shadow-indigo-500/30"
                />
                <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 text-white shadow-lg">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Preset Avatar
                </label>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  {AVATAR_GALLERY.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Avatar ${idx}`}
                      onClick={() => setProfilePhoto(url)}
                      className={`w-12 h-12 rounded-2xl object-cover cursor-pointer hover:scale-110 transition-transform ${
                        profilePhoto === url ? 'ring-2 ring-indigo-400 border-2 border-indigo-400' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-800 transition-colors">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    <span>Upload Custom Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => {
                            if (ev.target?.result) setProfilePhoto(ev.target.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold hover:text-white"
                  >
                    Skip Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: What best describes you? */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Step 2: Learner Role</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">What best describes you?</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                We personalize study partner matches according to your current academic or professional tier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEARNER_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setLearnerRole(role)}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    learnerRole === role
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{role}</span>
                  {learnerRole === role && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Select Learning Goals */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
                <Target className="w-3.5 h-3.5" />
                <span>Step 3: Learning Goals</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Select your learning goals</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Allow multiple selection. Add custom target goals below.
              </p>
            </div>

            {/* Selected Pills */}
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {PRESET_LEARNING_GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{goal}</span>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Goal */}
            <form onSubmit={handleAddCustomGoal} className="flex gap-2 pt-2">
              <input
                type="text"
                value={customGoal}
                onChange={e => setCustomGoal(e.target.value)}
                placeholder="Add custom goal (e.g. Pass AWS Solutions Architect)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Goal</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Select Subjects */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Step 4: Select Subjects</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Search & Choose Subjects</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Powerful searchable interface with categories. Select as many subjects as you want.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={subjectSearch}
                onChange={e => setSubjectSearch(e.target.value)}
                placeholder="Search subjects (e.g. Calculus, Machine Learning, Python)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {SUBJECT_CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {filteredSubjects.map(sub => {
                const isChosen = chosenSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    onClick={() => toggleSubject(sub)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isChosen
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{sub}</span>
                    {isChosen ? (
                      <Check className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Skill Level for Each Subject */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold">
                <Sliders className="w-3.5 h-3.5" />
                <span>Step 5: Skill Levels</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Define Skill Level per Subject</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Set your skill level for each selected subject so our AI matches you accurately.
              </p>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {chosenSubjects.map(sub => {
                const currentLevel = skillLevels[sub] || 'Intermediate';
                return (
                  <div key={sub} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{sub}</span>
                      <span className="text-xs font-semibold text-indigo-400">{currentLevel}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSkillLevels(prev => ({ ...prev, [sub]: lvl }))}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            currentLevel === lvl
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Preferred Study Style */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold">
                <Layers className="w-3.5 h-3.5" />
                <span>Step 6: Preferred Study Style</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">How do you prefer to study?</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Choose one or more study interaction formats.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STUDY_STYLES.map(style => {
                const isSelected = selectedStudyStyles.includes(style.title);
                return (
                  <button
                    key={style.title}
                    onClick={() => toggleStudyStyle(style.title)}
                    className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
                      <span>{style.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 font-normal leading-normal">
                      {style.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7: Current Purpose */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 7: Current Purpose</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Today I want to...</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Select your primary goal for today's sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CURRENT_PURPOSES.map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPurpose(p)}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    currentPurpose === p
                      ? 'bg-pink-600/20 border-pink-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{p}</span>
                  {currentPurpose === p && <Check className="w-4 h-4 text-pink-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: Preferred Languages */}
        {step === 8 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>Step 8: Preferred Languages</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Languages You Speak</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Allow multiple selection. StudyConnect matches you with peers fluent in your languages.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 max-h-56 overflow-y-auto">
              {LANGUAGES.map(lang => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 9: Study Availability */}
        {step === 9 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Step 9: Study Availability</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">When are you free to study?</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Select your active time slots. Automatic timezone detection active.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AVAILABILITY_OPTIONS.map(slot => {
                const isSelected = availability.includes(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => toggleAvailability(slot)}
                    className={`p-4 rounded-2xl border text-center font-bold text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Detected Timezone:</span>
              </div>
              <span className="font-bold text-white bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                {detectedTimezone}
              </span>
            </div>
          </div>
        )}

        {/* STEP 10: Notification Preferences */}
        {step === 10 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold">
                <Bell className="w-3.5 h-3.5" />
                <span>Step 10: Notification Preferences</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Customize Your Alerts</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Choose how StudyConnect updates you on partner requests, reminders, and goals.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { key: 'friendRequests', label: 'Friend Requests', desc: 'When peers invite you to their Learning Circle' },
                { key: 'studyReminders', label: 'Study Reminders', desc: 'Daily streak alerts & scheduled study session countdowns' },
                { key: 'messages', label: 'Direct Messages', desc: 'Instant chat messages from study partners' },
                { key: 'calls', label: 'Voice & Video Calls', desc: 'Incoming study room invitations & call requests' },
                { key: 'learningGoals', label: 'Learning Goals', desc: 'Milestone tracking & exam countdown updates' },
                { key: 'achievements', label: 'Achievements', desc: 'Badge unlocks & study streak rewards' }
              ].map(item => (
                <div 
                  key={item.key}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(notifications as any)[item.key]}
                    onChange={e => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-5 h-5 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 11: FINAL CELEBRATION SCREEN */}
        {step === 11 && (
          <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 via-blue-500 to-emerald-400 p-1 animate-spin">
                <div className="w-full h-full bg-slate-950 rounded-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                Setup Complete
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">You're Ready!</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                We're preparing your personalised StudyConnect experience and matching algorithm.
              </p>
            </div>

            <button
              id="btn-onboard-start-learning"
              onClick={handleFinalLaunch}
              disabled={isPreparing}
              className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-sm shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isPreparing ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Start Learning</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Navigation Buttons (Step 1 to 10) */}
        {step <= 10 && (
          <div className="flex items-center justify-between pt-8 border-t border-slate-800/80 mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              id="btn-onboard-next"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all"
            >
              <span>{step === 10 ? 'Complete Setup' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
