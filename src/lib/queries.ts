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

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
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
