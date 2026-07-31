import React from 'react';
import { Sparkles, Users, Globe2, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#0b0f19] via-slate-950 to-[#07090e] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full mx-auto text-center space-y-8 animate-in fade-in duration-500">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Intelligent Peer Learning Platform</span>
        </div>

        {/* Global Student Community Hero Visual Illustration */}
        <div className="relative max-w-xl mx-auto py-4">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-md space-y-6">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center transform -rotate-2 hover:rotate-0 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Student London"
                  className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-indigo-500 shadow-md"
                />
                <p className="text-xs font-bold text-white">Elena</p>
                <p className="text-[10px] text-indigo-400">🇬🇧 London • CS</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-900/40 to-slate-950 border border-indigo-500/30 text-center space-y-2 shadow-xl z-10 scale-105">
                <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-400 mx-auto flex items-center justify-center text-indigo-300">
                  <Globe2 className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-xs font-black text-white uppercase tracking-wider">Live Match</p>
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  98% Compatible
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center transform rotate-2 hover:rotate-0 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Student Tokyo"
                  className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-cyan-500 shadow-md"
                />
                <p className="text-xs font-bold text-white">Kenji</p>
                <p className="text-[10px] text-cyan-400">🇯🇵 Tokyo • AI</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <HeartHandshake className="w-4 h-4 text-pink-400" />
              <span>Studying together in real-time right now</span>
            </div>
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Never Study Alone{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Again
            </span>
          </h1>

          <div className="text-slate-300 text-sm sm:text-base space-y-1 font-medium leading-relaxed">
            <p>Find learners worldwide who share your goals.</p>
            <p>Study together. Discuss concepts.</p>
            <p>Build friendships. Grow together.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            id="btn-welcome-get-started"
            onClick={onGetStarted}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-welcome-login"
            onClick={onLogin}
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold text-sm transition-all"
          >
            Already have an account
          </button>
        </div>

        {/* Footer guarantee */}
        <div className="pt-8 text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure JWT Auth • Global Matchmaking • 100% Free for Learners</span>
        </div>
      </div>
    </div>
  );
};
