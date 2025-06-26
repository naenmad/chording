# Database Setup untuk Chording App

## Overview
File SQL ini berisi schema database untuk fitur user profiles, preferences, dan statistics di aplikasi Chording.

## Tables yang dibuat:

### 1. `profiles`
Menyimpan informasi profil user:
- `id` (UUID, primary key, references auth.users)
- `full_name` (TEXT)
- `username` (TEXT, unique)
- `bio` (TEXT)
- `location` (TEXT)
- `website` (TEXT)
- `avatar_url` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### 2. `user_preferences`
Menyimpan preferensi aplikasi user:
- `user_id` (UUID, references auth.users)
- `email_notifications` (BOOLEAN, default: true)
- `practice_reminders` (BOOLEAN, default: false)
- `new_features` (BOOLEAN, default: true)
- `marketing_emails` (BOOLEAN, default: false)
- `auto_scroll_speed` (TEXT, enum: slow/medium/fast)
- `default_instrument` (TEXT, enum: guitar/ukulele/piano)
- `chord_display` (TEXT, enum: diagram/text/both)

### 3. `user_stats`
Menyimpan statistik aktivitas user:
- `user_id` (UUID, references auth.users)
- `favorite_chords` (INTEGER, default: 0)
- `created_playlists` (INTEGER, default: 0)
- `songs_learned` (INTEGER, default: 0)
- `practice_hours` (INTEGER, default: 0)
- `last_activity` (TIMESTAMP)

## Features:

### Row Level Security (RLS)
- Semua tabel dilindungi dengan RLS
- User hanya bisa mengakses data mereka sendiri
- Policies dibuat untuk SELECT, INSERT, UPDATE operations

### Auto-generated Data
- Function `handle_new_user()` otomatis membuat profile, preferences, dan stats untuk user baru
- Trigger `on_auth_user_created` menjalankan function ini saat user mendaftar
- Auto-update `updated_at` timestamp dengan trigger

### Indexes
- Index pada `username` untuk pencarian cepat
- Index pada `user_id` untuk join operations

## Cara Setup:

### 1. Di Supabase Dashboard:
1. Buka project Supabase Anda
2. Pergi ke **SQL Editor**
3. Copy-paste isi file `init_user_tables.sql`
4. Klik **Run** untuk menjalankan script

### 2. Verifikasi Setup:
1. Check di **Table Editor** apakah 3 tabel sudah terbuat
2. Check di **Authentication** > **Users** lalu coba daftar user baru
3. Pastikan data otomatis terbuat di ketiga tabel

### 3. Test di Aplikasi:
1. Register user baru atau login
2. Akses `/profile` dan `/settings`
3. Coba edit profile dan preferensi
4. Pastikan data tersimpan dengan benar

## Notes:
- Username otomatis dibuat dari email + UUID snippet
- Avatar URL diambil dari OAuth provider (Google)
- Semua field profile bersifat opsional kecuali ID
- Preferences memiliki default values yang masuk akal
- Stats dimulai dari 0 untuk semua metrics

## Environment Variables:
Pastikan `.env.local` berisi:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
