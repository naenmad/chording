-- Add onboarding_completed column to profiles table if it doesn't exist
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

-- Update existing profiles to have onboarding_completed = false if null
UPDATE profiles 
SET onboarding_completed = FALSE 
WHERE onboarding_completed IS NULL;
