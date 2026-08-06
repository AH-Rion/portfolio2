import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/toast';
import { SectionHeading } from '@/components/Reveal';

export default function Contact() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast('Please fill out every field.', 'error');
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({ name: name.trim(), email: email.trim(), message: message.trim() });
      if (error) throw error;
      toast('Message sent — thanks for reaching out!', 'success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      toast(
        err instanceof Error ? err.message : 'Could not send message. Please try again.',
        'error'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading label="06 — Contact" title="Let's build something" align="center" />

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto mt-12 w-full max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Ada Lovelace"
              autoComplete="name"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="ada@example.com"
              autoComplete="email"
            />
          </Field>
        </div>
        <Field label="Message">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="input resize-none"
            placeholder="Tell me about your project, role, or idea..."
          />
        </Field>

        <button
          type="submit"
          disabled={sending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-glow to-electric-glow px-6 py-3 font-mono text-sm font-semibold text-ink-950 transition-all hover:shadow-glow-cyan disabled:opacity-60"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? 'Sending...' : 'Send message'}
        </button>
      </motion.form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: #e2e8f0;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .input::placeholder { color: #64748b; }
        .input:focus {
          border-color: rgba(34,211,238,0.5);
          box-shadow: 0 0 0 3px rgba(34,211,238,0.12);
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}
