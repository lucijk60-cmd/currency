import React, { useState, useEffect } from 'react';
import { AffiliateProgram } from '../../shared/types.js';
import { Link, Plus, Check, Trash2, ExternalLink, ShieldCheck, DollarSign } from 'lucide-react';

export const AdminAffiliates: React.FC = () => {
  const [affiliates, setAffiliates] = useState<AffiliateProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form inputs
  const [programName, setProgramName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [referralUrl, setReferralUrl] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [category, setCategory] = useState('Exchanges');
  const [keywords, setKeywords] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [priority, setPriority] = useState(50);
  const [maxLinks, setMaxLinks] = useState(1);

  const loadData = async () => {
    try {
      const res = await fetch('/api/affiliates');
      const data = await res.json();
      setAffiliates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programName || !referralUrl) return;

    try {
      const res = await fetch('/api/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program_name: programName,
          company_name: companyName || programName,
          referral_url: referralUrl,
          referral_code: referralCode,
          tracking_id: trackingId,
          category,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          call_to_action: callToAction || `Access ${companyName || programName} Official Portal`,
          priority,
          max_links_per_article: maxLinks,
        }),
      });

      if (res.ok) {
        setProgramName('');
        setCompanyName('');
        setReferralUrl('');
        setReferralCode('');
        setTrackingId('');
        setKeywords('');
        setCallToAction('');
        setShowAddForm(false);
        loadData();
      }
    } catch (err) {
      alert('Error creating affiliate program: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this affiliate program?')) return;
    try {
      await fetch(`/api/affiliates/${id}`, { method: 'DELETE' });
      loadData();
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
            Automated Affiliate Referral Manager
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Add your referral link once. AI analyzes each incoming article and contextually matches configured programs without manual intervention.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Affiliate Link</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase">New Referral Program Configuration</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-neutral-400 mb-1">Affiliate Program Name</label>
              <input
                type="text"
                required
                value={programName}
                onChange={e => setProgramName(e.target.value)}
                placeholder="e.g. Binance Global Official Partner"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Company / Entity Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Binance"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-400 mb-1">Configured Referral URL (Strict: Only your actual link)</label>
              <input
                type="url"
                required
                value={referralUrl}
                onChange={e => setReferralUrl(e.target.value)}
                placeholder="https://accounts.binance.com/register?ref=MY_ACTUAL_CODE"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Referral Code (Optional)</label>
              <input
                type="text"
                value={referralCode}
                onChange={e => setReferralCode(e.target.value)}
                placeholder="CRYPTOVA2026"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Tracking ID (Optional)</label>
              <input
                type="text"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                placeholder="cptv_campaign_1"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Exchanges">Exchanges</option>
                <option value="Security / Wallets">Security / Wallets</option>
                <option value="Derivatives">Derivatives</option>
                <option value="DeFi">DeFi</option>
                <option value="Tax & Compliance">Tax & Compliance</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Matching Keywords (Comma separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="binance, bnb, trading, crypto exchange"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Call to Action (CTA)</label>
              <input
                type="text"
                value={callToAction}
                onChange={e => setCallToAction(e.target.value)}
                placeholder="Trade Top Cryptocurrencies on Binance"
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">Priority (1 - 100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={priority}
                onChange={e => setPriority(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              />
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
              Save Program
            </button>
          </div>
        </form>
      )}

      {/* Affiliates Table */}
      <div className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-[11px] uppercase">
                <th className="pb-3 px-3">Program / Company</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Keywords Matched</th>
                <th className="pb-3 px-3">Clicks Tracked</th>
                <th className="pb-3 px-3">Estimated Rev</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {affiliates.map(aff => (
                <tr key={aff.id} className="hover:bg-neutral-800/30">
                  <td className="py-3 px-3 font-bold text-white">
                    <div>{aff.program_name}</div>
                    <div className="text-[10px] text-neutral-400 font-normal truncate max-w-xs">{aff.referral_url}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-300 text-[10px]">
                      {aff.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-400 max-w-xs truncate">
                    {aff.keywords.slice(0, 3).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-400">
                    {aff.clicks}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    ${(aff.estimated_revenue_usd || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDelete(aff.id)}
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
