-- Comprehensive database setup for Chording app
-- This script ensures all tables exist with correct columns and policies

-- 1. Create or update profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    bio TEXT,
    location TEXT,
    website TEXT,
    email TEXT,
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add onboarding_completed column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'onboarding_completed'
    ) THEN
        ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
    END IF;
END
$$;

-- Add email column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE profiles ADD COLUMN email TEXT;
    END IF;
END
$$;

-- 2. Create or update user_preferences table
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

-- 3. Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;

-- 5. Create RLS policies for profiles
CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 6. Create RLS policies for user_preferences
CREATE POLICY "Users can view own preferences" 
    ON user_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
    ON user_preferences FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
    ON user_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 7. Update existing records to ensure they have proper defaults
UPDATE profiles 
SET onboarding_completed = FALSE 
WHERE onboarding_completed IS NULL;

-- 8. Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, onboarding_completed)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
