'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Shield, Users, FileText, Database, Layers, ArrowLeft, LogOut, Search, Plus, CheckCircle, Lock } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'frds' | 'catalog' | 'clients'>('frds');
  const [frds, setFrds] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      const userRes = await apiFetch('/auth/me');

      if (userRes.error || !userRes.data?.user) {
        router.push('/login');
        return;
      }

      const currentUser = userRes.data.user;
      setUser(currentUser);

      if (currentUser.role !== 'admin') {
        alert('Access Denied: Admin role required for /admin panel.');
        router.push('/dashboard');
        return;
      }

      // Fetch all FRDs across all tenants for admin
      const frdRes = await apiFetch('/frds');
      if (frdRes.data?.frds) {
        setFrds(frdRes.data.frds);
      }

      // Fetch master catalog categories
      const catRes = await apiFetch('/catalog/categories');
      if (catRes.data?.categories) {
        setCategories(catRes.data.categories);
      }

      setLoading(false);
    }

    loadAdminData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-mono text-xs text-ink-muted">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cobalt animate-ping" />
          <span>Verifying Admin Authorization & Fetching Master Registry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col text-ink font-sans">
      {/* Top Admin Header */}
      <header className="bg-ink text-white border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="NUTZ Logo" width={24} height={24} />
              <span className="font-display font-bold text-sm tracking-tight">NUTZ FRD Admin Portal</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cobalt text-white font-semibold">
              SUPERADMIN ROLE
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-white/70">{user?.email}</span>
            <button
              onClick={() => {
                localStorage.removeItem('frd_token');
                router.push('/login');
              }}
              className="p-1.5 text-white/70 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-black/30 border-t border-white/10 px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-4 font-mono text-xs">
            <button
              onClick={() => setActiveTab('frds')}
              className={`px-4 py-1.5 rounded transition-all flex items-center gap-2 ${
                activeTab === 'frds' ? 'bg-cobalt text-white font-semibold' : 'text-white/70 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>All Client FRDs ({frds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-1.5 rounded transition-all flex items-center gap-2 ${
                activeTab === 'catalog' ? 'bg-cobalt text-white font-semibold' : 'text-white/70 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Master Catalog ({categories.length} Categories)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* TAB 1: ALL CLIENT FRDS */}
        {activeTab === 'frds' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-ink-border pb-4">
              <div>
                <h2 className="text-xl font-bold font-display text-ink">Master Client FRD Registry</h2>
                <p className="text-xs text-ink-muted font-sans mt-0.5">
                  View and manage Functional Requirement Documents across all tenant accounts.
                </p>
              </div>
            </div>

            <div className="bg-white border border-ink-border rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="bg-paper border-b border-ink-border font-mono text-ink-muted">
                    <th className="p-3.5">FRD ID</th>
                    <th className="p-3.5">Client Tenant ID</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Last Updated</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-border">
                  {frds.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-ink-muted font-mono">
                        No FRD documents created yet.
                      </td>
                    </tr>
                  ) : (
                    frds.map((doc) => (
                      <tr key={doc.id} className="hover:bg-paper/50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-cobalt">
                          {doc.id.slice(0, 8).toUpperCase()}...
                        </td>
                        <td className="p-3.5 font-mono text-ink-muted">
                          {doc.client_id.slice(0, 8)}...
                        </td>
                        <td className="p-3.5 font-mono">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {doc.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-ink-muted">
                          {new Date(doc.updated_at).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right font-mono">
                          <Link
                            href={`/dashboard/wizard/${doc.id}`}
                            className="text-cobalt hover:underline text-xs font-semibold"
                          >
                            Open Wizard →
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER CATALOG MANAGEMENT */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-ink-border pb-4">
              <div>
                <h2 className="text-xl font-bold font-display text-ink">Master Product Catalog Tier Hierarchy</h2>
                <p className="text-xs text-ink-muted font-sans mt-0.5">
                  Full 105-category catalog registry seeded into PostgreSQL tables.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white border border-ink-border rounded-lg p-5 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-paper text-ink-muted border border-ink-border">
                      {cat.code || 'CAT'}
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-ink">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-ink-muted font-sans line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
