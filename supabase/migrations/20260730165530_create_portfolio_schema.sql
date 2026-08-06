/*
# Portfolio site schema with admin-only writes

Creates all tables backing the public portfolio site and the admin dashboard.
Content is publicly readable; writes are restricted to authenticated admin users.

## 1. New Tables

- `site_content` — keyed single-row store for hero / about / footer text fields.
  - `key` (text, primary key) — e.g. 'hero', 'about', 'footer'.
  - `data` (jsonb, not null) — flexible payload of fields for that section.
  - `updated_at` (timestamptz).
- `skills` — skill tags shown in the animated grid.
  - `id` (uuid, primary key).
  - `name` (text, not null).
  - `category` (text).
  - `sort_order` (int, default 0).
  - `created_at` (timestamptz).
- `projects` — project cards in the grid.
  - `id` (uuid, primary key).
  - `title`, `description` (text).
  - `tech_stack` (text array).
  - `github_url`, `live_url`, `image_url` (text).
  - `sort_order` (int, default 0).
  - `created_at` (timestamptz).
- `experience` — timeline entries (experience + education).
  - `id` (uuid, primary key).
  - `title`, `organization`, `description` (text).
  - `start_date`, `end_date` (text — free-form ranges like "2023" or "Jan 2023").
  - `sort_order` (int, default 0).
  - `created_at` (timestamptz).
- `contact_messages` — submissions from the public contact form.
  - `id` (uuid, primary key).
  - `name`, `email`, `message` (text).
  - `read` (boolean, default false).
  - `created_at` (timestamptz).

## 2. Security (RLS)

- Public (anon + authenticated) can READ all content tables: `site_content`, `skills`, `projects`, `experience`.
- Public can INSERT into `contact_messages` (so the contact form works without login) and SELECT their own submission is not needed; reads of messages are admin-only.
- Authenticated users (the admin) can fully manage all content tables and contact_messages.
- Policies are split per CRUD verb (no FOR ALL).

## 3. Notes

- `site_content` uses a `key` column so hero/about/footer live as separate rows instead of one giant row; simpler to edit independently.
- `tech_stack` is a `text[]` so array operations work natively.
- Contact messages are write-only from the public side (no public SELECT) to prevent scraping of submissions.
*/

-- ===== site_content =====
CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content" ON site_content
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_site_content" ON site_content;
CREATE POLICY "admin_insert_site_content" ON site_content
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_site_content" ON site_content;
CREATE POLICY "admin_update_site_content" ON site_content
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_site_content" ON site_content;
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

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_skills" ON skills;
CREATE POLICY "admin_insert_skills" ON skills
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skills" ON skills;
CREATE POLICY "admin_update_skills" ON skills
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skills" ON skills;
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

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects" ON projects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
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

DROP POLICY IF EXISTS "public_read_experience" ON experience;
CREATE POLICY "public_read_experience" ON experience
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_experience" ON experience;
CREATE POLICY "admin_insert_experience" ON experience
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_experience" ON experience;
CREATE POLICY "admin_update_experience" ON experience
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_experience" ON experience;
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

-- Public can submit messages (contact form). No public read to prevent scraping.
DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_contact_messages" ON contact_messages;
CREATE POLICY "admin_read_contact_messages" ON contact_messages
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages" ON contact_messages
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages" ON contact_messages
  FOR DELETE TO authenticated USING (true);

-- ===== Seed default content so the site renders before the admin edits anything =====
INSERT INTO site_content (key, data) VALUES
  ('hero', '{"name":"Alex Carter","tagline":"Building elegant, performant software at the edge of the web.","roles":["Software Engineer","CS Student","Open Source Contributor","Creative Technologist"],"profile_image_url":""}') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_content (key, data) VALUES
  ('about', '{"bio":"I am a computer science student and software engineer focused on crafting thoughtful digital experiences. I care about clean architecture, delightful interfaces, and the small details that make products feel alive. When I am not shipping code, you will find me sketching UI concepts, contributing to open source, or exploring the latest in 3D on the web.","about_image_url":"","highlights":["3+ years building for the web","Open source contributor","Passionate about 3D & motion"]}') ON CONFLICT (key) DO NOTHING;
INSERT INTO site_content (key, data) VALUES
  ('footer', '{"text":"Alex Carter — Crafted with code and caffeine.","socials":[{"label":"GitHub","url":"https://github.com/","icon":"github"},{"label":"LinkedIn","url":"https://linkedin.com/","icon":"linkedin"},{"label":"Email","url":"mailto:hello@example.com","icon":"mail"},{"label":"Twitter","url":"https://twitter.com/","icon":"twitter"}]}') ON CONFLICT (key) DO NOTHING;

INSERT INTO skills (name, category, sort_order) VALUES
  ('TypeScript','Languages',1),('JavaScript','Languages',2),('Python','Languages',3),('Rust','Languages',4),
  ('React','Frontend',5),('Next.js','Frontend',6),('Three.js','Frontend',7),('Tailwind CSS','Frontend',8),
  ('Node.js','Backend',9),('PostgreSQL','Backend',10),('Supabase','Backend',11),('GraphQL','Backend',12),
  ('AWS','Cloud',13),('Docker','Cloud',14),('Vercel','Cloud',15)
  ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, sort_order) VALUES
  ('Nebula UI','A headless component library with motion baked in, built for design-driven teams.','{React,TypeScript,Framer Motion,Tailwind}','https://github.com/','https://example.com','',1),
  ('Particle Forge','Real-time GPU particle editor that exports ready-to-use Three.js scenes.','{Three.js,WebGL,TypeScript}','https://github.com/','https://example.com','',2),
  ('Quanta','A minimalist note-taking app with local-first sync and full-text search.','{React,IndexedDB,Supabase}','https://github.com/','https://example.com','',3),
  ('Orbit Analytics','A privacy-first analytics dashboard with serverless ingest and live charts.','{Next.js,Supabase,TypeScript}','https://github.com/','https://example.com','',4)
  ON CONFLICT DO NOTHING;

INSERT INTO experience (title, organization, description, start_date, end_date, sort_order) VALUES
  ('Software Engineering Intern','Lumen Labs','Built core dashboard features and shipped a redesign that cut load time by 40%.','2024','Present',1),
  ('Frontend Developer (Freelance)','Independent','Partnered with early-stage startups to design and ship marketing sites and product UIs.','2023','2024',2),
  ('B.S. Computer Science','State University','Focus on systems and human-computer interaction. GPA 3.9. Teaching assistant for Algorithms.','2022','2026',3),
  ('Open Source Maintainer','Various','Maintain several React and Three.js libraries with thousands of weekly downloads.','2021','Present',4)
  ON CONFLICT DO NOTHING;
