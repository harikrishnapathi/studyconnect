import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Volume2, 
  Sparkles, 
  Maximize2, 
  Radio, 
  ShieldCheck, 
  Grid,
  Zap,
  PhoneOff
} from 'lucide-react';

export const VideoCallPanel: React.FC = () => {
  const { 
    user, 
    activePartner, 
    isMicMuted, 
    setIsMicMuted, 
    isVideoOff, 
    setIsVideoOff, 
    isScreenSharing, 
    setIsScreenSharing,
    showToast,
    sessionDuration
  } = useApp();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [backgroundBlur, setBackgroundBlur] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'spotlight'>('grid');

  // Attempt real browser media stream for local self-view
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupCamera() {
      if (!isVideoOff) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        } catch (err) {
          console.warn('Camera fallback activated (permission denied or unsupported environment):', err);
          setHasCameraPermission(false);
        }
      } else {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          const s = localVideoRef.current.srcObject as MediaStream;
          s.getTracks().forEach(track => track.stop());
          localVideoRef.current.srcObject = null;
        }
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOff]);

  const toggleMic = () => {
    setIsMicMuted(!isMicMuted);
    showToast(isMicMuted ? 'Microphone unmuted 🎙️' : 'Microphone muted 🔇', 'info');
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    showToast(isVideoOff ? 'Camera turned on 📹' : 'Camera turned off 🚫', 'info');
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    showToast(!isScreenSharing ? 'Screen sharing started 🖥️' : 'Screen sharing stopped', 'success');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Live HD Session</span>
            <span className="font-mono text-slate-300">• {formatTime(sessionDuration)}</span>
          </div>

          <span className="hidden sm:inline text-xs text-slate-400 font-medium">
            {activePartner ? `Studying ${activePartner.subjects[0]} with ${activePartner.name}` : 'Group Study Room'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-mono text-[11px]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>12ms</span>
            <span className="text-slate-500">•</span>
            <span>1080p 60fps</span>
          </div>

          <button
            onClick={() => setLayoutMode(layoutMode === 'grid' ? 'spotlight' : 'grid')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Toggle View Grid"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Stage */}
      <div className="flex-1 p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        
        {/* Screen Share Overlay (If active) */}
        {isScreenSharing && (
          <div className="absolute inset-4 z-20 rounded-2xl bg-slate-900/95 border-2 border-indigo-500 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Monitor className="w-16 h-16 text-indigo-400 animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Sharing Your Screen to Study Room</h3>
              <p className="text-xs text-slate-400">All participants can view your shared code editor & whiteboard.</p>
            </div>
            <button
              onClick={toggleScreenShare}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Stop Sharing
            </button>
          </div>
        )}

        {/* Partner Video Tile */}
        <div className="relative w-full h-full min-h-[260px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group flex flex-col justify-between p-4">
          <img
            src={activePartner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
            alt={activePartner?.name}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
              backgroundBlur ? 'blur-sm scale-105' : ''
            }`}
          />

          {/* Top Info overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>{activePartner?.name || 'Study Partner'}</span>
            </div>

            <div className="p-2 rounded-full bg-slate-950/80 text-emerald-400 backdrop-blur-md">
              <Volume2 className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom Audio Wave Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-950/70 px-3 py-1.5 rounded-xl backdrop-blur-md">
              <div className="w-1.5 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <div className="w-1.5 h-5 bg-emerald-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-300 font-mono ml-1">Mic Active</span>
            </div>

            <span className="text-[11px] font-semibold text-slate-300 bg-slate-950/70 px-3 py-1 rounded-xl backdrop-blur-md">
              {activePartner?.subjects[0] || 'Focus Session'}
            </span>
          </div>
        </div>

        {/* Local Self Video Tile */}
        <div className="relative w-full h-full min-h-[260px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between p-4">
          {!isVideoOff ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
                backgroundBlur ? 'blur-md scale-105' : ''
              }`}
            />
          ) : (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center space-y-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
              />
              <span className="text-xs text-slate-400 font-semibold">Camera is Turned Off</span>
            </div>
          )}

          {/* Top Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-white text-xs font-bold backdrop-blur-md">
              <span>{user.name} (You)</span>
            </div>

            {isMicMuted && (
              <div className="p-2 rounded-full bg-rose-500/80 text-white backdrop-blur-md">
                <MicOff className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Bottom Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 bg-slate-950/70 px-2.5 py-1 rounded-lg backdrop-blur-md">
              {hasCameraPermission ? 'HD WebCam' : 'Virtual Cam Preview'}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Call Action Controls Bar */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center gap-3 sm:gap-4 z-10">
        <button
          id="btn-video-mic"
          onClick={toggleMic}
          className={`p-4 rounded-2xl transition-all shadow-lg ${
            isMicMuted
              ? 'bg-rose-600 text-white hover:bg-rose-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
        </button>

        <button
          id="btn-video-camera"
          onClick={toggleVideo}
          className={`p-4 rounded-2xl transition-all shadow-lg ${
            isVideoOff
              ? 'bg-rose-600 text-white hover:bg-rose-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-indigo-400" />}
        </button>

        <button
          id="btn-video-screenshare"
          onClick={toggleScreenShare}
          className={`p-4 rounded-2xl transition-all shadow-lg ${
            isScreenSharing
              ? 'bg-indigo-600 text-white hover:bg-indigo-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Share Screen"
        >
          <Monitor className="w-5 h-5 text-cyan-400" />
        </button>

        <button
          id="btn-video-blur"
          onClick={() => {
            setBackgroundBlur(!backgroundBlur);
            showToast(backgroundBlur ? 'Background blur removed' : 'Virtual background blur active', 'info');
          }}
          className={`p-4 rounded-2xl transition-all shadow-lg ${
            backgroundBlur
              ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Toggle Background Blur"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
        </button>

        <button
          id="btn-video-end-call"
          onClick={() => {
            showToast('Study call ended.', 'info');
          }}
          className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xl shadow-rose-600/30 transition-transform hover:scale-105"
          title="End Call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
