-- Supabase-only setup (needs the `auth` schema), so it lives outside Prisma migrations.
-- Run in the Supabase SQL editor on a fresh project, after `prisma migrate deploy`. Safe to re-run.
--
-- Corrected from the old 20250820141500_fix_handle_new_user migration:
--   * no grant on "User_id_seq" (User.id is text; that sequence never existed)
--   * auth.uid() is uuid and "User".id is text, so policies compare auth.uid()::text

-- Create a public."User" row for every new Supabase auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public."User" (id, email, username, "profilePic")
  VALUES (
    new.id::text,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', new.email), -- fallback username
    COALESCE(new.raw_user_meta_data->>'profilePic', '/avatar.png') -- default avatar
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."User" TO postgres, anon, authenticated, service_role;

-- Row level security for direct (PostgREST) access; the backend connects as the DB owner
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to users" ON public."User";
CREATE POLICY "Allow public read access to users"
  ON public."User" FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow users to insert their own user record" ON public."User";
CREATE POLICY "Allow users to insert their own user record"
  ON public."User" FOR INSERT
  WITH CHECK (auth.uid()::text = id);

DROP POLICY IF EXISTS "Allow users to update their own user record" ON public."User";
CREATE POLICY "Allow users to update their own user record"
  ON public."User" FOR UPDATE
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);
