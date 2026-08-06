import { useEffect, useState } from 'react';
import { Save, Loader2, Plus, X, Trash2 } from 'lucide-react';
import { fetchFooter, upsertContent } from '@/lib/queries';
import { useToast } from '@/lib/toast';
import { AdminCard, Label, Input, Button } from '@/components/admin/AdminUI';
import type { FooterContent, SocialLink } from '@/lib/types';
import { Header } from '@/components/admin/editors/HeroEditor';

const ICON_OPTIONS = ['github', 'linkedin', 'mail', 'facebook', 'email'];

export default function FooterEditor() {
  const toast = useToast();
  const [data, setData] = useState<FooterContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFooter().then(setData).catch(() => toast('Could not load footer.', 'error'));
  }, [toast]);

  if (!data)
    return <Loader2 className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />;

  const update = (patch: Partial<FooterContent>) =>
    setData((d) => (d ? { ...d, ...patch } : d));

  const updateSocial = (i: number, patch: Partial<SocialLink>) => {
    const socials = [...data.socials];
    socials[i] = { ...socials[i], ...patch };
    update({ socials });
  };

  const addSocial = () =>
    update({ socials: [...data.socials, { label: 'New link', url: 'https://', icon: 'github' }] });

  const removeSocial = (i: number) =>
    update({ socials: data.socials.filter((_, idx) => idx !== i) });

  const save = async () => {
    setSaving(true);
    const { error } = await upsertContent('footer', data as unknown as Record<string, unknown>);
    setSaving(false);
    toast(error ? error.message : 'Footer saved.', error ? 'error' : 'success');
  };

  return (
    <div>
      <Header title="Footer" subtitle="Social links and copyright text." onSave={save} saving={saving} />

      <div className="mt-6 space-y-6">
        <AdminCard>
          <Label>Footer text</Label>
          <Input value={data.text} onChange={(e) => update({ text: e.target.value })} />
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <Label>Social links</Label>
            <button
              onClick={addSocial}
              className="flex items-center gap-1 font-mono text-xs text-cyan-300 hover:text-cyan-200"
            >
              <Plus className="h-3.5 w-3.5" /> Add link
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {data.socials.map((s, i) => (
              <div key={i} className="grid gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:grid-cols-[1fr_1.4fr_auto_auto]">
                <Input
                  value={s.label}
                  onChange={(e) => updateSocial(i, { label: e.target.value })}
                  placeholder="Label"
                />
                <Input
                  value={s.url}
                  onChange={(e) => updateSocial(i, { url: e.target.value })}
                  placeholder="https://..."
                />
                <select
                  value={s.icon}
                  onChange={(e) => updateSocial(i, { icon: e.target.value })}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 text-sm text-slate-100 outline-none focus:border-cyan-glow/50"
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o} value={o} className="bg-ink-900">
                      {o}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeSocial(i)}
                  className="grid place-items-center rounded-lg border border-white/10 px-2 text-slate-500 hover:text-fuchsia-400"
                  aria-label="Remove link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {data.socials.length === 0 && (
              <p className="text-sm text-slate-500">No social links yet.</p>
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
