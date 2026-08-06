import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

export default function AdminLogin() {
  const { signIn, signUp } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast('Enter email and password.', 'error');
      return;
    }
    setBusy(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setBusy(false);
    if (error) {
      toast(error, 'error');
    } else if (mode === 'signup') {
      toast('Account created — you are signed in.', 'success');
    } else {
      toast('Welcome back.', 'success');
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center bg-ink-950 px-5">
      <div className="pointer-events-none absolute inset-0 bg-radial-faint" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-cyan-glow/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-electric-glow/15 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-ink-900/80 p-8 backdrop-blur-xl"
      >
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-cyan-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-cyan-glow to-electric-glow text-ink-950">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-mono text-lg font-bold text-white">Admin</h1>
            <p className="text-xs text-slate-500">Sign in to edit your portfolio</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-slate-400">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/15"
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-glow/50 focus:ring-2 focus:ring-cyan-glow/15"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-glow to-electric-glow px-4 py-2.5 font-mono text-sm font-semibold text-ink-950 transition-all hover:shadow-glow-cyan disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
            className="text-cyan-300 hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
