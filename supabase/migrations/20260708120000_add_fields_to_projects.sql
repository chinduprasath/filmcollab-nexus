-- Add detail fields and hiring control to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS production_notes TEXT DEFAULT 'None specified',
ADD COLUMN IF NOT EXISTS target_audience TEXT DEFAULT 'None specified',
ADD COLUMN IF NOT EXISTS distribution_plan TEXT DEFAULT 'None specified',
ADD COLUMN IF NOT EXISTS timeline TEXT DEFAULT 'None specified',
ADD COLUMN IF NOT EXISTS benefits TEXT DEFAULT 'None specified',
ADD COLUMN IF NOT EXISTS contact_info TEXT DEFAULT 'None specified',
ADD COLUMN IF NOT EXISTS allow_applicants BOOLEAN DEFAULT TRUE;
