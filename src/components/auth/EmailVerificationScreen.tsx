import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, RefreshCw, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface EmailVerificationScreenProps {
  email: string;
  otpDemo?: string;
  onVerified: () => void;
}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ email, otpDemo, onVerified }) => {
  const [otp, setOtp] = useState(otpDemo || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(45);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError('Please enter the full 6-digit verification OTP code.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Invalid OTP verification code.');
        setLoading(false);
        return;
      }

      onVerified();
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-gradient-to-b from-[#0b0f19] via-slate-950 to-[#07090e]">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
        
        {/* Animated Mail Icon */}
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mx-auto flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10 animate-bounce">
          <Mail className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Verify Your Email</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            We have sent a 6-digit verification code to:
          </p>
          <p className="text-indigo-400 font-bold text-sm bg-indigo-950/50 py-1.5 px-3 rounded-xl border border-indigo-900 inline-block">
            {email}
          </p>
        </div>

        {otpDemo && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
            <span className="font-semibold">Demo Verification OTP:</span>{' '}
            <span className="font-mono font-bold tracking-widest text-indigo-200">{otpDemo}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            A new verification code has been dispatched to your inbox.
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Enter 6-Digit OTP Code
            </label>
            <input
              id="input-otp-code"
              type="text"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            id="btn-verify-submit"
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Confirm Verification</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="pt-2 flex flex-col items-center gap-2 text-xs text-slate-400">
          <span>Didn't receive the email code?</span>
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-bold disabled:text-slate-600 disabled:no-underline underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code Now'}
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Email verification protects your StudyConnect identity</span>
        </div>
      </div>
    </div>
  );
};
