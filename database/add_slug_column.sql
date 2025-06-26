-- Add slug column to songs table for SEO-friendly URLs
-- Run this script in Supabase SQL editor

-- 1. Add slug column to songs table
ALTER TABLE songs ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 2. Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_songs_slug ON songs(slug);

-- 3. Create function to generate slug from title and artist
CREATE OR REPLACE FUNCTION generate_slug(title TEXT, artist TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Create base slug from title and artist
    base_slug := LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    title || '-' || artist,
                    '[^a-zA-Z0-9\s\-]', '', 'g'  -- Remove special characters except spaces and hyphens
                ),
                '\s+', '-', 'g'  -- Replace spaces with hyphens
            ),
            '-+', '-', 'g'  -- Replace multiple hyphens with single hyphen
        )
    );
    
    -- Remove leading/trailing hyphens
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    -- Ensure slug is not empty
    IF base_slug = '' THEN
        base_slug := 'song';
    END IF;
    
    -- Check for uniqueness and add number if needed
    final_slug := base_slug;
    
    WHILE EXISTS (SELECT 1 FROM songs WHERE slug = final_slug) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger function to auto-generate slug
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate slug if it's not provided or if title/artist changed
    IF NEW.slug IS NULL OR NEW.slug = '' OR 
       (TG_OP = 'UPDATE' AND (OLD.title != NEW.title OR OLD.artist_name != NEW.artist_name)) THEN
        NEW.slug := generate_slug(NEW.title, COALESCE(NEW.artist_name, 'unknown'));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger to auto-generate slug on insert/update
DROP TRIGGER IF EXISTS trigger_auto_generate_slug ON songs;
CREATE TRIGGER trigger_auto_generate_slug
    BEFORE INSERT OR UPDATE ON songs
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_slug();

-- 6. Generate slugs for existing songs (if any)
UPDATE songs 
SET slug = generate_slug(title, COALESCE(artist_name, 'unknown'))
WHERE slug IS NULL OR slug = '';

-- 7. Make slug NOT NULL after generating for existing records
ALTER TABLE songs ALTER COLUMN slug SET NOT NULL;

-- 8. Update spotify_url column comment for clarity
COMMENT ON COLUMN songs.spotify_url IS 'Stores Spotify track ID only (e.g., "4uLU6hMCjMI75M1A2tKUQC"), not full URL. App will construct embed URL from this ID.';

-- Example slugs that will be generated:
-- "Laskar Pelangi" by "Nidji" -> "laskar-pelangi-nidji"
-- "Ku Ingin" by "Dewa 19" -> "ku-ingin-dewa-19"
-- "Separuh Aku" by "Noah" -> "separuh-aku-noah"
