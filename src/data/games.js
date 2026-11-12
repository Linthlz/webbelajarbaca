// Daftar mini game. "example" adalah contoh bergambar yang ditampilkan sebelum bermain.
export const GAMES = [
  {
    id: 'tebak-huruf',
    title: 'Tebak Huruf',
    tone: 'coral',
    pic: 'telinga',
    instruction: 'Dengarkan baik-baik, huruf apa yang kamu dengar?',
    example: [{ t: 'sound' }, { t: 'arrow' }, { t: 'letter', v: 'B' }, { t: 'check' }],
  },
  {
    id: 'cocokkan-gambar',
    title: 'Cocokkan Gambar',
    tone: 'tangerine',
    pic: 'apel',
    instruction: 'Tekan gambar, lalu tekan huruf awalnya.',
    example: [{ t: 'pic', v: 'apel' }, { t: 'arrow' }, { t: 'letter', v: 'A' }, { t: 'check' }],
  },
  {
    id: 'susun-suku-kata',
    title: 'Susun Suku Kata',
    tone: 'sun',
    pic: 'puzzle',
    instruction: 'Lihat gambarnya, lalu susun suku kata menjadi kata yang benar.',
    example: [{ t: 'pic', v: 'bola' }, { t: 'arrow' }, { t: 'text', v: 'BO' }, { t: 'text', v: 'LA' }, { t: 'check' }],
  },
  {
    id: 'dengarkan-dan-pilih',
    title: 'Dengarkan dan Pilih',
    tone: 'mint',
    pic: 'buku',
    instruction: 'Dengarkan katanya, lalu pilih gambar yang cocok.',
    example: [{ t: 'sound' }, { t: 'arrow' }, { t: 'pic', v: 'buku' }, { t: 'check' }],
  },
  {
    id: 'lengkapi-kata',
    title: 'Lengkapi Kata',
    tone: 'sky',
    pic: 'pensil',
    instruction: 'Ada huruf yang hilang. Pilih huruf yang tepat!',
    example: [{ t: 'text', v: 'B_LA' }, { t: 'arrow' }, { t: 'letter', v: 'O' }, { t: 'check' }],
  },
  {
    id: 'petualangan',
    title: 'Petualangan Membaca',
    tone: 'grape',
    pic: 'roket',
    instruction: 'Bantu Pipi sampai ke garis akhir! Jawab setiap soal supaya Pipi bisa maju.',
    example: [{ t: 'mascot' }, { t: 'arrow' }, { t: 'pic', v: 'bendera' }],
  },
]

export const getGame = (id) => GAMES.find((g) => g.id === id)
