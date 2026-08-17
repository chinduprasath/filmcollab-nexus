-- Create casting_calls table
CREATE TABLE IF NOT EXISTS public.casting_calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    project_name TEXT NOT NULL,
    production_house TEXT,
    casting_director TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    poster TEXT,
    category TEXT NOT NULL,
    role_name TEXT NOT NULL,
    role_description TEXT NOT NULL,
    gender TEXT NOT NULL,
    age_min INTEGER NOT NULL,
    age_max INTEGER NOT NULL,
    height TEXT,
    languages TEXT[],
    experience TEXT NOT NULL,
    compensation TEXT NOT NULL,
    location TEXT NOT NULL,
    shoot_dates TEXT,
    audition_dates TEXT,
    audition_venue TEXT,
    vacancies INTEGER DEFAULT 1,
    max_applications INTEGER,
    date_posted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_date_to_apply TIMESTAMP WITH TIME ZONE,
    project_description TEXT,
    requirements TEXT[],
    what_to_bring TEXT[],
    notes TEXT,
    attachments JSONB,
    status TEXT NOT NULL DEFAULT 'Open',
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create casting_applicants table
CREATE TABLE IF NOT EXISTS public.casting_applicants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    casting_call_id UUID NOT NULL REFERENCES public.casting_calls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    profile_photo TEXT,
    profession TEXT,
    experience TEXT,
    location TEXT,
    languages TEXT[],
    skills TEXT[],
    portfolio_url TEXT,
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'Interested',
    match_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(casting_call_id, user_id)
);

-- Create casting_call_saves table
CREATE TABLE IF NOT EXISTS public.casting_call_saves (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    casting_call_id UUID NOT NULL REFERENCES public.casting_calls(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, casting_call_id)
);

-- Enable RLS
ALTER TABLE public.casting_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casting_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casting_call_saves ENABLE ROW LEVEL SECURITY;

-- Casting Calls Policies
-- Anyone can read casting calls
CREATE POLICY "Anyone can view casting calls" ON public.casting_calls
    FOR SELECT USING (true);

-- Authenticated users can insert their own casting calls
CREATE POLICY "Users can insert casting calls" ON public.casting_calls
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own casting calls
CREATE POLICY "Users can update their own casting calls" ON public.casting_calls
    FOR UPDATE USING (auth.uid() = creator_id);

-- Creators can delete their own casting calls
CREATE POLICY "Users can delete their own casting calls" ON public.casting_calls
    FOR DELETE USING (auth.uid() = creator_id);

-- Casting Applicants Policies
-- Users can view applications for their own casting calls, or their own applications
CREATE POLICY "Users can view relevant applications" ON public.casting_applicants
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (SELECT creator_id FROM public.casting_calls WHERE id = casting_call_id)
    );

-- Users can apply (insert) as themselves
CREATE POLICY "Users can insert their own applications" ON public.casting_applicants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can withdraw (delete) their own applications
CREATE POLICY "Users can delete their own applications" ON public.casting_applicants
    FOR DELETE USING (auth.uid() = user_id);

-- Creators can update application status (e.g., Interested -> Confirmed)
CREATE POLICY "Creators can update application statuses" ON public.casting_applicants
    FOR UPDATE USING (
        auth.uid() IN (SELECT creator_id FROM public.casting_calls WHERE id = casting_call_id)
    );

-- Casting Call Saves Policies
-- Users can view their own saves
CREATE POLICY "Users can view their own saves" ON public.casting_call_saves
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own saves
CREATE POLICY "Users can insert their own saves" ON public.casting_call_saves
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saves
CREATE POLICY "Users can delete their own saves" ON public.casting_call_saves
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Triggers for updated_at
CREATE TRIGGER update_casting_calls_updated_at
BEFORE UPDATE ON public.casting_calls
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_casting_applicants_updated_at
BEFORE UPDATE ON public.casting_applicants
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

