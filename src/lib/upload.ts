import { useState } from 'react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';

/** Uploads a file to the portfolio-assets bucket and returns its public URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Hook returning a file picker handler + uploading state. */
export function useImageUpload(
  folder: string,
  onDone: (url: string) => void
) {
  const [uploading, setUploading] = useState(false);

  const handle = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onDone(url);
    } catch (err) {
      console.error('[useImageUpload] upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, handle };
}
