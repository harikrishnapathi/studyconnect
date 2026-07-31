import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  Flag,
  Lock
} from 'lucide-react';

interface SafetyModalProps {
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ onClose }) => {
  const { activePartner, blockUser, reportUser, showToast } = useApp();

  const [reportReason, setReportReason] = useState('Inappropriate behavior or spam');
  const [showReportForm, setShowReportForm] = useState(false);

  const handleBlockActivePartner = () => {
    if (activePartner) {
      blockUser(activePartner.id);
      onClose();
    } else {
      showToast('No active partner selected to block.', 'info');
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePartner) {
      reportUser(activePartner.id, reportReason);
      setShowReportForm(false);
      onClose();
    } else {
      showToast('Report logged with moderation team.', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Safety & Moderation Shield</h3>
              <p className="text-xs text-slate-400">Keeping StudyConnect a safe, respectful learning space</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Guidelines List */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>StudyConnect Code of Conduct</span>
          </div>
          <ul className="space-y-2 list-disc list-inside text-slate-400">
            <li>Keep all discussions strictly academic and collaborative.</li>
            <li>Never share private financial passwords, home addresses, or secret keys.</li>
            <li>Zero tolerance for harassment, hate speech, or inappropriate material.</li>
            <li>AI profanity filters automatically redact toxic content in chat.</li>
          </ul>
        </div>

        {/* Actions for current partner */}
        {activePartner && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Active Study Session Partner:</span>
              <span className="text-xs font-semibold text-white">{activePartner.name}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowReportForm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700"
              >
                <Flag className="w-4 h-4" />
                <span>Report Partner</span>
              </button>

              <button
                onClick={handleBlockActivePartner}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs border border-rose-500/30"
              >
                <Ban className="w-4 h-4" />
                <span>Block User</span>
              </button>
            </div>
          </div>
        )}

        {/* Report Form */}
        {showReportForm && (
          <form onSubmit={handleSubmitReport} className="space-y-4 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-white uppercase tracking-wider">Reason for Report</label>
            <select
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs"
            >
              <option value="Inappropriate behavior or spam">Inappropriate behavior or spam</option>
              <option value="Harassment or toxic language">Harassment or toxic language</option>
              <option value="Off-topic / Non-academic content">Off-topic / Non-academic content</option>
              <option value="Fake or misleading profile">Fake or misleading profile</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
            >
              Submit Confidential Report
            </button>
          </form>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
