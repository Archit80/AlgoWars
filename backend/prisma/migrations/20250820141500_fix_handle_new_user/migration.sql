-- Drop the existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;

-- Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a new user into the public.User table
  -- Use COALESCE to handle potential NULL values from Supabase auth
  INSERT INTO public."User" (id, email, username, "profilePic")
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', new.email), -- Fallback username to email
    COALESCE(new.raw_user_meta_data->>'profilePic', '/avatar.png') -- Default avatar
  );
  RETURN new;
END;
$$;

-- Create the trigger to call the function after a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant usage on the schema to the necessary roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;

-- Grant permissions on the User table
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."User" TO postgres, anon, authenticated, service_role;
GRANT SELECT, USAGE ON SEQUENCE "User_id_seq" TO postgres, anon, authenticated, service_role;

-- Grant permissions on the UserSettings table if it exists
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."UserSettings" TO postgres, anon, authenticated, service_role;
-- GRANT SELECT, USAGE ON SEQUENCE "UserSettings_id_seq" TO postgres, anon, authenticated, service_role;

-- Grant permissions on other tables as needed...
-- Example:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Match" TO postgres, anon, authenticated, service_role;
-- GRANT SELECT, USAGE ON SEQUENCE "Match_id_seq" TO postgres, anon, authenticated, service_role;

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Create policies for the User table
DROP POLICY IF EXISTS "Allow public read access to users" ON public."User";
CREATE POLICY "Allow public read access to users"
  ON public."User" FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow users to insert their own user record" ON public."User";
CREATE POLICY "Allow users to insert their own user record"
  ON public."User" FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to update their own user record" ON public."User";
CREATE POLICY "Allow users to update their own user record"
  ON public."User" FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
