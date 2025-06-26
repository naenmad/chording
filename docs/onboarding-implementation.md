# Chording! Onboarding Flow Implementation

## Overview
This document describes the implementation of the onboarding flow for new users in the Chording! application.

## Components

### 1. OnboardingFlow Component (`src/components/OnboardingFlow.tsx`)
- Multi-step guided setup process
- Steps: Welcome, Profile, Preferences, Tutorial, Complete
- Collects user data and saves to Supabase
- Responsive design with consistent styling

### 2. Onboarding Page (`src/app/onboarding/page.tsx`)
- Protected route for onboarding process
- Checks user authentication status
- Redirects to login if not authenticated
- Redirects to home after completion

### 3. OnboardingBanner Component (`src/components/OnboardingBanner.tsx`)
- Displays notification for incomplete onboarding
- Shows on home page for users who haven't completed setup
- Provides direct link to continue onboarding

### 4. Auth Hook (`src/hooks/useAuth.ts`)
- Custom hook for authentication and onboarding status checking
- Provides `useAuth()` and `useRequireAuth()` functions
- Handles redirects based on authentication and onboarding status

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    bio TEXT,
    location TEXT,
    website TEXT,
    email TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
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

## Flow Implementation

### Registration Flow
1. User fills registration form
2. Account created in Supabase Auth
3. Initial profile record created with `onboarding_completed: false`
4. User redirected to onboarding page (if auto-login enabled)
5. User completes onboarding steps
6. `onboarding_completed` flag set to `true`
7. User redirected to home page

### Login Flow
1. User enters credentials
2. Authentication successful
3. Check `onboarding_completed` status
4. If not completed: redirect to onboarding
5. If completed: redirect to home page

### OAuth Flow (Google)
1. User clicks "Sign in with Google"
2. OAuth authentication process
3. User data received from Google
4. Initial profile created if new user
5. Callback route checks onboarding status
6. Redirect to onboarding or home based on status

## Protected Routes
- Profile page (`/profile`)
- Settings page (`/settings`)
- Any route requiring authentication

These routes use `useRequireAuth()` hook which:
- Checks authentication status
- Redirects to login if not authenticated
- Checks onboarding status
- Redirects to onboarding if not completed

## Middleware
Simplified middleware approach for handling public vs protected routes:
- Allows client-side auth checking
- Handles basic route protection
- More complex auth logic handled by hooks

## Key Features
1. **Automatic Profile Creation**: Profile records created automatically on signup
2. **Onboarding Status Tracking**: `onboarding_completed` flag tracks progress
3. **Flexible Redirection**: Smart redirects based on auth and onboarding status
4. **User Experience**: Seamless flow from registration to app usage
5. **Data Collection**: Collects essential user data for personalization

## Usage

### For New Users
1. Register account
2. Complete onboarding steps
3. Start using the app with personalized settings

### For Existing Users
1. Login with credentials
2. If onboarding not completed, complete it
3. Access all app features

### For Developers
1. Use `useAuth()` for optional auth checking
2. Use `useRequireAuth()` for protected routes
3. Check `needsOnboarding` flag to show appropriate UI
4. Handle onboarding completion in components as needed

## Files Modified/Created

### New Files
- `src/app/onboarding/page.tsx`
- `src/components/OnboardingBanner.tsx`
- `src/hooks/useAuth.ts`
- `database/onboarding_tables.sql`

### Modified Files
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/app/profile/page.tsx`
- `src/app/settings/page.tsx`
- `src/app/page.tsx`
- `src/lib/supabase.ts`
- `middleware.ts`

## Next Steps
1. Run database migrations (`database/onboarding_tables.sql`)
2. Test the complete flow
3. Add error handling and edge cases
4. Add analytics tracking for onboarding completion
5. Add skip option for non-essential steps
6. Implement onboarding progress indicators
