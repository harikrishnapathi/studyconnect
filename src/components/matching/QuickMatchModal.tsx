import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuickMatchCriteria, StudyPartner } from '../../types';
import { MOCK_PARTNERS } from '../../data/mockData';
import { 
  X, 
  Sparkles, 
  Search, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  Clock, 
  Globe, 
  Flame, 
  Star, 
  UserPlus, 
  MessageSquare, 
  ShieldAlert, 
  Users, 
  Radio, 
  BookOpen, 
  Calendar, 
  UserCheck, 
  UserX,
  Volume2,
  Video,
  Code
} from 'lucide-react';

const SUBJECT_OPTIONS = [
  'Python', 'Java', 'React', 'DSA', 'Machine Learning', 'AWS',
  'IELTS', 'UPSC', 'GATE', 'Medical', 'Law', 'Finance',
  'Mathematics', 'Physics', 'Biology', 'Chemistry', 'System Design',
  'C++', 'Flutter', 'Economics', 'Psychology', 'Web Development'
];

const GOAL_OPTIONS = [
  'Understand Concepts', 'Revision', 'Exam Preparation',
  'Interview Preparation', 'Coding Practice', 'Assignments',
  'Project Discussion', 'Mock Interview', 'Teaching Others', 'Research'
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const STUDY_TYPES = ['One-to-One', 'Small Group', 'Community'];

const SESSION_LENGTHS = ['15 Minutes', '30 Minutes', '60 Minutes', '90 Minutes', '2 Hours', 'Unlimited'];

const COMM_PREFS: Array<'Text Chat' | 'Voice' | 'Video' | 'Whiteboard' | 'Any'> = [
  'Text Chat', 'Voice', 'Video', 'Whiteboard', 'Any'
];

const LANGUAGE_OPTIONS = [
  'English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam', 'Kannada',
  'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic'
];

export const QuickMatchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, startStudySession, addToLearningCircle, reportUser, showToast, setActiveTab } = useApp();

  const [step, setStep] = useState<number>(1);
  const [subjectQuery, setSubjectQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>(
    user.subjects && user.subjects.length > 0 ? user.subjects[0] : 'Python'
  );
  const [selectedGoal, setSelectedGoal] = useState<string>(
    user.goal || 'Understand Concepts'
  );
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    user.skillLevel || 'Intermediate'
  );
  const [studyType, setStudyType] = useState<'One-to-One' | 'Small Group' | 'Community'>('One-to-One');
  const [sessionLength, setSessionLength] = useState<string>('30 Minutes');
  const [commPref, setCommPref] = useState<'Text Chat' | 'Voice' | 'Video' | 'Whiteboard' | 'Any'>('Any');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    user.language ? [user.language] : ['English']
  );

  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matches, setMatches] = useState<Array<{
    partner: StudyPartner;
    compatibilityScore: number;
    matchReason: string;
    icebreakers: string[];
    suggestedAgenda: string[];
  }>>([]);
  const [matchIndex, setMatchIndex] = useState<number>(0);
  const [showProfileDrawer, setShowProfileDrawer] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? (prev.length > 1 ? prev.filter(l => l !== lang) : prev) : [...prev, lang]
    );
  };

  const filteredSubjects = SUBJECT_OPTIONS.filter(s => 
    s.toLowerCase().includes(subjectQuery.toLowerCase())
  );

  const handleRunQuickMatch = async () => {
    setIsMatching(true);
    setStep(8); // Showing match loader / result step

    const criteria: QuickMatchCriteria = {
      subject: selectedSubject,
      goal: selectedGoal,
      skillLevel,
      studyType,
      sessionLength,
      communicationPref: commPref,
      languages: selectedLanguages
    };

    try {
      const res = await fetch('/api/quick-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          criteria,
          mockDatabasePartners: MOCK_PARTNERS
        })
      });

      const data = await res.json();
      if (data.success && data.matches?.length > 0) {
        setMatches(data.matches);
      } else {
        // Fallback calculation
        const fallback = MOCK_PARTNERS.map(p => ({
          partner: p,
          compatibilityScore: 92,
          matchReason: `High compatibility on ${selectedSubject}. Shared alignment on ${selectedGoal}.`,
          icebreakers: [`Hey! Ready to study ${selectedSubject}?`, `What topic shall we cover first?`],
          suggestedAgenda: ['10m Review', '20m Practice', '10m Q&A']
        }));
        setMatches(fallback);
      }
    } catch (e) {
      console.error('Quick match error:', e);
      const fallback = MOCK_PARTNERS.map(p => ({
        partner: p,
        compatibilityScore: 89,
        matchReason: `Matched on ${selectedSubject} and ${selectedGoal}.`,
        icebreakers: [`Hey! Ready for ${selectedSubject}?`],
        suggestedAgenda: ['15m Concepts', '15m Discussion']
      }));
      setMatches(fallback);
    } finally {
      setTimeout(() => setIsMatching(false), 900);
    }
  };

  const currentMatch = matches[matchIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Intelligent Quick Match</h3>
              <p className="text-xs text-slate-400">Step {Math.min(7, step)} of 7 • Smart Partner Finder</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {step <= 7 && (
          <div className="w-full bg-slate-800 h-1">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1 transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        )}

        {/* Body Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* STEP 1: What are you studying today? */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-xl font-bold text-white">What are you studying today?</h4>
                <p className="text-xs text-slate-400 mt-1">Select or search for your primary topic of focus.</p>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subject (e.g. Python, Medical, Law...)"
                  value={subjectQuery}
                  onChange={e => setSubjectQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {(filteredSubjects.length > 0 ? filteredSubjects : [subjectQuery]).map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubject(sub)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                      selectedSubject === sub
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{sub}</span>
                      {selectedSubject === sub && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Goal Today */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-xl font-bold text-white">What is your goal today?</h4>
                <p className="text-xs text-slate-400 mt-1">Specify your exact objective for this study session.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GOAL_OPTIONS.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGoal(g)}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      selectedGoal === g
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{g}</span>
                    {selectedGoal === g && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Skill Level */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-xl font-bold text-white">Your Skill Level</h4>
                <p className="text-xs text-slate-400 mt-1">We'll pair you with peers at or around your proficiency.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {SKILL_LEVELS.map((lvl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSkillLevel(lvl as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      skillLevel === lvl
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{lvl}</span>
                      {skillLevel === lvl && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {lvl === 'Beginner' && 'Building foundational understanding & concepts.'}
                      {lvl === 'Intermediate' && 'Solving standard problems & revising core ideas.'}
                      {lvl === 'Advanced' && 'Tackling complex cases, mock interviews & advanced material.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Preferred Study Type */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-xl font-bold text-white">Preferred Study Type</h4>
                <p className="text-xs text-slate-400 mt-1">Choose your ideal group format.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {STUDY_TYPES.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStudyType(st as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      studyType === st
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{st}</span>
                      {studyType === st && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {st === 'One-to-One' && 'Direct 1-on-1 focus partner.'}
                      {st === 'Small Group' && '3 to 5 learners in a micro-study squad.'}
                      {st === 'Community' && 'Open group discussion or silent co-working room.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Preferred Session Length */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-xl font-bold text-white">Preferred Session Length</h4>
                <p className="text-xs text-slate-400 mt-1">How much time do you want to dedicate today?</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SESSION_LENGTHS.map((len, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSessionLength(len)}
                    className={`p-3.5 rounded-2xl border text-center text-xs font-bold transition-all ${
                      sessionLength === len
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                    <span>{len}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Communication Preference */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-xl font-bold text-white">Communication Preference</h4>
                <p className="text-xs text-slate-400 mt-1">Select your preferred session interaction medium.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMM_PREFS.map((cp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCommPref(cp)}
                    className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      commPref === cp
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{cp}</span>
                    {commPref === cp && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Languages */}
          {step === 7 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-xl font-bold text-white">Languages</h4>
                <p className="text-xs text-slate-400 mt-1">Select one or multiple languages you are comfortable speaking in.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {LANGUAGE_OPTIONS.map((lang, idx) => {
                  const isSelected = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleLanguage(lang)}
                      className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{lang}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: MATCH RESULT PREVIEW OR SCANNING */}
          {step === 8 && (
            <div>
              {isMatching ? (
                <div className="min-h-[320px] flex flex-col items-center justify-center space-y-5 text-center">
                  <div className="relative w-24 h-24 rounded-full border-2 border-indigo-500/30 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping" />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/40">
                      <Sparkles className="w-8 h-8 animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">Running Compatibility Engine...</h4>
                    <p className="text-xs text-slate-400">Scoring candidates based on subject, goal, skill level, and languages.</p>
                  </div>
                </div>
              ) : currentMatch ? (
                /* MATCH PREVIEW CARD */
                <div className="space-y-5 animate-in fade-in">
                  
                  {/* Top Match Score Badge */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/40">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                      <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400 animate-pulse" />
                      <span>{currentMatch.compatibilityScore}% Compatibility Score</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Rank #1 Match Found</span>
                  </div>

                  {/* Partner Overview */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="relative">
                      <img
                        src={currentMatch.partner.avatar}
                        alt={currentMatch.partner.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white">{currentMatch.partner.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {currentMatch.partner.country}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-400 font-semibold">{currentMatch.partner.goal}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span>🗣️ {currentMatch.partner.language}</span>
                        <span>•</span>
                        <span>⭐ {currentMatch.partner.rating} Rating</span>
                        <span>•</span>
                        <span>⏱️ {currentMatch.partner.studyHoursTotal} Study Hours</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Synergy Rationale */}
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                    <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                      Why this match?
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {currentMatch.matchReason}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => {
                        startStudySession(currentMatch.partner);
                        onClose();
                      }}
                      className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Start Session</span>
                    </button>

                    <button
                      onClick={() => setShowProfileDrawer(true)}
                      className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        if (matchIndex < matches.length - 1) {
                          setMatchIndex(prev => prev + 1);
                        } else {
                          showToast('No more direct candidates in queue. Showing alternative rooms!', 'info');
                          setStep(9); // Show fallback
                        }
                      }}
                      className="py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800"
                    >
                      Skip
                    </button>

                    <button
                      onClick={() => {
                        reportUser(currentMatch.partner.id, 'Inappropriate behavior in quick match');
                        if (matchIndex < matches.length - 1) setMatchIndex(prev => prev + 1);
                      }}
                      className="py-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 text-xs font-semibold border border-rose-800/40"
                    >
                      Report
                    </button>
                  </div>
                </div>
              ) : (
                /* FALLBACK STATE IF NO DIRECT MATCH */
                <div className="space-y-5 text-center animate-in fade-in py-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">No 1-on-1 Peer Online For "{selectedSubject}" Right Now</h4>
                    <p className="text-xs text-slate-400">Don't worry! Here are alternative instant options to keep learning:</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <button
                      onClick={() => {
                        setActiveTab('rooms');
                        onClose();
                      }}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 space-y-1 transition-all"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-indigo-400">
                        <Users className="w-4 h-4" />
                        <span>Join Live Study Room</span>
                      </div>
                      <p className="text-xs text-slate-400">Jump into open group study rooms operating right now.</p>
                    </button>

                    <button
                      onClick={() => {
                        showToast('Notification alert set! We will notify you when a partner joins.', 'success');
                        onClose();
                      }}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 space-y-1 transition-all"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-cyan-400">
                        <Zap className="w-4 h-4" />
                        <span>Notify Me When Match Found</span>
                      </div>
                      <p className="text-xs text-slate-400">Receive instant push notification when a matching learner is online.</p>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('workspace');
                        onClose();
                      }}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 space-y-1 transition-all"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
                        <BookOpen className="w-4 h-4" />
                        <span>Start Solo Focus Session</span>
                      </div>
                      <p className="text-xs text-slate-400">Use timer, AI assistant & whiteboard for solo study mode.</p>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('circle');
                        onClose();
                      }}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 space-y-1 transition-all"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-amber-400">
                        <UserPlus className="w-4 h-4" />
                        <span>Invite Friends</span>
                      </div>
                      <p className="text-xs text-slate-400">Send invite link to your classmate or peer.</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        {step <= 7 && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between">
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                step === 1 ? 'opacity-30 pointer-events-none text-slate-600' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {step < 7 ? (
              <button
                onClick={() => setStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleRunQuickMatch}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Study Partner</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
