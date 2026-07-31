import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyPartner } from '../../types';
import { MOCK_PARTNERS } from '../../data/mockData';
import { 
  Sparkles, 
  RotateCw, 
  MessageSquare, 
  UserPlus, 
  Flame, 
  Star, 
  Globe, 
  Clock, 
  Zap, 
  CheckCircle2,
  Video,
  Filter,
  Check
} from 'lucide-react';

export const AIMatchingEngine: React.FC = () => {
  const { user, startStudySession, addToLearningCircle, showToast } = useApp();

  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<StudyPartner[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [filterSubject, setFilterSubject] = useState<string>('All');

  // Trigger server-side AI match evaluation
  useEffect(() => {
    fetchMatches();
  }, [user]);

  const fetchMatches = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: user,
          mockDatabasePartners: MOCK_PARTNERS
        })
      });

      const data = await res.json();
      if (data.success && data.matches?.length > 0) {
        // Merge match scores into candidates
        const merged: StudyPartner[] = MOCK_PARTNERS.map(p => {
          const match = data.matches.find((m: any) => m.partnerId === p.id);
          if (match) {
            return {
              ...p,
              matchScore: match.matchScore,
              matchReason: match.matchReason,
              icebreakers: match.icebreakers,
              suggestedAgenda: match.suggestedAgenda
            };
          }
          return {
            ...p,
            matchScore: 88,
            matchReason: `High compatibility on learning goals and study schedule.`,
            icebreakers: [`Ready to study ${p.subjects[0]}?`, `What topic shall we cover first?`],
            suggestedAgenda: ['15m Review', '20m Practice', '10m Q&A']
          };
        }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

        setCandidates(merged);
      } else {
        setCandidates(MOCK_PARTNERS);
      }
    } catch (e) {
      console.error('Error fetching AI matches:', e);
      setCandidates(MOCK_PARTNERS);
    } finally {
      setTimeout(() => setIsScanning(false), 800);
    }
  };

  const filteredCandidates = candidates.filter(c => {
    if (filterSubject === 'All') return true;
    return c.subjects.includes(filterSubject);
  });

  const currentCandidate = filteredCandidates[currentIndex % Math.max(1, filteredCandidates.length)];

  const handleNextCandidate = () => {
    setIsScanning(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsScanning(false);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Smart Matchmaking Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your Top AI Study Partners
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Evaluating compatibility across subject alignment, skill level, language, and current mood.
          </p>
        </div>

        {/* Filter dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Subject Filter:</span>
            <select
              value={filterSubject}
              onChange={e => {
                setFilterSubject(e.target.value);
                setCurrentIndex(0);
              }}
              className="bg-transparent text-white font-semibold focus:outline-none"
            >
              <option value="All">All Subjects ({candidates.length})</option>
              {user.subjects.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <button
            id="btn-refresh-matches"
            onClick={fetchMatches}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Re-Scan</span>
          </button>
        </div>
      </div>

      {/* Main Matching Display */}
      {isScanning ? (
        /* Radar Scanner Animation State */
        <div className="min-h-[420px] flex flex-col items-center justify-center p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-center space-y-6">
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-2 border-indigo-500/30">
            <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-indigo-500/40 animate-pulse" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40">
              <Sparkles className="w-10 h-10 animate-spin" />
            </div>
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-bold text-white">Scanning Active Global Study Network...</h3>
            <p className="text-xs text-slate-400">
              Cross-referencing {user.subjects.join(', ')} with available peer schedules worldwide.
            </p>
          </div>
        </div>
      ) : currentCandidate ? (
        /* Matched Partner Showcase Card */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Candidate Main Profile Card (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Compatibility Badge Glow */}
            <div className="absolute top-0 right-0 p-4 sm:p-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-sm shadow-xl shadow-emerald-500/10 backdrop-blur-md">
                <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400 animate-pulse" />
                <span>{currentCandidate.matchScore || 96}% AI Match</span>
              </div>
            </div>

            {/* Candidate Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pr-24">
              <div className="relative">
                <img
                  src={currentCandidate.avatar}
                  alt={currentCandidate.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-indigo-500 shadow-xl shadow-indigo-500/20"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900" title="Online Now" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{currentCandidate.name}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {currentCandidate.country}
                  </span>
                </div>

                <p className="text-xs text-indigo-400 font-semibold">
                  {currentCandidate.goal}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    {currentCandidate.language}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {currentCandidate.timezone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    {currentCandidate.streakDays}d Streak
                  </span>
                </div>
              </div>
            </div>

            {/* Bio & Current Focus */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
              <p>{currentCandidate.bio}</p>
              {currentCandidate.currentFocusSubject && (
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-cyan-400 border-t border-slate-800/60">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Currently Studying: {currentCandidate.currentFocusSubject}</span>
                </div>
              )}
            </div>

            {/* AI Match Rationale */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-blue-950/30 to-slate-950 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Synergy Rationale</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {currentCandidate.matchReason}
              </p>
            </div>

            {/* Subject Chips */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Shared Expertise & Focus Topics
              </label>
              <div className="flex flex-wrap gap-2">
                {currentCandidate.subjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <button
                id="btn-match-start-study"
                onClick={() => startStudySession(currentCandidate)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start Study Session</span>
              </button>

              <button
                id="btn-match-add-circle"
                onClick={() => addToLearningCircle(currentCandidate)}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span>Add to Circle</span>
              </button>

              <button
                id="btn-match-skip"
                onClick={handleNextCandidate}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
              >
                <span>Next Partner</span>
              </button>
            </div>
          </div>

          {/* Right Column: Suggested Agenda & Icebreakers (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Suggested Study Session Agenda */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Clock className="w-4 h-4" />
                <span>Recommended 45m Session Agenda</span>
              </div>
              <ul className="space-y-3">
                {(currentCandidate.suggestedAgenda || [
                  '10m: Concept recap & target goal setting',
                  '25m: Focused problem solving & pair coding',
                  '10m: Q&A recap & whiteboard summary'
                ]).map((stepItem, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{stepItem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Conversation Icebreaker Starters */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>AI Conversation Starters</span>
              </div>
              <div className="space-y-2">
                {(currentCandidate.icebreakers || [
                  `Hey ${currentCandidate.name.split(' ')[0]}! Ready to conquer ${currentCandidate.subjects[0]} together?`,
                  `What's your biggest priority topic for today's session?`
                ]).map((ib, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      startStudySession(currentCandidate);
                      showToast(`Opened session with icebreaker pre-filled!`, 'info');
                    }}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-300 cursor-pointer transition-colors"
                  >
                    "{ib}"
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Video Call Test Button */}
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Instant HD Video / Voice Call</h4>
              <p className="text-xs text-slate-400">
                Join a live 1-on-1 audio/video study room with low latency & interactive canvas.
              </p>
              <button
                onClick={() => startStudySession(currentCandidate)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
              >
                Launch Room Call
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
          <p className="text-slate-400 text-sm">No partners match the selected subject filter right now.</p>
          <button
            onClick={() => setFilterSubject('All')}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Show All Candidates
          </button>
        </div>
      )}
    </div>
  );
};
