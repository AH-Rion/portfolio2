-- =============================================================
-- Portfolio schema + RLS policies
-- This SQL has already been applied to your Supabase project.
-- Keep this file as a reference — you can also run it in the
-- Supabase SQL Editor if you ever recreate the project.
-- =============================================================

-- ===== site_content =====
-- keyed single-row store for hero / about / footer text fields
CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_site_content" ON site_content
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_insert_site_content" ON site_content
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_site_content" ON site_content
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_site_content" ON site_content
  FOR DELETE TO authenticated USING (true);

-- ===== skills =====
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_skills" ON skills
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_insert_skills" ON skills
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_skills" ON skills
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_skills" ON skills
  FOR DELETE TO authenticated USING (true);

-- ===== projects =====
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  tech_stack text[] NOT NULL DEFAULT '{}',
  github_url text,
  live_url text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_projects" ON projects
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_insert_projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_projects" ON projects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_projects" ON projects
  FOR DELETE TO authenticated USING (true);

-- ===== experience =====
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  description text,
  start_date text,
  end_date text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_experience" ON experience
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_insert_experience" ON experience
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_experience" ON experience
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_experience" ON experience
  FOR DELETE TO authenticated USING (true);

-- ===== contact_messages =====
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can submit; reads are admin-only to prevent scraping.
CREATE POLICY "public_insert_contact_messages" ON contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_read_contact_messages" ON contact_messages
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_update_contact_messages" ON contact_messages
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_contact_messages" ON contact_messages
  FOR DELETE TO authenticated USING (true);

-- ===== Storage bucket + policies =====
insert into storage.buckets (id, name, public) values ('portfolio-assets', 'portfolio-assets', true) on conflict (id) do nothing;

CREATE POLICY "public_read_portfolio_assets" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-assets');
CREATE POLICY "admin_insert_portfolio_assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "admin_update_portfolio_assets" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "admin_delete_portfolio_assets" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets');

-- ===== Seed data (already inserted) =====
INSERT INTO site_content (key, data) VALUES
  ('hero', '{"name":"Alex Carter","tagline":"Building elegant, performant software at the edge of the web.","roles":["Software Engineer","CS Student","Open Source Contributor","Creative Technologist"],"profile_image_url":""}') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_content (key, data) VALUES
  ('about', '{"bio":"I am a computer science student and software engineer...","about_image_url":"","highlights":["3+ years building for the web","Open source contributor","Passionate about 3D & motion"]}') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_content (key, data) VALUES
  ('footer', '{"text":"Alex Carter — Crafted with code and caffeine.","socials":[{"label":"GitHub","url":"https://github.com/","icon":"github"},{"label":"LinkedIn","url":"https://linkedin.com/","icon":"linkedin"},{"label":"Email","url":"mailto:hello@example.com","icon":"mail"}]}') ON CONFLICT (key) DO NOTHING;
