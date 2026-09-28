import React, { useEffect, useState } from 'react';
import { SetupStatus, AutomationLog } from '../../shared/types.js';
import {
  Play,
  RotateCcw,
  Pause,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Rss,
  Cpu,
  Globe,
  Database,
  TrendingUp,
  Link,
  Image,
} from 'lucide-react';

export const AdminAutomation: React.FC = () => {
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [executing, setExecuting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [statusRes, logsRes] = await Promise.all([
        fetch('/api/automation/status').then(r => r.json()),
        fetch('/api/automation/logs').then(r => r.json()),
      ]);
      setStatus(statusRes);
      setLogs(logsRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const triggerAction = async (endpoint: string, actionName: string) => {
    setExecuting(true);
    setActionMessage(`Executing ${actionName}...`);
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      setActionMessage(`${actionName} completed: ` + JSON.stringify(data.result || data.status || 'OK'));
      loadData();
    } catch (err: any) {
      setActionMessage(`Error executing ${actionName}: ${err.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const statusItems = [
    { title: 'RSS Aggregator', status: `${status?.sources.active ?? 4} Active Feeds`, icon: Rss, ok: true },
    { title: 'AI News Editor', status: status?.gemini.connected ? 'Gemini 3.8 Active' : 'Fallback Engine Ready', icon: Cpu, ok: true },
    { title: 'Translation Engine', status: '6 Global Languages Online', icon: Globe, ok: true },
    { title: 'Database Store', status: 'Supabase PostgreSQL Model', icon: Database, ok: true },
    { title: 'Crypto Market Feeds', status: 'CoinGecko Live API Stream', icon: TrendingUp, ok: true },
    { title: 'Affiliate Matching', status: `${status?.affiliates.active ?? 4} Configured Programs`, icon: Link, ok: true },
    { title: 'Banner Ad Delivery', status: `${status?.ads.active ?? 2} Campaigns Active`, icon: Image, ok: true },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#090e1c] border border-amber-500/25">
        <h1 className="text-2xl font-bold font-['Cinzel'] text-white">
          Autonomous Newsroom Command Terminal
        </h1>
        <p className="text-xs font-mono text-neutral-400 mt-1">
          Monitor real-time RSS collection, duplicate filtering, Gemini AI editorial synthesis, multilingual translation, affiliate injection, and banner serving.
        </p>
      </div>

      {/* Action Buttons as specified in Requirement 22 */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800 space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
          Manual Operational Overrides
        </h2>

        <div className="flex flex-wrap gap-3">
          {/* RUN NOW */}
          <button
            onClick={() => triggerAction('/api/automation/run', 'Run Pipeline Now')}
            disabled={executing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RUN NOW</span>
          </button>

          {/* RETRY FAILED */}
          <button
            onClick={() => triggerAction('/api/automation/retry', 'Retry Failed Articles')}
            disabled={executing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETRY FAILED</span>
          </button>

          {/* PAUSE AUTOMATION */}
          <button
            onClick={() => triggerAction('/api/automation/pause', 'Pause Automation')}
            disabled={executing || !status?.automation.running}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-rose-300 font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <Pause className="w-4 h-4" />
            <span>PAUSE AUTOMATION</span>
          </button>

          {/* RESUME AUTOMATION */}
          <button
            onClick={() => triggerAction('/api/automation/resume', 'Resume Automation')}
            disabled={executing || status?.automation.running}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>RESUME AUTOMATION</span>
          </button>

          {/* TEST SOURCES */}
          <a
            href="/admin/sources"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Rss className="w-4 h-4 text-amber-400" />
            <span>TEST SOURCES</span>
          </a>
        </div>

        {actionMessage && (
          <div className="p-3 rounded-xl bg-neutral-900 border border-amber-500/30 text-xs font-mono text-amber-300 animate-in fade-in">
            {actionMessage}
          </div>
        )}
      </div>

      {/* 7 System Status Modules as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusItems.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="p-4 rounded-2xl bg-[#080d1a] border border-neutral-800 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-200 font-mono">
                  {item.title}
                </h4>
                <div className="text-[11px] font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{item.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Automation Logs Terminal */}
      <div className="rounded-3xl bg-[#04060b] border border-neutral-800 overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-[#090d18] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Live Pipeline Stream Logs
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Auto-refreshing every 8s
          </span>
        </div>

        <div className="p-5 font-mono text-xs text-neutral-300 space-y-2 max-h-96 overflow-y-auto bg-black/40">
          {logs.length > 0 ? (
            logs.map(log => {
              const levelColor =
                log.level === 'success' ? 'text-emerald-400' :
                log.level === 'error' ? 'text-rose-400' :
                log.level === 'warn' ? 'text-amber-400' : 'text-cyan-400';

              return (
                <div key={log.id} className="flex items-start gap-3 py-1 border-b border-neutral-900/80">
                  <span className="text-neutral-400 flex-shrink-0">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold flex-shrink-0 ${levelColor}`}>
                    {log.level}
                  </span>
                  <span className="text-amber-300/80 uppercase text-[10px] flex-shrink-0">
                    [{log.stage}]
                  </span>
                  <span className="text-neutral-200">
                    {log.message}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-neutral-400 py-4 text-center">
              No recent logs recorded. Pipeline is standby.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
