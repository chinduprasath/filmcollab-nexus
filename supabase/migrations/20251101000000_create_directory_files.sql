-- Create the directory_files table
CREATE TABLE IF NOT EXISTS public.directory_files (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_type text NOT NULL, -- e.g., 'images', 'videos', 'documents', 'audios'
  file_url text NOT NULL,
  file_size text,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tags text[] DEFAULT '{}'::text[],
  stats jsonb DEFAULT '{"views": 0, "likes": 0, "downloads": 0}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.directory_files ENABLE ROW LEVEL SECURITY;

-- Create policies for directory_files
CREATE POLICY "directory_files_select_all" ON public.directory_files
  FOR SELECT USING (true);

CREATE POLICY "directory_files_insert_auth" ON public.directory_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "directory_files_update_auth" ON public.directory_files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "directory_files_delete_auth" ON public.directory_files
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.user_roles WHERE role = 'admin'));

-- Set up storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('directory_assets', 'directory_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "directory_assets_public_access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'directory_assets' );

CREATE POLICY "directory_assets_auth_insert" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'directory_assets' AND auth.role() = 'authenticated' );

CREATE POLICY "directory_assets_owner_update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'directory_assets' AND auth.uid() = owner );

CREATE POLICY "directory_assets_owner_delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'directory_assets' AND auth.uid() = owner );
