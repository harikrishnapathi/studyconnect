import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Trash2, 
  Download, 
  HardDrive, 
  AlertTriangle, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  X,
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { FileAttachment } from '../../types';

interface FileContentModerationViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FileContentModerationView: React.FC<FileContentModerationViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'keywords'>('files');

  // Sample Uploaded Files
  const [files, setFiles] = useState<FileAttachment[]>([
    { id: 'f-1', name: 'Stanford_DP_Memoization_Cheatsheet.pdf', size: '2.4 MB', type: 'pdf', url: '#', uploadedBy: 'Elena Rostova', uploadedAt: '10:32 AM' },
    { id: 'f-2', name: 'USMLE_Cardiology_Anki_Deck.apkg', size: '14.8 MB', type: 'raw', url: '#', uploadedBy: 'Dr. Marcus Vance', uploadedAt: 'Yesterday' },
    { id: 'f-3', name: 'JEE_Physics_Mechanics_Formulas.pdf', size: '1.1 MB', type: 'pdf', url: '#', uploadedBy: 'Aarav Sharma', uploadedAt: '3 days ago' },
    { id: 'f-4', name: 'Unverified_Exe_Installer.exe', size: '8.4 MB', type: 'raw', url: '#', uploadedBy: 'SuspiciousUser99', uploadedAt: 'Just now' }
  ]);

  // Keyword & Profanity Detection Violations Log
  const [flaggedMessages, setFlaggedMessages] = useState([
    { id: 'flg-1', content: 'Buy cheap exam papers on http://spam-site.biz', sender: 'Vikram Mehta', context: 'LeetCode Pod Chat', triggerKeyword: 'spam-site', score: '98% Spam' },
    { id: 'flg-2', content: 'You are so dumb, stop talking', sender: 'AnonymousPeer', context: 'Medical Room Chat', triggerKeyword: 'abusive language', score: '82% Abuse' }
  ]);

  const handleDeleteFile = (id: string, name: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    onShowToast(`File "${name}" removed from server storage.`, 'error');
  };

  const handleDismissFlag = (id: string) => {
    setFlaggedMessages(prev => prev.filter(m => m.id !== id));
    onShowToast('Flagged message dismissed as false positive.', 'info');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Files & AI Content Moderation</h2>
          <p className="text-xs text-slate-400">Malware scanning for shared study attachments & automated keyword profanity detection.</p>
        </div>

        <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-1">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'files' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            File Storage ({files.length})
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'keywords' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Keyword Triggers ({flaggedMessages.length})
          </button>
        </div>
      </div>

      {activeTab === 'files' ? (
        <div className="space-y-4">
          {/* Storage Analytics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Total Cloud Storage Used</div>
                <div className="text-lg font-extrabold text-white">26.7 GB / 100 GB</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Antivirus Status</div>
                <div className="text-lg font-extrabold text-emerald-400">ClamAV Active</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Blocked Malware Attempts</div>
                <div className="text-lg font-extrabold text-rose-400">12 Files Blocked</div>
              </div>
            </div>
          </div>

          {/* Files Table */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Filename</th>
                  <th className="px-5 py-3.5">Size</th>
                  <th className="px-5 py-3.5">Uploaded By</th>
                  <th className="px-5 py-3.5">Scan Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="font-bold text-white">{file.name}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">{file.size}</td>
                    <td className="px-5 py-3.5 text-slate-300">{file.uploadedBy}</td>
                    <td className="px-5 py-3.5">
                      {file.name.endsWith('.exe') ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[10px]">
                          Suspicious Format
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                          Passed Clean
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDeleteFile(file.id, file.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          title="Purge File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Keyword & Profanity Logs */
        <div className="space-y-3">
          {flaggedMessages.map((msg) => (
            <div key={msg.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-xs">{msg.sender}</span>
                  <span className="text-[10px] text-slate-400">• {msg.context}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                    Trigger: {msg.triggerKeyword} ({msg.score})
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  "{msg.content}"
                </p>
              </div>

              <button
                onClick={() => handleDismissFlag(msg.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold shrink-0"
              >
                Dismiss Flag
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
