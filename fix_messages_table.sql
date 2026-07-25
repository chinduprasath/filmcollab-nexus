-- Drop the table if you want a clean slate (WARNING: deletes all messages), 
-- or just run the ALTER and CREATE POLICY parts.
-- DROP TABLE IF EXISTS public.messages;

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid not null default gen_random_uuid (),
  sender_id uuid not null,
  receiver_id uuid not null,
  content text not null,
  type text not null default 'text'::text,
  is_read boolean not null default false,
  created_at timestamp with time zone null default now(),
  constraint messages_pkey primary key (id),
  constraint messages_receiver_id_fkey foreign KEY (receiver_id) references profiles (id) on delete CASCADE,
  constraint messages_sender_id_fkey foreign KEY (sender_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON public.messages USING btree (sender_id, receiver_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages USING btree (created_at desc) TABLESPACE pg_default;

-- ==============================================
-- CRITICAL FIX: Enable RLS and setup policies
-- Without this, the insert will fail silently or give permission errors.
-- ==============================================

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 1. Policy: Users can see messages they sent or received
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

-- 2. Policy: Users can insert messages if they are the sender
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

-- 3. Policy: Users can update messages (to mark as read) if they are the receiver
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
