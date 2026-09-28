import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('অনুগ্রহ করে আপনার অনুমোদিত ইমেইল এবং পাসওয়ার্ড লিখুন।');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        localStorage.setItem('cryptova_admin_token', data.token);
        // Redirect to admin dashboard
        window.location.href = '/admin';
      } else {
        setError(data.error || 'লগইন ব্যর্থ হয়েছে। সঠিক ইমেইল ও পাসওয়ার্ড প্রদান করুন।');
      }
    } catch (err: any) {
      setError(err.message || 'নেটওয়ার্ক সংযোগে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#080d18] border border-amber-500/30 shadow-[0_0_80px_rgba(245,158,11,0.1)] relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-amber-500/15 blur-2xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black font-['Cinzel'] tracking-wider text-white">
            CRYPTOVA
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-amber-400 mt-1">
            Private Admin Control Terminal
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>শুধুমাত্র অনুমোদিত এডমিন একাউন্টের জন্য</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1.5 font-medium">
              Authorized Email / অনুমোদিত জিমেইল
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your-admin@gmail.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a1020] border border-neutral-700 focus:border-amber-400 focus:outline-none text-xs font-mono text-white placeholder-neutral-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-300 mb-1.5 font-medium">
              Admin Password / এডমিন পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="আপনার গোপন পাসওয়ার্ড দিন"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0a1020] border border-neutral-700 focus:border-amber-400 focus:outline-none text-xs font-mono text-white placeholder-neutral-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'যাচাই করা হচ্ছে...' : 'Sign In to Control Center (লগইন করুন)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-800/80 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল ওয়েবসাইটে ফেরত যান</span>
          </a>

          <div className="text-[10px] font-mono text-neutral-500">
            Protected by Cryptographic Auth
          </div>
        </div>
      </div>
    </div>
  );
};
