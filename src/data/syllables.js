import { VOWELS } from './alphabet.js'

// Urutan vokal mengikuti kebiasaan buku belajar membaca: a-i-u-e-o.
const group = (c) => ({
  consonant: c,
  syllables: VOWELS.map((v) => ({ text: c + v, c, v })),
})

export const SYLLABLE_GROUPS = ['B', 'C', 'D', 'M', 'P', 'S'].map(group)
export const ALL_SYLLABLES = SYLLABLE_GROUPS.flatMap((g) => g.syllables)
