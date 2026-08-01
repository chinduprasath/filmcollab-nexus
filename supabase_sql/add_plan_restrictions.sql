ALTER TABLE public.subscription_plans 
ADD COLUMN IF NOT EXISTS restrictions JSONB DEFAULT '{}'::jsonb;
