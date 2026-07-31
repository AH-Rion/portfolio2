import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchSkills } from '@/lib/queries';
import { useToast } from '@/lib/toast';
import { Button } from '@/components/admin/AdminUI';
import type { Skill } from '@/lib/types';

export default function SkillsEditor() {
  const toast = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', category: '' });

  const load = () => {
    setLoading(true);
    fetchSkills()
      .then(setSkills)
      .catch(() => toast('Could not load skills.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const add = async () => {
    if (!draft.name.trim()) return;
    const sort_order = skills.length ? Math.max(...skills.map((s) => s.sort_order)) + 1 : 0;
    const { error } = await supabase
      .from('skills')
      .insert({ name: draft.name.trim(), category: draft.category.trim() || null, sort_order });
    if (error) return toast(error.message, 'error');
    setDraft({ name: '', category: '' });
    setAdding(false);
    toast('Skill added.', 'success');
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) return toast(error.message, 'error');
    toast('Skill removed.', 'success');
    load();
  };

  const move = async (skill: Skill, dir: -1 | 1) => {
    const idx = skills.findIndex((s) => s.id === skill.id);
    const swap = skills[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from('skills').update({ sort_order: swap.sort_order }).eq('id', skill.id),
      supabase.from('skills').update({ sort_order: skill.sort_order }).eq('id', swap.id),
    ]);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white">Skills</h1>
          <p className="mt-1 text-sm text-slate-500">Add, remove, and reorder skill tags.</p>
        </div>
        <Button onClick={() => setAdding((a) => !a)}>
          <Plus className="h-4 w-4" /> Add skill
        </Button>
      </div>

      {adding && (
        <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-[1fr_1fr_auto]">
          <input
            placeholder="Skill name"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-glow/50"
          />
          <input
            placeholder="Category (optional)"
            value={draft.category}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-glow/50"
          />
          <Button onClick={add}>Save</Button>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        ) : (
          skills.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => move(s, -1)}
                  disabled={i === 0}
                  className="text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(s, 1)}
                  disabled={i === skills.length - 1}
                  className="text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-100">{s.name}</p>
                {s.category && (
                  <p className="font-mono text-xs text-cyan-400">{s.category}</p>
                )}
              </div>
              <button
                onClick={() => remove(s.id)}
                className="text-slate-500 hover:text-fuchsia-400"
                aria-label="Delete skill"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
        {!loading && skills.length === 0 && (
          <p className="text-slate-500">No skills yet — add your first one.</p>
        )}
      </div>
    </div>
  );
}
