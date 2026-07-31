import { useEffect, useState } from 'react';
import { Loader2, Save, Plus, X } from 'lucide-react';
import { fetchAbout, upsertContent } from '@/lib/queries';
import { useToast } from '@/lib/toast';
import { AdminCard, Label, TextArea, Button } from '@/components/admin/AdminUI';
import ImageUploader from '@/components/admin/AdminUI';
import type { AboutContent } from '@/lib/types';
import { Header } from '@/components/admin/editors/HeroEditor';

export default function AboutEditor() {
  const toast = useToast();
  const [data, setData] = useState<AboutContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAbout().then(setData).catch(() => toast('Could not load about.', 'error'));
  }, [toast]);

  if (!data)
    return <Loader2 className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />;

  const update = (patch: Partial<AboutContent>) =>
    setData((d) => (d ? { ...d, ...patch } : d));

  const save = async () => {
    setSaving(true);
    const { error } = await upsertContent('about', data as unknown as Record<string, unknown>);
    setSaving(false);
    toast(error ? error.message : 'About saved.', error ? 'error' : 'success');
  };

  return (
    <div>
      <Header title="About" subtitle="Your bio and about photo." onSave={save} saving={saving} />

      <div className="mt-6 space-y-6">
        <AdminCard>
          <Label>Bio</Label>
          <TextArea
            rows={8}
            value={data.bio}
            onChange={(e) => update({ bio: e.target.value })}
            placeholder="Tell visitors about yourself..."
          />
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <Label>Highlights</Label>
            <button
              onClick={() => update({ highlights: [...data.highlights, 'New highlight'] })}
              className="flex items-center gap-1 font-mono text-xs text-cyan-300 hover:text-cyan-200"
            >
              <Plus className="h-3.5 w-3.5" /> Add highlight
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {data.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={h}
                  onChange={(e) => {
                    const highlights = [...data.highlights];
                    highlights[i] = e.target.value;
                    update({ highlights });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-glow/50"
                />
                <button
                  onClick={() => update({ highlights: data.highlights.filter((_, idx) => idx !== i) })}
                  className="text-slate-500 hover:text-fuchsia-400"
                  aria-label="Remove highlight"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <ImageUploader
            label="About photo"
            folder="about"
            url={data.about_image_url}
            onChange={(url) => update({ about_image_url: url })}
            aspect="aspect-[4/5] max-w-[240px]"
          />
        </AdminCard>
      </div>
    </div>
  );
}
