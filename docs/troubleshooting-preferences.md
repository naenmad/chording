# Troubleshooting: Error Saving Preferences

## Issue Description
You're getting "Error saving preferences: {}" during the onboarding process. This indicates that the user preferences are not being saved to the database.

## Possible Causes

### 1. **Missing user_preferences Table**
The table might not exist in your Supabase database.

**Solution:**
```sql
-- Run this in your Supabase SQL Editor
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
```

### 2. **Row Level Security (RLS) Issues**
The RLS policies might not allow users to insert/update their preferences.

**Solution:**
```sql
-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own preferences" 
    ON user_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
    ON user_preferences FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
    ON user_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
```

### 3. **Missing Columns**
Some columns might be missing from the table.

**Solution:**
```sql
-- Check if all required columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_preferences';

-- Add missing columns if needed
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS favorite_genre TEXT,
ADD COLUMN IF NOT EXISTS skill_level TEXT DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS primary_instrument TEXT DEFAULT 'guitar',
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS practice_reminders BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS new_features BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auto_scroll_speed TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS default_instrument TEXT DEFAULT 'guitar',
ADD COLUMN IF NOT EXISTS chord_display TEXT DEFAULT 'diagram';
```

## Diagnostic Steps

### Step 1: Use the Debug Page
1. Go to `http://localhost:3000/debug`
2. Click "Jalankan Debug Test"
3. Check if "User Preferences Table Access" shows SUCCESS or FAILED
4. If it shows FAILED, you have RLS or table issues

### Step 2: Check Database Manually
In your Supabase dashboard:
1. Go to Table Editor
2. Look for `user_preferences` table
3. Check if the table exists and has the right columns
4. Go to Authentication > Policies
5. Check if RLS policies exist for `user_preferences`

### Step 3: Test Manual Creation
1. On the debug page, if "User Preferences - Preferences Tidak Ditemukan" is shown
2. Click the "Buat User Preferences" button
3. This will try to create default preferences
4. Check the browser console for detailed error messages

## Quick Fix Commands

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Complete setup for user_preferences table
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

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;

CREATE POLICY "Users can view own preferences" 
    ON user_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
    ON user_preferences FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
    ON user_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
```

## Alternative Solution: Skip Preferences
If you want to temporarily bypass the preferences saving:

1. In `OnboardingFlow.tsx`, you can comment out the preferences saving section
2. The onboarding will complete without saving preferences
3. Users can set preferences later in their profile settings

## Expected Behavior After Fix
- Debug page should show "User Preferences Table Access: SUCCESS"
- Onboarding should complete without errors
- User preferences should be created with default values
- No "Error saving preferences" messages in console
