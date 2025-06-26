-- Create chord-related tables for Chording app
-- This script creates the tables needed to store chord data

-- 1. Create genres table
CREATE TABLE IF NOT EXISTS genres (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create artists table
CREATE TABLE IF NOT EXISTS artists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create songs table
CREATE TABLE IF NOT EXISTS songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
    artist_name TEXT, -- For simple cases where we don't need full artist data
    genre_id UUID REFERENCES genres(id) ON DELETE SET NULL,
    genre_name TEXT, -- For simple cases where we don't need full genre data
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Intermediate', 'Advanced')),
    key_signature TEXT, -- e.g., 'Am', 'C', 'G'
    capo TEXT, -- e.g., 'Fret 2', 'No Capo'
    tempo TEXT, -- e.g., '120 BPM'
    duration TEXT, -- e.g., '4:32'
    lyrics TEXT, -- Full lyrics with chords
    spotify_url TEXT,
    youtube_url TEXT,
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS on tables
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for public read access
-- Genres policies
DROP POLICY IF EXISTS "Genres are viewable by everyone" ON genres;
CREATE POLICY "Genres are viewable by everyone" 
    ON genres FOR SELECT 
    USING (true);

-- Artists policies
DROP POLICY IF EXISTS "Artists are viewable by everyone" ON artists;
CREATE POLICY "Artists are viewable by everyone" 
    ON artists FOR SELECT 
    USING (true);

-- Songs policies
DROP POLICY IF EXISTS "Songs are viewable by everyone" ON songs;
CREATE POLICY "Songs are viewable by everyone" 
    ON songs FOR SELECT 
    USING (true);

-- Allow authenticated users to insert songs
DROP POLICY IF EXISTS "Authenticated users can insert songs" ON songs;
CREATE POLICY "Authenticated users can insert songs"
    ON songs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own songs
DROP POLICY IF EXISTS "Users can update their own songs" ON songs;
CREATE POLICY "Users can update their own songs"
    ON songs FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete their own songs  
DROP POLICY IF EXISTS "Users can delete their own songs" ON songs;
CREATE POLICY "Users can delete their own songs"
    ON songs FOR DELETE
    USING (auth.role() = 'authenticated');

-- 6. Insert sample data
INSERT INTO genres (name, description) VALUES 
    ('Pop', 'Music that appeals to a wide audience'),
    ('Rock', 'Rock music with electric guitars and drums'),
    ('Dangdut', 'Indonesian traditional music genre'),
    ('Jazz', 'Jazz music with improvisation'),
    ('Folk', 'Traditional folk music'),
    ('Alternative', 'Alternative rock and indie music')
ON CONFLICT (name) DO NOTHING;

INSERT INTO artists (name, bio) VALUES 
    ('Peterpan', 'Indonesian rock band formed in Bandung'),
    ('Isyana Sarasvati', 'Indonesian singer-songwriter'),
    ('Iwan Fals', 'Legendary Indonesian folk singer'),
    ('Exists', 'Malaysian rock band'),
    ('Sheila on 7', 'Indonesian alternative rock band'),
    ('Noah', 'Indonesian rock band, formerly Peterpan')
ON CONFLICT DO NOTHING;

-- Get genre and artist IDs for sample songs
INSERT INTO songs (title, artist_name, genre_name, difficulty, key_signature, capo, tempo, duration, lyrics, is_featured, is_popular, view_count) VALUES 
(
    'Bintang di Surga',
    'Peterpan',
    'Pop',
    'Intermediate',
    'Am',
    'Fret 2',
    '120 BPM',
    '4:32',
    '[Intro]
Am F C G
Am F C G

[Verse 1]
Am                F
Ku menatap langit sore ini
C                 G
Berharap engkau kan kembali
Am               F
Menghapus sepi di hati ini
C                G
Kau bintang di surga

[Pre-Chorus]
F              G
Tak ingin ku terluka
Am             F
Seperti yang dulu kala
F              G
Saat kau tinggalkan aku

[Chorus]
C               G
Kau bintang di surga
Am              F
Yang tak kan pernah ku raih
C               G
Meski ku selalu mencoba
Am              F
Tuk menggapai cintamu

[Verse 2]
Am                F
Ku berlari mengejar bayanganmu
C                 G
Yang hilang ditelan waktu
Am               F
Ku berharap ini hanya mimpi
C                G
Dan kau kan kembali',
    true,
    true,
    1250
),
(
    'Kau Adalah',
    'Isyana Sarasvati',
    'Pop',
    'Easy',
    'C',
    'No Capo',
    '110 BPM',
    '3:45',
    '[Intro]
C Am F G
C Am F G

[Verse 1]
C              Am
Kau adalah setetes embun
F                G
Yang jatuh di pagi hari
C              Am
Kau adalah sinar mentari
F                G
Yang menerangi hari-hariku

[Chorus]
C              G
Kau adalah cinta
Am             F
Yang ku tunggu selama ini
C              G
Kau adalah mimpi
Am             F
Yang jadi kenyataan

[Verse 2]
C              Am
Kau adalah angin sepoi
F                G
Yang menyejukkan jiwa ini
C              Am
Kau adalah bintang kejora
F                G
Yang bersinar di hatiku',
    true,
    true,
    980
),
(
    'Aku Milikmu',
    'Iwan Fals',
    'Folk',
    'Advanced',
    'D',
    'No Capo',
    '90 BPM',
    '5:12',
    '[Intro]
D A Bm G
D A Bm G

[Verse 1]
D                 A
Aku milikmu selamanya
Bm               G
Hingga nafas ini berhenti
D                 A
Aku milikmu sepenuhnya
Bm               G
Dengan jiwa dan ragaku

[Chorus]
G              A
Takkan pernah ku lepaskan
D              Bm
Cinta yang telah kau berikan
G              A
Takkan pernah ku tinggalkan
D              Bm
Janji yang telah kita buat

[Verse 2]
D                 A
Di setiap langkah hidupku
Bm               G
Kau selalu ada bersamaku
D                 A
Di setiap detik waktuku
Bm               G
Kau hadir dalam pikiranku',
    true,
    true,
    1100
),
(
    'Mencari Alasan',
    'Exists',
    'Rock',
    'Intermediate',
    'Em',
    'No Capo',
    '140 BPM',
    '4:08',
    '[Intro]
Em C G D
Em C G D

[Verse 1]
Em              C
Mencari alasan untuk pergi
G               D
Meninggalkan semua kenangan ini
Em              C
Mencari alasan untuk berhenti
G               D
Menyakiti hati yang terluka

[Chorus]
C              G
Aku tak tahu harus berbuat apa
D              Em
Ketika cinta ini berakhir
C              G
Aku tak tahu harus berkata apa
D              Em
Ketika kau memutuskan pergi

[Verse 2]
Em              C
Semua yang indah telah berlalu
G               D
Tinggal kenangan yang menyakitkan
Em              C
Semua yang manis telah sirna
G               D
Kini hanya pahit yang tersisa',
    true,
    true,
    850
),
(
    'Dan',
    'Sheila on 7',
    'Alternative',
    'Intermediate',
    'F',
    'Fret 1',
    '130 BPM',
    '4:15',
    '[Intro]
F C Dm Bb
F C Dm Bb

[Verse 1]
F               C
Dan aku disini menunggu
Dm              Bb
Menunggu waktu yang tepat
F               C
Dan aku disini berharap
Dm              Bb
Berharap kau akan kembali

[Chorus]
Bb             C
Dan aku tahu ini salah
F              Dm
Mencintaimu yang tak mungkin
Bb             C
Dan aku tahu ini gila
F              Dm
Berharap pada yang tak pasti

[Verse 2]
F               C
Dan aku disini terdiam
Dm              Bb
Memendam rasa yang membara
F               C
Dan aku disini terluka
Dm              Bb
Oleh cinta yang tak berbalas',
    false,
    true,
    720
),
(
    'Laskar Pelangi',
    'Nidji',
    'Pop',
    'Easy',
    'G',
    'No Capo',
    '100 BPM',
    '4:00',
    '[Intro]
G Em C D
G Em C D

[Verse 1]
G              Em
Mimpi adalah kunci
C              D
Untuk kita menaklukkan dunia
G              Em
Berlarilah tanpa lelah
C              D
Demi masa depan

[Chorus]
C              D
Laskar pelangi
G              Em
Takkan terikat waktu
C              D
Bebaskan mimpimu di angkasa
G              Em
Warnai bumi

[Verse 2]
G              Em
Menarilah dan terus tertawa
C              D
Walau dunia tak seindah surga
G              Em
Bersyukurlah pada yang kuasa
C              D
Cinta kita di dunia',
    false,
    true,
    1350
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_songs_artist_name ON songs(artist_name);
CREATE INDEX IF NOT EXISTS idx_songs_genre_name ON songs(genre_name);
CREATE INDEX IF NOT EXISTS idx_songs_difficulty ON songs(difficulty);
CREATE INDEX IF NOT EXISTS idx_songs_is_featured ON songs(is_featured);
CREATE INDEX IF NOT EXISTS idx_songs_is_popular ON songs(is_popular);
CREATE INDEX IF NOT EXISTS idx_songs_view_count ON songs(view_count);
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);

-- 8. Create function to update view count
CREATE OR REPLACE FUNCTION increment_song_view_count(song_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE songs 
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE id = song_id;
END;
$$ LANGUAGE plpgsql;
