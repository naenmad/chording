# Role-Based Authorization untuk Chording App

## Overview

Sistem role-based authorization telah diimplementasikan untuk membatasi akses fitur tertentu hanya untuk user dengan role admin. Saat ini, fitur "Add Chord" hanya bisa diakses oleh admin.

## Implementasi

### 1. Database Schema

Tabel `profiles` telah ditambahkan kolom:
- `role`: ENUM ('admin', 'user') dengan default 'user'

### 2. Frontend Components

#### useAuth Hook
- Mengambil informasi user dan role dari database
- Menyediakan helper functions untuk checking admin access
- Auto-refresh profile saat auth state berubah

#### useAdminAuth Hook
- Extension dari useAuth khusus untuk admin features
- Menyediakan `hasAdminAccess` dan `requireAdmin()` functions

### 3. Protected Routes

#### /add-chord
- Hanya bisa diakses oleh user dengan role 'admin'
- Non-admin akan di-redirect ke home dengan error message
- UI menampilkan access denied message untuk non-admin

#### Navigation Menu
- Menu "Tambah Chord" hanya muncul untuk admin
- Badge "Admin" ditampilkan untuk membedakan menu admin

### 4. Database Policies (RLS)

Row Level Security policies dibuat untuk:
- Hanya admin yang bisa INSERT/UPDATE/DELETE di tabel chords
- Semua user bisa READ chords (public access)
- User hanya bisa update profile sendiri (tapi tidak bisa ubah role)

## Setup Instructions

### 1. Run Database Migration

Execute SQL script `database/add_role_authorization.sql` di Supabase SQL Editor:

```sql
-- Script akan membuat:
-- - Kolom role di tabel profiles
-- - RLS policies untuk chords table
-- - Helper functions untuk role management
```

### 2. Promote User ke Admin

Untuk membuat user pertama menjadi admin, jalankan di Supabase SQL Editor:

```sql
SELECT promote_user_to_admin('email@admin.com');
```

Atau update manual di Table Editor:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'email@admin.com';
```

### 3. Verify Implementation

1. **Test sebagai regular user:**
   - Login dengan account biasa
   - Pastikan menu "Tambah Chord" tidak muncul
   - Coba akses `/add-chord` directly → harus redirect dengan error

2. **Test sebagai admin:**
   - Login dengan account admin
   - Menu "Tambah Chord" harus muncul dengan badge "Admin"
   - Bisa akses `/add-chord` page normal

## Usage Examples

### Checking Admin Access in Components

```tsx
import { useAdminAuth } from '@/hooks/useAuth';

function MyComponent() {
    const { isAdmin, hasAdminAccess } = useAdminAuth();
    
    if (!hasAdminAccess) {
        return <div>Access denied</div>;
    }
    
    return <div>Admin content here</div>;
}
```

### Conditional Rendering

```tsx
import { useAuth } from '@/hooks/useAuth';

function Navigation() {
    const { isAdmin } = useAuth();
    
    return (
        <nav>
            <Link href="/profile">Profile</Link>
            {isAdmin && (
                <Link href="/add-chord">
                    Add Chord <span className="badge">Admin</span>
                </Link>
            )}
        </nav>
    );
}
```

### Protected API Calls

```tsx
import { useAdminAuth } from '@/hooks/useAuth';

function AddChordForm() {
    const { requireAdmin } = useAdminAuth();
    
    const handleSubmit = async () => {
        try {
            requireAdmin(); // Throws error if not admin
            
            // Proceed with admin-only operation
            await songAPI.addChord(formData);
        } catch (error) {
            console.error('Admin access required:', error);
        }
    };
}
```

## Security Features

### Frontend Security
- Route protection dengan redirect untuk non-admin
- Conditional UI rendering berdasarkan role
- Client-side validation sebelum API calls

### Backend Security (Supabase)
- Row Level Security (RLS) policies
- Database-level constraints untuk role validation
- Server-side authorization untuk semua CRUD operations

### Database Functions
- `promote_user_to_admin(email)`: Promote user ke admin
- `is_admin(user_id)`: Check admin status
- Kedua functions memiliki proper authorization checks

## Future Enhancements

1. **Multiple Roles**: Extend ke roles seperti 'moderator', 'contributor'
2. **Permissions System**: Granular permissions per feature
3. **Admin Dashboard**: Interface untuk manage users dan roles
4. **Audit Log**: Track admin actions untuk security
5. **Role Expiry**: Temporary admin access dengan expiration

## Troubleshooting

### User tidak bisa jadi admin
- Check tabel profiles ada record untuk user tersebut
- Verify column role exists dan has correct constraint
- Run promote function dengan email yang benar

### Menu tidak muncul/hilang
- Check useAuth hook return values
- Verify client-side rendering sudah selesai (mounted state)
- Check browser console untuk errors

### Database errors
- Verify RLS policies enabled
- Check user permissions di Supabase auth
- Run diagnostic queries untuk debug access

---

Sistem ini memberikan foundation yang solid untuk role-based authorization yang bisa di-extend sesuai kebutuhan aplikasi di masa depan.
