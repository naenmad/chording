export const highlightChords = (text: string): string => {
    // Split text menjadi lines untuk proses per baris
    const lines = text.split('\n');

    const processedLines = lines.map(line => {
        const trimmedLine = line.trim();

        // Deteksi section headers (Intro, Verse, Chorus, dll)
        if (isSectionHeader(trimmedLine)) {
            return `<div class="section-header">${trimmedLine}</div>`;
        }

        // Deteksi empty lines
        if (trimmedLine === '') {
            return '<div class="empty-line"></div>';
        }

        // Process chord highlights pada line biasa
        const chordPattern = /\b([A-G][#b]?(?:m|maj|min|dim|aug|sus[24]?|add[69]|M?[679]|11|13)?(?:\/[A-G][#b]?)?)\b/g;

        const processedLine = line.replace(chordPattern, (match) => {
            if (isValidChord(match.trim())) {
                return `<span class="chord-highlight">${match}</span>`;
            }
            return match;
        });

        return `<div class="lyrics-line">${processedLine}</div>`;
    });

    return processedLines.join('\n');
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