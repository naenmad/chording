-- Quick Fix for User Preferences Table Issues
-- Run this in your Supabase SQL Editor

-- 1. Create the user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    favorite_genre TEXT,
    skill_level TEXT DEFAULT 'beginner',
    primary_instrument TEXT DEFAULT 'guitar',
    email_notifications BOOLEAN DEFAULT TRUE,
    practice_reminders BOOLEAN DEFAULT FALSE,
    new_features BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    auto_scroll_speed TEXT DEFAULT 'medium',
    default_instrument TEXT DEFAULT 'guitar',
    chord_display TEXT DEFAULT 'diagram',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can delete own preferences" ON user_preferences;

-- 4. Create comprehensive RLS policies
CREATE POLICY "Users can view own preferences" 
    ON user_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
    ON user_preferences FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
    ON user_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences" 
    ON user_preferences FOR DELETE 
    USING (auth.uid() = user_id);

-- 5. Grant necessary permissions (if using service role)
GRANT ALL ON user_preferences TO authenticated;
GRANT ALL ON user_preferences TO anon;

-- 6. Verify the setup
SELECT 
    'Table exists' as check_type,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_preferences'
    ) THEN 'PASS' ELSE 'FAIL' END as result
UNION ALL
SELECT 
    'RLS enabled' as check_type,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'user_preferences' AND relrowsecurity = true
    ) THEN 'PASS' ELSE 'FAIL' END as result
UNION ALL
SELECT 
    'Policies exist' as check_type,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_preferences'
    ) THEN 'PASS' ELSE 'FAIL' END as result;
