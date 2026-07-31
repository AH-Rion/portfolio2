import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen, Loader2, Reply } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchMessages } from '@/lib/queries';
import { useToast } from '@/lib/toast';
import type { ContactMessage } from '@/lib/types';

export default function MessagesInbox() {
  const toast = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchMessages()
      .then(setMessages)
      .catch(() => toast('Could not load messages.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const toggleRead = async (m: ContactMessage) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: !m.read })
      .eq('id', m.id);
    if (error) return toast(error.message, 'error');
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) return toast(error.message, 'error');
    if (active === id) setActive(null);
    toast('Message deleted.', 'success');
    load();
  };

  const unread = messages.filter((m) => !m.read).length;
  const activeMsg = messages.find((m) => m.id === active);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            {messages.length} total · {unread} unread
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        {/* list */}
        <div className="space-y-2">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          ) : messages.length === 0 ? (
            <p className="text-slate-500">No messages yet.</p>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActive(m.id);
                  if (!m.read) toggleRead(m);
                }}
                className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                  active === m.id
                    ? 'border-cyan-glow/40 bg-cyan-glow/5'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                {m.read ? (
                  <MailOpen className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate text-sm ${m.read ? 'text-slate-300' : 'font-semibold text-white'}`}>
                      {m.name}
                    </p>
                    <span className="shrink-0 font-mono text-[10px] text-slate-600">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{m.message}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* detail */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          {activeMsg ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-mono text-lg font-bold text-white">{activeMsg.name}</h2>
                  <a
                    href={`mailto:${activeMsg.email}`}
                    className="text-sm text-cyan-400 hover:underline"
                  >
                    {activeMsg.email}
                  </a>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${activeMsg.email}?subject=Re: your message`}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-cyan-300"
                    aria-label="Reply"
                  >
                    <Reply className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => remove(activeMsg.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-fuchsia-400"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {new Date(activeMsg.created_at).toLocaleString()}
              </p>
              <div className="mt-4 whitespace-pre-line rounded-lg border border-white/5 bg-ink-950/40 p-4 text-sm leading-relaxed text-slate-200">
                {activeMsg.message}
              </div>
            </div>
          ) : (
            <div className="grid h-full min-h-[200px] place-items-center text-center">
              <p className="text-sm text-slate-500">Select a message to read it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
