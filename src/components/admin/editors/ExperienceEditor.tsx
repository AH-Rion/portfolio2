import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, ArrowUp, ArrowDown, X, Save, Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchExperience } from '@/lib/queries';
import { useToast } from '@/lib/toast';
import { Button, Label, Input, TextArea, AdminCard } from '@/components/admin/AdminUI';
import type { Experience } from '@/lib/types';

interface Draft {
  title: string;
  organization: string;
  description: string;
  start_date: string;
  end_date: string;
  sort_order: number;
}

const EMPTY: Draft = {
  title: '',
  organization: '',
  description: '',
  start_date: '',
  end_date: '',
  sort_order: 0,
};

export default function ExperienceEditor() {
  const toast = useToast();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchExperience()
      .then(setItems)
      .catch(() => toast('Could not load experience.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const startNew = () => {
    setEditing(null);
    setDraft({ ...EMPTY, sort_order: items.length });
  };

  const startEdit = (e: Experience) => {
    setEditing(e);
    setDraft({
      title: e.title,
      organization: e.organization ?? '',
      description: e.description ?? '',
      start_date: e.start_date ?? '',
      end_date: e.end_date ?? '',
      sort_order: e.sort_order,
    });
  };

  const save = async () => {
    if (!draft.title.trim()) return toast('Title is required.', 'error');
    setSaving(true);
    const payload = {
      title: draft.title.trim(),
      organization: draft.organization.trim() || null,
      description: draft.description.trim() || null,
      start_date: draft.start_date.trim() || null,
      end_date: draft.end_date.trim() || null,
      sort_order: draft.sort_order,
    };
    const { error } = editing
      ? await supabase.from('experience').update(payload).eq('id', editing.id)
      : await supabase.from('experience').insert(payload);
    setSaving(false);
    if (error) return toast(error.message, 'error');
    toast(editing ? 'Entry updated.' : 'Entry added.', 'success');
    setEditing(null);
    setDraft(EMPTY);
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) return toast(error.message, 'error');
    toast('Entry deleted.', 'success');
    load();
  };

  const move = async (e: Experience, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === e.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from('experience').update({ sort_order: swap.sort_order }).eq('id', e.id),
      supabase.from('experience').update({ sort_order: e.sort_order }).eq('id', swap.id),
    ]);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white">Experience</h1>
          <p className="mt-1 text-sm text-slate-500">Timeline entries — work and education.</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="h-4 w-4" /> New entry
        </Button>
      </div>

      {(editing || (items.length === 0 && !loading)) && (
        <AdminCard className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm font-semibold text-white">
              {editing ? 'Edit entry' : 'New entry'}
            </h2>
            {editing && (
              <button
                onClick={() => {
                  setEditing(null);
                  setDraft(EMPTY);
                }}
                className="text-slate-400 hover:text-fuchsia-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Organization / Company</Label>
                <Input value={draft.organization} onChange={(e) => setDraft((d) => ({ ...d, organization: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start</Label>
                  <Input value={draft.start_date} onChange={(e) => setDraft((d) => ({ ...d, start_date: e.target.value }))} placeholder="2023" />
                </div>
                <div>
                  <Label>End</Label>
                  <Input value={draft.end_date} onChange={(e) => setDraft((d) => ({ ...d, end_date: e.target.value }))} placeholder="Present" />
                </div>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <TextArea rows={3} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
            </div>
            <div className="flex justify-end">
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </AdminCard>
      )}

      <div className="mt-6 space-y-2">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        ) : (
          items.map((e, i) => (
            <div
              key={e.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => move(e, -1)}
                  disabled={i === 0}
                  className="text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(e, 1)}
                  disabled={i === items.length - 1}
                  className="text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-100">{e.title}</p>
                <p className="text-xs text-slate-500">
                  {e.organization}
                  {e.start_date && ` · ${e.start_date}${e.end_date ? ` — ${e.end_date}` : ''}`}
                </p>
              </div>
              <button onClick={() => startEdit(e)} className="text-slate-400 hover:text-cyan-300" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => remove(e.id)} className="text-slate-500 hover:text-fuchsia-400" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
        {!loading && items.length === 0 && !editing && (
          <p className="text-slate-500">No entries yet — create your first one.</p>
        )}
      </div>
    </div>
  );
}
