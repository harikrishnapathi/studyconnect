import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Send, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Filter, 
  UserCheck, 
  Plus, 
  X,
  AlertCircle
} from 'lucide-react';
import { SystemAnnouncement, SupportTicket, TicketPriority, TicketStatus } from '../../types';

interface AnnouncementsSupportViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AnnouncementsSupportView: React.FC<AnnouncementsSupportViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'support'>('announcements');

  // Announcements State
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>([]);
  const [showCreateAnnModal, setShowCreateAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annTarget, setAnnTarget] = useState<'All Learners' | 'Country' | 'Community' | 'Study Pod' | 'Subject'>('All Learners');
  const [sendPush, setSendPush] = useState(true);

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchAnnouncements();
    fetchTickets();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements');
      const data = await res.json();
      if (data.announcements) setAnnouncements(data.announcements);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/admin/support/tickets');
      const data = await res.json();
      if (data.tickets) setTickets(data.tickets);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          targetType: annTarget,
          sendPush
        })
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncements([data.announcement, ...announcements]);
        onShowToast('System announcement published to target learners!', 'success');
      }
    } catch (err) {
      onShowToast('Failed to dispatch announcement.', 'error');
    } finally {
      setShowCreateAnnModal(false);
      setAnnTitle('');
      setAnnContent('');
    }
  };

  const handleReplyTicket = (status: TicketStatus) => {
    if (!selectedTicket || !replyText) return;

    const updatedMsg = {
      id: `m-${Date.now()}`,
      sender: 'Sarah Connor (Support Executive)',
      senderRole: 'agent' as const,
      text: replyText,
      timestamp: 'Just now'
    };

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status,
          messages: [...t.messages, updatedMsg]
        };
      }
      return t;
    }));

    onShowToast(`Ticket ${selectedTicket.id} updated (${status}).`, 'success');
    setReplyText('');
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Announcements & Support Desk</h2>
          <p className="text-xs text-slate-400">Broadcast targeted push updates & resolve learner support tickets.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'announcements' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Announcements ({announcements.length})
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'support' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Support Queue ({tickets.length})
            </button>
          </div>

          {activeTab === 'announcements' && (
            <button
              onClick={() => setShowCreateAnnModal(true)}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Announcement</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'announcements' ? (
        /* System Announcements Section */
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-extrabold text-white text-sm">{ann.title}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                  {ann.targetType} ({ann.recipientCount?.toLocaleString()} Users)
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800/80 leading-relaxed">
                {ann.content}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>By: {ann.createdBy}</span>
                <span>Dispatched: {ann.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Support Tickets Desk Section */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {tickets.map((tkt) => (
              <div
                key={tkt.id}
                onClick={() => setSelectedTicket(tkt)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 ${
                  selectedTicket?.id === tkt.id
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-xl'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{tkt.id}</span>
                    <h3 className="font-extrabold text-white text-sm">{tkt.subject}</h3>
                    <p className="text-xs text-slate-400">Learner: {tkt.userName} ({tkt.userEmail})</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    tkt.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    {tkt.priority} Priority
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{tkt.description}</p>
              </div>
            ))}
          </div>

          {/* Ticket Reply Console */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 h-fit sticky top-24">
            {selectedTicket ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="font-extrabold text-white text-sm">Ticket Console</h3>
                  <p className="text-xs text-slate-400">{selectedTicket.subject}</p>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedTicket.messages.map((m) => (
                    <div key={m.id} className={`p-3 rounded-2xl text-xs space-y-1 ${
                      m.senderRole === 'agent' ? 'bg-indigo-950/40 border border-indigo-500/30' : 'bg-slate-950 border border-slate-800'
                    }`}>
                      <div className="font-bold text-indigo-300 text-[10px]">{m.sender}</div>
                      <div className="text-slate-200">{m.text}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Reply to Learner</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official support message..."
                    rows={3}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleReplyTicket('In Progress')}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    Send Reply
                  </button>
                  <button
                    onClick={() => handleReplyTicket('Resolved')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                Select a support ticket to inspect conversation thread & reply.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Announcement */}
      {showCreateAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleCreateAnnouncement} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowCreateAnnModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-white">Broadcast System Announcement</h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Audience</label>
              <select
                value={annTarget}
                onChange={(e) => setAnnTarget(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none"
              >
                <option value="All Learners">All Platform Learners</option>
                <option value="Country">Target by Country</option>
                <option value="Community">Target Specific Community</option>
                <option value="Study Pod">Target Specific Study Pod</option>
                <option value="Subject">Target by Subject Topic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Headline Title</label>
              <input
                type="text"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. 🎉 Platform Upgrade Live!"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Announcement Body</label>
              <textarea
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                rows={3}
                placeholder="Detailed message..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateAnnModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md"
              >
                Broadcast Announcement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
