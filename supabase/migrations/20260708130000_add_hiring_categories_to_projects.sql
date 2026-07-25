-- Add hiring_categories to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS hiring_categories TEXT[] DEFAULT '{}'::TEXT[];
