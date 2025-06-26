# Panduan Setup Google OAuth di Supabase

Chording! menggunakan Google OAuth untuk autentikasi pengguna. Ikuti panduan ini untuk mengaktifkan login dengan Google.

## 🔧 Setup Google Cloud Console

### 1. Buat Project di Google Cloud Console

1. **Buka Google Cloud Console**
   - Kunjungi: https://console.cloud.google.com/
   - Login dengan akun Google Anda

2. **Buat atau Pilih Project**
   - Klik dropdown project di header
   - Buat project baru atau pilih existing project
   - Nama project: `Chording OAuth`

3. **Aktifkan Google+ API**
   - Di sidebar, klik "APIs & Services" → "Library"
   - Cari "Google+ API" atau "Google Identity"
   - Klik dan pilih "Enable"

### 2. Buat OAuth 2.0 Credentials

1. **Buat Credentials**
   - Klik "APIs & Services" → "Credentials"
   - Klik "CREATE CREDENTIALS" → "OAuth client ID"
   - Jika belum ada, setup OAuth consent screen terlebih dahulu
   - Pilih "Web application"
   - Nama: `Chording Web App`

2. **Konfigurasi Authorized Origins**
   ```
   Authorized JavaScript origins:
   - http://localhost:3000 (untuk development)
   - https://yourdomain.com (untuk production)
   ```

3. **Konfigurasi Redirect URIs**
   ```
   Authorized redirect URIs:
   - http://localhost:3000/auth/callback (development)
   - https://yourdomain.com/auth/callback (production)
   - https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback (WAJIB)
   ```

4. **Salin Credentials**
   - Client ID: `123456789-abcdef.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-your-secret-here`

## 🚀 Setup di Supabase Dashboard

### 1. Navigasi ke Authentication

1. **Buka Supabase Dashboard**
   - Kunjungi: https://supabase.com/dashboard
   - Login dan pilih project Chording

2. **Buka Authentication Settings**
   - Sidebar → "Authentication"
   - Tab "Providers"

### 2. Aktifkan Google Provider

1. **Konfigurasi Google OAuth**
   - Scroll ke "Google"
   - Toggle "Enable sign in with Google" → **ON**
   
2. **Masukkan Credentials**
   - **Client ID**: `123456789-abcdef.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-your-secret-here`
   - Klik "Save"

### 3. Set Site URL (PENTING!)

1. **Buka General Settings**
   - Sidebar → "Settings" → "General"

2. **Update Site URL**
   - **Site URL**: `http://localhost:3000` (development)
   - **Site URL**: `https://yourdomain.com` (production)

3. **Update Redirect URLs**
   - **Redirect URLs**: 
     ```
     http://localhost:3000/**
     https://yourdomain.com/**
     ```
   - Klik "Save"

---

## ✅ Testing & Verification

### 1. Test Google Login

Setelah setup selesai, test login Google di aplikasi:

```bash
# Jalankan development server
npm run dev

# Buka browser ke http://localhost:3000/login
# Klik tombol "Masuk dengan Google"
```

### 2. Troubleshooting

**❌ "OAuth client not found"**
- Pastikan Client ID dan Client Secret benar
- Periksa kembali konfigurasi di Google Cloud Console

**❌ "Redirect URI mismatch"**
- Pastikan redirect URI di Google Cloud Console include:
  ```
  https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
  ```

**❌ "Provider not enabled"**
- Pastikan Google provider sudah diaktifkan di Supabase
- Toggle "Enable sign in with Google" harus ON

### 3. Verifikasi Berhasil

✅ **Login berhasil jika:**
- User diarahkan ke halaman utama setelah klik Google
- Tidak ada error di browser console
- User muncul di Authentication → Users di Supabase Dashboard

---

## 📝 Catatan Penting

1. **Supabase Project ID**: Ganti `YOUR_SUPABASE_PROJECT_ID` dengan ID project Supabase Anda
2. **Domain Production**: Ganti `yourdomain.com` dengan domain production Anda
3. **Environment Variables**: Pastikan `.env.local` sudah dikonfigurasi dengan benar:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **OAuth Consent Screen**: Untuk production, lengkapi OAuth consent screen di Google Cloud Console
5. **Verification**: Untuk domain production, verify ownership di Google Cloud Console

---

🎉 **Selamat! Google OAuth sudah siap digunakan di Chording!**
