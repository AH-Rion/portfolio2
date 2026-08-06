/*
# Storage policies for portfolio-assets bucket

The bucket 'portfolio-assets' (public) stores hero/about/project images uploaded from the admin dashboard.
- Anyone can read (public bucket).
- Authenticated users (admin) can upload, update, delete files.

## Security
- SELECT (read) open to anon + authenticated so public images load.
- INSERT/UPDATE/DELETE restricted to authenticated.
*/

DROP POLICY IF EXISTS "public_read_portfolio_assets" ON storage.objects;
CREATE POLICY "public_read_portfolio_assets" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "admin_insert_portfolio_assets" ON storage.objects;
CREATE POLICY "admin_insert_portfolio_assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "admin_update_portfolio_assets" ON storage.objects;
CREATE POLICY "admin_update_portfolio_assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-assets') WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "admin_delete_portfolio_assets" ON storage.objects;
CREATE POLICY "admin_delete_portfolio_assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-assets');
