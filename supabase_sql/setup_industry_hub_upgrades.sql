-- Add content column to industry_news table to store rich text article content
ALTER TABLE public.industry_news
ADD COLUMN IF NOT EXISTS content TEXT;

-- For events, ensure we have the expanded links
ALTER TABLE public.industry_events
ADD COLUMN IF NOT EXISTS google_maps_link TEXT,
ADD COLUMN IF NOT EXISTS meeting_link TEXT,
ADD COLUMN IF NOT EXISTS registration_link TEXT;

-- For courses, ensure we have the new website link
ALTER TABLE public.industry_courses
ADD COLUMN IF NOT EXISTS website_link TEXT;
