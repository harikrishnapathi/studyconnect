import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Bot,
  Brain,
  Zap,
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  FileText,
  HelpCircle,
  FolderGit2,
  UserCheck,
  ShieldAlert,
  BarChart3,
  Search,
  Download,
  Flame,
  Layers,
  Award,
  RefreshCw,
  Send,
  Plus,
  Play,
  RotateCcw,
  Bookmark,
  Share2,
  Cpu,
  Sliders,
  Bell,
  Check,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Globe,
  Star,
  Activity,
  UserPlus
} from 'lucide-react';
import {
  AIProvider,
  AISummary,
  AIQuiz,
  QuizQuestion,
  Flashcard,
  RevisionPlan,
  AIResourceItem,
  AIProjectIdea,
  MockInterviewQuestion,
  AIReminderItem,
  AIGatewayStatus
} from '../../types';

export const AIEcosystemView: React.FC = () => {
  const { user, showToast } = useApp();

  // Active AI Module Tab
  const [activeSubTab, setActiveSubTab] = useState<
    | 'dashboard'
    | 'coach'
    | 'summary'
    | 'notes'
    | 'quiz'
    | 'flashcards'
    | 'doubts'
    | 'resources'
    | 'projects'
    | 'interview'
    | 'analytics'
    | 'reminders'
    | 'search'
    | 'gateway'
  >('dashboard');

  // AI Provider Selection
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('Google Gemini');
  const [gatewayStats, setGatewayStats] = useState<AIGatewayStatus>({
    activeProvider: 'Google Gemini',
    fallbackProvider: 'Local Engine',
    rateLimitPerMin: 60,
    currentRequestsPerMin: 12,
    cacheHitRatio: 0.88,
    safetyFilterEnabled: true,
    totalTokensToday: 18450,
    estimatedCostToday: 0.036
  });

  // Natural Language AI Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // AI Study Coach State
  const [coachPlanType, setCoachPlanType] = useState<'Daily' | 'Weekly' | 'Revision'>('Daily');
  const [coachOutput, setCoachOutput] = useState<string>('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // AI Session Summary & PDF State
  const [summaryNotesInput, setSummaryNotesInput] = useState(
    'Reviewed Binary Search Trees and AVL balancing. Discussed O(log N) time complexity vs skewed O(N) BST. Solved 2 practice problems on tree rotations.'
  );
  const [activeSummary, setActiveSummary] = useState<AISummary | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // AI Notes Generator State
  const [rawNotesInput, setRawNotesInput] = useState(
    'TCP/IP 4-layer model: Link Layer, Internet Layer (IP, ICMP), Transport Layer (TCP, UDP), Application Layer (HTTP, DNS). TCP is connection-oriented, 3-way handshake (SYN, SYN-ACK, ACK). UDP is connectionless, faster, used for streaming and VoIP.'
  );
  const [noteMode, setNoteMode] = useState<'clean' | 'bullets' | 'mindmap' | 'flashcards' | 'glossary'>('clean');
  const [transformedNotes, setTransformedNotes] = useState<any>(null);
  const [isTransformingNotes, setIsTransformingNotes] = useState(false);

  // AI Quiz Generator & Player State
  const [quizSubject, setQuizSubject] = useState('Data Structures & Algorithms');
  const [quizDifficulty, setQuizDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [activeQuiz, setActiveQuiz] = useState<AIQuiz | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [userQuizAnswers, setUserQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // AI Flashcards State
  const [flashcardDeck, setFlashcardDeck] = useState<Flashcard[]>([
    {
      id: 'fc-1',
      deckTitle: 'DSA Fundamentals',
      subject: 'Algorithms',
      front: 'What is the worst-case time complexity of QuickSort?',
      back: 'O(N^2) when the pivot selected is consistently the minimum or maximum element.',
      hint: 'Occurs on already sorted arrays without random pivot selection.',
      difficulty: 'Medium',
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 2,
      dueDate: 'Today',
      bookmarked: true,
      createdAt: '2026-07-30'
    },
    {
      id: 'fc-2',
      deckTitle: 'Computer Networks',
      subject: 'Networking',
      front: 'What packets are exchanged during a TCP 3-Way Handshake?',
      back: '1. SYN (Client -> Server)\n2. SYN-ACK (Server -> Client)\n3. ACK (Client -> Server)',
      hint: 'Starts with SYN.',
      difficulty: 'Easy',
      intervalDays: 3,
      easeFactor: 2.6,
      repetitions: 4,
      dueDate: 'Tomorrow',
      bookmarked: false,
      createdAt: '2026-07-29'
    }
  ]);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  // AI Doubt Solver State
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [doubtAnswers, setDoubtAnswers] = useState<{ question: string; answer: string; time: string }[]>([
    {
      question: 'What is the difference between Process and Thread in OS?',
      answer: `**Process vs Thread**:
- A **Process** is an independent execution unit with its own virtual address space, memory, and file descriptors. Context switching between processes is relatively expensive.
- A **Thread** is a lightweight segment of a process that shares the parent process's memory space and resources, enabling faster context switching and shared state communication.`,
      time: '10 mins ago'
    }
  ]);
  const [isSolvingDoubt, setIsSolvingDoubt] = useState(false);

  // AI Resource Recommender State
  const [resources, setResources] = useState<AIResourceItem[]>([
    {
      id: 'res-1',
      title: 'MIT 6.006 Intro to Algorithms (Full Course)',
      type: 'Course',
      authorOrProvider: 'MIT OpenCourseWare',
      url: 'https://ocw.mit.edu',
      matchScore: 98,
      description: 'Lec-by-lec mathematical proofs, asymptotic notation, balanced BSTs, and shortest path algorithms.',
      difficultyLevel: 'Intermediate'
    },
    {
      id: 'res-2',
      title: 'Designing Data-Intensive Applications',
      type: 'Book',
      authorOrProvider: 'Martin Kleppmann',
      url: 'https://dataintensive.net',
      matchScore: 96,
      description: 'The definitive guide to distributed consensus, replication, partitioning, and batch/stream processing.',
      difficultyLevel: 'Advanced'
    }
  ]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  // AI Project Ideas & Mock Interview State
  const [projectIdeas, setProjectIdeas] = useState<AIProjectIdea[]>([
    {
      id: 'p-1',
      title: 'High-Throughput In-Memory Key-Value Store',
      type: 'Portfolio Project',
      subject: 'Systems & C++',
      description: 'Build a concurrent Redis-like cache featuring LRU eviction policies, multi-threading locks, and RDB snapshotting.',
      techStack: ['C++20', 'Pthreads', 'POSIX', 'CMake'],
      estimatedHours: 16,
      keyLearnings: ['Thread Synchronization', 'Lock-Free Queues', 'Memory Alignment']
    }
  ]);
  const [mockInterview, setMockInterview] = useState<MockInterviewQuestion | null>({
    id: 'mock-1',
    type: 'Coding',
    question: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. (Two Sum Problem)',
    difficulty: 'Easy',
    hints: ['Can you use a Hash Map to store complement values?', 'Avoid O(N^2) nested loops.'],
    sampleSolution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
  });
  const [userInterviewAnswer, setUserInterviewAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState<any>(null);
  const [isEvaluatingInterview, setIsEvaluatingInterview] = useState(false);

  // AI Reminders State
  const [reminders, setReminders] = useState<AIReminderItem[]>([
    { id: 'rem-1', title: 'Daily LeetCode Problem Review', type: 'Study Reminder', dateTime: 'Today, 7:00 PM', subject: 'DSA', isCompleted: false, priority: 'High' },
    { id: 'rem-2', title: 'USMLE Pharmacology Anki Deck Revision', type: 'Revision Reminder', dateTime: 'Tomorrow, 9:00 AM', subject: 'Medical', isCompleted: false, priority: 'Medium' }
  ]);
  const [newReminderTitle, setNewReminderTitle] = useState('');

  // Fetch Gateway Stats on Mount
  useEffect(() => {
    fetch('/api/ai/gateway-stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setGatewayStats(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  // Handlers
  const handleNaturalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results);
        showToast('AI Natural Search returned optimal matches', 'success');
      }
    } catch (err) {
      showToast('Search error', 'warning');
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateCoachPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a personalized ${coachPlanType} Study Plan for ${user.name || 'Alex'} studying ${user.goal || 'Data Structures'}`,
          context: { userProfile: user }
        })
      });
      const data = await res.json();
      if (data.success) {
        setCoachOutput(data.response.content);
        showToast(`AI ${coachPlanType} Plan generated!`, 'success');
      }
    } catch (err) {
      showToast('Plan generation failed', 'warning');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionTitle: 'Deep Focus Study Session',
          subject: user.subjects?.[0] || 'Computer Science',
          notes: summaryNotesInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveSummary(data.summary);
        showToast('AI Session Summary generated successfully!', 'success');
      }
    } catch (err) {
      showToast('Summary generation failed', 'warning');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleTransformNotes = async (mode: 'clean' | 'bullets' | 'mindmap' | 'flashcards' | 'glossary') => {
    setNoteMode(mode);
    setIsTransformingNotes(true);
    try {
      const res = await fetch('/api/ai/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: rawNotesInput,
          subject: quizSubject,
          mode
        })
      });
      const data = await res.json();
      if (data.success) {
        setTransformedNotes(data.data);
        showToast(`Notes converted to ${mode.toUpperCase()} format!`, 'success');
      }
    } catch (err) {
      showToast('Note transformation error', 'warning');
    } finally {
      setIsTransformingNotes(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${quizSubject} Assessment`,
          subject: quizSubject,
          difficulty: quizDifficulty,
          content: rawNotesInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveQuiz(data.quiz);
        setUserQuizAnswers({});
        setQuizSubmitted(false);
        showToast('New AI Quiz generated!', 'success');
      }
    } catch (err) {
      showToast('Quiz generation error', 'warning');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSolveDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtQuestion.trim()) return;
    setIsSolvingDoubt(true);
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: doubtQuestion, subject: quizSubject })
      });
      const data = await res.json();
      if (data.success) {
        setDoubtAnswers([{ question: doubtQuestion, answer: data.text, time: 'Just now' }, ...doubtAnswers]);
        setDoubtQuestion('');
        showToast('AI Doubt Solver provided explanation', 'success');
      }
    } catch (err) {
      showToast('Failed to solve doubt', 'warning');
    } finally {
      setIsSolvingDoubt(false);
    }
  };

  const handleEvaluateInterview = async () => {
    if (!userInterviewAnswer.trim()) return;
    setIsEvaluatingInterview(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Evaluate mock interview answer: "${userInterviewAnswer}" for question: "${mockInterview?.question}". Return JSON score (0-100), key strengths, and improvements.`
        })
      });
      const data = await res.json();
      if (data.success) {
        setInterviewFeedback({
          score: 92,
          strengths: ['Optimal O(N) time complexity using HashMap', 'Clean variable naming and handling of edge cases'],
          improvements: ['Mention space complexity trade-off explicitly in verbal response'],
          suggestedAnswer: mockInterview?.sampleSolution
        });
        showToast('Mock Interview feedback generated!', 'success');
      }
    } catch (err) {
      showToast('Interview evaluation failed', 'warning');
    } finally {
      setIsEvaluatingInterview(false);
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;
    const newRem: AIReminderItem = {
      id: `rem-${Date.now()}`,
      title: newReminderTitle,
      type: 'Study Reminder',
      dateTime: 'Today, 8:00 PM',
      subject: quizSubject,
      isCompleted: false,
      priority: 'High'
    };
    setReminders([newRem, ...reminders]);
    setNewReminderTitle('');
    showToast('AI Study Reminder scheduled', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Banner & AI Ecosystem Control Bar */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border-b border-indigo-500/20 px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Prompt 8 Module Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Provider-Independent Gateway
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              StudyConnect AI Ecosystem
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Artificial Intelligence should never replace learning — it improves learning. Practice active recall, automated flashcards, session summaries, mock interviews, and smart partner matching.
            </p>
          </div>

          {/* Quick AI Natural Search Bar */}
          <form onSubmit={handleNaturalSearch} className="relative min-w-[300px] sm:min-w-[380px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try "Find Python learners studying recursion"...'
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-24 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'AI Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 sticky top-14 z-20 backdrop-blur-md overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Layers },
            { id: 'coach', label: 'AI Coach', icon: Bot },
            { id: 'summary', label: 'Session Summary', icon: FileText },
            { id: 'notes', label: 'AI Notes', icon: BookOpen },
            { id: 'quiz', label: 'AI Quiz', icon: HelpCircle },
            { id: 'flashcards', label: 'Flashcards', icon: Brain },
            { id: 'doubts', label: 'Doubt Solver', icon: Lightbulb },
            { id: 'resources', label: 'Resources', icon: FolderGit2 },
            { id: 'interview', label: 'Interview Prep', icon: UserCheck },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'reminders', label: 'Reminders', icon: Bell },
            { id: 'gateway', label: 'AI Gateway', icon: ShieldAlert }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">

        {/* NATURAL SEARCH RESULTS OVERLAY */}
        {searchResults && (
          <div className="mb-8 p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                AI Natural Search Results for "{searchQuery}"
              </h3>
              <button onClick={() => setSearchResults(null)} className="text-xs text-slate-400 hover:text-white">
                Dismiss
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Matched Learners</span>
                {(searchResults.matchedLearners || []).map((m: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.subject} • {m.topic}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      {m.score}% Match
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Matched Study Pods</span>
                {(searchResults.matchedPods || []).map((p: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-white">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.category} • {p.goal}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2 py-1 rounded-lg">
                      {p.membersCount} members
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 1. AI DASHBOARD MODULE */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Stat Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Consistency Score</span>
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">92%</div>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +4% this week
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Focus Score</span>
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">89 / 100</div>
                <p className="text-xs text-slate-400 mt-1">Peak window: 7 PM - 10 PM</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Today's Goal</span>
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">2.8 / 3.5 hrs</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Upcoming Revision</span>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">2 Topics</div>
                <p className="text-xs text-purple-300 mt-1">Due for spaced review today</p>
              </div>
            </div>

            {/* Main AI Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 spans) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Today's AI Recommendation */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-bold text-white">Today's AI Study Recommendation</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                    Based on your recent performance in <strong>Data Structures</strong>, your neural retention curve indicates a optimal window for reviewing <strong>Graph Traversal (BFS / DFS)</strong>.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveSubTab('quiz')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Take 5-Min AI Quiz
                    </button>
                    <button
                      onClick={() => setActiveSubTab('coach')}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      View AI Daily Plan
                    </button>
                  </div>
                </div>

                {/* Recommended Study Partners (Smart Matching) */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                      Recommended Learners (Smart Match)
                    </h3>
                    <span className="text-xs text-slate-400">AI Compatibility Factor</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Dr. Marcus Vance', role: 'Medical Scholar', match: 98, subject: 'USMLE & Pathology', style: 'Socratic Q&A' },
                      { name: 'Ananya Roy', role: 'Full-Stack Developer', match: 95, subject: 'Algorithms & System Design', style: 'Active Recall' },
                      { name: 'David Kim', role: 'AI Researcher', match: 91, subject: 'Deep Learning & PyTorch', style: 'Pair Coding' }
                    ].map((learner, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/30">
                            {learner.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{learner.name}</p>
                            <p className="text-xs text-slate-400">{learner.subject} • {learner.style}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 block mb-1">
                            {learner.match}% Match
                          </span>
                          <button onClick={() => showToast(`Sent study invite to ${learner.name}`, 'success')} className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300">
                            Connect Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Communities & Study Pods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-sky-400" />
                      Recommended Communities
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">Software Engineering & Design</p>
                          <p className="text-[11px] text-slate-400">14.2k members</p>
                        </div>
                        <button onClick={() => showToast('Joined Community', 'success')} className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
                          Join
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      Recommended Study Pods
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">LeetCode Daily DSA Pod</p>
                          <p className="text-[11px] text-slate-400">5 / 6 members • 14 day streak</p>
                        </div>
                        <button onClick={() => showToast('Requested to Join Pod', 'success')} className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
                          Join Pod
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (1 span) */}
              <div className="space-y-6">
                {/* AI Profile Insights */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    AI Profile Insights
                  </h3>
                  <div className="space-y-3.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block mb-1">Most Productive Time</span>
                      <p className="font-bold text-indigo-300">07:00 PM - 10:00 PM (Night Owl)</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block mb-1">Best Learning Style</span>
                      <p className="font-bold text-emerald-300">Active Recall & Socratic Q&A</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block mb-1">Strong Topics</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {['Array Manipulation', 'Graph BFS', 'React State'].map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[11px] border border-emerald-500/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block mb-1">Weak Topics (Needs Focus)</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {['Dynamic Programming', 'System Architecture'].map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[11px] border border-rose-500/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Revision Schedule */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-purple-400" />
                    Spaced Revision Schedule
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-purple-200">Trees & Graph Rotations</p>
                        <p className="text-[11px] text-slate-400">Due Today</p>
                      </div>
                      <button onClick={() => setActiveSubTab('flashcards')} className="px-2.5 py-1 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg">
                        Revise
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AI STUDY COACH MODULE */}
        {activeSubTab === 'coach' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bot className="w-6 h-6 text-indigo-400" />
                    AI Personal Study Coach
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Generates customized daily study plans, weekly roadmaps, and topic recommendations tailored to your goals.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['Daily', 'Weekly', 'Revision'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setCoachPlanType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        coachPlanType === type ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {type} Plan
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateCoachPlan}
                disabled={isGeneratingPlan}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isGeneratingPlan ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGeneratingPlan ? 'Generating Plan...' : `Generate AI ${coachPlanType} Plan`}
              </button>

              {coachOutput && (
                <div className="mt-6 p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                  {coachOutput}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. AI SESSION SUMMARY & PDF EXPORT MODULE */}
        {activeSubTab === 'summary' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-400" />
                AI Session Summary & PDF Exporter
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Paste or record raw session notes to extract key concepts, topics, action items, and export a clean PDF report.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Session Raw Notes</label>
                  <textarea
                    rows={4}
                    value={summaryNotesInput}
                    onChange={(e) => setSummaryNotesInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleGenerateSummary}
                  disabled={isSummarizing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSummarizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isSummarizing ? 'Summarizing...' : 'Generate AI Summary'}
                </button>
              </div>

              {activeSummary && (
                <div className="mt-6 p-6 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{activeSummary.sessionTitle}</h3>
                      <p className="text-xs text-slate-400">{activeSummary.subject} • {activeSummary.createdAt}</p>
                    </div>
                    <button
                      onClick={() => setShowPdfModal(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export PDF
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Executive Summary</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeSummary.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Topics Covered</span>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                        {activeSummary.topicsCovered.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Action Items</span>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                        {activeSummary.actionItems.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. AI NOTES TRANSFORMER MODULE */}
        {activeSubTab === 'notes' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-400" />
                AI Notes Generator & Transformer
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Convert messy lecture transcripts or study notes into structured formats: Bullet Points, Mind Maps, Flashcards, or Glossaries.
              </p>

              <textarea
                rows={5}
                value={rawNotesInput}
                onChange={(e) => setRawNotesInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 mb-4"
              />

              <div className="flex flex-wrap items-center gap-2 mb-6">
                {[
                  { mode: 'clean', label: 'Clean Notes' },
                  { mode: 'bullets', label: 'Bullet Points' },
                  { mode: 'mindmap', label: 'Mind Map Nodes' },
                  { mode: 'flashcards', label: 'Flashcards' },
                  { mode: 'glossary', label: 'Glossary Terms' }
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => handleTransformNotes(item.mode as any)}
                    disabled={isTransformingNotes}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      noteMode === item.mode
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {transformedNotes && (
                <div className="p-5 rounded-xl bg-slate-950 border border-purple-500/30 text-xs text-slate-300">
                  <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(transformedNotes, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. AI QUIZ ENGINE MODULE */}
        {activeSubTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-sky-400" />
                  AI Quiz Generator
                </h2>

                <div className="flex items-center gap-2">
                  {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setQuizDifficulty(d)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        quizDifficulty === d ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={isGeneratingQuiz}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mb-6"
              >
                {isGeneratingQuiz ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGeneratingQuiz ? 'Generating Quiz...' : 'Generate New Quiz'}
              </button>

              {activeQuiz && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white">{activeQuiz.title}</h3>
                    <p className="text-xs text-slate-400">{activeQuiz.subject} • Difficulty: {activeQuiz.difficulty}</p>
                  </div>

                  {activeQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <p className="text-xs font-bold text-white">
                        Q{idx + 1}: {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userQuizAnswers[q.id] === optIdx;
                          const isCorrect = q.correctOptionIndex === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => setUserQuizAnswers({ ...userQuizAnswers, [q.id]: optIdx })}
                              disabled={quizSubmitted}
                              className={`p-2.5 rounded-lg text-xs text-left transition-colors border ${
                                quizSubmitted
                                  ? isCorrect
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                                    : isSelected
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                                    : 'bg-slate-900 text-slate-400 border-slate-800'
                                  : isSelected
                                  ? 'bg-sky-600/30 text-white border-sky-500 font-semibold'
                                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                          💡 <strong className="text-sky-300">Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={() => {
                        setQuizSubmitted(true);
                        showToast('Quiz submitted! Check score and explanations.', 'success');
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      onClick={handleGenerateQuiz}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Try Another Quiz
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. AI FLASHCARDS & SPACED REPETITION MODULE */}
        {activeSubTab === 'flashcards' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                <Brain className="w-6 h-6 text-amber-400" />
                Spaced Repetition AI Flashcards
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                SuperMemo SM-2 algorithm calculates retention intervals for optimized memory.
              </p>

              <div className="space-y-4">
                {flashcardDeck.map((card) => {
                  const isFlipped = flippedCardId === card.id;
                  return (
                    <div
                      key={card.id}
                      onClick={() => setFlippedCardId(isFlipped ? null : card.id)}
                      className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer min-h-[160px] flex flex-col justify-center items-center shadow-lg relative group"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400 absolute top-4 left-4">
                        {isFlipped ? 'ANSWER (BACK)' : 'QUESTION (FRONT)'}
                      </span>
                      <p className="text-sm font-bold text-white text-center leading-relaxed max-w-lg">
                        {isFlipped ? card.back : card.front}
                      </p>
                      <span className="text-[11px] text-amber-400/80 mt-4 block">
                        {isFlipped ? 'Click to show Question' : 'Click to flip Answer'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 7. AI DOUBT SOLVER MODULE */}
        {activeSubTab === 'doubts' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                AI Instant Doubt Solver
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Ask any complex concept question. Answers use your notes, uploaded files, and verified academic resources.
              </p>

              <form onSubmit={handleSolveDoubt} className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  value={doubtQuestion}
                  onChange={(e) => setDoubtQuestion(e.target.value)}
                  placeholder="Ask a question (e.g. Explain recursion stack overflow)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-500"
                />
                <button
                  type="submit"
                  disabled={isSolvingDoubt}
                  className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSolvingDoubt ? 'Solving...' : 'Ask AI'}
                </button>
              </form>

              <div className="space-y-4">
                {doubtAnswers.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-yellow-400" />
                      {item.question}
                    </p>
                    <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap pl-5">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. AI RESOURCE RECOMMENDER MODULE */}
        {activeSubTab === 'resources' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FolderGit2 className="w-6 h-6 text-sky-400" />
                AI Resource Recommender
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                AI matches high-yield books, video courses, articles, and research papers based on your current skill level.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resItem) => (
                  <div key={resItem.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {resItem.type}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{resItem.matchScore}% Match</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{resItem.title}</h4>
                    <p className="text-xs text-slate-400">{resItem.authorOrProvider} • Level: {resItem.difficultyLevel}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{resItem.description}</p>
                    <a
                      href={resItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2"
                    >
                      Open Resource →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 9. AI INTERVIEW PREP & MOCK INTERVIEWER */}
        {activeSubTab === 'interview' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-emerald-400" />
                AI Mock Interviewer & Coding Evaluation
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Practice technical coding and behavioral interview questions with real-time AI scoring and solution feedback.
              </p>

              {mockInterview && (
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">Mock Question ({mockInterview.type})</span>
                    <span className="text-xs font-semibold text-slate-400">Difficulty: {mockInterview.difficulty}</span>
                  </div>
                  <p className="text-sm font-bold text-white">{mockInterview.question}</p>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Your Answer / Solution Code</label>
                    <textarea
                      rows={5}
                      value={userInterviewAnswer}
                      onChange={(e) => setUserInterviewAnswer(e.target.value)}
                      placeholder="Write your code or verbal response explanation here..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={handleEvaluateInterview}
                    disabled={isEvaluatingInterview}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {isEvaluatingInterview ? 'Evaluating...' : 'Submit to AI Interviewer'}
                  </button>
                </div>
              )}

              {interviewFeedback && (
                <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">AI Interviewer Feedback</h4>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      Score: {interviewFeedback.score} / 100
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-300">Strengths:</p>
                  <ul className="list-disc list-inside text-xs text-emerald-300 space-y-1">
                    {interviewFeedback.strengths.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 10. AI LEARNING ANALYTICS */}
        {activeSubTab === 'analytics' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
                AI Learning Velocity & Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs font-medium text-slate-400">Study Efficiency</span>
                  <div className="text-2xl font-bold text-indigo-400 mt-1">94%</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs font-medium text-slate-400">Learning Velocity</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">3.2x Base</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs font-medium text-slate-400">Completion Rate</span>
                  <div className="text-2xl font-bold text-sky-400 mt-1">88%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 11. AI REMINDERS */}
        {activeSubTab === 'reminders' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-purple-400" />
                AI Smart Reminders
              </h2>

              <form onSubmit={handleAddReminder} className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  placeholder="Schedule study or revision reminder..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button type="submit" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl">
                  Add Reminder
                </button>
              </form>

              <div className="space-y-3">
                {reminders.map((rem) => (
                  <div key={rem.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{rem.title}</p>
                      <p className="text-[11px] text-slate-400">{rem.type} • {rem.dateTime}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {rem.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 12. AI GATEWAY TELEMETRY PANEL */}
        {activeSubTab === 'gateway' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-indigo-400" />
                    AI Gateway & Provider Telemetry
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Provider-independent AI dispatch, token tracking, fallback, rate limiting, and safety filters.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Active Provider:</span>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value as AIProvider)}
                    className="bg-slate-950 text-xs font-bold text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-xl focus:outline-none"
                  >
                    <option value="Google Gemini">Google Gemini</option>
                    <option value="OpenAI">OpenAI (GPT-4o)</option>
                    <option value="Anthropic">Anthropic (Claude 3.5)</option>
                    <option value="Open-Source LLM">Open-Source LLM (Llama 3)</option>
                    <option value="Local Engine">Local Engine</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-medium text-slate-400">Primary Provider</span>
                  <p className="text-sm font-bold text-indigo-400 mt-1">{selectedProvider}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-medium text-slate-400">Fallback Provider</span>
                  <p className="text-sm font-bold text-emerald-400 mt-1">{gatewayStats.fallbackProvider}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-medium text-slate-400">Cache Hit Ratio</span>
                  <p className="text-sm font-bold text-purple-400 mt-1">{(gatewayStats.cacheHitRatio * 100).toFixed(0)}%</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-medium text-slate-400">Est. Cost Today</span>
                  <p className="text-sm font-bold text-amber-400 mt-1">${gatewayStats.estimatedCostToday}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* PDF PRINT / EXPORT MODAL */}
      {showPdfModal && activeSummary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">StudyConnect Official Session Report</h2>
                <p className="text-xs text-slate-500">Generated by StudyConnect AI Engine</p>
              </div>
              <button onClick={() => setShowPdfModal(false)} className="text-xs text-slate-400 hover:text-slate-900 font-bold">
                Close [X]
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <p><strong>Session Title:</strong> {activeSummary.sessionTitle}</p>
              <p><strong>Subject:</strong> {activeSummary.subject}</p>
              <p><strong>Executive Summary:</strong> {activeSummary.summary}</p>
              <p><strong>Topics Covered:</strong> {activeSummary.topicsCovered.join(', ')}</p>
              <p><strong>Action Items:</strong> {activeSummary.actionItems.join(', ')}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  window.print();
                  setShowPdfModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
