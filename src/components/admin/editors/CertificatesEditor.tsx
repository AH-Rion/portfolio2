import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, ArrowUp, ArrowDown, X, Save, Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchCertificates } from '@/lib/queries';
import { useToast } from '@/lib/toast';
import { Button, Label, Input, TextArea, AdminCard } from '@/components/admin/AdminUI';
import ImageUploader from '@/components/admin/AdminUI';
import type { Certificate } from '@/lib/types';

interface Draft {
  title: string;
  organization: string;
  issue_date: string;
  skills: string[];
  credential_id: string;
  certificate_url: string;
  image_url: string;
  sort_order: number;
}

const EMPTY: Draft = {
  title: '',
  organization: '',
  issue_date: '',
  skills: [],
  credential_id: '',
  certificate_url: '',
  image_url: '',
  sort_order: 0,
};

export default function CertificatesEditor() {
  const toast = useToast();
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchCertificates()
      .then(setItems)
      .catch(() => toast('Could not load certificates.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [toast]);

  const startNew = () => {
    setEditing(null);
    setDraft({ ...EMPTY, sort_order: items.length });
    setTagInput('');
  };

  const startEdit = (c: Certificate) => {
    setEditing(c);
    setDraft({
      title: c.title,
      organization: c.organization ?? '',
      issue_date: c.issue_date ?? '',
      skills: c.skills ?? [],
      credential_id: c.credential_id ?? '',
      certificate_url: c.certificate_url ?? '',
      image_url: c.image_url ?? '',
      sort_order: c.sort_order,
    });
    setTagInput('');
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!draft.skills.includes(t)) {
      setDraft((d) => ({ ...d, skills: [...d.skills, t] }));
    }
    setTagInput('');
  };

  const save = async () => {
    if (!draft.title.trim()) return toast('Title is required.', 'error');
    setSaving(true);
    const payload = {
      title: draft.title.trim(),
      organization: draft.organization.trim() || null,
      issue_date: draft.issue_date.trim() || null,
      skills: draft.skills,
      credential_id: draft.credential_id.trim() || null,
      certificate_url: draft.certificate_url.trim() || null,
      image_url: draft.image_url.trim() || null,
      sort_order: draft.sort_order,
    };
    const { error } = editing
      ? await supabase.from('certificates').update(payload).eq('id', editing.id)
      : await supabase.from('certificates').insert(payload);
    setSaving(false);
    if (error) return toast(error.message, 'error');
    toast(editing ? 'Certificate updated.' : 'Certificate added.', 'success');
    setEditing(null);
    setDraft(EMPTY);
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) return toast(error.message, 'error');
    toast('Certificate deleted.', 'success');
    load();
  };

  const move = async (c: Certificate, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === c.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from('certificates').update({ sort_order: swap.sort_order }).eq('id', c.id),
      supabase.from('certificates').update({ sort_order: c.sort_order }).eq('id', swap.id),
    ]);
    load();
  };

  const formOpen = editing || (items.length === 0 && !loading);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white">Certificates</h1>
          <p className="mt-1 text-sm text-slate-500">Add and manage your certifications.</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="h-4 w-4" /> New certificate
        </Button>
      </div>

      {formOpen && (
        <AdminCard className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm font-semibold text-white">
              {editing ? 'Edit certificate' : 'New certificate'}
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
                <Label>Issuing organization</Label>
                <Input value={draft.organization} onChange={(e) => setDraft((d) => ({ ...d, organization: e.target.value }))} />
              </div>
              <div>
                <Label>Issue date</Label>
                <Input value={draft.issue_date} onChange={(e) => setDraft((d) => ({ ...d, issue_date: e.target.value }))} placeholder="Mar 2024" />
              </div>
            </div>

            <div>
              <Label>Skills learned</Label>
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
                  placeholder="Type a skill and press Enter"
                />
                <Button variant="ghost" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {draft.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.skills.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 rounded border border-cyan-glow/20 bg-cyan-glow/5 px-2 py-0.5 font-mono text-xs text-cyan-300"
                    >
                      {t}
                      <button
                        onClick={() =>
                          setDraft((d) => ({ ...d, skills: d.skills.filter((x) => x !== t) }))
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Credential ID (optional)</Label>
                <Input value={draft.credential_id} onChange={(e) => setDraft((d) => ({ ...d, credential_id: e.target.value }))} />
              </div>
              <div>
                <Label>Certificate URL (optional)</Label>
                <Input value={draft.certificate_url} onChange={(e) => setDraft((d) => ({ ...d, certificate_url: e.target.value }))} placeholder="https://..." />
              </div>
            </div>

            <ImageUploader
              label="Certificate image (optional)"
              folder="certificates"
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
          items.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => move(c, -1)}
                  disabled={i === 0}
                  className="text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(c, 1)}
                  disabled={i === items.length - 1}
                  className="text-slate-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-100">{c.title}</p>
                <p className="text-xs text-slate-500">
                  {c.organization}
                  {c.issue_date && ` · ${c.issue_date}`}
                </p>
              </div>
              <button onClick={() => startEdit(c)} className="text-slate-400 hover:text-cyan-300" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => remove(c.id)} className="text-slate-500 hover:text-fuchsia-400" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
        {!loading && items.length === 0 && !editing && (
          <p className="text-slate-500">No certificates yet — create your first one.</p>
        )}
      </div>
    </div>
  );
}
