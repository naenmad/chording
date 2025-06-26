# Database Migration untuk Chord Data

## Quick Setup (Wajib Dilakukan Pertama Kali!)

🚨 **JIKA ANDA MENDAPAT ERROR 404, LAKUKAN LANGKAH INI DULU:**

```
Error: Failed to load resource: the server responded with a status of 404
eafhwyumjsgsbxkhadbi.supabase.co/rest/v1/songs?select=...
```

**Penyebab**: Tabel database belum dibuat!

**Solusi Cepat**:
1. **Buka Supabase Dashboard** → https://supabase.com/dashboard
2. **Pilih Project** → SQL Editor  
3. **Copy semua isi file** `database/create_chord_tables.sql`
4. **Paste ke SQL Editor** dan klik **Run**
5. **Tunggu sampai selesai** (seharusnya membuat 3 tabel + sample data)
6. **Refresh aplikasi** dan coba tambah chord lagi

📖 **Instruksi lengkap**: Lihat file `database/SETUP-INSTRUKSI.md`

## Overview
File ini berisi instruksi untuk mengimplementasikan perubahan dari data chord statis ke database dinamis.

## Perubahan yang Telah Dibuat

### 1. Database Schema (`database/create_chord_tables.sql`)
Membuat tabel baru untuk menyimpan data chord:
- **genres**: Menyimpan kategori musik
- **artists**: Menyimpan informasi artis
- **songs**: Menyimpan data lagu dan chord lengkap

### 2. API Functions (`src/lib/supabase.ts`)
Menambahkan fungsi `songAPI` untuk:
- `getFeaturedSongs()`: Mengambil lagu featured untuk homepage
- `getPopularSongs()`: Mengambil lagu populer
- `getSongById()`: Mengambil detail lagu berdasarkan ID
- `getGenresWithCount()`: Mengambil genre dengan jumlah lagu
- `getSongsByGenre()`: Mencari lagu berdasarkan genre
- `searchSongs()`: Pencarian lagu
- `incrementViewCount()`: Menambah view count
- `getAllArtists()`: Mengambil semua artis

### 3. Homepage (`src/app/page.tsx`)
- Mengubah dari data statis ke server-side data fetching
- Menggunakan `songAPI.getFeaturedSongs()` untuk chord terpopuler
- Menggunakan `songAPI.getGenresWithCount()` untuk daftar genre
- Menambahkan loading states dan fallback content
- Menampilkan view count pada chord cards

### 4. Popular Page (`src/app/popular/page.tsx`)
- Mengubah dari data hardcode ke dynamic database fetch
- Menggunakan `songAPI.getPopularSongs()` untuk mengambil lagu populer
- Menampilkan genre name dan view count dari database
- Loading states dan fallback content
- Support untuk semua field database

### 5. Genre Page (`src/app/genre/page.tsx`)
- Mengubah dari data statis ke dynamic database fetch
- Menggunakan `songAPI.getGenresWithCount()` untuk real-time genre count
- Link ke halaman genre detail (`/genre/songs?name=...`)
- Loading skeleton untuk UX yang smooth

### 6. Artists Page (`src/app/artists/page.tsx`)
- Mengubah dari data hardcode ke dynamic database fetch
- Menggunakan `songAPI.getAllArtists()` untuk daftar artis
- Menampilkan song count per artis dari database
- Dynamic genre filter dari database

### 7. Genre Detail Page (`src/app/genre/songs/page.tsx`)
- **BARU**: Halaman untuk menampilkan lagu berdasarkan genre
- Client-side filtering dengan search params
- Menggunakan `songAPI.getSongsByGenre()` untuk fetch lagu
- Loading, error, dan empty states
- Breadcrumb navigation

### 8. Artist Detail Page (`src/app/artists/[name]/page.tsx`)
- **BARU**: Halaman untuk menampilkan lagu dari artis tertentu  
- Dynamic routing berdasarkan nama artis
- Menggunakan `songAPI.getSongsByArtist()` untuk fetch lagu
- Artist avatar dan info display
- Loading, error, dan empty states

### 9. Add Chord Page (`src/app/add-chord/page.tsx`)
- **BARU**: Halaman untuk menambahkan chord baru
- Hanya bisa diakses oleh pengguna yang sudah login
- Form lengkap dengan validasi client-side
- Auto-redirect ke halaman detail setelah berhasil submit
- Support untuk semua field database
- Dropdown genre dari database yang existing
- Preview lyrics dengan format chord yang sama seperti di detail page
- **FITUR BARU**: Support multiple artists dengan pemisah koma
  - Input: "Raisa, Isyana Sarasvati, Tulus"
  - Output: "Raisa, Isyana Sarasvati, Tulus"
  - Preview real-time dalam bentuk badge/chips
  - Auto-cleanup whitespace dan empty values

### 4. Chord Detail Page (`src/app/chord/[id]/page.tsx`)
- Mengubah dari data hardcode ke dynamic database fetch
- Menggunakan `songAPI.getSongById()` untuk detail lagu
- Auto-increment view count saat halaman dibuka
- Loading states dan error handling
- Support untuk semua field database (artist_name, genre_name, dll)

## Cara Setup Database

⚠️ **PENTING**: Database tables harus dibuat terlebih dahulu sebelum menggunakan aplikasi!

### 1. **Buat Tabel di Supabase Dashboard**
1. Buka Supabase Dashboard → Project → SQL Editor
2. Copy-paste isi file `database/create_chord_tables.sql`
3. Klik "Run" untuk menjalankan script
4. Pastikan tidak ada error dan tabel berhasil dibuat

### 2. **Atau via Command Line**:
   ```bash
   # Jika menggunakan psql client
   psql -h db.eafhwyumjsgsbxkhadbi.supabase.co -p 5432 -d postgres -U postgres -f database/create_chord_tables.sql
   ```

### 3. **Verifikasi Tabel Berhasil Dibuat**:
   - Buka Supabase Dashboard → Table Editor
   - Pastikan tabel `songs`, `genres`, `artists` sudah ada
   - Cek sample data sudah diinsert (6 sample songs)
   - Test RLS policies dengan query sederhana

### 4. **Troubleshooting Error 404**:
   Jika mendapat error "Failed to load resource: 404" seperti:
   ```
   eafhwyumjsgsbxkhadbi.supabase.co/rest/v1/songs?select=...
   ```
   
   **Penyebab**: Tabel `songs` belum ada di database
   
   **Solusi**: 
   1. Jalankan script SQL `database/create_chord_tables.sql` di Supabase Dashboard
   2. Refresh halaman aplikasi
   3. Coba tambah chord lagi

### 5. **Environment Variables**:
   Pastikan sudah ada di `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://eafhwyumjsgsbxkhadbi.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## Features Baru

### Homepage
- **Dynamic Featured Chords**: Menampilkan lagu berdasarkan `is_featured = true`
- **Dynamic Genres**: Menghitung otomatis jumlah lagu per genre
- **View Counter**: Menampilkan jumlah views untuk setiap lagu
- **Fallback Content**: Loading skeleton dan fallback saat data tidak tersedia

### Popular Page
- **Dynamic Popular Songs**: Menampilkan lagu berdasarkan `is_popular = true` dan view count
- **Real-time Data**: Langsung dari database, bukan hardcode
- **Genre Display**: Menampilkan genre untuk setiap lagu
- **Loading States**: Skeleton loading yang smooth

### Genre Pages
- **Dynamic Genre List**: Jumlah lagu per genre otomatis update
- **Genre Detail Page**: Halaman dedicated untuk melihat lagu per genre
- **Search by Genre**: Filter lagu berdasarkan genre yang dipilih
- **Empty States**: Handling ketika genre belum memiliki lagu

### Artists Pages
- **Dynamic Artist List**: Daftar artis dari database dengan song count
- **Artist Detail Page**: Halaman dedicated untuk melihat lagu per artis
- **Search by Artist**: Filter lagu berdasarkan artis yang dipilih
- **Song Count Display**: Menampilkan jumlah lagu per artis

### Chord Detail Page
- **Database Integration**: Semua data diambil dari database
- **Auto View Increment**: View count otomatis bertambah saat halaman dibuka
- **Dynamic Metadata**: Title, artist, genre, dll dari database
- **Error Handling**: Proper 404 handling untuk lagu yang tidak ada

## Sample Data
Database sudah include 6 sample lagu:
1. Bintang di Surga - Peterpan (Intermediate)
2. Kau Adalah - Isyana Sarasvati (Easy)
3. Aku Milikmu - Iwan Fals (Advanced)
4. Mencari Alasan - Exists (Intermediate)
5. Dan - Sheila on 7 (Intermediate)
6. Laskar Pelangi - Nidji (Easy)

## Next Steps
1. **Jalankan SQL script** untuk setup database
2. **Test homepage** - pastikan featured chords muncul
3. **Test popular page** - pastikan lagu populer muncul dari database
4. **Test genre pages** - pastikan genre dan detail genre berfungsi
5. **Test artists pages** - pastikan artis dan detail artis berfungsi  
6. **Test chord detail pages** - klik salah satu chord untuk melihat detail
7. **Tambah data** - insert lebih banyak lagu via admin panel atau SQL
8. **Setup search functionality** - implement search di header
9. **Optimasi performance** - add caching jika diperlukan

## Troubleshooting

### Error 404 - Tabel Tidak Ditemukan
**Gejala**: 
```
Failed to load resource: the server responded with a status of 404
eafhwyumjsgsbxkhadbi.supabase.co/rest/v1/songs?select=...
Error adding song: Object
```

**Penyebab**: Tabel `songs`, `genres`, atau `artists` belum dibuat di database Supabase.

**Solusi**:
1. **Buka Supabase Dashboard** → SQL Editor
2. **Copy-paste script** dari `database/create_chord_tables.sql`
3. **Klik Run** untuk menjalankan script
4. **Refresh aplikasi** dan coba lagi

### Jika Homepage Blank
- Cek console browser untuk error
- Pastikan Supabase connection berfungsi
- Verify RLS policies allow public read access
- **Pastikan tabel sudah dibuat** (lihat error 404 di atas)

### Jika Chord Detail 404
- Pastikan ID yang digunakan ada di database
- Cek UUID format (harus UUID v4, bukan integer)
- Test dengan sample data yang sudah diinsert
- **Pastikan tabel songs sudah dibuat**

### Error Permission Denied
- Cek RLS policies di Supabase Dashboard
- Pastikan policy "Enable read access for all users" aktif
- Untuk insert/update, pastikan user sudah authenticated

### Performance Issues
- Monitor Supabase dashboard untuk slow queries
- Consider adding indexes untuk search fields
- Implement caching untuk frequently accessed data
