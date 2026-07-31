import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  UserX, 
  KeyRound, 
  CheckCircle2, 
  Trash2, 
  RotateCcw, 
  History, 
  Smartphone, 
  Eye, 
  X,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../../types';

interface UserManagementViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({ onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended' | 'Banned' | 'Verified'>('All');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<'7_days' | '30_days' | 'permanent'>('permanent');

  // Sample Learners Directory for Admin Management
  const [learners, setLearners] = useState([
    {
      id: 'usr-101',
      name: 'Alex Chen',
      email: 'alex.chen@university.edu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'CS & Math major grinding LeetCode Mediums.',
      country: 'United States',
      language: 'English',
      timezone: 'PST (UTC-8)',
      status: 'Active',
      isVerified: true,
      role: 'College Student',
      hoursLogged: 142,
      streakDays: 14,
      reportsCount: 0,
      joinedAt: '2026-01-12',
      lastLogin: '10 mins ago',
      device: 'MacBook Pro (Chrome 124)',
      ipAddress: '192.168.1.104'
    },
    {
      id: 'usr-102',
      name: 'Elena Rostova',
      email: 'elena.r@stanford.edu',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Algorithms TA & PyTorch Enthusiast.',
      country: 'Germany',
      language: 'English, German',
      timezone: 'CET (UTC+1)',
      status: 'Active',
      isVerified: true,
      role: 'University Student',
      hoursLogged: 210,
      streakDays: 28,
      reportsCount: 0,
      joinedAt: '2025-11-04',
      lastLogin: '2 hours ago',
      device: 'iPad Pro (App)',
      ipAddress: '84.112.45.19'
    },
    {
      id: 'usr-881',
      name: 'Vikram Mehta',
      email: 'vikram.m@techspam.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Selling telegram premium access.',
      country: 'India',
      language: 'Hindi, English',
      timezone: 'IST (UTC+5:30)',
      status: 'Suspended',
      isVerified: false,
      role: 'Other',
      hoursLogged: 12,
      streakDays: 1,
      reportsCount: 3,
      joinedAt: '2026-07-20',
      lastLogin: '25 mins ago',
      device: 'Windows 11 (Firefox)',
      ipAddress: '103.22.41.8'
    },
    {
      id: 'usr-412',
      name: 'Jason Miller',
      email: 'jason.m@cheaters.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Guaranteed exam paper writing.',
      country: 'United Kingdom',
      language: 'English',
      timezone: 'GMT (UTC+0)',
      status: 'Banned',
      isVerified: false,
      role: 'Other',
      hoursLogged: 4,
      streakDays: 0,
      reportsCount: 5,
      joinedAt: '2026-07-28',
      lastLogin: 'Yesterday',
      device: 'Ubuntu Linux',
      ipAddress: '185.220.101.5'
    }
  ]);

  const filteredLearners = learners.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Active') return matchesSearch && l.status === 'Active';
    if (statusFilter === 'Suspended') return matchesSearch && l.status === 'Suspended';
    if (statusFilter === 'Banned') return matchesSearch && l.status === 'Banned';
    if (statusFilter === 'Verified') return matchesSearch && l.isVerified;
    return matchesSearch;
  });

  const handleBanUser = () => {
    if (!selectedUser) return;
    const actionLabel = banDuration === 'permanent' ? 'Banned' : 'Suspended';
    
    setLearners(prev => prev.map(l => {
      if (l.id === selectedUser.id) {
        return { ...l, status: actionLabel };
      }
      return l;
    }));

    onShowToast(`Learner ${selectedUser.name} has been ${actionLabel.toLowerCase()}. Reason: ${banReason || 'Policy Violation'}`, 'error');
    setShowBanModal(false);
    setBanReason('');
  };

  const handleToggleVerify = (userId: string) => {
    setLearners(prev => prev.map(l => {
      if (l.id === userId) {
        const nextVerified = !l.isVerified;
        onShowToast(`Verification badge ${nextVerified ? 'granted to' : 'revoked from'} learner`, 'info');
        return { ...l, isVerified: nextVerified };
      }
      return l;
    }));
  };

  const handleResetPassword = (email: string) => {
    onShowToast(`Password reset link dispatched to ${email}`, 'success');
  };

  const handleRestoreAccount = (userId: string) => {
    setLearners(prev => prev.map(l => {
      if (l.id === userId) {
        return { ...l, status: 'Active' };
      }
      return l;
    }));
    onShowToast('Learner account restored to Active status', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search & Filter Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white">Learner Account Directory</h2>
            <p className="text-xs text-slate-400">Search, verify credentials, manage RBAC status, and review security logs.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">{filteredLearners.length} Accounts Listed</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by learner name, email, or country..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Suspended">Suspended</option>
              <option value="Banned">Banned</option>
              <option value="Verified">Verified Learners</option>
            </select>
          </div>
        </div>
      </div>

      {/* Learners Directory Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Learner</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Location & Role</th>
                <th className="px-5 py-3.5">Study Stats</th>
                <th className="px-5 py-3.5">Reports</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredLearners.map((learner) => (
                <tr key={learner.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={learner.avatar}
                        alt={learner.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">{learner.name}</span>
                          {learner.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" title="Verified Learner Badge" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{learner.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {learner.status === 'Active' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        Active
                      </span>
                    )}
                    {learner.status === 'Suspended' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        Suspended
                      </span>
                    )}
                    {learner.status === 'Banned' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                        Banned
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-white font-semibold">{learner.country}</div>
                    <div className="text-[11px] text-slate-400">{learner.role}</div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-indigo-300 font-bold">{learner.hoursLogged} hrs logged</div>
                    <div className="text-[11px] text-emerald-400">🔥 {learner.streakDays} Day Streak</div>
                  </td>

                  <td className="px-5 py-4">
                    {learner.reportsCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                        {learner.reportsCount} Reports
                      </span>
                    ) : (
                      <span className="text-slate-500">Clean Record</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedUser(learner as any);
                          setShowDetailModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="View Full Profile & Session History"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleVerify(learner.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          learner.isVerified ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Toggle Verified Badge"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleResetPassword(learner.email)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Trigger Password Reset Email"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>

                      {learner.status === 'Active' ? (
                        <button
                          onClick={() => {
                            setSelectedUser(learner as any);
                            setShowBanModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          title="Ban / Suspend Account"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestoreAccount(learner.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                          title="Restore Account"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ban / Suspend Confirmation Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 relative">
            <button
              onClick={() => setShowBanModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Suspend or Ban Learner</h3>
                <p className="text-xs text-slate-400">{selectedUser.name} ({selectedUser.email})</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Enforcement Duration</label>
                <select
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
                >
                  <option value="7_days">Temporary Suspension (7 Days)</option>
                  <option value="30_days">Temporary Suspension (30 Days)</option>
                  <option value="permanent">Permanent Account Ban</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Audit Reason / Policy Violation</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="e.g. Repeated spam in Study Pods, Academic Misconduct..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md"
              >
                Execute Enforcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={(selectedUser as any).avatar}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/50"
              />
              <div>
                <h3 className="text-lg font-black text-white">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                    {(selectedUser as any).role || 'Learner'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{(selectedUser as any).country}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <History className="w-4 h-4 text-indigo-400" />
                <span>Security & Login Audit</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div><span className="text-slate-500">Last Login:</span> {(selectedUser as any).lastLogin}</div>
                <div><span className="text-slate-500">IP Address:</span> {(selectedUser as any).ipAddress}</div>
                <div className="col-span-2"><span className="text-slate-500">Active Device:</span> {(selectedUser as any).device}</div>
                <div className="col-span-2"><span className="text-slate-500">Account Created:</span> {(selectedUser as any).joinedAt}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
