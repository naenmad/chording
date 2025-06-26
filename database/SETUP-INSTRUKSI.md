# 🚨 SETUP DATABASE - WAJIB DIBACA JIKA ERROR 404!

## Error yang Anda Alami:
```
Error adding song: Failed to load resource: the server responded with a status of 404
eafhwyumjsgsbxkhadbi.supabase.co/rest/v1/songs?select=...
```

**Penyebab**: Tabel `songs` belum dibuat di database Supabase!

## Solusi Cepat (5 Menit):

### 1. Buka Supabase Dashboard
- Kunjungi: https://supabase.com/dashboard
- Login dan pilih project: **eafhwyumjsgsbxkhadbi**

### 2. Buka SQL Editor
- Klik **SQL Editor** di sidebar kiri
- Klik **New Query**

### 3. Copy-Paste Script SQL
- Buka file `create_chord_tables.sql` di folder ini
- Copy **SELURUH ISI FILE** (Ctrl+A, Ctrl+C)
- Paste ke SQL Editor (Ctrl+V)

### 4. Jalankan Script
- Klik **Run** atau tekan Ctrl+Enter
- Tunggu hingga selesai (biasanya 10-20 detik)
- Pastikan tidak ada error berwarna merah

### 5. Verifikasi Berhasil
- Klik **Table Editor** di sidebar kiri
- Anda harus melihat 3 tabel baru:
  - ✅ `songs` (6 sample data)
  - ✅ `genres` (3 sample data)
  - ✅ `artists` (6 sample data)

### 6. Test Aplikasi
- Refresh halaman aplikasi (F5)
- Coba tambah chord lagi
- Error 404 seharusnya hilang!

## Jika Masih Error:

1. **Cek tabel ada** - Pastikan 3 tabel benar-benar muncul di Table Editor
2. **Hard refresh** - Tekan Ctrl+Shift+R di browser
3. **Cek console** - Buka Developer Tools (F12) → Console untuk error detail
4. **Cek .env.local** - Pastikan SUPABASE_URL dan ANON_KEY benar

## Yang Akan Dibuat:

### Sample Songs (6):
1. Bintang di Surga - Peterpan
2. Kau Adalah - Isyana Sarasvati  
3. Aku Milikmu - Iwan Fals
4. Mencari Alasan - Exists
5. Dan - Sheila on 7
6. Laskar Pelangi - Nidji

### Genres (3):
- Pop, Rock, Alternative

### Artists (6):
- 6 artis Indonesia populer

## Butuh Bantuan?
Jika masih ada masalah, cek:
- Supabase project sudah aktif
- Environment variables sudah benar
- Internet connection stabil saat menjalankan script
