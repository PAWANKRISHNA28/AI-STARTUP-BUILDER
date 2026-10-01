import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Analytics } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Cpu, Clock, Star, Layers, Activity, Loader2, Sparkles 
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Chart3D } from '../components/Three/Chart3D';
import { OrbitControls, Environment } from '@react-three/drei';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalyticsSummary();
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
        <p className="text-xs text-muted font-medium">Computing usage metrics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-card p-12 text-center rounded-3xl border border-border shadow-soft">
        <h3 className="text-base font-bold text-heading">Analytics unavailable</h3>
        <p className="text-xs text-muted mt-1">Failed to fetch telemetry metrics from database.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Projects Created', value: data.projects_created, icon: Layers, color: 'text-primary' },
    { label: 'Reports Generated', value: data.reports_generated, icon: Sparkles, color: 'text-indigo-500' },
    { label: 'Top Industry', value: data.most_used_industry, icon: Activity, color: 'text-emerald-500' },
    { label: 'Avg Gen Time', value: `${data.average_generation_time_seconds.toFixed(0)}s`, icon: Clock, color: 'text-amber-500' },
    { label: 'Total AI Requests', value: data.total_ai_requests, icon: Cpu, color: 'text-sky-500' },
    { label: 'Favorite Startups', value: data.favorite_projects_count, icon: Star, color: 'text-rose-500' },
  ];

  const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-heading">System Analytics</h1>
        <p className="text-sm text-muted">Track agent execution metrics, usage frequency, and startup creation history.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-soft flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{c.label}</span>
                <h3 className="text-2xl font-display font-bold text-heading">{c.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/80 ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Weekly activity */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-soft space-y-4">
          <h3 className="text-base font-bold text-heading">Weekly AI Requests</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weekly_usage}>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly generation (3D) */}
        <div className="bg-card p-6 rounded-3xl border border-border shadow-soft space-y-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <h3 className="text-base font-bold text-heading">Monthly Projects (Holo-View)</h3>
          <div className="h-64 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden bg-slate-900/50">
            <Canvas camera={{ position: [0, 5, 8], fov: 40 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <Environment preset="city" />
              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2 - 0.1} minPolarAngle={Math.PI / 4} />
              <Chart3D 
                data={data.monthly_usage.map(d => ({ label: d.month, value: d.projects }))} 
                maxValue={Math.max(...data.monthly_usage.map(d => d.projects), 10)} 
              />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Agent performance breakdown */}
      <div className="bg-card p-6 rounded-3xl border border-border shadow-soft space-y-4">
        <h3 className="text-base font-bold text-heading">Agent Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-muted uppercase font-bold border-b border-border">
              <tr>
                <th className="p-3">Agent Specialist</th>
                <th className="p-3">Synthesizing Accuracy</th>
                <th className="p-3">Average Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.agent_performance.map((ap, i) => (
                <tr key={i}>
                  <td className="p-3 font-bold text-heading">{ap.agent}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${ap.accuracy}%` }} />
                      </div>
                      <span className="font-extrabold text-emerald-600">{ap.accuracy}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted font-bold">{ap.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

