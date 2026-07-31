import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeState, setFadeState] = useState<'in' | 'visible' | 'out'>('in');
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeState('visible');
    }, 50);

    const timer2 = setTimeout(() => {
      setFadeState('out');
    }, 1400);

    const timer3 = setTimeout(() => {
      onCompleteRef.current();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleSkip = () => {
    setFadeState('out');
    onCompleteRef.current();
  };

  return (
    <div 
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0b0f19] via-slate-950 to-[#07090e] transition-opacity duration-500 cursor-pointer ${
        fadeState === 'out' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-6 max-w-lg px-6 animate-in fade-in zoom-in duration-700">
        {/* Animated Brand Logo Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 shadow-2xl shadow-indigo-600/40 transform hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Study<span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Connect</span>
          </h1>
          <p className="text-indigo-400 font-extrabold text-sm sm:text-base tracking-widest uppercase">
            Never Study Alone Again
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto font-medium">
          The intelligent global peer study network connecting learners worldwide.
        </p>

        {/* Loading Ring Spinner */}
        <div className="pt-6 flex justify-center">
          <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};
