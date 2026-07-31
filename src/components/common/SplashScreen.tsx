import React from 'react';
import { 
  Sparkles, 
  Users, 
  Video, 
  FileText, 
  PenTool, 
  ArrowRight, 
  Globe2, 
  ShieldCheck, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4 py-12 overflow-hidden bg-gradient-to-b from-[#0b0f19] via-slate-950 to-[#07090e]">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold backdrop-blur-md shadow-lg shadow-indigo-500/5">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>Next-Gen Global Learning Network</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-slate-300">AI-Powered Matching</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Never Study Alone{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Again.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Instantly connect with another student anywhere in the world who is learning the exact same subject, at your skill level, in your language.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="btn-splash-get-started"
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>Start Learning Together</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Core Value Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-indigo-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">AI Match Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Match based on goals, skill level, study style & mood. Never random.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">HD Voice & Video</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamless 1-on-1 and group video study rooms with screen share.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Live Whiteboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Infinite co-drawing canvas with shapes, sticky notes & PDF export.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">File Sharing & AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              PDF previewer, code snippets, voice notes & Gemini AI study bot.
            </p>
          </div>
        </div>

        {/* Live Network Metrics */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-wrap items-center justify-around gap-6 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white">24,820+</span> Active Study Sessions
          </div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">142</span> Countries Connected
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">98.4%</span> AI Matching Accuracy
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Encrypted & Moderated
          </div>
        </div>
      </div>
    </div>
  );
};
