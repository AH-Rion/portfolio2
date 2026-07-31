import { useEffect, useState } from 'react';
import { Save, Loader2, Plus, X } from 'lucide-react';
import { fetchHero, upsertContent } from '@/lib/queries';
import { useToast } from '@/lib/toast';
import { AdminCard, Label, Input, Button } from '@/components/admin/AdminUI';
import ImageUploader from '@/components/admin/AdminUI';
import type { HeroContent } from '@/lib/types';

export default function HeroEditor() {
  const toast = useToast();
  const [data, setData] = useState<HeroContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHero().then(setData).catch(() => toast('Could not load hero.', 'error'));
  }, [toast]);

  if (!data) return <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />;

  const update = (patch: Partial<HeroContent>) => setData((d) => (d ? { ...d, ...patch } : d));

  const save = async () => {
    setSaving(true);
    const { error } = await upsertContent('hero', data as unknown as Record<string, unknown>);
    setSaving(false);
    toast(error ? error.message : 'Hero saved.', error ? 'error' : 'success');
  };

  return (
    <div>
      <Header title="Hero" subtitle="The first thing visitors see." onSave={save} saving={saving} />

      <div className="mt-6 space-y-6">
        <AdminCard>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input value={data.name} onChange={(e) => update({ name: e.target.value })} />
            </div>
          </div>
          <div className="mt-4">
            <Label>Tagline</Label>
            <Input
              value={data.tagline}
              onChange={(e) => update({ tagline: e.target.value })}
              placeholder="A short one-line description"
            />
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <Label>Rotating roles</Label>
            <button
              onClick={() => update({ roles: [...data.roles, 'New role'] })}
              className="flex items-center gap-1 font-mono text-xs text-cyan-300 hover:text-cyan-200"
            >
              <Plus className="h-3.5 w-3.5" /> Add role
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {data.roles.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={r}
                  onChange={(e) => {
                    const roles = [...data.roles];
                    roles[i] = e.target.value;
                    update({ roles });
                  }}
                />
                <button
                  onClick={() => update({ roles: data.roles.filter((_, idx) => idx !== i) })}
                  className="text-slate-500 hover:text-fuchsia-400"
                  aria-label="Remove role"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <ImageUploader
            label="Profile photo"
            folder="hero"
            url={data.profile_image_url}
            onChange={(url) => update({ profile_image_url: url })}
            aspect="aspect-square max-w-[200px]"
          />
        </AdminCard>
      </div>
    </div>
  );
}

export function Header({
  title,
  subtitle,
  onSave,
  saving,
}: {
  title: string;
  subtitle: string;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-mono text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <Button onClick={onSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save
      </Button>
    </div>
  );
}
