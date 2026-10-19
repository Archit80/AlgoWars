-- Supabase-only setup (needs the `auth` schema), so it lives outside Prisma migrations.
-- Run in the Supabase SQL editor (or psql) after `prisma migrate deploy`. Safe to re-run.
--
-- Every Supabase auth user gets a public."User" profile. When a confirmed email already has an
-- orphaned profile (its auth user is gone, e.g. after moving Supabase projects), the profile is
-- re-linked to the new auth user instead of failing the sign-up. Every foreign key to "User".id
-- is ON UPDATE CASCADE, so matches, answers, sessions and achievements move with it.

-- Link or create the profile for one auth user. Only call this for a CONFIRMED email:
-- re-linking by email on an unconfirmed address would let anyone claim someone else's profile.
CREATE OR REPLACE FUNCTION public.link_or_create_app_user(auth_id uuid, auth_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public."User" WHERE id = auth_id::text) THEN
    RETURN;
  END IF;

  -- Re-link an orphaned profile with this email (never one that belongs to a live auth user)
  UPDATE public."User" u
     SET id = auth_id::text
   WHERE u.email = auth_email
     AND NOT EXISTS (SELECT 1 FROM auth.users a WHERE a.id::text = u.id);
  IF FOUND THEN
    RETURN;
  END IF;

  INSERT INTO public."User" (id, email)
  VALUES (auth_id::text, auth_email)
  ON CONFLICT DO NOTHING;
END;
$$;

-- New auth user: confirmed emails (e.g. Google) are linked or created now. Unconfirmed ones
-- (magic link before the click) only get a fresh profile when the email is unused; otherwise
-- linking waits for confirmation (trigger below). Never raises, so sign-up itself can't fail here.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL THEN
    PERFORM public.link_or_create_app_user(NEW.id, NEW.email);
  ELSE
    INSERT INTO public."User" (id, email)
    VALUES (NEW.id::text, NEW.email)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Email confirmed later (magic link clicked): link or create then
CREATE OR REPLACE FUNCTION public.handle_user_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.link_or_create_app_user(NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_user_confirmed();

-- Backfill: confirmed auth users that have no profile yet
SELECT public.link_or_create_app_user(a.id, a.email)
  FROM auth.users a
 WHERE a.email_confirmed_at IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM public."User" u WHERE u.id = a.id::text);

-- Lock "User" against direct access through Supabase's public REST API (anon/authenticated
-- keys ship in the browser). With RLS on and no policies, PostgREST can't read or write it,
-- while the backend (table owner) and the SECURITY DEFINER triggers above are unaffected.
-- The app never queries tables from the browser; it only uses Supabase Auth and Storage.
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert from auth trigger" ON public."User";
DROP POLICY IF EXISTS "Allow public read access to users" ON public."User";
DROP POLICY IF EXISTS "Allow users to insert their own user record" ON public."User";
DROP POLICY IF EXISTS "Allow users to update their own user record" ON public."User";
