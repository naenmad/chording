# Daftar Genre Musik - Chording App

## Genre yang Tersedia di Add Chord

### Genre Populer Indonesia
- **Pop** - Musik pop Indonesia mainstream
- **Rock** - Rock Indonesia dan internasional  
- **Ballad** - Lagu slow/romantis dengan lirik mendalam
- **Dangdut** - Genre khas Indonesia
- **Keroncong** - Musik tradisional Indonesia
- **Campursari** - Perpaduan gamelan dan musik modern
- **Slow Rock** - Rock dengan tempo lambat
- **Love Song** - Lagu cinta/romantis

### Genre Internasional
- **Jazz** - Musik jazz klasik dan modern
- **Folk** - Musik rakyat/tradisional
- **Acoustic** - Musik akustik tanpa amplifikasi
- **Alternative** - Musik alternatif/indie
- **Indie** - Independent music
- **R&B** - Rhythm and Blues
- **Soul** - Musik soul
- **Reggae** - Musik dari Jamaica
- **Ska** - Predecessor reggae
- **Punk** - Musik punk rock
- **Metal** - Heavy metal dan varian
- **Hip Hop** - Musik hip hop
- **Rap** - Musik rap
- **Electronic** - Musik elektronik
- **EDM** - Electronic Dance Music
- **Classical** - Musik klasik
- **Country** - Musik country
- **Blues** - Musik blues
- **Gospel** - Musik rohani Kristen
- **Spiritual** - Musik spiritual/rohani
- **Bossa Nova** - Musik Brazil
- **Latin** - Musik Latin Amerika
- **World Music** - Musik dunia
- **Fusion** - Perpaduan berbagai genre
- **Progressive** - Musik progresif
- **Experimental** - Musik eksperimental

### Genre Khusus
- **Soundtrack** - Musik film/TV
- **Instrumental** - Musik tanpa vokal

## Cara Kerja System Genre

1. **Dynamic Loading**: Genre dari database ditampilkan terlebih dahulu
2. **Fallback List**: Jika genre belum ada di database, tersedia fallback list lengkap
3. **No Duplicates**: System otomatis menghindari duplikasi genre
4. **Extensible**: Admin dapat menambah genre baru via database

## Tips Memilih Genre

- **Untuk lagu cinta/romantis**: Pilih "Ballad" atau "Love Song"
- **Untuk lagu akustik**: Pilih "Acoustic" atau "Folk"  
- **Untuk lagu daerah**: Pilih "Keroncong" atau "Campursari"
- **Untuk lagu rohani**: Pilih "Gospel" atau "Spiritual"
- **Untuk lagu instrumental**: Pilih "Instrumental"
- **Jika ragu**: Pilih genre yang paling mendekati atau "Pop" sebagai default

## Menambah Genre Baru

Genre baru dapat ditambahkan dengan 2 cara:

1. **Via Database** (Recommended):
   ```sql
   INSERT INTO genres (name, count) VALUES ('New Genre', 0);
   ```

2. **Via Code** (untuk genre umum):
   Tambahkan ke array fallback di `add-chord/page.tsx`

Genre dari database akan selalu diprioritaskan dan muncul di atas list.
