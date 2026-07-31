import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  VolumeX, 
  UserX, 
  MessageSquare, 
  FileText, 
  Filter, 
  Clock, 
  Eye,
  Check
} from 'lucide-react';
import { ModerationReport, ReportCategory } from '../../types';

interface ModerationQueueViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ModerationQueueView: React.FC<ModerationQueueViewProps> = ({ onShowToast }) => {
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [actionNote, setActionNote] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAction = async (action: 'Warn' | 'Mute' | 'Suspend' | 'Ban' | 'Dismiss') => {
    if (!selectedReport) return;

    try {
      await fetch(`/api/admin/reports/${selectedReport.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          note: actionNote,
          targetUserId: selectedReport.reportedUserId
        })
      });

      setReports(prev => prev.map(r => {
        if (r.id === selectedReport.id) {
          return { ...r, status: action === 'Dismiss' ? 'Dismissed' : 'Resolved' };
        }
        return r;
      }));

      onShowToast(`Report ${selectedReport.id} action executed: ${action}.`, 'success');
      setSelectedReport(null);
      setActionNote('');
    } catch (err) {
      onShowToast('Action execution failed.', 'error');
    }
  };

  const categoriesList: Array<ReportCategory | 'All'> = [
    'All',
    'Spam',
    'Abuse',
    'Harassment',
    'Fake Profile',
    'Copyright',
    'Academic Misconduct',
    'Inappropriate Files',
    'Fraud'
  ];

  const filteredReports = reports.filter(r => {
    if (categoryFilter === 'All') return true;
    return r.category === categoryFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Moderation Queue Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-black text-white">Safety & Moderation Queue</h2>
          </div>
          <p className="text-xs text-slate-400">Review reported peer misconduct, academic fraud, spam, and policy violations.</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
          >
            {categoriesList.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Violation Types' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Queue List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading queue...</div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Queue Empty</h3>
              <p className="text-xs text-slate-400">No pending moderation reports for this category.</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                  selectedReport?.id === report.id
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-xl'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={report.reportedUserAvatar}
                      alt={report.reportedUserName}
                      className="w-10 h-10 rounded-2xl object-cover border border-rose-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">{report.reportedUserName}</span>
                        <span className="text-[10px] font-mono text-slate-400">({report.reportedUserId})</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Reported by: <span className="text-slate-300 font-medium">{report.reporterName}</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                      {report.category}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {report.createdAt}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 leading-relaxed">
                  "{report.reason}"
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className={`font-bold ${
                    report.status === 'Pending' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    Status: {report.status}
                  </span>
                  <span className="text-indigo-400 font-bold hover:underline flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Evidence & Action
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Evidence & Decision Workspace */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 h-fit sticky top-24">
          {selectedReport ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-sm">Evidence Review Panel</h3>
                <span className="text-xs text-indigo-400 font-mono font-bold">{selectedReport.id}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Violation Category</span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-rose-300">
                  {selectedReport.category}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Reported Content / Flagged Chat</span>
                <div className="p-3 rounded-2xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 break-words">
                  {selectedReport.evidenceContent}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Moderator Audit Note</label>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Internal rationale for taking this action..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Enforcement Action</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleTakeAction('Warn')}
                    className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Warn User</span>
                  </button>

                  <button
                    onClick={() => handleTakeAction('Mute')}
                    className="p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Mute Chat (24h)</span>
                  </button>

                  <button
                    onClick={() => handleTakeAction('Ban')}
                    className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 col-span-2"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Ban Account Permanently</span>
                  </button>

                  <button
                    onClick={() => handleTakeAction('Dismiss')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 col-span-2"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Dismiss False Report</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <ShieldAlert className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs font-medium">Select a report from the queue to inspect evidence and execute enforcement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
