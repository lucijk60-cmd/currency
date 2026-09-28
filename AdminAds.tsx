import React, { useState, useEffect } from 'react';
import { AdCampaign } from '../../shared/types.js';
import { Image, Plus, Check, Trash2, ExternalLink, Calendar, Layers } from 'lucide-react';

export const AdminAds: React.FC = () => {
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [desktopBannerUrl, setDesktopBannerUrl] = useState('');
  const [mobileBannerUrl, setMobileBannerUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [sponsorBadge, setSponsorBadge] = useState('OFFICIAL SPONSOR');
  const [priority, setPriority] = useState(100);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const loadAds = async () => {
    try {
      const res = await fetch('/api/ads');
      const data = await res.json();
      setAds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetUrl) return;

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          desktop_banner_url: desktopBannerUrl || 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=1200&h=300&fit=crop&q=80',
          mobile_banner_url: mobileBannerUrl || desktopBannerUrl || 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&h=250&fit=crop&q=80',
          target_url: targetUrl,
          headline: headline || name,
          sponsor_badge: sponsorBadge,
          priority,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
        }),
      });

      if (res.ok) {
        setName('');
        setDesktopBannerUrl('');
        setMobileBannerUrl('');
        setTargetUrl('');
        setHeadline('');
        setShowAddForm(false);
        loadAds();
      }
    } catch (err) {
      alert('Error saving banner ad: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad campaign?')) return;
    try {
      await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      loadAds();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e1c] border border-amber-500/25">
        <div>
          <h1 className="text-2xl font-bold font-['Cinzel'] text-white">
            Banner Advertisement Campaign Manager
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Configure desktop and mobile banner advertisements. The highest priority active campaign automatically renders below EVERY news article.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Banner Campaign</span>
        </button>
      </div>

      {/* Add Campaign Form */}
      {showAddForm && (
        <form onSubmit={handleAddAd} className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase">Create Banner Campaign</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-neutral-400 mb-1">Ad Campaign Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ledger Flex Genesis Campaign"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Target / Destination URL</label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder="https://shop.ledger.com/?r=my_code"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-400 mb-1">Desktop Banner Image URL (1200x300 recommended)</label>
              <input
                type="url"
                value={desktopBannerUrl}
                onChange={e => setDesktopBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or hosted banner URL"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-400 mb-1">Mobile Banner Image URL (600x250 recommended)</label>
              <input
                type="url"
                value={mobileBannerUrl}
                onChange={e => setMobileBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or hosted banner URL"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Banner Headline</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="NOT YOUR KEYS, NOT YOUR COINS. UPGRADE HARDWARE."
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Sponsor Badge</label>
              <input
                type="text"
                value={sponsorBadge}
                onChange={e => setSponsorBadge(e.target.value)}
                placeholder="OFFICIAL SPONSOR"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Priority (Higher wins)</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={priority}
                onChange={e => setPriority(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-neutral-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex-1">
                <label className="block text-neutral-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
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
              Deploy Campaign
            </button>
          </div>
        </form>
      )}

      {/* Campaigns Table */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-[11px] uppercase">
                <th className="pb-3 px-3">Campaign</th>
                <th className="pb-3 px-3">Headline / Target</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Impressions</th>
                <th className="pb-3 px-3">Clicks</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {ads.map(ad => (
                <tr key={ad.id} className="hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-bold text-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={ad.desktop_banner_url}
                        alt=""
                        className="w-16 h-8 object-cover rounded border border-neutral-700"
                      />
                      <span>{ad.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-neutral-300 max-w-xs truncate">
                    <div>{ad.headline}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{ad.target_url}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-400">
                    #{ad.priority}
                  </td>
                  <td className="py-3 px-3 text-neutral-300">
                    {ad.impressions.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    {ad.clicks.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
