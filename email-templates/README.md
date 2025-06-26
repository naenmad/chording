# Email Templates untuk Chording!

Template email HTML kustom untuk berbagai jenis email Supabase Auth pada project Chording.

## 📁 Struktur File

```
email-templates/
├── README.md                   # Dokumentasi ini
├── base-template.html          # Template dasar (untuk referensi)
├── confirm-signup.html         # Email konfirmasi pendaftaran
├── invite-user.html           # Email undangan user
├── magic-link.html            # Email magic link login
├── change-email.html          # Email konfirmasi perubahan email
├── reset-password.html        # Email reset password
└── reauthentication.html      # Email verifikasi ulang
```

## 🎨 Desain & Branding

### Warna Brand
- **Primary**: `#00FFFF` (Cyan)
- **Secondary**: `#B0A0D0` (Light Purple)
- **Dark**: `#1A2A3A` (Dark Blue)
- **Background**: Linear gradient `#1A2A3A` → `#2A3A4A` → `#1A2A3A`

### Fitur Desain
- ✅ Responsive design (mobile-friendly)
- ✅ Consistent branding dengan aplikasi
- ✅ Modern gradient backgrounds
- ✅ Interactive buttons dengan hover effects
- ✅ Icon SVG untuk setiap jenis email
- ✅ Typography yang mudah dibaca
- ✅ Accessibility considerations

## 📧 Jenis Template

### 1. Confirm Sign Up (`confirm-signup.html`)
**Digunakan untuk**: Konfirmasi pendaftaran akun baru
**Variabel Supabase**:
- `{{ .SiteURL }}` - URL website
- `{{ .Email }}` - Email pengguna
- `{{ .ConfirmationURL }}` - Link konfirmasi

**Fitur**:
- Welcome message untuk user baru
- Informasi fitur Chording
- CTA button untuk konfirmasi
- Tips dan panduan

### 2. Invite User (`invite-user.html`)
**Digunakan untuk**: Mengundang user bergabung
**Variabel Supabase**:
- `{{ .SiteURL }}` - URL website
- `{{ .ConfirmationURL }}` - Link undangan

**Fitur**:
- Kartu undangan dengan gradien
- Daftar benefit bergabung
- Informasi batas waktu undangan
- CTA yang menarik

### 3. Magic Link (`magic-link.html`)
**Digunakan untuk**: Login tanpa password
**Variabel Supabase**:
- `{{ .SiteURL }}` - URL website
- `{{ .Email }}` - Email pengguna
- `{{ .ConfirmationURL }}` - Magic link

**Fitur**:
- Kartu magic link dengan efek visual
- Informasi keamanan dan batas waktu
- Peringatan keamanan
- Tips penggunaan yang aman

### 4. Change Email (`change-email.html`)
**Digunakan untuk**: Konfirmasi perubahan email
**Variabel Supabase**:
- `{{ .SiteURL }}` - URL website
- `{{ .Email }}` - Email lama
- `{{ .NewEmail }}` - Email baru
- `{{ .ConfirmationURL }}` - Link konfirmasi

**Fitur**:
- Visual perubahan email (dari → ke)
- Penjelasan proses perubahan
- Informasi keamanan
- Panduan setelah konfirmasi

### 5. Reset Password (`reset-password.html`)
**Digunakan untuk**: Reset password
**Variabel Supabase**:
- `{{ .SiteURL }}` - URL website
- `{{ .Email }}` - Email pengguna
- `{{ .ConfirmationURL }}` - Link reset password

**Fitur**:
- Peringatan keamanan yang jelas
- Tips password yang aman
- Informasi batas waktu
- Panduan jika bukan user yang request

### 6. Reauthentication (`reauthentication.html`)
**Digunakan untuk**: Verifikasi identitas untuk tindakan sensitif
**Variabel Supabase**:
- `{{ .SiteURL }}` - URL website
- `{{ .Email }}` - Email pengguna
- `{{ .CreatedAt }}` - Waktu request
- `{{ .ConfirmationURL }}` - Link verifikasi

**Fitur**:
- Badge keamanan dengan visual menarik
- Grid informasi akun dan waktu
- Penjelasan mengapa verifikasi diperlukan
- Peringatan keamanan yang ketat

## 🔧 Cara Menggunakan

### 1. Upload ke Supabase Dashboard
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Ke **Authentication** → **Email Templates**
4. Pilih jenis template yang ingin diubah
5. Copy-paste kode HTML dari file yang sesuai
6. Klik **Save**

### 2. Testing Template
Setelah upload, test template dengan:
- Membuat akun baru (confirm signup)
- Request reset password
- Login dengan magic link
- Mengundang user baru

### 3. Customization
Untuk customize lebih lanjut:
- Edit warna di bagian CSS
- Ubah teks sesuai kebutuhan
- Tambahkan informasi kontak
- Sesuaikan link footer

## 📱 Mobile Responsiveness

Semua template telah dioptimasi untuk mobile dengan:
- Media queries untuk layar kecil
- Button yang mudah di-tap
- Typography yang scalable
- Layout yang adaptive

## 🔒 Keamanan

Template mencakup:
- ✅ Peringatan keamanan yang jelas
- ✅ Informasi batas waktu link
- ✅ Panduan jika user tidak melakukan action
- ✅ Tips keamanan akun

## 🎯 Variabel Supabase

Variabel yang umum digunakan:
- `{{ .SiteURL }}` - URL website (dari settings Supabase)
- `{{ .Email }}` - Email penerima
- `{{ .ConfirmationURL }}` - Link aksi
- `{{ .Token }}` - Token (jika diperlukan)
- `{{ .NewEmail }}` - Email baru (untuk change email)
- `{{ .CreatedAt }}` - Timestamp

## 🚀 Deployment

1. **Development**: Test di local environment
2. **Staging**: Upload ke Supabase staging project
3. **Production**: Upload ke Supabase production project

## 📞 Support

Jika ada pertanyaan tentang template:
- Cek dokumentasi Supabase Auth
- Test template di environment development
- Pastikan variabel Supabase sesuai

## 🔄 Update Log

- **v1.0**: Template awal dengan 6 jenis email
- Konsisten dengan branding Chording
- Responsive design
- Keamanan dan accessibility
