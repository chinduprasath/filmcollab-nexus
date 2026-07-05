-- Create user discovery tables
-- This migration creates tables for user profiles, user likes, user saves, and connections

-- 1. Update profiles table to include discovery fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('Entry', 'Mid', 'Senior')),
ADD COLUMN IF NOT EXISTS industry TEXT CHECK (industry IN ('film', 'television', 'advertising', 'documentary', 'animation', 'photography', 'music', 'other')),
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS projects_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- 2. Create user_likes table
CREATE TABLE IF NOT EXISTS public.user_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    liked_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, liked_user_id)
);

-- 3. Create user_saves table
CREATE TABLE IF NOT EXISTS public.user_saves (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    saved_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, saved_user_id)
);

-- 4. Create connections table
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    connected_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, connected_user_id)
);

-- 5. Enable RLS on all tables
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for user_likes
CREATE POLICY "user_likes_select_policy" ON public.user_likes 
FOR SELECT 
USING (true);

CREATE POLICY "user_likes_insert_policy" ON public.user_likes 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "user_likes_delete_policy" ON public.user_likes 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 7. Create RLS policies for user_saves
CREATE POLICY "user_saves_select_policy" ON public.user_saves 
FOR SELECT 
USING (true);

CREATE POLICY "user_saves_insert_policy" ON public.user_saves 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "user_saves_delete_policy" ON public.user_saves 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 8. Create RLS policies for connections
CREATE POLICY "connections_select_policy" ON public.connections 
FOR SELECT 
USING (true);

CREATE POLICY "connections_insert_policy" ON public.connections 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "connections_update_policy" ON public.connections 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "connections_delete_policy" ON public.connections 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 9. Create triggers to update likes_count
CREATE OR REPLACE FUNCTION update_user_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.profiles 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.liked_user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.profiles 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.liked_user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_likes_count_trigger
    AFTER INSERT OR DELETE ON public.user_likes
    FOR EACH ROW EXECUTE FUNCTION update_user_likes_count();

-- 10. Create trigger to update updated_at for connections
CREATE OR REPLACE FUNCTION update_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER connections_updated_at_trigger
    BEFORE UPDATE ON public.connections
    FOR EACH ROW EXECUTE FUNCTION update_connections_updated_at();

-- 11. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON public.user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_liked_user_id ON public.user_likes(liked_user_id);
CREATE INDEX IF NOT EXISTS idx_user_saves_user_id ON public.user_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saves_saved_user_id ON public.user_saves(saved_user_id);
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON public.connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected_user_id ON public.connections(connected_user_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);
CREATE INDEX IF NOT EXISTS idx_profiles_industry ON public.profiles(industry);
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON public.profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);
