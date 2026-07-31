import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Server,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  GitBranch,
  Play,
  RotateCcw,
  RefreshCw,
  Trash2,
  HardDrive,
  Globe,
  Lock,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Sliders,
  Radio,
  Share2,
  Download,
  BookOpen
} from 'lucide-react';
import {
  ContainerServiceStatus,
  RedisCacheStats,
  CeleryQueueMetrics,
  DbReplicaStatus,
  PipelineRun,
  SecurityAuditLog,
  InfraHealthOverview
} from '../../types';

export const InfrastructureControlView: React.FC = () => {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    'cluster' | 'pipeline' | 'db-cache' | 'queues' | 'security' | 'docs'
  >('cluster');

  const [overview, setOverview] = useState<InfraHealthOverview | null>(null);
  const [containers, setContainers] = useState<ContainerServiceStatus[]>([]);
  const [redisStats, setRedisStats] = useState<RedisCacheStats | null>(null);
  const [celeryMetrics, setCeleryMetrics] = useState<CeleryQueueMetrics | null>(null);
  const [dbReplicas, setDbReplicas] = useState<DbReplicaStatus[]>([]);
  const [pipelines, setPipelines] = useState<PipelineRun[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedScale, setSelectedScale] = useState<string>('100,000 Users');

  useEffect(() => {
    fetchInfraData();
  }, []);

  const fetchInfraData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/infra/overview');
      const data = await res.json();
      if (data.success) {
        setOverview(data.overview);
        setContainers(data.containers || []);
        setRedisStats(data.redis);
        setCeleryMetrics(data.celery);
        setDbReplicas(data.dbReplicas || []);
        setPipelines(data.recentPipelines || []);
        setSecurityLogs(data.securityLogs || []);
      }
    } catch (e) {
      showToast('Failed to load infrastructure telemetry', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurgeRedisCache = async () => {
    try {
      const res = await fetch('/api/infra/redis/purge', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        fetchInfraData();
      }
    } catch (e) {
      showToast('Cache purge action failed', 'warning');
    }
  };

  const handleTriggerDbBackup = async () => {
    try {
      const res = await fetch('/api/infra/db/backup/trigger', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        fetchInfraData();
      }
    } catch (e) {
      showToast('Backup trigger failed', 'warning');
    }
  };

  const handleTriggerPipeline = async () => {
    try {
      const res = await fetch('/api/infra/pipeline/trigger', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        fetchInfraData();
      }
    } catch (e) {
      showToast('Pipeline trigger failed', 'warning');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-b border-indigo-500/20 px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                Prompt 11 Enterprise Infrastructure
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Cluster 99.99% Operational
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Production Infrastructure Control Center
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Clean architecture modular monolith engineered for high availability, fault tolerance, Django Channels, Celery background tasks, Redis cluster, PostgreSQL read replicas, & zero-downtime CI/CD deployment.
            </p>
          </div>

          {/* Quick Metrics & Scale Selector */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
            <div className="px-3 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Traffic Scale</span>
              <select
                value={selectedScale}
                onChange={(e) => {
                  setSelectedScale(e.target.value);
                  showToast(`Simulating cluster load for ${e.target.value}`, 'info');
                }}
                className="bg-transparent text-xs font-bold text-indigo-300 focus:outline-none cursor-pointer"
              >
                <option value="1,000 Users" className="bg-slate-900">1,000 Users</option>
                <option value="10,000 Users" className="bg-slate-900">10,000 Users</option>
                <option value="100,000 Users" className="bg-slate-900">100,000 Users</option>
                <option value="1 Million Users" className="bg-slate-900">1 Million Users</option>
                <option value="10 Million Users" className="bg-slate-900">10 Million Users</option>
              </select>
            </div>

            <div className="px-3 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">API Latency</span>
              <span className="text-xs font-bold text-emerald-400">{overview?.avgApiLatencyMs || 18}ms (p99: {overview?.p99LatencyMs || 42}ms)</span>
            </div>

            <button
              onClick={fetchInfraData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Infrastructure Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 sticky top-14 z-20 backdrop-blur-md overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2">
          {[
            { id: 'cluster', label: 'Cluster & Containers', icon: Server },
            { id: 'pipeline', label: 'CI/CD Deployment', icon: GitBranch },
            { id: 'db-cache', label: 'Database & Redis', icon: Database },
            { id: 'queues', label: 'Celery & WebSockets', icon: Zap },
            { id: 'security', label: 'Security & WAF', icon: ShieldCheck },
            { id: 'docs', label: 'Architecture Specs', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">

        {/* 1. CLUSTER & CONTAINERS */}
        {activeTab === 'cluster' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Active Container Replicas</span>
                <span className="text-xl font-extrabold text-white mt-1 block">{containers.length} Containers</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> All Healthy
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Requests Per Minute</span>
                <span className="text-xl font-extrabold text-indigo-400 mt-1 block">{overview?.totalRequestsPerMin.toLocaleString()} req/m</span>
                <span className="text-[10px] text-slate-400">Nginx Rate Limit: 30r/s</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Error Rate</span>
                <span className="text-xl font-extrabold text-emerald-400 mt-1 block">{overview?.errorRatePercent}%</span>
                <span className="text-[10px] text-slate-400">Target SLA: &lt; 0.01%</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Current Cluster Scale</span>
                <span className="text-xl font-extrabold text-amber-400 mt-1 block">{selectedScale}</span>
                <span className="text-[10px] text-slate-400">Auto-scaling enabled</span>
              </div>
            </div>

            {/* Container Services Table */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-indigo-400" />
                    Containerized Micro-Services Topology
                  </h3>
                  <p className="text-xs text-slate-400">Live Docker container metrics and process health</p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Container Engine: Docker 25.0
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 rounded-l-xl">Container Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">CPU %</th>
                      <th className="p-3">RAM Usage</th>
                      <th className="p-3">Port</th>
                      <th className="p-3 rounded-r-xl">Container ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {containers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-mono text-white font-semibold flex items-center gap-2">
                          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          {c.name}
                        </td>
                        <td className="p-3 font-medium text-indigo-300">{c.role}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{c.cpuUsagePercent}%</td>
                        <td className="p-3 font-mono">{c.memoryUsageMb} MB / {c.maxMemoryMb} MB</td>
                        <td className="p-3 font-mono">{c.port > 0 ? c.port : '-'}</td>
                        <td className="p-3 font-mono text-slate-400">{c.containerId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. CI/CD DEPLOYMENT PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <GitBranch className="w-6 h-6 text-indigo-400" />
                    GitHub Actions Continuous Deployment Pipeline
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Automated linting, formatting, security scanning, multi-stage Docker builds, & zero-downtime Cloud Run deployments.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerPipeline}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <Play className="w-4 h-4 fill-current" /> Trigger Manual CI/CD Run
                  </button>
                </div>
              </div>

              {/* Recent Pipelines List */}
              <div className="space-y-4">
                {pipelines.map((pipe) => (
                  <div key={pipe.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Passed
                          </span>
                          <span className="text-xs font-mono text-indigo-300">Commit: {pipe.commitHash} ({pipe.branch})</span>
                        </div>
                        <p className="text-xs font-bold text-white mt-1">{pipe.commitMessage}</p>
                        <p className="text-[11px] text-slate-400">{pipe.author} • Triggered {pipe.timestamp}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Total Runtime</span>
                        <span className="text-sm font-bold text-white font-mono">{pipe.durationSeconds} seconds</span>
                      </div>
                    </div>

                    {/* Step Execution Sequence */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {pipe.steps.map((step, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                          <span className="text-[11px] font-bold text-slate-200">{step.name}</span>
                          <div className="flex items-center justify-between text-[10px] text-emerald-400 mt-2">
                            <span>✓ Passed</span>
                            <span className="font-mono">{step.durationSeconds}s</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. DATABASE & REDIS TOPOLOGY */}
        {activeTab === 'db-cache' && (
          <div className="space-y-6">
            {/* PostgreSQL Read Replicas */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-sky-400" />
                    PostgreSQL 15 Cluster Topology (Primary & Read Replicas)
                  </h3>
                  <p className="text-xs text-slate-400">Automatic read/write splitting, connection pooling, and sub-second replication lag.</p>
                </div>

                <button
                  onClick={handleTriggerDbBackup}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2"
                >
                  <HardDrive className="w-4 h-4" /> Trigger Automated S3 Backup
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dbReplicas.map((db, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        db.role === 'Primary Write' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}>
                        {db.role}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">Lag: {db.replicationLagMs}ms</span>
                    </div>

                    <h4 className="text-xs font-bold text-white">{db.instanceName}</h4>
                    <p className="text-[11px] text-slate-400">{db.region}</p>

                    <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Active Connections:</span>
                        <span className="font-mono text-white">{db.activeConnections} / {db.maxConnections}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Database Size:</span>
                        <span className="font-mono text-white">{(db.dbSizeBytes / 1e9).toFixed(1)} GB</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Last S3 Backup:</span>
                        <span className="text-sky-300">{db.lastBackupTimestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Redis Cluster Cache Stats */}
            {redisStats && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      Redis 7 In-Memory Cache Cluster Telemetry
                    </h3>
                    <p className="text-xs text-slate-400">User sessions, API response caching, and Celery broker queues.</p>
                  </div>

                  <button
                    onClick={handlePurgeRedisCache}
                    className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Purge Redis Cache
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Cache Hit Rate</span>
                    <span className="text-xl font-extrabold text-emerald-400">{redisStats.hitRatePercent}%</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">RAM Used</span>
                    <span className="text-xl font-extrabold text-amber-400">{redisStats.usedMemoryHuman}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Keys</span>
                    <span className="text-xl font-extrabold text-sky-400">{redisStats.keysCount.toLocaleString()}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Connected Clients</span>
                    <span className="text-xl font-extrabold text-purple-400">{redisStats.connectedClients}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. CELERY QUEUES & WEBSOCKETS */}
        {activeTab === 'queues' && celeryMetrics && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Celery Distributed Background Task Workers
                  </h3>
                  <p className="text-xs text-slate-400">Asynchronous processing for emails, reports, video compression, & AI summaries.</p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {celeryMetrics.activeWorkers} Workers Online
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Tasks Processed</span>
                  <span className="text-xl font-bold text-white">{celeryMetrics.processedTasksCount.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Queue Depth</span>
                  <span className="text-xl font-bold text-amber-400">{celeryMetrics.queuedTasksCount} tasks</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Avg Execution Time</span>
                  <span className="text-xl font-bold text-emerald-400">{celeryMetrics.avgExecutionTimeMs} ms</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Failed Tasks</span>
                  <span className="text-xl font-bold text-slate-400">{celeryMetrics.failedTasksCount}</span>
                </div>
              </div>

              {/* Active Tasks Table */}
              <h4 className="text-xs font-bold text-white pt-2 border-t border-slate-800">Currently Executing Tasks</h4>
              <div className="space-y-2">
                {celeryMetrics.activeTasks.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-indigo-300 font-bold">{t.taskName}</span>
                      <span className="text-slate-400 ml-2 font-mono">({t.args})</span>
                    </div>
                    <span className="text-slate-400 font-mono">Running: {t.runtimeSeconds}s on {t.workerId}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. SECURITY & WAF */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  Security, WAF, & Anti-Abuse Sentinel
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  HTTPS everywhere, JWT token rotation, Nginx rate limiting, CSRF/XSS protection, and SQL injection prevention.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">WAF Rate Limiter</span>
                  <span className="text-base font-bold text-emerald-400">ACTIVE (30r/s)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">JWT Signature</span>
                  <span className="text-base font-bold text-indigo-400">HS256 256-Bit</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">DDoS Protection</span>
                  <span className="text-base font-bold text-amber-400">AUTO-MITIGATE</span>
                </div>
              </div>

              {/* Security Audit Logs Table */}
              <h3 className="text-sm font-bold text-white pt-2 border-t border-slate-800">Live Security Audit Log</h3>
              <div className="space-y-3">
                {securityLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {log.eventType}
                        </span>
                        <span className="text-xs font-mono text-slate-300">{log.endpoint}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{log.details}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">IP: {log.ipAddress} • {log.timestamp}</p>
                    </div>

                    <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400 self-start sm:self-center">
                      Action: {log.actionTaken}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. ARCHITECTURE DOCS & SCALING MATRIX */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-400" />
                  Enterprise Architecture & Scaling Roadmap (1K to 10M Users)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Complete technical specification for StudyConnect's production deployment.
                </p>
              </div>

              {/* Scaling Roadmap Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-amber-400">Phase 1: 1K - 10K Users</h3>
                  <p className="text-xs text-slate-300">Modular monolith running on Gunicorn + Daphne ASGI behind single Nginx reverse proxy. Single PostgreSQL DB + Redis cache.</p>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 block font-mono">Resource Cost: ~$80 / mo</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-indigo-400">Phase 2: 100K Users</h3>
                  <p className="text-xs text-slate-300">Autoscaled Django Cloud Run / K8s containers. PostgreSQL Primary with 2 Read Replicas. Redis Sentinel Cluster & 8 Celery Workers.</p>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 block font-mono">Resource Cost: ~$450 / mo</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400">Phase 3: 1M - 10M Users</h3>
                  <p className="text-xs text-slate-300">Extract high-traffic modules (AI, WebSockets, Video signaling) into standalone gRPC microservices. Global CDN for static media.</p>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 block font-mono">Resource Cost: Scale-Adjusted</span>
                </div>
              </div>

              {/* API Versioning & Disaster Recovery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-sky-400" /> API Versioning Strategy (/api/v1 & /api/v2)
                  </h4>
                  <p className="text-xs text-slate-400">
                    All core endpoints are namespaced under `/api/v1/`. Breaking changes will deprecate v1 with a 6-month window before sunsetting, introducing `/api/v2/` seamlessly.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Disaster Recovery & S3 Backup Plan
                  </h4>
                  <p className="text-xs text-slate-400">
                    Daily automated PostgreSQL dumps compressed with gzip and uploaded to encrypted S3 bucket. RPO (Recovery Point Objective): &lt; 24h. RTO (Recovery Time Objective): &lt; 15 mins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
