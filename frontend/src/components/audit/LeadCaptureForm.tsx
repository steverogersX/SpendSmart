'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectField, SelectOption } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { submitLead, type LeadTier } from '@/lib/api';
import type { AuditResult } from '@shared/types/auditResult';

const TEAM_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'] as const;

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.enum(TEAM_SIZES).optional(),
  website: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

const SUCCESS_COPY: Record<LeadTier, string> = {
  high: 'A Credex advisor will be in touch shortly.',
  mid: 'Report on its way — check your inbox.',
  low: "We'll notify you when a better option appears.",
};

interface Props {
  tier: LeadTier;
  totalSavings: number;
  auditResult: AuditResult;
  submitLabel?: string;
  onSuccess?: () => void;
}

export function LeadCaptureForm({ tier, totalSavings, auditResult, submitLabel = 'Send report', onSuccess }: Props) {
  const [showOptional, setShowOptional] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const teamSizeValue = useWatch({ control, name: 'teamSize' });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await submitLead({
        email: values.email,
        companyName: values.companyName || undefined,
        role: values.role || undefined,
        teamSize: values.teamSize,
        tier,
        totalSavingsMonthly: totalSavings,
        auditResults: auditResult,
        website: values.website,
      });
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
      >
        <CheckCircle className="size-4 shrink-0" />
        {SUCCESS_COPY[tier]}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Honeypot — visually hidden, catches bots that fill all fields */}
      <input
        type="text"
        {...register('website')}
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
      />

      {/* Email + submit */}
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <Input
            {...register('email')}
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            className={cn(errors.email && 'border-destructive focus-visible:ring-destructive/30')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : submitLabel}
        </Button>
      </div>

      {/* Optional fields toggle */}
      <button
        type="button"
        onClick={() => setShowOptional((v) => !v)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown
          className={cn('size-3.5 transition-transform duration-200', showOptional && 'rotate-180')}
        />
        {showOptional ? 'Hide' : 'Add'} company details (optional)
      </button>

      <AnimatePresence initial={false}>
        {showOptional && (
          <motion.div
            key="optional"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div>
                <Label htmlFor="companyName" className="text-xs text-muted-foreground">
                  Company
                </Label>
                <Input
                  id="companyName"
                  {...register('companyName')}
                  placeholder="Acme Corp"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-xs text-muted-foreground">
                  Role
                </Label>
                <Input
                  id="role"
                  {...register('role')}
                  placeholder="CTO, DevOps Lead…"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="teamSize" className="text-xs text-muted-foreground">
                  Team size
                </Label>
                <SelectField
                  value={teamSizeValue}
                  onValueChange={(v) => setValue('teamSize', v as (typeof TEAM_SIZES)[number])}
                  placeholder="Select…"
                  className="mt-1 h-9 text-sm"
                >
                  {TEAM_SIZES.map((s) => (
                    <SelectOption key={s} value={s} label={s} />
                  ))}
                </SelectField>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {serverError && <p className="text-xs text-destructive">{serverError}</p>}
    </form>
  );
}
