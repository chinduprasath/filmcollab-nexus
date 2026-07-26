-- 1. Unblock ticket updates (Allow any logged-in user to insert updates)
DROP POLICY IF EXISTS "Only admins can insert ticket updates" ON public.ticket_updates;
CREATE POLICY "Anyone can insert ticket updates" ON public.ticket_updates 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- 2. Unblock ticket modification (Allow any logged-in user to toggle chat & update status)
DROP POLICY IF EXISTS "Admins can update tickets" ON public.tickets;
CREATE POLICY "Anyone can update tickets" ON public.tickets
  FOR UPDATE TO authenticated 
  USING (true);

-- 3. Unblock ticket messages (Allow any logged-in user to send chat messages)
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert ticket messages" ON public.ticket_messages;
CREATE POLICY "Anyone can insert ticket messages" ON public.ticket_messages 
  FOR INSERT TO authenticated 
  WITH CHECK (true);
  
DROP POLICY IF EXISTS "Anyone can read ticket messages" ON public.ticket_messages;
CREATE POLICY "Anyone can read ticket messages" ON public.ticket_messages 
  FOR SELECT TO authenticated 
  USING (true);

-- Reload schema so changes take effect immediately
NOTIFY pgrst, 'reload schema';
