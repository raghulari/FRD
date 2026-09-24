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
import { ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const registerSchema = z
  .object({
    company_name: z.string().min(2, 'Company name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setIsSubmitting(true);

    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        company_name: values.company_name,
      }),
    });

    setIsSubmitting(false);

    if (res.error) {
      setServerError(res.message || res.error);
      return;
    }

    if (res.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
      router.push('/dashboard');
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
        <span className="text-xs font-mono text-ink-muted block">{"// REGISTRATION ROUTE (CLIENT ONLY)"}</span>
        <h2 className="mt-2 text-2xl font-bold font-display text-ink">Create Your Client Account</h2>
        <p className="mt-1 text-xs text-ink-muted">Build, manage, and download exact-spec Functional Requirement Documents.</p>
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
                <span className="font-semibold block">Registration Error</span>
                <span>{serverError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="company_name" className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="company_name"
                type="text"
                placeholder="e.g. Acme Software Solutions Ltd."
                {...register('company_name')}
                className={`w-full px-3.5 py-2.5 bg-paper text-ink text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent transition-all font-sans ${
                  errors.company_name ? 'border-rose-400 bg-rose-50/20' : 'border-ink-border'
                }`}
              />
              {errors.company_name && (
                <p className="mt-1 text-xs text-rose-600 font-mono">{errors.company_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Work Email Address <span className="text-rose-500">*</span>
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
              <label htmlFor="password" className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
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

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={`w-full px-3.5 py-2.5 bg-paper text-ink text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent transition-all font-sans ${
                  errors.confirmPassword ? 'border-rose-400 bg-rose-50/20' : 'border-ink-border'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 font-mono">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-cobalt text-sm font-semibold rounded-md text-white bg-cobalt hover:bg-cobalt-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cobalt transition-all disabled:opacity-50 disabled:cursor-not-allowed font-display shadow-sm"
              >
                {isSubmitting ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Client Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-border text-center">
            <p className="text-xs text-ink-muted">
              Already registered?{' '}
              <Link href="/login" className="font-semibold text-cobalt hover:underline">
                Sign in to your dashboard
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs font-mono text-ink-muted flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cobalt" />
          <span>Tenant data isolated via PostgreSQL Row-Level Security</span>
        </div>
      </motion.div>
    </div>
  );
}
