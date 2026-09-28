import React, { useState, useEffect } from 'react';
import { RssSource } from '../../shared/types.js';
import { Rss, Plus, Check, Trash2, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

export const AdminSources: React.FC = () => {
  const [sources, setSources] = useState<RssSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [rssUrl, setRssUrl] = useState('');
  const [category, setCategory] = useState('General');
  const [fetchFreq, setFetchFreq] = useState(15);

  const loadSources = async () => {
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      setSources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rssUrl) return;

    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          website_url: websiteUrl || rssUrl,
          rss_url: rssUrl,
          category,
          fetch_frequency_minutes: fetchFreq,
        }),
      });
      if (res.ok) {
        setName('');
        setWebsiteUrl('');
        setRssUrl('');
        setShowAddForm(false);
        loadSources();
      }
    } catch (err) {
      alert('Error adding source: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this source?')) return;
    try {
      await fetch(`/api/sources/${id}`, { method: 'DELETE' });
      loadSources();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestSource = async (source: RssSource) => {
    setTestingId(source.id);
    setTestResult(null);
    try {
      const res = await fetch('/api/sources/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rss_url: source.rss_url }),
      });
      const data = await res.json();
      setTestResult({
        sourceName: source.name,
        success: data.success,
        count: data.items?.length || 0,
        sample: data.items?.[0]?.title || 'No items',
      });
    } catch (err: any) {
      setTestResult({ sourceName: source.name, success: false, error: err.message });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e1c] border border-amber-500/25">
        <div>
          <h1 className="text-2xl font-bold font-['Cinzel'] text-white">
            Approved RSS / API News Sources
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Configure cryptocurrency feeds. The autonomous pipeline fetches and synthesizes without manual editing.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add News Feed</span>
        </button>
      </div>

      {/* Add Source Form Modal / Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddSource} className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase">Add Approved Source</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-neutral-400 mb-1">Source Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Blockworks"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://blockworks.co"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">RSS Feed URL</label>
              <input
                type="url"
                required
                value={rssUrl}
                onChange={e => setRssUrl(e.target.value)}
                placeholder="https://blockworks.co/feed"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Default Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="General">General</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Ethereum">Ethereum</option>
                <option value="DeFi">DeFi</option>
                <option value="Regulation">Regulation</option>
                <option value="Exchanges">Exchanges</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs font-mono"
            >
              Save Feed
            </button>
          </div>
        </form>
      )}

      {/* Test Result Message */}
      {testResult && (
        <div className={`p-4 rounded-xl text-xs font-mono border ${testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
          <div className="font-bold mb-1">
            Test Result for {testResult.sourceName}: {testResult.success ? 'SUCCESS ✓' : 'FAILED ✕'}
          </div>
          {testResult.success ? (
            <div>Retrieved {testResult.count} items. Sample title: "{testResult.sample}"</div>
          ) : (
            <div>Error: {testResult.error}</div>
          )}
        </div>
      )}

      {/* Sources Table */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-[11px] uppercase">
                <th className="pb-3 px-3">Source Name</th>
                <th className="pb-3 px-3">RSS Endpoint</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Frequency</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {sources.map(src => (
                <tr key={src.id} className="hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <Rss className="w-4 h-4 text-amber-400" />
                    <span>{src.name}</span>
                  </td>
                  <td className="py-3 px-3 text-neutral-400 max-w-xs truncate font-mono text-[11px]">
                    {src.rss_url}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-300 text-[10px]">
                      {src.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-300">
                    Every {src.fetch_frequency_minutes}m
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTestSource(src)}
                        disabled={testingId === src.id}
                        className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] transition-colors"
                      >
                        {testingId === src.id ? 'Testing...' : 'Test Feed'}
                      </button>
                      <button
                        onClick={() => handleDelete(src.id)}
                        className="p-1 rounded text-neutral-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
