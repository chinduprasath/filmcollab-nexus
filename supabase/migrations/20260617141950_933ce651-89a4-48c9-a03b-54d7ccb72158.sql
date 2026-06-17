
-- Remove duplicate profile rows per user (keep most recently updated)
DELETE FROM public.profiles p
USING public.profiles p2
WHERE p.user_id = p2.user_id
  AND p.user_id IS NOT NULL
  AND (p.updated_at, p.id) < (p2.updated_at, p2.id);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
