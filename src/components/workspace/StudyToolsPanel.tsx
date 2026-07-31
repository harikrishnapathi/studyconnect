import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_FLASHCARDS } from '../../data/mockData';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Layers, 
  Code, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  RotateCw,
  Flame,
  Music
} from 'lucide-react';

export const StudyToolsPanel: React.FC = () => {
  const { user, showToast } = useApp();

  const [activeSubTool, setActiveSubTool] = useState<'pomodoro' | 'flashcards' | 'code'>('pomodoro');

  // Pomodoro State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [ambientSound, setAmbientSound] = useState<string>('Lofi Beats');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Flashcards State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<string[]>([]);

  // Code Editor State
  const [codeLang, setCodeLang] = useState('python');
  const [codeText, setCodeText] = useState(`def min_study_hours(sessions, target):
    # Calculate total accumulated hours
    total = sum(sessions)
    if total >= target:
        return 0
    return target - total

print(f"Hours needed: {min_study_hours([2.5, 4.0, 3.5], 15)}")`);
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [isExecutingCode, setIsExecutingCode] = useState(false);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(prev => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
      showToast(timerMode === 'focus' ? '🎉 Focus session complete! Take a break.' : 'Break over! Ready to focus?', 'success');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds, timerMode]);

  const switchTimerMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    if (mode === 'focus') setPomodoroSeconds(25 * 60);
    if (mode === 'shortBreak') setPomodoroSeconds(5 * 60);
    if (mode === 'longBreak') setPomodoroSeconds(15 * 60);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentCard = SAMPLE_FLASHCARDS[cardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((cardIndex + 1) % SAMPLE_FLASHCARDS.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((cardIndex - 1 + SAMPLE_FLASHCARDS.length) % SAMPLE_FLASHCARDS.length);
  };

  const handleRunCode = () => {
    setIsExecutingCode(true);
    setCodeOutput('Compiling & executing code on StudyConnect Sandbox...');
    setTimeout(() => {
      setIsExecutingCode(false);
      setCodeOutput(`>>> Execution Output:\nHours needed: 5.0\n\n[Process finished with exit code 0 - Execution time: 42ms]`);
      showToast('Code executed successfully!', 'success');
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Sub-tool Selector Tabs Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTool('pomodoro')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTool === 'pomodoro'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pomodoro & Ambient</span>
          </button>

          <button
            onClick={() => setActiveSubTool('flashcards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTool === 'flashcards'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveSubTool('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTool === 'code'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Pair Code Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Tool View Container */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        
        {/* SUBTOOL 1: POMODORO TIMER */}
        {activeSubTool === 'pomodoro' && (
          <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in duration-300">
            
            {/* Mode Switcher Pills */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => switchTimerMode('focus')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timerMode === 'focus' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                25m Focus
              </button>
              <button
                onClick={() => switchTimerMode('shortBreak')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timerMode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                5m Short Break
              </button>
              <button
                onClick={() => switchTimerMode('longBreak')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timerMode === 'longBreak' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                15m Long Break
              </button>
            </div>

            {/* Massive Digital Timer Clock */}
            <div className="relative py-8 flex flex-col items-center justify-center">
              <div className="w-64 h-64 rounded-full border-4 border-indigo-500/30 flex flex-col items-center justify-center bg-slate-950 shadow-2xl relative">
                <span className="text-6xl font-black font-mono tracking-tight text-white">
                  {formatTimer(pomodoroSeconds)}
                </span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400 mt-2">
                  {timerMode === 'focus' ? 'Deep Work Session' : 'Rest & Recharge'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
              >
                {isTimerRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                <span>{isTimerRunning ? 'Pause Session' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => switchTimerMode(timerMode)}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Ambient Sound Audio Player */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-indigo-400 shrink-0" />
                <div className="text-left">
                  <p className="font-bold text-white">Ambient Background Audio</p>
                  <p className="text-[11px] text-slate-400">{ambientSound}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={ambientSound}
                  onChange={e => setAmbientSound(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-medium"
                >
                  <option value="Lofi Beats">🎧 Lofi Beats</option>
                  <option value="Gentle Rain">🌧️ Gentle Rain</option>
                  <option value="Library Ambience">📚 Quiet Library</option>
                  <option value="Synthwave Study">🌌 Synthwave Study</option>
                </select>

                <button
                  onClick={() => {
                    setIsAudioPlaying(!isAudioPlaying);
                    showToast(isAudioPlaying ? 'Ambient sound muted' : `Playing ${ambientSound}`, 'info');
                  }}
                  className={`p-2 rounded-xl transition-colors ${
                    isAudioPlaying ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBTOOL 2: FLASHCARDS */}
        {activeSubTool === 'flashcards' && (
          <div className="max-w-xl w-full space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="text-amber-400">Deck: {currentCard.category}</span>
              <span>Card {cardIndex + 1} of {SAMPLE_FLASHCARDS.length}</span>
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="h-72 w-full p-8 rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 hover:border-amber-500/50 shadow-2xl flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-amber-400">{currentCard.category}</span>
                <span className="text-[11px] italic">Click to flip card</span>
              </div>

              <div className="text-center space-y-3">
                {!isFlipped ? (
                  <h3 className="text-xl font-bold text-white leading-relaxed">
                    "{currentCard.question}"
                  </h3>
                ) : (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Answer:</p>
                    <p className="text-sm text-slate-200 leading-relaxed">{currentCard.answer}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center text-xs text-slate-500 gap-1 font-mono">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isFlipped ? 'Showing Answer' : 'Showing Question'}</span>
              </div>
            </div>

            {/* Navigation & Score */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevCard}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Previous Card
              </button>

              <button
                onClick={() => {
                  if (!knownCards.includes(currentCard.id)) {
                    setKnownCards([...knownCards, currentCard.id]);
                  }
                  handleNextCard();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Mastered & Next</span>
              </button>

              <button
                onClick={handleNextCard}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Next Card
              </button>
            </div>
          </div>
        )}

        {/* SUBTOOL 3: PAIR CODE EDITOR */}
        {activeSubTool === 'code' && (
          <div className="w-full h-full flex flex-col space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">Interactive Sandbox Code Editor</span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={codeLang}
                  onChange={e => setCodeLang(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold"
                >
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript / TypeScript</option>
                  <option value="cpp">C++ (GCC 12)</option>
                </select>

                <button
                  onClick={handleRunCode}
                  disabled={isExecutingCode}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isExecutingCode ? 'Running...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                value={codeText}
                onChange={e => setCodeText(e.target.value)}
                rows={12}
                className="w-full h-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500 resize-none"
              />

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Execution Output</span>
                  <pre className="whitespace-pre-wrap text-emerald-400 font-mono text-xs">{codeOutput || 'Click "Run Code" to execute script...'}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
