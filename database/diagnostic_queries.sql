-- Database diagnostic queries to check the current state

-- 1. Check if profiles table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check if user_preferences table exists and its structure  
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_preferences' 
ORDER BY ordinal_position;

-- 3. Check RLS policies on profiles table
SELECT 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 4. Check RLS policies on user_preferences table
SELECT 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'user_preferences';

-- 5. Count existing records
SELECT 
    'profiles' as table_name,
    count(*) as record_count
FROM profiles
UNION ALL
SELECT 
    'user_preferences' as table_name,
    count(*) as record_count
FROM user_preferences;
