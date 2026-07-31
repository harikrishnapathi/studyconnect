import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  X,
  Share2,
  PlusSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Check if app is running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Detect user platform
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else if (/android/.test(ua)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Listen for browser PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('Thank you for installing StudyConnect!', 'success');
        setDeferredPrompt(null);
        onClose();
      } else {
        showToast('App installation deferred.', 'info');
      }
    } else if (platform === 'ios') {
      showToast('Tap Share button below, then "Add to Home Screen"', 'info');
    } else {
      showToast('To install: click browser menu (⋮ or ⊕) -> "Install StudyConnect"', 'info');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Decorative Top Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-4">
          <img
            src="/icon-192.png"
            alt="StudyConnect Icon"
            className="w-16 h-16 rounded-2xl shadow-xl border border-indigo-500/30 object-cover"
          />
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> PWA Standalone Ready
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">Install StudyConnect App</h2>
            <p className="text-xs text-slate-400">Install directly onto your device for instant offline access & full-screen mode.</p>
          </div>
        </div>

        {/* Installed State Banner */}
        {isStandalone ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">App is Installed!</h4>
              <p className="text-xs text-emerald-300/90">You are running StudyConnect in full native standalone mode.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Primary Action Button */}
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Download className="w-5 h-5" /> Install App Now (One-Click)
              </button>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-5 h-5" /> Ready to Install
              </button>
            )}

            {/* Platform Instructions */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                {platform === 'ios' ? <Smartphone className="w-4 h-4" /> : platform === 'android' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                Installation Guide ({platform === 'ios' ? 'iOS Safari' : platform === 'android' ? 'Android Chrome' : 'Desktop Browser'})
              </h4>

              {platform === 'ios' && (
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Tap the <span className="font-bold text-white flex-inline items-center gap-1"><Share2 className="w-3.5 h-3.5 inline text-indigo-400" /> Share</span> icon in Safari bottom bar.</li>
                  <li>Scroll down and tap <span className="font-bold text-white flex-inline items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline text-indigo-400" /> Add to Home Screen</span>.</li>
                  <li>Tap <span className="font-bold text-white">Add</span> in the top-right corner. Launch StudyConnect from your home screen!</li>
                </ol>
              )}

              {platform === 'android' && (
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Tap the <span className="font-bold text-white">⋮ (Three Dots)</span> menu in Chrome top-right.</li>
                  <li>Tap <span className="font-bold text-white">Install App</span> or <span className="font-bold text-white">Add to Home Screen</span>.</li>
                  <li>Confirm installation to add StudyConnect directly to your app launcher!</li>
                </ol>
              )}

              {platform === 'desktop' && (
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Click the <span className="font-bold text-white">Install StudyConnect</span> button in your browser address bar (top right).</li>
                  <li>Or open Chrome/Edge menu <span className="font-bold text-white">⋮</span> → <span className="font-bold text-white">Save and Share</span> → <span className="font-bold text-white">Install App</span>.</li>
                  <li>Enjoy desktop window mode with offline capabilities and keyboard shortcuts!</li>
                </ol>
              )}
            </div>
          </div>
        )}

        {/* Feature Pills */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-2">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-slate-300 font-bold block">Instant Offline</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-slate-300 font-bold block">Zero Ads / Pure</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <Globe className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <span className="text-slate-300 font-bold block">Full Screen</span>
          </div>
        </div>
      </div>
    </div>
  );
};
