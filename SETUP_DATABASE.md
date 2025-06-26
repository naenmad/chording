# INSTRUKSI SETUP DATABASE - WAJIB DIJALANKAN!

## ⚠️ PENTING: Jalankan Script SQL Terlebih Dahulu

Sebelum menggunakan fitur Add Chord, Anda **WAJIB** menjalankan script SQL untuk menambahkan kolom `slug`:

### 1. Buka Supabase Dashboard
- Login ke dashboard.supabase.com
- Pilih project Anda

### 2. Buka SQL Editor
- Klik menu "SQL Editor" di sidebar kiri
- Klik "New query"

### 3. Copy & Paste Script
Salin seluruh isi file `database/add_slug_column.sql` dan paste di SQL Editor.

### 4. Jalankan Script
- Klik tombol "Run" atau tekan Ctrl+Enter
- Tunggu sampai berhasil dieksekusi

## ✅ Setelah Script Berhasil Dijalankan

Fitur yang akan berfungsi:
- ✅ Add Chord dengan SEO-friendly URLs
- ✅ Slug otomatis dari judul + artis
- ✅ URLs seperti: `/chord/laskar-pelangi-nidji` instead of `/chord/uuid`
- ✅ Spotify ID extraction (hanya ID disimpan, bukan full URL)

## 🔧 Error yang Diperbaiki

**Error sebelumnya:**
```
Error: POST .../songs?...&select=id%2Cslug 400 (Bad Request)
```

**Penyebab:** Kolom `slug` belum ada di database

**Solusi:** Jalankan script `add_slug_column.sql`

## 📋 Fitur Baru yang Ditambahkan

### 1. SEO-Friendly URLs
- ❌ Sebelum: `/chord/01f06f11-a6ea-4b5f-b5b5-3ff6f69f116f`
- ✅ Sekarang: `/chord/laskar-pelangi-nidji`

### 2. Capo Dropdown
- ✅ Dropdown dengan opsi: No Capo, Fret 1-10
- ✅ Tidak perlu typing manual lagi

### 3. Spotify ID Optimization
- ✅ Form: Input full URL Spotify
- ✅ Database: Simpan hanya ID (hemat storage)
- ✅ Player: Auto-construct embed URL

## 🚀 Ready to Use!

Setelah menjalankan script SQL, aplikasi siap digunakan dengan fitur lengkap!
