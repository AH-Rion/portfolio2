import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, ArrowUp, ArrowDown, X, Save, Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchProjects } from '@/lib/queries';
import { useToast } from '@/lib/toast';
import { Button, Label, Input, TextArea, AdminCard } from '@/components/admin/AdminUI';
import ImageUploader from '@/components/admin/AdminUI';
import type { Project } from '@/lib/types';

interface Draft {
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  image_url: string;
  sort_order: number;
}

const EMPTY: Draft = {
  title: '',
  description: '',
  tech_stack: [],
  github_url: '',
  live_url: '',
  image_url: '',
  sort_order: 0,
};

export default function ProjectsEditor() {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchProjects()
      .then(setProjects)
      .catch(() => toast('Could not load projects.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const startNew = () => {
    setEditing(null);
    setDraft({ ...EMPTY, sort_order: projects.length });
    setTagInput('');
  };

  const startEdit = (p: Project) => {
    setEditing(p);
    setDraft({
      title: p.title,
      description: p.description ?? '',
      tech_stack: p.tech_stack ?? [],
      github_url: p.github_url ?? '',
      live_url: p.live_url ?? '',
      image_url: p.image_url ?? '',
      sort_order: p.sort_order,
    });
    setTagInput('');
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!draft.tech_stack.includes(t)) {
      setDraft((d) => ({ ...d, tech_stack: [...d.tech_stack, t] }));
    }
    setTagInput('');
  };

  const save = async () => {
    if (!draft.title.trim()) return toast('Title is required.', 'error');
    setSaving(true);
    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      tech_stack: draft.tech_stack,
      github_url: draft.github_url.trim() || null,
      live_url: draft.live_url.trim() || null,
      image_url: draft.image_url.trim() || null,
      sort_order: draft.sort_order,
    };
    const { error } = editing
      ? await supabase.from('projects').update(payload).eq('id', editing.id)
      : await supabase.from('projects').insert(payload);
    setSaving(false);
    if (error) return toast(error.message, 'error');
    toast(editing ? 'Project updated.' : 'Project added.', 'success');
    setEditing(null);
    setDraft(EMPTY);
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return toast(error.message, 'error');
    toast('Project deleted.', 'success');
    load();
  };

  const move = async (p: Project, dir: -1 | 1) => {
    const idx = projects.findIndex((x) => x.id === p.id);
    const swap = projects[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from('projects').update({ sort_order: swap.sort_order }).eq('id', p.id),
      supabase.from('projects').update({ sort_order: p.sort_order }).eq('id', swap.id),
    ]);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Add and manage your project cards.</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="h-4 w-4" /> New project
        </Button>
      </div>

      {(editing || (projects.length === 0 && !loading)) && (
        <AdminCard className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm font-semibold text-white">
              {editing ? 'Edit project' : 'New project'}
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
            <div>
              <Label>Description</Label>
              <TextArea
                rows={3}
                value={draft.description ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>GitHub URL</Label>
                <Input value={draft.github_url ?? ''} onChange={(e) => setDraft((d) => ({ ...d, github_url: e.target.value }))} />
              </div>
              <div>
                <Label>Live URL</Label>
                <Input value={draft.live_url ?? ''} onChange={(e) => setDraft((d) => ({ ...d, live_url: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label>Tech stack tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Type a tag and press Enter"
                />
                <Button variant="ghost" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {draft.tech_stack.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 rounded border border-cyan-glow/20 bg-cyan-glow/5 px-2 py-0.5 font-mono text-xs text-cyan-300"
                    >
                      {t}
                      <button
                        onClick={() =>
                          setDraft((d) => ({ ...d, tech_stack: d.tech_stack.filter((x) => x !== t) }))
                        }
                        className="hover:text-fuchsia-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <ImageUploader
              label="Thumbnail"
              folder="projects"
              url={draft.image_url}
              onChange={(url) => setDraft((d) => ({ ...d, image_url: url }))}
            />

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
          projects.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => move(p, -1)}
                  disabled={i === 0}
                  className="text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(p, 1)}
                  disabled={i === projects.length - 1}
                  className="text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="h-10 w-16 rounded object-cover" />
              ) : (
                <div className="grid h-10 w-16 place-items-center rounded bg-ink-700 font-mono text-xs text-white/20">
                  {p.title.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-100">{p.title}</p>
                {p.tech_stack.length > 0 && (
                  <p className="font-mono text-xs text-slate-500">{p.tech_stack.join(' · ')}</p>
                )}
              </div>
              <button
                onClick={() => startEdit(p)}
                className="text-slate-400 hover:text-cyan-300"
                aria-label="Edit project"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(p.id)}
                className="text-slate-500 hover:text-fuchsia-400"
                aria-label="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
        {!loading && projects.length === 0 && !editing && (
          <p className="text-slate-500">No projects yet — create your first one.</p>
        )}
      </div>
    </div>
  );
}
