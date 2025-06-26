# Automatic Featured & Popular Chord System

## Perubahan dari Sistem Manual ke Otomatis

### Sebelumnya (Manual)
- User bisa mencentang "Tampilkan sebagai chord pilihan di homepage"
- User bisa mencentang "Masukkan ke daftar chord populer"
- Tidak adil dan tidak berdasarkan kualitas/popularitas sebenarnya

### Sekarang (Otomatis)
- **Featured Songs**: Ditentukan berdasarkan view count dari 30 hari terakhir
- **Popular Songs**: Ditentukan berdasarkan threshold view count minimum (10+ views)
- Sistem yang lebih fair dan berdasarkan engagement sebenarnya

## Algoritma Baru

### Featured Songs (Homepage)
1. Mengambil lagu dengan view count tertinggi dari 30 hari terakhir
2. Jika tidak cukup data recent, fallback ke all-time popular
3. Otomatis ter-update berdasarkan activity real-time

### Popular Songs (Halaman Popular)
1. Menampilkan lagu dengan minimum 10 views
2. Diurutkan berdasarkan view count tertinggi
3. Threshold bisa disesuaikan sesuai kebutuhan

## Fungsi Admin (Opsional)
- `setFeaturedStatus()`: Untuk manual override jika diperlukan
- `updatePopularStatus()`: Untuk batch update status popular
- Kedua fungsi ini bisa dijalankan secara berkala atau on-demand

## Keuntungan Sistem Baru
1. ✅ **Fair**: Berdasarkan engagement nyata, bukan self-promotion
2. ✅ **Otomatis**: Tidak perlu manual intervention
3. ✅ **Real-time**: Update berdasarkan view count terbaru
4. ✅ **Quality Control**: Chord berkualitas akan naik secara natural
5. ✅ **User Experience**: User fokus pada content, bukan gaming system

## Database Schema
Kolom `is_featured` dan `is_popular` tetap ada untuk:
- Backward compatibility
- Manual override oleh admin jika diperlukan
- Cache untuk performance (daripada calculate real-time terus)

Tapi secara default, user biasa tidak bisa mengubah nilai ini.
