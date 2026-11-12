import { ALPHABET } from './alphabet.js'
import { SYLLABLE_GROUPS } from './syllables.js'
import { SIMPLE_WORDS, LONGER_WORDS } from './words.js'
import { SENTENCES } from './sentences.js'
import { STORIES } from './stories.js'

const chunk = (arr, size) => {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// Huruf dibagi 5 kelompok kecil supaya anak tidak langsung menghadapi 26 huruf.
const letterGroups = [ALPHABET.slice(0, 5), ALPHABET.slice(5, 10), ALPHABET.slice(10, 15), ALPHABET.slice(15, 20), ALPHABET.slice(20)]

/**
 * Setiap level terdiri dari beberapa "tahap". Satu tahap = beberapa kartu belajar + latihan singkat.
 * kind menentukan kartu dan jenis latihan yang dipakai (lihat LessonPlayer.jsx dan utils/rounds.js).
 */
export const LEVELS = [
  {
    id: 1,
    kind: 'letter',
    title: 'Mengenal Huruf',
    tone: 'coral',
    pic: 'apel',
    intro: 'Halo teman-teman! Hari ini kita akan belajar mengenal huruf. Yuk, dengarkan suaranya!',
    stages: letterGroups.map((items) => ({
      label: `${items[0].letter} – ${items[items.length - 1].letter}`,
      pic: items[0].pic,
      items,
    })),
  },
  {
    id: 2,
    kind: 'syllable',
    title: 'Mengenal Suku Kata',
    tone: 'tangerine',
    pic: 'puzzle',
    intro: 'Sekarang kita gabungkan dua huruf menjadi suku kata. Lihat dan dengarkan, ya!',
    stages: SYLLABLE_GROUPS.map((g) => ({ label: g.syllables[0].text, text: g.syllables[0].text, items: g.syllables })),
  },
  {
    id: 3,
    kind: 'word',
    title: 'Membaca Kata',
    tone: 'sun',
    pic: 'bola',
    intro: 'Ayo membaca kata! Tekan suku kata untuk mendengar bunyinya.',
    stages: chunk(SIMPLE_WORDS, 4).map((items) => ({ label: items[0].text, pic: items[0].pic, items })),
  },
  {
    id: 4,
    kind: 'longword',
    title: 'Kata Lebih Panjang',
    tone: 'mint',
    pic: 'sepeda',
    intro: 'Kata-kata ini lebih panjang. Kita baca pelan-pelan, ya!',
    stages: chunk(LONGER_WORDS, 4).map((items) => ({ label: items[1].text, pic: items[1].pic, items })),
  },
  {
    id: 5,
    kind: 'sentence',
    title: 'Membaca Kalimat',
    tone: 'sky',
    pic: 'buku',
    intro: 'Hebat! Sekarang kita membaca kalimat. Tekan setiap kata untuk mendengarnya.',
    stages: chunk(SENTENCES, 4).map((items) => ({ label: items[0].text, pic: items[0].scene[0], items })),
  },
  {
    id: 6,
    kind: 'story',
    title: 'Membaca Cerita',
    tone: 'grape',
    pic: 'pelangi',
    intro: 'Waktunya membaca cerita! Baca setiap kalimat, lalu tekan tombol lanjut.',
    stages: STORIES.map((story) => ({ label: story.title, pic: story.cover[1], items: story.pages, story })),
  },
]

export const getLevel = (id) => LEVELS.find((l) => l.id === Number(id))
export const TOTAL_STAGES = LEVELS.reduce((n, l) => n + l.stages.length, 0)
