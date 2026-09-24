'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { ShieldCheck, ArrowRight, AlertCircle, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);

    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    setIsSubmitting(false);

    if (res.error) {
      setServerError(res.message || res.error);
      return;
    }

    if (res.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);

      const userRole = res.data.user?.role;
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 px-6 lg:px-8 text-ink selection:bg-cobalt selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 justify-center mb-4 group">
          <div className="relative w-11 h-11 flex items-center justify-center bg-white p-1 rounded border border-ink-border shadow-sm">
            <Image src="/logo.png" alt="NUTZ Logo" width={40} height={40} className="object-contain" priority />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-xl text-ink tracking-tight flex items-center gap-1.5">
              NUTZ FRD
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-cobalt-light text-cobalt border border-cobalt/20 rounded uppercase">
                PRO
              </span>
            </span>
            <span className="text-[10px] font-mono text-ink-muted">Nutz Technovation Platform</span>
          </div>
        </Link>
        <span className="text-xs font-mono text-ink-muted block">{"// AUTHENTICATION PORTAL"}</span>
        <h2 className="mt-2 text-2xl font-bold font-display text-ink">Sign In to NUTZ FRD</h2>
        <p className="mt-1 text-xs text-ink-muted">Access your drafts, technical specifications, and approved FRD proposals.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-6 shadow-sm border border-ink-border sm:rounded-lg sm:px-10">
          {serverError && (
            <div className="mb-6 p-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Authentication Failed</span>
                <span>{serverError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register('email')}
                className={`w-full px-3.5 py-2.5 bg-paper text-ink text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent transition-all font-sans ${
                  errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-ink-border'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-mono">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider">
                  Password <span className="text-rose-500">*</span>
                </label>
                <Link href="/forgot-password" className="text-xs text-cobalt hover:underline font-mono">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-3.5 py-2.5 bg-paper text-ink text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent transition-all font-sans ${
                  errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-ink-border'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-mono">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-cobalt text-sm font-semibold rounded-md text-white bg-cobalt hover:bg-cobalt-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cobalt transition-all disabled:opacity-50 disabled:cursor-not-allowed font-display shadow-sm"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-border text-center">
            <p className="text-xs text-ink-muted">
              Need a new client account?{' '}
              <Link href="/register" className="font-semibold text-cobalt hover:underline">
                Register company profile
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs font-mono text-ink-muted flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cobalt" />
          <span>PostgreSQL Rate-Limited & Encrypted Session Authentication</span>
        </div>
      </motion.div>
    </div>
  );
}
