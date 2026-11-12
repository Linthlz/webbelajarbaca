// Huruf A–Z.
//   sound  : ejaan yang dikirim ke mesin suara untuk BUNYI (fonem) huruf — "beh", bukan "bé".
//   name   : ejaan untuk NAMA huruf.
//   ipa    : tulisan bunyi yang ditampilkan untuk pendamping.
// Mesin suara (TTS) hanya bisa mendekati bunyi fonem tunggal; untuk bunyi yang persis,
// daftarkan rekaman "phoneme/<huruf>" di public/assets/audio/manifest.json.
const L = (letter, word, pic, sound, name, ipa) => ({ letter, lower: letter.toLowerCase(), word, pic, sound, name, ipa })

export const ALPHABET = [
  L('A', 'Apel', 'apel', 'a', 'a', '/a/'),
  L('B', 'Bola', 'bola', 'beh', 'bé', '/b/'),
  L('C', 'Cicak', 'cicak', 'ceh', 'cé', '/c/'),
  L('D', 'Dadu', 'dadu', 'deh', 'dé', '/d/'),
  L('E', 'Ember', 'ember', 'é', 'é', '/e/'),
  L('F', 'Foto', 'foto', 'feh', 'éf', '/f/'),
  L('G', 'Gajah', 'gajah', 'geh', 'gé', '/g/'),
  L('H', 'Harimau', 'harimau', 'heh', 'ha', '/h/'),
  L('I', 'Ikan', 'ikan', 'i', 'i', '/i/'),
  L('J', 'Jeruk', 'jeruk', 'jeh', 'jé', '/j/'),
  L('K', 'Kucing', 'kucing', 'keh', 'ka', '/k/'),
  L('L', 'Lampu', 'lampu', 'leh', 'él', '/l/'),
  L('M', 'Mobil', 'mobil', 'meh', 'ém', '/m/'),
  L('N', 'Nanas', 'nanas', 'neh', 'én', '/n/'),
  L('O', 'Obat', 'obat', 'o', 'o', '/o/'),
  L('P', 'Pisang', 'pisang', 'peh', 'pé', '/p/'),
  L('Q', 'Quran', 'quran', 'keh', 'ki', '/k/'),
  L('R', 'Roti', 'roti', 'reh', 'ér', '/r/'),
  L('S', 'Sapi', 'sapi', 'seh', 'és', '/s/'),
  L('T', 'Topi', 'topi', 'teh', 'té', '/t/'),
  L('U', 'Ular', 'ular', 'u', 'u', '/u/'),
  L('V', 'Vas', 'vas', 'veh', 'vé', '/v/'),
  L('W', 'Wortel', 'wortel', 'weh', 'wé', '/w/'),
  L('X', 'Xilofon', 'xilofon', 'eks', 'éks', '/ks/'),
  L('Y', 'Yoyo', 'yoyo', 'yeh', 'yé', '/y/'),
  L('Z', 'Zebra', 'zebra', 'zeh', 'zét', '/z/'),
]

export const LETTER = Object.fromEntries(ALPHABET.map((l) => [l.letter, l]))
export const VOWELS = ['A', 'I', 'U', 'E', 'O']

// Huruf yang bunyinya jelas berbeda satu sama lain — dipakai untuk permainan tebak bunyi.
export const CLEAR_SOUND_LETTERS = ['A', 'B', 'D', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y']
