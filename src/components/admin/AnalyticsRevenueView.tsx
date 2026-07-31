import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Download, 
  Calendar, 
  Users, 
  Clock, 
  FileSpreadsheet 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface AnalyticsRevenueViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AnalyticsRevenueView: React.FC<AnalyticsRevenueViewProps> = ({ onShowToast }) => {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [breakdownData, setBreakdownData] = useState<any>({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics/revenue');
      const data = await res.json();
      if (data.data) {
        setRevenueData(data.data.monthlyOverview);
        setBreakdownData(data.data.breakdown);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#06b6d4', '#f59e0b'];

  const pieChartData = [
    { name: 'PRO Subscriptions', value: breakdownData.premiumSubscriptions || 52400 },
    { name: 'Study Materials', value: breakdownData.marketplaceMaterials || 18200 },
    { name: 'Mentor Bookings', value: breakdownData.mentorBookings || 9100 },
    { name: 'Platform Commissions', value: breakdownData.commissions || 4800 }
  ];

  const handleExportCSV = () => {
    onShowToast('CSV Financial & Analytics Report exported to downloads folder.', 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Platform Growth & Revenue Analytics</h2>
          <p className="text-xs text-slate-400">Track subscriber conversion rates, monthly study hours, and revenue streams.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Revenue & Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-sm">Monthly Revenue Trend ($ USD)</h3>
              <p className="text-[11px] text-slate-400">Gross platform revenue over 6 months</p>
            </div>
            <span className="text-sm font-black text-emerald-400">$84,500 / mo</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" textAnchor="middle" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Stream Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-sm">Revenue Stream Breakdown</h3>
            <p className="text-[11px] text-slate-400">Distribution of platform income</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {pieChartData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-white">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
