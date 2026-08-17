-- Add additional_urls array for grouped images in directory_files

ALTER TABLE public.directory_files
ADD COLUMN IF NOT EXISTS additional_urls JSONB DEFAULT '[]'::jsonb;