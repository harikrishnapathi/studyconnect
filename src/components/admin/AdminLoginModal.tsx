import React, { useState } from 'react';
import { Shield, KeyRound, Lock, Check, AlertCircle, Smartphone, UserCheck, X } from 'lucide-react';
import { AdminRole, AdminUser } from '../../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (admin: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@studyconnect.global');
  const [password, setPassword] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('123456');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Super Admin');
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [trustedDevice, setTrustedDevice] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const rolesList: AdminRole[] = [
    'Super Admin',
    'Platform Admin',
    'Community Moderator',
    'Study Pod Moderator',
    'Support Executive',
    'Content Reviewer',
    'Analytics Manager',
    'Security Administrator'
  ];

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter admin credentials.');
      return;
    }
    setError('');
    setStep('mfa');
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mfaCode, role: selectedRole })
      });
      const data = await res.json();

      if (data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Authentication failed. Please check 2FA code.');
      }
    } catch (err) {
      setError('Server authentication error. Try demo code 123456.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">StudyConnect Admin Portal</h3>
            <p className="text-xs text-slate-400 font-medium">RBAC Security Authentication & 2FA Gate</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Select Admin Role (RBAC)</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                {rolesList.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Secure Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Continue to 2FA Verification</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-center space-y-2">
              <Smartphone className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
              <h4 className="text-xs font-bold text-white">Two-Factor Authenticator Code</h4>
              <p className="text-[11px] text-slate-400">
                Enter the 6-digit verification code from Google Authenticator or SMS (Demo code: <span className="font-mono text-indigo-300 font-bold">123456</span>).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 text-center">6-Digit 2FA Token</label>
              <input
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-indigo-500/50 text-center font-mono text-lg font-bold text-indigo-300 tracking-widest focus:outline-none"
                required
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={trustedDevice}
                onChange={(e) => setTrustedDevice(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-indigo-600"
              />
              <span>Remember this trusted admin workstation for 30 days</span>
            </label>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Verify & Launch Admin Console'}
                <UserCheck className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
