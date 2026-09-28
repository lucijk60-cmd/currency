import React, { useEffect, useState } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';

export const AdminFailed: React.FC = () => {
  const [failedList, setFailedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch('/api/failed');
      const data = await res.json();
      setFailedList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetryAll = async () => {
    setRetrying(true);
    try {
      const res = await fetch('/api/automation/retry', { method: 'POST' });
      const data = await res.json();
      alert(`Retry cycle completed: Recovered ${data.result?.recovered || 0} items.`);
      loadData();
    } catch (err: any) {
      alert('Retry error: ' + err.message);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e1c] border border-rose-500/25">
        <div>
          <h1 className="text-2xl font-bold font-['Cinzel'] text-white flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            Failed Articles Quarantine Queue
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Articles that encountered parsing, rate limits, or network timeouts after 3 automated attempts are quarantined here.
          </p>
        </div>

        <button
          onClick={handleRetryAll}
          disabled={retrying || failedList.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase transition-colors disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
          <span>Retry All In Queue</span>
        </button>
      </div>

      {/* List */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800">
        {failedList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-[11px] uppercase">
                  <th className="pb-3 px-3">Headline / URL</th>
                  <th className="pb-3 px-3">Source</th>
                  <th className="pb-3 px-3">Failure Stage</th>
                  <th className="pb-3 px-3">Error Message</th>
                  <th className="pb-3 px-3">Attempts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {failedList.map(item => (
                  <tr key={item.id}>
                    <td className="py-3 px-3 font-semibold text-white max-w-sm truncate">
                      <div>{item.original_title}</div>
                      <div className="text-[10px] text-neutral-400 font-normal truncate">{item.original_url}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-300">{item.source_name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px]">
                        {item.error_stage}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-rose-400 max-w-xs truncate">{item.error_message}</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">{item.retry_count} / 3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-400 font-mono text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-bold text-neutral-200">Zero Quarantine Errors</div>
            <p>All collected news items have been successfully synthesized, translated, and published.</p>
          </div>
        )}
      </div>
    </div>
  );
};
