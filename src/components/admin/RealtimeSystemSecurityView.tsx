import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Globe, 
  AlertOctagon, 
  FileText, 
  Lock, 
  Radio, 
  RefreshCw 
} from 'lucide-react';
import { AuditLogItem, ServerHealthMetrics } from '../../types';

interface RealtimeSystemSecurityViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const RealtimeSystemSecurityView: React.FC<RealtimeSystemSecurityViewProps> = ({ onShowToast }) => {
  const [health, setHealth] = useState<ServerHealthMetrics | null>(null);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHealthAndLogs();
  }, []);

  const fetchHealthAndLogs = async () => {
    setRefreshing(true);
    try {
      const [hRes, lRes] = await Promise.all([
        fetch('/api/admin/server-health'),
        fetch('/api/admin/audit-logs')
      ]);
      const hData = await hRes.json();
      const lData = await lRes.json();

      if (hData.health) setHealth(hData.health);
      if (lData.logs) setLogs(lData.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Real-Time Infrastructure & Audit Security</h2>
          <p className="text-xs text-slate-400">Live CPU, RAM, Redis cache, WebSockets, IP firewall monitoring & admin action logs.</p>
        </div>

        <button
          onClick={fetchHealthAndLogs}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Live Server Telemetry Gauge Grid */}
      {health && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">CPU Core Usage</span>
            <div className="text-2xl font-black text-emerald-400">{health.cpuUsagePercent}%</div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${health.cpuUsagePercent}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">RAM Allocation</span>
            <div className="text-2xl font-black text-cyan-400">{health.memoryUsagePercent}%</div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full" style={{ width: `${health.memoryUsagePercent}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">WebSocket Connections</span>
            <div className="text-2xl font-black text-indigo-400">{health.activeWebSockets.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">Socket.io Clusters</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Database Pools</span>
            <div className="text-2xl font-black text-amber-400">{health.dbConnections} active</div>
            <div className="text-[10px] text-slate-400">PostgreSQL Pool</div>
          </div>
        </div>
      )}

      {/* Immutable Audit Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-white text-sm">Immutable Admin Audit Logs</h3>
          </div>
          <span className="text-xs text-slate-400">Security & RBAC Action History</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Affected Learner / Entity</th>
                <th className="px-4 py-3">Reason / Rationale</th>
                <th className="px-4 py-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-white">{log.adminName}</span>
                    <div className="text-[10px] text-indigo-400">{log.adminRole}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold font-mono text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">{log.affectedEntity}</td>
                  <td className="px-4 py-3 text-slate-400 italic">"{log.reason}"</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
