# Setup dan Testing Onboarding Flow

## Setup Database

1. **Jalankan SQL Script**
   ```bash
   # Copy dan jalankan script SQL di Supabase Dashboard > SQL Editor
   # File: database/onboarding_tables.sql
   ```

2. **Verifikasi Tabel**
   Pastikan tabel berikut sudah dibuat:
   - `profiles`
   - `user_preferences`

3. **Cek RLS Policies**
   Pastikan Row Level Security sudah aktif dan policies sudah teraplikasi.

## Testing Flow

### 1. Test Registrasi Baru
```bash
# Jalankan aplikasi
npm run dev

# Buka browser ke http://localhost:3000
# Klik "Daftar" atau langsung ke /register
# Isi form registrasi
# Verifikasi redirect ke onboarding
```

### 2. Test Onboarding Process
```bash
# Setelah registrasi, pastikan user diarahkan ke /onboarding
# Ikuti semua step onboarding:
# - Welcome
# - Lengkapi Profil
# - Preferensi Musik
# - Tutorial
# - Selesai
# Verifikasi redirect ke home page
```

### 3. Test Login dengan Onboarding Belum Selesai
```bash
# Buat user baru tapi tutup browser sebelum onboarding selesai
# Login lagi dengan akun yang sama
# Pastikan diarahkan ke onboarding
```

### 4. Test Login dengan Onboarding Sudah Selesai
```bash
# Login dengan akun yang sudah selesai onboarding
# Pastikan langsung diarahkan ke home page
# Pastikan tidak ada OnboardingBanner di home page
```

### 5. Test OAuth Flow
```bash
# Klik "Masuk dengan Google" di halaman login/register
# Verifikasi proses OAuth
# Untuk user baru: pastikan diarahkan ke onboarding
# Untuk user lama: pastikan diarahkan ke home
```

### 6. Test Protected Routes
```bash
# Akses /profile tanpa login -> redirect ke /login
# Akses /settings tanpa login -> redirect ke /login
# Login tapi onboarding belum selesai -> redirect ke /onboarding
# Login dengan onboarding selesai -> akses normal
```

## Debug & Troubleshooting

### 1. Cek Database
```sql
-- Cek apakah user profile dibuat
SELECT * FROM profiles WHERE email = 'user@example.com';

-- Cek status onboarding
SELECT id, email, onboarding_completed FROM profiles;

-- Cek user preferences
SELECT * FROM user_preferences WHERE user_id = 'USER_ID';
```

### 2. Cek Console Browser
```javascript
// Buka Developer Tools > Console
// Cek error messages
// Cek network requests ke Supabase
```

### 3. Cek Supabase Dashboard
```bash
# Buka Supabase Dashboard
# Cek Authentication > Users
# Cek Database > profiles table
# Cek Logs untuk errors
```

## Common Issues & Solutions

### 1. User tidak diarahkan ke onboarding
**Masalah**: `onboarding_completed` flag tidak di-set dengan benar
**Solusi**: 
```sql
UPDATE profiles SET onboarding_completed = false WHERE id = 'USER_ID';
```

### 2. Error saat menyimpan profil
**Masalah**: RLS policies atau tabel structure
**Solusi**: Jalankan ulang SQL script, cek policies

### 3. OAuth callback error
**Masalah**: URL callback tidak sesuai
**Solusi**: Cek konfigurasi OAuth di Supabase Dashboard

### 4. Infinite redirect loop
**Masalah**: Logic redirect tidak sesuai
**Solusi**: Cek useAuth hook dan middleware

## Performance Monitoring

### 1. Onboarding Completion Rate
```sql
-- Hitung persentase user yang menyelesaikan onboarding
SELECT 
  COUNT(*) as total_users,
  SUM(CASE WHEN onboarding_completed = true THEN 1 ELSE 0 END) as completed,
  ROUND(
    SUM(CASE WHEN onboarding_completed = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 
    2
  ) as completion_rate
FROM profiles;
```

### 2. Time to Complete Onboarding
```sql
-- Analisis waktu yang dibutuhkan untuk menyelesaikan onboarding
SELECT 
  email,
  created_at,
  updated_at,
  (updated_at - created_at) as time_to_complete
FROM profiles 
WHERE onboarding_completed = true
ORDER BY time_to_complete DESC;
```

## Customization

### 1. Menambah Step Onboarding
Edit `src/components/OnboardingFlow.tsx`:
```typescript
const steps = [
  // ...existing steps...
  {
    id: 'new_step',
    title: 'New Step Title',
    subtitle: 'New step description',
    icon: '🎯'
  }
];
```

### 2. Mengubah Data yang Dikumpulkan
Edit state di `OnboardingFlow.tsx`:
```typescript
const [profileData, setProfileData] = useState({
  // ...existing fields...
  new_field: ''
});
```

### 3. Mengubah Kondisi Redirect
Edit `src/hooks/useAuth.ts` untuk mengubah logic redirect.

## Security Checklist

- [ ] RLS policies aktif untuk semua tabel
- [ ] User hanya bisa akses data mereka sendiri
- [ ] OAuth callback URL aman
- [ ] Input validation di form onboarding
- [ ] Error handling untuk semua auth flows

## Deployment Checklist

- [ ] Database migrations di-apply
- [ ] Environment variables di-set
- [ ] OAuth providers di-konfigurasi
- [ ] Email templates di-setup (jika ada)
- [ ] Testing di environment production
