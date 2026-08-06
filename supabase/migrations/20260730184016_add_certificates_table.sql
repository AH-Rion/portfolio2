/*
# Add certificates table for portfolio

Adds a new `certificates` table backing the new public Certificates section and its admin editor.

## 1. New Tables
- `certificates`
  - `id` (uuid, primary key)
  - `title` (text, not null) — certificate title
  - `organization` (text) — issuing organization
  - `issue_date` (text) — free-form issue date, e.g. "Mar 2024"
  - `skills` (text array) — skills learned
  - `credential_id` (text, optional) — credential identifier
  - `certificate_url` (text, optional) — link to view/verify the certificate
  - `image_url` (text, optional) — certificate image
  - `sort_order` (int, default 0)
  - `created_at` (timestamptz)

## 2. Security (RLS)
- Public (anon + authenticated) can READ certificates.
- Authenticated admin can INSERT / UPDATE / DELETE.
- Policies split per CRUD verb (no FOR ALL).

## 3. Notes
- Public read mirrors the other content tables (skills, projects, experience).
- Seed data inserts four sample certificates so the section renders immediately.
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  issue_date text,
  skills text[] NOT NULL DEFAULT '{}',
  credential_id text,
  certificate_url text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_certificates" ON certificates;
CREATE POLICY "public_read_certificates" ON certificates
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_certificates" ON certificates;
CREATE POLICY "admin_insert_certificates" ON certificates
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_certificates" ON certificates;
CREATE POLICY "admin_update_certificates" ON certificates
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_certificates" ON certificates;
CREATE POLICY "admin_delete_certificates" ON certificates
  FOR DELETE TO authenticated USING (true);

-- Seed sample certificates
INSERT INTO certificates (title, organization, issue_date, skills, credential_id, certificate_url, image_url, sort_order) VALUES
  ('Meta Front-End Developer', 'Meta', 'Feb 2024', ARRAY['React','TypeScript','UI/UX','Accessibility'], 'META-FED-2024-0192', 'https://example.com/cert/meta-fed', '', 1),
  ('AWS Certified Cloud Practitioner', 'Amazon Web Services', 'Nov 2023', ARRAY['AWS','Cloud','DevOps'], 'AWS-CCP-2023-7741', 'https://example.com/cert/aws-ccp', '', 2),
  ('Three.js Journey', 'Bruno Simon', 'Aug 2023', ARRAY['Three.js','WebGL','GLSL','3D Math'], 'TJJ-2023-4408', 'https://example.com/cert/threejs', '', 3),
  ('Responsive Web Design', 'freeCodeCamp', 'May 2022', ARRAY['HTML','CSS','Flexbox','Grid'], 'FCC-RWD-2022-1187', 'https://example.com/cert/fcc-rwd', '', 4)
  ON CONFLICT DO NOTHING;
