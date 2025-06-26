export const highlightChords = (text: string): string => {
    // Split text menjadi lines untuk proses per baris
    const lines = text.split('\n');

    const processedLines = lines.map(line => {
        const trimmedLine = line.trim();        // Deteksi section headers (Intro, Verse, Chorus, dll)
        if (isSectionHeader(trimmedLine)) {
            const cleanedHeader = cleanSectionHeader(trimmedLine);
            return `<div class="section-header">${cleanedHeader}</div>`;
        }

        // Deteksi empty lines
        if (trimmedLine === '') {
            return '<div class="empty-line"></div>';
        }

        // Deteksi apakah line ini adalah chord line (hanya berisi chord dan spasi)
        if (isChordLine(line)) {
            // Process chord highlights pada chord line - pertahankan spacing asli
            const chordPattern = /\b([A-G][#b]?(?:m|maj|min|dim|aug|sus[24]?|add[69]|M?[679]|11|13)?(?:\/[A-G][#b]?)?)\b/g;

            const processedLine = line.replace(chordPattern, (match) => {
                if (isValidChord(match.trim())) {
                    return `<span class="chord-highlight">${match}</span>`;
                }
                return match;
            });

            return `<div class="chord-line">${processedLine}</div>`;
        } else {
            // Untuk lyrics line, tidak perlu highlight chord
            return `<div class="lyrics-line">${line}</div>`;
        }
    });

    return processedLines.join('\n');
};

// Fungsi untuk membersihkan section header
const cleanSectionHeader = (header: string): string => {
    // Hapus kurung siku dan buat title case
    const cleaned = header.replace(/[\[\]]/g, '').trim();

    // Buat title case (kata pertama kapital, sisanya kecil)
    return cleaned.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

// Fungsi untuk mendeteksi apakah line berisi chord
const isChordLine = (line: string): boolean => {
    const trimmedLine = line.trim();

    // Jika line kosong, bukan chord line
    if (trimmedLine === '') return false;

    // Split line berdasarkan spasi dan filter yang kosong
    const words = trimmedLine.split(/\s+/).filter(word => word.length > 0);

    // Jika tidak ada kata, bukan chord line
    if (words.length === 0) return false;

    // Hitung berapa banyak kata yang merupakan chord valid
    const chordCount = words.filter(word => isValidChord(word)).length;

    // Jika hanya ada 1 kata dan itu chord valid, anggap sebagai chord line
    if (words.length === 1 && chordCount === 1) {
        return true;
    }

    // Jika lebih dari 50% kata adalah chord valid, anggap sebagai chord line
    // Dan minimal ada 2 chord atau lebih
    return chordCount >= 2 && (chordCount / words.length) > 0.5;
};

const isSectionHeader = (line: string): boolean => {
    const sectionKeywords = [
        'intro', 'verse', 'chorus', 'bridge', 'outro', 'refrain',
        'pre-chorus', 'interlude', 'solo', 'coda', 'reff',
        'bait', 'reff', 'bridge'
    ];

    const lowerLine = line.toLowerCase();

    // Cek apakah line hanya berisi section keyword (dengan atau tanpa angka)
    return sectionKeywords.some(keyword => {
        const regex = new RegExp(`^\\s*\\[?${keyword}\\s*\\d*\\]?\\s*:?\\s*$`, 'i');
        return regex.test(lowerLine) || lowerLine === keyword;
    });
};

const isValidChord = (chord: string): boolean => {
    // Root notes yang valid
    const validRoots = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    // Cek apakah dimulai dengan root note yang valid
    const hasValidRoot = validRoots.some(root => {
        return chord.startsWith(root) || chord.startsWith(root + '#') || chord.startsWith(root + 'b');
    });

    // Hindari kata-kata umum yang bukan chord
    const excludeWords = ['An', 'As', 'At', 'Be', 'By', 'Do', 'Go', 'He', 'If', 'In', 'Is', 'It', 'Me', 'My', 'No', 'Of', 'On', 'Or', 'So', 'To', 'Up', 'We'];
    const isCommonWord = excludeWords.includes(chord) && chord.length <= 2;

    return hasValidRoot && !isCommonWord;
};