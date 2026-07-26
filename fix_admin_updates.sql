-- 1. Ensure the chat_enabled column exists on the tickets table
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS chat_enabled boolean default false;

-- 2. Create the ticket_updates table (in case it was skipped earlier)
CREATE TABLE IF NOT EXISTS public.ticket_updates (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete cascade,
  author_id uuid references public.profiles(id),
  content text not null,
  created_at timestamp with time zone default now()
);

-- 3. Setup security for ticket_updates
ALTER TABLE public.ticket_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read ticket updates" ON public.ticket_updates;
CREATE POLICY "Everyone can read ticket updates" ON public.ticket_updates 
  FOR SELECT TO authenticated USING (true);
  
DROP POLICY IF EXISTS "Only admins can insert ticket updates" ON public.ticket_updates;
CREATE POLICY "Only admins can insert ticket updates" ON public.ticket_updates 
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    EXISTS (SELECT 1 FROM public.admin_team_members WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 4. CRITICAL FIX: Make sure the admin account actually has the 'admin' role in the database!
-- If your database still thinks the admin is a 'user', the security policies will block the toggle.
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@filmcollab.com'; -- If your admin email is different, change it here!

-- 5. Ensure the UPDATE policy allows admins to toggle the chat
DROP POLICY IF EXISTS "Admins can update tickets" ON public.tickets;
CREATE POLICY "Admins can update tickets" ON public.tickets
  FOR UPDATE TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
    EXISTS (SELECT 1 FROM public.admin_team_members WHERE profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Reload schema
NOTIFY pgrst, 'reload schema';
