-- Add role column to profiles table for admin authorization
-- This script should be run in Supabase SQL Editor

-- 1. Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user';

-- 2. Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 3. Update existing profiles to have 'user' role by default
UPDATE public.profiles 
SET role = 'user' 
WHERE role IS NULL;

-- 4. Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- 5. Create policy to allow users to update their own profile (but not role)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 6. Create policy for admin role management (only service role can change roles)
DROP POLICY IF EXISTS "Service role can manage user roles" ON public.profiles;
CREATE POLICY "Service role can manage user roles" ON public.profiles
    FOR UPDATE USING (auth.role() = 'service_role');

-- 7. Create RLS policy for chords table - only admins can insert
DROP POLICY IF EXISTS "Only admins can insert chords" ON public.chords;
CREATE POLICY "Only admins can insert chords" ON public.chords
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 8. Create RLS policy for chords table - only admins can update
DROP POLICY IF EXISTS "Only admins can update chords" ON public.chords;
CREATE POLICY "Only admins can update chords" ON public.chords
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 9. Create RLS policy for chords table - only admins can delete
DROP POLICY IF EXISTS "Only admins can delete chords" ON public.chords;
CREATE POLICY "Only admins can delete chords" ON public.chords
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 10. Allow everyone to read chords (public access)
DROP POLICY IF EXISTS "Anyone can view chords" ON public.chords;
CREATE POLICY "Anyone can view chords" ON public.chords
    FOR SELECT USING (true);

-- 11. Function to promote a user to admin (can be called by service role or existing admin)
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
    current_user_role TEXT;
BEGIN
    -- Check if current user is admin or service role
    SELECT role INTO current_user_role 
    FROM public.profiles 
    WHERE id = auth.uid();
    
    IF current_user_role != 'admin' AND auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Only admins can promote users';
    END IF;
    
    -- Find user by email
    SELECT au.id INTO user_id
    FROM auth.users au
    WHERE au.email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Update user role to admin
    UPDATE public.profiles 
    SET role = 'admin', updated_at = NOW()
    WHERE id = user_id;
    
    RETURN TRUE;
END;
$$;

-- 12. Function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID DEFAULT auth.uid())
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

-- 12.5. Create trigger to prevent regular users from changing their role
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Allow service role to change anything
    IF auth.role() = 'service_role' THEN
        RETURN NEW;
    END IF;
    
    -- Check if role is being changed
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        -- Only admins can change roles
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Only admins can change user roles';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_prevent_role_change ON public.profiles;
CREATE TRIGGER trigger_prevent_role_change
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_role_change();

-- 13. Grant necessary permissions
GRANT EXECUTE ON FUNCTION promote_user_to_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated, anon;

-- 14. Enable RLS on tables if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chords ENABLE ROW LEVEL SECURITY;

-- Example: To promote a user to admin, run this SQL (replace with actual email):
-- SELECT promote_user_to_admin('admin@example.com');

-- To check if current user is admin:
-- SELECT is_admin();

COMMENT ON COLUMN public.profiles.role IS 'User role: admin or user. Admins can add/edit/delete chords.';
COMMENT ON FUNCTION promote_user_to_admin(TEXT) IS 'Promote a user to admin role by email. Only admins or service role can call this.';
COMMENT ON FUNCTION is_admin(UUID) IS 'Check if a user has admin role. Defaults to current authenticated user.';
