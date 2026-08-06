import { supabase } from './supabase';
import type {
  HeroContent,
  AboutContent,
  FooterContent,
  Skill,
  Project,
  Experience,
  Certificate,
  ContactMessage,
} from './types';

export async function fetchHero(): Promise<HeroContent | null> {
  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('key', 'hero')
    .maybeSingle();
  return (data?.data as unknown as HeroContent) ?? null;
}

export async function fetchAbout(): Promise<AboutContent | null> {
  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('key', 'about')
    .maybeSingle();
  return (data?.data as unknown as AboutContent) ?? null;
}

export async function fetchFooter(): Promise<FooterContent | null> {
  const { data } = await supabase
    .from('site_content')
    .select('data')
    .eq('key', 'footer')
    .maybeSingle();
  return (data?.data as unknown as FooterContent) ?? null;
}

export async function upsertContent(key: string, data: Record<string, unknown>) {
  return supabase
    .from('site_content')
    .upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: 'key' });
}

export async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Normalizes a raw DB row into a safe Project, or null if corrupted/missing required fields. */
function normalizeProject(row: Record<string, unknown> | null | undefined): Project | null {
  if (!row || typeof row !== 'object') return null;
  const id = row.id;
  const title = row.title;
  if (typeof id !== 'string' || typeof title !== 'string') return null;
  return {
    id,
    title,
    description: typeof row.description === 'string' ? row.description : null,
    tech_stack: Array.isArray(row.tech_stack) ? (row.tech_stack as string[]).filter((t) => typeof t === 'string') : [],
    github_url: typeof row.github_url === 'string' ? row.github_url : null,
    live_url: typeof row.live_url === 'string' ? row.live_url : null,
    image_url: typeof row.image_url === 'string' ? row.image_url : null,
    sort_order: typeof row.sort_order === 'number' ? row.sort_order : 0,
    created_at: typeof row.created_at === 'string' ? row.created_at : undefined,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('[fetchProjects] Supabase error:', error.message);
    throw error;
  }
  if (!Array.isArray(data)) return [];
  const valid: Project[] = [];
  for (const row of data) {
    const p = normalizeProject(row as Record<string, unknown>);
    if (p) valid.push(p);
    else console.warn('[fetchProjects] Ignoring corrupted project record:', row);
  }
  return valid;
}

export async function fetchExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
