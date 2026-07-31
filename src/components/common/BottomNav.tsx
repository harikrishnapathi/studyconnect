import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Sparkles, 
  Users, 
  Bell, 
  User, 
  Zap, 
  BookOpen,
  Globe,
  Activity,
  Trophy,
  Crown,
  Server,
  Rocket,
  Settings
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setQuickMatchOpen } = useApp();

  return (
    <>
      {/* Floating Action Button (FAB) for Quick Match - Always Available */}
      <div className="fixed bottom-20 right-5 sm:bottom-8 sm:right-8 z-40">
        <button
          onClick={() => setQuickMatchOpen(true)}
          className="group relative flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm shadow-2xl shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
        >
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">Quick Match</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-2 py-1.5 flex items-center justify-start sm:justify-around xl:hidden overflow-x-auto scrollbar-none gap-0.5 sm:gap-1">
        
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'home' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px]">Home</span>
        </button>

        {/* 2. Match */}
        <button
          onClick={() => setActiveTab('matching')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'matching' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[9px]">Match</span>
        </button>

        {/* AI Ecosystem */}
        <button
          onClick={() => setActiveTab('ai-ecosystem')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'ai-ecosystem' ? 'text-indigo-400 font-bold' : 'text-indigo-400/80'
          }`}
        >
          <Zap className="w-4 h-4 text-indigo-400" />
          <span className="text-[9px]">AI</span>
        </button>

        {/* Growth Engine */}
        <button
          onClick={() => setActiveTab('growth-engine')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'growth-engine' ? 'text-emerald-400 font-bold' : 'text-emerald-400/80'
          }`}
        >
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px]">Growth</span>
        </button>

        {/* Business Platform */}
        <button
          onClick={() => setActiveTab('business-platform')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'business-platform' ? 'text-amber-400 font-bold' : 'text-amber-400/80'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-[9px]">Pricing</span>
        </button>

        {/* Production Infrastructure */}
        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'infrastructure' ? 'text-indigo-400 font-bold' : 'text-indigo-400/80'
          }`}
        >
          <Server className="w-4 h-4 text-indigo-400" />
          <span className="text-[9px]">Infra</span>
        </button>

        {/* Launch & QA */}
        <button
          onClick={() => setActiveTab('production-readiness')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'production-readiness' ? 'text-emerald-400 font-bold' : 'text-emerald-400/80'
          }`}
        >
          <Rocket className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px]">Launch</span>
        </button>

        {/* 3. Pods */}
        <button
          onClick={() => setActiveTab('pods')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'pods' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[9px]">Pods</span>
        </button>

        {/* 4. Communities */}
        <button
          onClick={() => setActiveTab('communities')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'communities' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span className="text-[9px]">Global</span>
        </button>

        {/* 5. Circle */}
        <button
          onClick={() => setActiveTab('circle')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'circle' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[9px]">Circle</span>
        </button>

        {/* Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'feed' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[9px]">Feed</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'settings' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[9px]">Settings</span>
        </button>

      </nav>
    </>
  );
};

