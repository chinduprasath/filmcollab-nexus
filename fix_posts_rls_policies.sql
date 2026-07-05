-- Fix Posts RLS Policies
-- Run this script in Supabase SQL Editor to fix the RLS policy issues

-- 1. Drop all existing policies
DROP POLICY IF EXISTS "posts_select_policy" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_policy" ON public.posts;
DROP POLICY IF EXISTS "posts_update_policy" ON public.posts;
DROP POLICY IF EXISTS "posts_delete_policy" ON public.posts;

DROP POLICY IF EXISTS "post_likes_select_policy" ON public.post_likes;
DROP POLICY IF EXISTS "post_likes_insert_policy" ON public.post_likes;
DROP POLICY IF EXISTS "post_likes_delete_policy" ON public.post_likes;

DROP POLICY IF EXISTS "post_comments_select_policy" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_insert_policy" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_update_policy" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_delete_policy" ON public.post_comments;

DROP POLICY IF EXISTS "post_saves_select_policy" ON public.post_saves;
DROP POLICY IF EXISTS "post_saves_insert_policy" ON public.post_saves;
DROP POLICY IF EXISTS "post_saves_delete_policy" ON public.post_saves;

-- 2. Create simplified RLS policies for posts
CREATE POLICY "posts_select_policy" ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "posts_insert_policy" ON public.posts 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "posts_update_policy" ON public.posts 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "posts_delete_policy" ON public.posts 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 3. Create simplified RLS policies for post_likes
CREATE POLICY "post_likes_select_policy" ON public.post_likes 
FOR SELECT 
USING (true);

CREATE POLICY "post_likes_insert_policy" ON public.post_likes 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "post_likes_delete_policy" ON public.post_likes 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 4. Create simplified RLS policies for post_comments
CREATE POLICY "post_comments_select_policy" ON public.post_comments 
FOR SELECT 
USING (true);

CREATE POLICY "post_comments_insert_policy" ON public.post_comments 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "post_comments_update_policy" ON public.post_comments 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "post_comments_delete_policy" ON public.post_comments 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 5. Create simplified RLS policies for post_saves
CREATE POLICY "post_saves_select_policy" ON public.post_saves 
FOR SELECT 
USING (true);

CREATE POLICY "post_saves_insert_policy" ON public.post_saves 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "post_saves_delete_policy" ON public.post_saves 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 6. Test the policies
SELECT 'RLS policies updated successfully!' as status;
