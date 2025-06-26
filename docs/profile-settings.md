# Profile & Settings Pages

## Overview
Halaman Profile dan Settings telah dibuat untuk memberikan pengguna kontrol penuh atas akun dan preferensi mereka di aplikasi Chording.

## Features

### Profile Page (`/profile`)
**Akses**: Memerlukan login

**Fitur utama:**
- **View/Edit Profile**: Full name, username, bio, location, website
- **Avatar Display**: Avatar dari Google OAuth atau initial dari nama/email
- **Account Info**: Tipe akun (Google/Email), tanggal bergabung, terakhir login
- **Activity Stats**: Favorite chords, playlists, songs learned, practice hours
- **Responsive Design**: Tampil optimal di desktop dan mobile

### Settings Page (`/settings`)
**Akses**: Memerlukan login

**4 Tab Utama:**

#### 1. Account Tab
- **Update Email**: Ubah alamat email (dengan konfirmasi)
- **Change Password**: Khusus untuk user email (bukan Google OAuth)
- **Account Information**: Tipe akun, member since, last sign in

#### 2. Preferences Tab
- **Auto Scroll Speed**: Slow/Medium/Fast
- **Default Instrument**: Guitar/Ukulele/Piano
- **Chord Display Style**: Diagram/Text Only/Both

#### 3. Notifications Tab
- **Email Notifications**: Updates tentang akun
- **Practice Reminders**: Pengingat latihan rutin
- **New Features**: Notifikasi fitur baru
- **Marketing Emails**: Konten promosi dan tips

#### 4. Privacy & Security Tab
- **Sign Out**: Keluar dari semua device
- **Download Data**: Request export data personal
- **Delete Account**: Hapus akun permanen (dengan konfirmasi)

## Database Schema

### Tables yang diperlukan:
1. **`profiles`** - Data profil user
2. **`user_preferences`** - Preferensi aplikasi
3. **`user_stats`** - Statistik aktivitas

### Setup Database:
1. Jalankan `database/init_user_tables.sql` di Supabase SQL Editor
2. Schema otomatis membuat data default saat user baru register
3. RLS (Row Level Security) memastikan user hanya akses data sendiri

## Navigation

### Akses melalui Navbar:
- **Desktop**: Dropdown menu user → "Profil Saya" / "Pengaturan"
- **Mobile**: Menu hamburger → "Profil Saya" / "Pengaturan"

### Cross-navigation:
- Profile page → Settings page (tombol "Settings")
- Settings page → Profile page (tombol "View Profile")

## User Experience

### Authentication States:
- **Not Logged In**: Redirect ke `/login` dengan pesan
- **Loading**: Spinner loading state
- **Logged In**: Full access ke semua fitur

### Form Handling:
- **Real-time validation**: Password strength, email format
- **Success/Error messages**: Clear feedback untuk setiap action
- **Loading states**: Disable buttons saat processing
- **Auto-save**: Beberapa perubahan tersimpan otomatis

### Responsive Design:
- **Mobile-first approach**: Optimal di semua device
- **Touch-friendly**: Button size dan spacing yang sesuai
- **Grid layout**: Adjustable column layout

## Security Features

### Row Level Security (RLS):
- User hanya bisa akses/edit data mereka sendiri
- Policy database mencegah unauthorized access

### Input Validation:
- Email format validation
- Password minimum 6 karakter
- Username uniqueness check
- URL format validation untuk website

### Safe Operations:
- Confirmation dialog untuk delete account
- Logout dari semua device
- Secure password update flow

## Implementation Notes

### OAuth vs Email Users:
- **Google OAuth**: Tidak bisa ubah password (managed by Google)
- **Email Users**: Full control termasuk password change
- **Avatar**: Google users get profile picture, email users get generated avatar

### Data Sync:
- Profile data tersimpan di `profiles` table
- Preferences tersimpan di `user_preferences` table  
- Stats akan update seiring aktivitas user (future feature)

### Performance:
- **Single page loads**: Fetch semua data sekaligus saat load
- **Optimistic updates**: UI update sebelum server response
- **Error handling**: Graceful fallback jika fetch gagal

## Future Enhancements

### Planned Features:
- **Avatar upload**: Upload custom profile picture
- **Social features**: Public profiles, follow/unfollow
- **Activity tracking**: Real-time stats update
- **Export functionality**: Complete data export dalam JSON/PDF
- **Dark mode**: Theme preference setting
- **Advanced preferences**: More granular control

### Integration Points:
- **Spotify**: Sync listening habits untuk stats
- **Practice tracking**: Integration dengan chord practice sessions
- **Social sharing**: Share achievements dan stats
- **Notifications**: Push notifications untuk reminders

## Testing

### Manual Testing Checklist:
- [ ] Register user baru → check auto-created profile
- [ ] Login → access profile page
- [ ] Edit profile → verify data saves
- [ ] Change preferences → verify persistence
- [ ] Update email → check confirmation flow
- [ ] Change password (email users) → verify works
- [ ] Sign out → verify logout
- [ ] Mobile responsive → test all screen sizes
- [ ] Error states → test network failures
- [ ] Validation → test invalid inputs

### Database Testing:
- [ ] Check RLS policies work
- [ ] Verify triggers create default data
- [ ] Test unique constraints (username)
- [ ] Verify cascade deletes work
- [ ] Check indexes improve performance
