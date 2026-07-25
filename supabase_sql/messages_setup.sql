-- ==========================================
-- MESSAGES & CHATTING SETUP FOR SUPABASE
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- 1. Create the messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text', -- 'text', 'image', 'video', 'document', 'audio'
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Optimize queries with performance indices
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. Set security policies for messages
-- Only allow users to read messages they sent or received
DROP POLICY IF EXISTS "Users can read their own received or sent messages" ON public.messages;
CREATE POLICY "Users can read their own received or sent messages" 
    ON public.messages 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE (profiles.id = sender_id OR profiles.id = receiver_id) 
            AND profiles.user_id = auth.uid()
        )
    );

-- Only allow users to send messages from their own authenticated account
DROP POLICY IF EXISTS "Users can insert messages where they are the sender" ON public.messages;
CREATE POLICY "Users can insert messages where they are the sender" 
    ON public.messages 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = sender_id 
            AND profiles.user_id = auth.uid()
        )
    );

-- Only allow update if the user is the receiver (to mark message as read)
DROP POLICY IF EXISTS "Users can mark received messages as read" ON public.messages;
CREATE POLICY "Users can mark received messages as read" 
    ON public.messages 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = receiver_id 
            AND profiles.user_id = auth.uid()
        )
    );

-- 5. Seed some sample connections and profiles (If not already present)
-- This ensures there are connected users to display and start chatting with
DO $$
DECLARE
    first_profile_id UUID;
    second_profile_id UUID;
    third_profile_id UUID;
BEGIN
    -- Try to grab existing profile ids from public.profiles
    SELECT id INTO first_profile_id FROM public.profiles LIMIT 1;
    SELECT id INTO second_profile_id FROM public.profiles OFFSET 1 LIMIT 1;
    SELECT id INTO third_profile_id FROM public.profiles OFFSET 2 LIMIT 1;

    -- If there are profiles in the system, let's create a connection between them to test
    IF first_profile_id IS NOT NULL AND second_profile_id IS NOT NULL THEN
        -- Insert a sample connection if it doesn't exist
        INSERT INTO public.connections (user_id, connected_user_id, status, created_at, updated_at)
        VALUES 
            (first_profile_id, second_profile_id, 'accepted', NOW(), NOW())
        ON CONFLICT DO NOTHING;

        -- Insert initial sample chat messages
        INSERT INTO public.messages (sender_id, receiver_id, content, type, is_read, created_at)
        VALUES 
            (second_profile_id, first_profile_id, 'Hey! Are you free to review the teaser?', 'text', false, NOW() - INTERVAL '5 hours'),
            (first_profile_id, second_profile_id, 'Yes, send it over.', 'text', true, NOW() - INTERVAL '4 hours 54 minutes'),
            (second_profile_id, first_profile_id, 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=640', 'image', false, NOW() - INTERVAL '4 hours 30 minutes')
        ON CONFLICT DO NOTHING;
    END IF;

    IF first_profile_id IS NOT NULL AND third_profile_id IS NOT NULL THEN
        -- Insert connection between 1 and 3
        INSERT INTO public.connections (user_id, connected_user_id, status, created_at, updated_at)
        VALUES 
            (first_profile_id, third_profile_id, 'accepted', NOW(), NOW())
        ON CONFLICT DO NOTHING;

        -- Insert initial messages
        INSERT INTO public.messages (sender_id, receiver_id, content, type, is_read, created_at)
        VALUES 
            (first_profile_id, third_profile_id, 'Color grade is looking great!', 'text', true, NOW() - INTERVAL '1 day'),
            (third_profile_id, first_profile_id, 'Thanks! Final draft by EOD.', 'text', true, NOW() - INTERVAL '23 hours')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
