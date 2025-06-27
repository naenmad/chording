-- SIMPLE VERSION - Minimal script for role authorization
-- Run this if the main script has issues

-- 1. Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user';

-- 2. Update existing profiles to have 'user' role by default
UPDATE public.profiles 
SET role = 'user' 
WHERE role IS NULL;

-- 3. Simple function to promote user to admin (bypass security for initial setup)
CREATE OR REPLACE FUNCTION promote_user_to_admin_simple(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Find user by email from auth.users
    SELECT au.id INTO user_id
    FROM auth.users au
    WHERE au.email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Create profile if not exists, or update existing
    INSERT INTO public.profiles (id, role, created_at, updated_at)
    VALUES (user_id, 'admin', NOW(), NOW())
    ON CONFLICT (id) 
    DO UPDATE SET 
        role = 'admin', 
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$;

-- 4. Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_simple(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role 
    FROM public.profiles 
    WHERE id = check_user_id;
    
    RETURN COALESCE(user_role = 'admin', FALSE);
END;
$$;

-- 5. Grant permissions
GRANT EXECUTE ON FUNCTION promote_user_to_admin_simple(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION is_admin_simple(UUID) TO authenticated, anon;

-- 6. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 7. Basic policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;  
CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Example usage:
-- SELECT promote_user_to_admin_simple('your-email@example.com');
-- SELECT is_admin_simple();
