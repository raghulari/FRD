'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { LayoutDashboard, Settings, FileText, LogOut, ShieldCheck, Plus } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const res = await apiFetch('/auth/me');
      if (res.error || !res.data?.user) {
        localStorage.removeItem('accessToken');
        router.push('/login');
        return;
      }
      setUser(res.data.user);
      setIsLoading(false);
    }
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-mono text-xs text-ink-muted">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cobalt animate-ping" />
          <span>Authenticating session & loading PostgreSQL RLS policies...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: 'FRD Documents', icon: FileText },
    { href: '/dashboard/settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-paper flex text-ink font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-ink-border flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-ink-border flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center bg-white p-1 rounded border border-ink-border">
              <Image src="/logo.png" alt="NUTZ Logo" width={32} height={32} className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-ink tracking-tight flex items-center gap-1.5">
                NUTZ FRD
                <span className="text-[9px] font-mono font-medium px-1 py-0.2 bg-cobalt-light text-cobalt border border-cobalt/20 rounded uppercase">
                  PRO
                </span>
              </span>
              <span className="text-[9px] font-mono text-ink-muted">Client Portal</span>
            </div>
          </div>

          {/* Company Profile Badge */}
          <div className="p-4 mx-3 my-4 bg-paper rounded border border-ink-border font-mono text-xs">
            <span className="text-[10px] text-ink-muted block uppercase tracking-wider">Tenant Profile</span>
            <span className="font-semibold text-ink block truncate">{user?.client?.company_name || 'Acme Corp'}</span>
            <span className="text-[10px] text-cobalt block font-medium mt-0.5">{user?.email}</span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-mono font-medium transition-colors ${
                    isActive
                      ? 'bg-cobalt-light text-cobalt border border-cobalt/20'
                      : 'text-ink-muted hover:text-ink hover:bg-paper'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Tenant RLS Indicator & Logout */}
        <div className="p-4 border-t border-ink-border space-y-3">
          <div className="p-2.5 rounded bg-paper border border-ink-border text-[10px] font-mono text-ink-muted flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>RLS Active: {user?.client?.id?.slice(0, 8)}...</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-rose-600 hover:bg-rose-50 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-ink-border px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-ink-muted uppercase tracking-wider">{"// CLIENT DASHBOARD"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/wizard/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start New FRD</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
