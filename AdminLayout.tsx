import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Rss,
  Link,
  BarChart3,
  Image,
  AlertOctagon,
  Settings,
  ArrowLeft,
  ShieldCheck,
  Radio,
  Sliders,
  LogOut,
} from 'lucide-react';

interface AdminLayoutProps {
  currentPath: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, children }) => {
  const [adminEmail, setAdminEmail] = React.useState('sajabedbusiness@gmail.com');

  React.useEffect(() => {
    const token = localStorage.getItem('cryptova_admin_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (!d.authenticated) {
          localStorage.removeItem('cryptova_admin_token');
          window.location.href = '/login';
        } else if (d.email) {
          setAdminEmail(d.email);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Automation Center', path: '/admin/automation', icon: Cpu },
    { label: 'RSS News Sources', path: '/admin/sources', icon: Rss },
    { label: 'Affiliate Manager', path: '/admin/affiliate', icon: Link },
    { label: 'Affiliate Analytics', path: '/admin/affiliate/analytics', icon: BarChart3 },
    { label: 'Banner Ads Manager', path: '/admin/ads', icon: Image },
    { label: 'Failed Articles', path: '/admin/failed', icon: AlertOctagon },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
    { label: 'Setup Wizard', path: '/setup', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#05070d] text-neutral-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#080c18] border-b md:border-b-0 md:border-r border-neutral-800 flex-shrink-0 flex flex-col justify-between p-4">
        <div>
          {/* Admin Header */}
          <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-neutral-800/80">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Cinzel'] font-bold text-white text-base">
                CRYPTOVA
              </div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                Control Terminal
              </div>
              <div className="text-[9px] font-mono text-emerald-400/90 truncate max-w-[160px] mt-0.5" title={adminEmail}>
                ● {adminEmail}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 mt-6 border-t border-neutral-800/80 space-y-1">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Website</span>
          </a>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('cryptova_admin_token');
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
