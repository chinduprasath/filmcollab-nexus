-- Create storage bucket for post media
INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true);

-- Create storage policies for post-media bucket
CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id = 'post-media');

CREATE POLICY "Allow authenticated users to upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'post-media' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to update their own files" ON storage.objects FOR UPDATE USING (
  bucket_id = 'post-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own files" ON storage.objects FOR DELETE USING (
  bucket_id = 'post-media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
