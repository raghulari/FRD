'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setSubmittedEmail(values.email);
    setIsSubmitted(true);
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
        <span className="text-xs font-mono text-ink-muted block">{"// PASSWORD RECOVERY"}</span>
        <h2 className="mt-2 text-2xl font-bold font-display text-ink">Reset Your Password</h2>
        <p className="mt-1 text-xs text-ink-muted">Enter your account email address to receive password reset instructions.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-6 shadow-sm border border-ink-border sm:rounded-lg sm:px-10">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-ink">Reset Instructions Sent</h3>
              <p className="text-xs text-ink-muted leading-relaxed font-sans">
                If an account exists for <span className="font-mono font-semibold text-ink">{submittedEmail}</span>, you will receive an email shortly with reset instructions.
              </p>
              <div className="pt-4 border-t border-ink-border">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-cobalt hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-mono font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Account Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    {...register('email')}
                    className={`w-full px-3.5 py-2.5 bg-paper text-ink text-sm border rounded focus:outline-none focus:ring-2 focus:ring-cobalt focus:border-transparent transition-all font-sans ${
                      errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-ink-border'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-ink-muted absolute right-3.5 top-3 pointer-events-none" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600 font-mono">{errors.email.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-cobalt text-sm font-semibold rounded-md text-white bg-cobalt hover:bg-cobalt-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cobalt transition-all disabled:opacity-50 disabled:cursor-not-allowed font-display shadow-sm"
                >
                  {isSubmitting ? <span>Sending...</span> : <span>Send Reset Instructions</span>}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-ink-border text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-xs font-mono text-ink-muted hover:text-ink">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
