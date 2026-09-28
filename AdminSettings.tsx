import React, { useEffect, useState } from 'react';
import { SiteSettings } from '../../shared/types.js';
import { Settings, Save, CheckCircle2, Shield, Calendar, Globe } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => setSettings(d))
      .catch(err => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert('Error updating settings: ' + err);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-neutral-400 font-mono text-xs">Loading configuration...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#090e1c] border border-amber-500/25">
        <h1 className="text-2xl font-bold font-['Cinzel'] text-white">
          Newsroom System & Retention Settings
        </h1>
        <p className="text-xs font-mono text-neutral-400 mt-1">
          Configure automated data retention cycles, multilingual affiliate disclosures, and background schedules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Retention Period (Requirement 24) */}
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase">
              Article Retention Policy (Requirement 24)
            </h3>
          </div>
          <p className="text-xs font-mono text-neutral-400">
            Define automated database pruning threshold: 0-24h (Latest), 1-7d (Recent), 7-30d (Archive). Articles older than the threshold are automatically pruned or archived.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[30, 60, 90, 0].map(days => (
              <button
                key={days}
                type="button"
                onClick={() => setSettings({ ...settings, retention_days: days })}
                className={`p-4 rounded-xl border text-center font-mono text-xs transition-all ${
                  settings.retention_days === days
                    ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                    : 'border-neutral-800 bg-[#0a1020] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="text-lg font-bold mb-1">
                  {days === 0 ? 'Never' : `${days} Days`}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {days === 90 ? '(System Default)' : days === 0 ? 'Infinite Retention' : 'Storage Optimized'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Localized Affiliate Disclosures (Requirement 17) */}
        <div className="p-6 rounded-2xl bg-[#080d1a] border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase">
              Multilingual Affiliate Disclosure Editor (Requirement 17)
            </h3>
          </div>
          <p className="text-xs font-mono text-neutral-400">
            Displayed automatically beneath every contextual affiliate and referral insertion across all 6 supported languages.
          </p>

          <div className="space-y-4 pt-2 text-xs font-mono">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">English (en)</label>
              <textarea
                rows={2}
                value={settings.affiliate_disclosure.en}
                onChange={e =>
                  setSettings({
                    ...settings,
                    affiliate_disclosure: { ...settings.affiliate_disclosure, en: e.target.value },
                  })
                }
                className="w-full p-3 rounded-xl bg-[#0a1020] border border-neutral-700 text-neutral-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">العربية - Arabic (ar)</label>
              <textarea
                rows={2}
                dir="rtl"
                value={settings.affiliate_disclosure.ar}
                onChange={e =>
                  setSettings({
                    ...settings,
                    affiliate_disclosure: { ...settings.affiliate_disclosure, ar: e.target.value },
                  })
                }
                className="w-full p-3 rounded-xl bg-[#0a1020] border border-neutral-700 text-neutral-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">বাংলা - Bengali (bn)</label>
              <textarea
                rows={2}
                value={settings.affiliate_disclosure.bn}
                onChange={e =>
                  setSettings({
                    ...settings,
                    affiliate_disclosure: { ...settings.affiliate_disclosure, bn: e.target.value },
                  })
                }
                className="w-full p-3 rounded-xl bg-[#0a1020] border border-neutral-700 text-neutral-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Deutsch - German (de)</label>
              <textarea
                rows={2}
                value={settings.affiliate_disclosure.de}
                onChange={e =>
                  setSettings({
                    ...settings,
                    affiliate_disclosure: { ...settings.affiliate_disclosure, de: e.target.value },
                  })
                }
                className="w-full p-3 rounded-xl bg-[#0a1020] border border-neutral-700 text-neutral-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Español - Spanish (es)</label>
              <textarea
                rows={2}
                value={settings.affiliate_disclosure.es}
                onChange={e =>
                  setSettings({
                    ...settings,
                    affiliate_disclosure: { ...settings.affiliate_disclosure, es: e.target.value },
                  })
                }
                className="w-full p-3 rounded-xl bg-[#0a1020] border border-neutral-700 text-neutral-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Français - French (fr)</label>
              <textarea
                rows={2}
                value={settings.affiliate_disclosure.fr}
                onChange={e =>
                  setSettings({
                    ...settings,
                    affiliate_disclosure: { ...settings.affiliate_disclosure, fr: e.target.value },
                  })
                }
                className="w-full p-3 rounded-xl bg-[#0a1020] border border-neutral-700 text-neutral-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#080d1a] border border-neutral-800">
          <div>
            {saved && (
              <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Admin Security & Password Management */}
      <AdminSecurityManager />
    </div>
  );
};

const AdminSecurityManager: React.FC = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('cryptova_admin_token');
    fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.email) {
          setCurrentEmail(data.email);
          setNewEmail(data.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড দুটি মিলছে না (Passwords do not match)' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be >= 6 chars)' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('cryptova_admin_token');
      const res = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          newEmail,
          currentPassword,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: data.message || 'এডমিন তথ্য সফলভাবে আপডেট হয়েছে।' });
        setCurrentEmail(data.email);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'আপডেট করতে সমস্যা হয়েছে।' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'নেটওয়ার্ক এরর' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#080d1a] border border-amber-500/30 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-amber-400" />
        <h3 className="text-sm font-mono font-bold text-white uppercase">
          এডমিন একাউন্ট সিকিউরিটি ও পাসওয়ার্ড পরিবর্তন (Admin Security & Credentials)
        </h3>
      </div>
      <p className="text-xs font-mono text-neutral-400">
        শুধুমাত্র একজন অনুমোদিত এডমিন হিসেবে আপনি আপনার ইমেইল এবং লগইন পাসওয়ার্ড এখান থেকে পরিবর্তন করতে পারবেন।
      </p>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-mono ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4 pt-2 text-xs font-mono">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-300 mb-1">অনুমোদিত এডমিন ইমেইল / জিমেইল</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="admin@gmail.com"
              className="w-full p-2.5 rounded-xl bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              বর্তমান সক্রিয়: {currentEmail || 'লোড হচ্ছে...'}
            </span>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1">বর্তমান পাসওয়ার্ড (Current Password)</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="বর্তমান পাসওয়ার্ড লিখুন"
              className="w-full p-2.5 rounded-xl bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-300 mb-1">নতুন পাসওয়ার্ড (New Password)</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="কমপক্ষে ৬ অক্ষর দিন"
              className="w-full p-2.5 rounded-xl bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="একই পাসওয়ার্ড আবার লিখুন"
              className="w-full p-2.5 rounded-xl bg-[#0a1020] border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          <span>{loading ? 'আপডেট করা হচ্ছে...' : 'এডমিন পাসওয়ার্ড ও ইমেইল আপডেট করুন'}</span>
        </button>
      </form>
    </div>
  );
};
