'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { ShieldCheck, Save, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const res = await apiFetch('/auth/me');
      if (res.data?.user) {
        setUserEmail(res.data.user.email);
        setCompanyName(res.data.user.client?.company_name || '');
      }
    }
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setIsUpdatingProfile(true);

    const res = await apiFetch('/client/profile', {
      method: 'PUT',
      body: JSON.stringify({ company_name: companyName }),
    });

    setIsUpdatingProfile(false);

    if (res.error) {
      setProfileError(res.message || res.error);
    } else {
      setProfileMessage('Company profile updated successfully');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    setIsUpdatingPassword(true);

    const res = await apiFetch('/client/password', {
      method: 'PUT',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    setIsUpdatingPassword(false);

    if (res.error) {
      setPasswordError(res.message || res.error);
    } else {
      setPasswordMessage('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-ink-border pb-6">
        <span className="text-xs font-mono text-cobalt font-semibold uppercase tracking-widest block mb-1">
          {"// ACCOUNT & SECURITY"}
        </span>
        <h1 className="text-2xl font-bold font-display text-ink">Account Settings</h1>
        <p className="text-xs text-ink-muted mt-1 font-sans">
          Manage your client profile metadata, account credentials, and PostgreSQL security policies.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Company Profile Settings */}
        <div className="bg-white border border-ink-border rounded-lg p-6 shadow-sm space-y-6">
          <div className="border-b border-ink-border/60 pb-4">
            <h2 className="text-lg font-bold font-display text-ink">Company Profile</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              This company name appears on generated Functional Requirement Documents.
            </p>
          </div>

          {profileMessage && (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileMessage}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Work Email (Read Only)
              </label>
              <input
                type="text"
                disabled
                value={userEmail}
                className="w-full px-3.5 py-2.5 bg-paper text-ink-muted text-sm border border-ink-border rounded font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isUpdatingProfile ? 'Saving Profile...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

        {/* Password Security Settings */}
        <div className="bg-white border border-ink-border rounded-lg p-6 shadow-sm space-y-6">
          <div className="border-b border-ink-border/60 pb-4">
            <h2 className="text-lg font-bold font-display text-ink">Change Account Password</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Ensure your password is at least 8 characters long.
            </p>
          </div>

          {passwordMessage && (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordMessage}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm border border-ink-border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white text-xs font-mono font-semibold rounded shadow-sm transition-all disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isUpdatingPassword ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        </div>

        {/* Tenant RLS Security Banner */}
        <div className="bg-paper p-6 rounded-lg border border-ink-border flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold font-mono text-ink block">Row-Level Security (RLS) Active</span>
            <p className="text-ink-muted leading-relaxed font-sans">
              Every database query executed on behalf of your company runs within a PostgreSQL transaction with local session parameters <code className="font-mono text-cobalt bg-cobalt-light px-1 py-0.5 rounded">SET LOCAL app.current_client_id</code>. Your draft documents are strictly isolated at the database engine layer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
