/**
 * Pembuat soal ("ronde") untuk latihan level dan mini game.
 *
 * Tiga bentuk ronde (lihat components/games/RoundRunner.jsx):
 *   choice  : pilih satu dari beberapa pilihan
 *   arrange : susun potongan (huruf / suku kata) ke kotak yang tersedia
 *   match   : cocokkan gambar dengan huruf awalnya
 *
 * intro  = instruksi yang dibacakan
 * parts  = suara soal (bunyi huruf / kata) yang dibacakan setelah instruksi
 */
import { ALPHABET, CLEAR_SOUND_LETTERS, LETTER, VOWELS } from '../data/alphabet.js'
import { ALL_SYLLABLES } from '../data/syllables.js'
import { GAME_WORDS, ALL_WORDS, SIMPLE_WORDS } from '../data/words.js'
import { SENTENCES } from '../data/sentences.js'
import { say } from './speechEngine.js'
import { shuffle, sample, pick, shuffleNot } from './random.js'

const others = (pool, exclude, n, key = (x) => x) => {
  const seen = new Set([].concat(exclude).map(key))
  const out = []
  for (const item of shuffle(pool)) {
    if (seen.has(key(item))) continue
    seen.add(key(item))
    out.push(item)
    if (out.length === n) break
  }
  return out
}

const letterOption = (letter) => ({ id: letter, kind: 'letter', value: letter, label: `huruf ${letter}` })
const picOption = (pic, label) => ({ id: pic, kind: 'pic', value: pic, label: label || pic })
const wordOption = (word) => ({ id: word.id, kind: 'syllables', value: word.syl, label: word.text })
const textOption = (text) => ({ id: text, kind: 'text', value: text, label: text })
const sceneOption = (scene) => ({ id: scene.join('+'), kind: 'scene', value: scene, label: scene.join(' dan ') })

// ---------- bentuk soal dasar ----------

/** Dengar bunyi huruf -> pilih hurufnya. */
export function soundToLetter(letter, pool = CLEAR_SOUND_LETTERS) {
  return {
    type: 'choice',
    intro: 'Dengarkan baik-baik, huruf apa yang kamu dengar?',
    parts: [say.phoneme(letter)],
    prompt: { kind: 'audio' },
    options: shuffle([letter, ...others(pool, letter, 2)]).map(letterOption),
    answer: letter,
  }
}

/** Lihat gambar -> pilih huruf awalnya. */
export function pictureToLetter(item, pool = ALPHABET) {
  return {
    type: 'choice',
    intro: 'Lihat gambarnya. Huruf awalnya apa?',
    parts: [say.word(item.word)],
    prompt: { kind: 'pic', pic: item.pic },
    options: shuffle([item, ...others(pool.filter((x) => x.sound !== item.sound), item, 2, (x) => x.letter)]).map((x) => letterOption(x.letter)),
    answer: item.letter,
  }
}

/** Dengar suku kata -> susun dari huruf. */
export function buildSyllable(syl) {
  const distractor = pick(VOWELS.filter((v) => v !== syl.v))
  const answer = [syl.c, syl.v]
  return {
    type: 'arrange',
    intro: 'Dengarkan, lalu susun hurufnya menjadi suku kata.',
    parts: [say.syllable(syl.text)],
    prompt: { kind: 'audio' },
    pieces: shuffleNot([syl.c, syl.v, distractor], answer),
    answer,
    pieceSound: 'phoneme',
  }
}

/** Dengar suku kata -> pilih tulisannya. */
export function soundToSyllable(syl) {
  return {
    type: 'choice',
    intro: 'Dengarkan, lalu pilih suku kata yang kamu dengar.',
    parts: [say.syllable(syl.text)],
    prompt: { kind: 'audio' },
    options: shuffle([syl, ...others(ALL_SYLLABLES, syl, 2, (x) => x.text)]).map((x) => textOption(x.text)),
    answer: syl.text,
  }
}

/** Lihat gambar -> pilih kata yang cocok. */
export function pictureToWord(word, pool = SIMPLE_WORDS) {
  return {
    type: 'choice',
    intro: 'Lihat gambarnya, lalu pilih kata yang cocok.',
    parts: [say.word(word.text)],
    prompt: { kind: 'pic', pic: word.pic },
    options: shuffle([word, ...others(pool, word, 2, (x) => x.id)]).map(wordOption),
    answer: word.id,
  }
}

/** Lihat gambar -> susun suku kata menjadi kata. */
export function arrangeWord(word, pool = ALL_WORDS) {
  const allSyl = [...new Set(pool.flatMap((w) => w.syl))]
  const distractor = others(allSyl, word.syl, 1)
  return {
    type: 'arrange',
    intro: 'Lihat gambarnya, lalu susun suku kata menjadi kata yang benar.',
    parts: [say.word(word.text)],
    prompt: { kind: 'pic', pic: word.pic },
    pieces: shuffleNot([...word.syl, ...distractor], word.syl),
    answer: word.syl,
    pieceSound: 'syllable',
  }
}

/** Dengar kata -> pilih gambarnya. */
export function wordToPicture(word, pool = GAME_WORDS) {
  return {
    type: 'choice',
    intro: 'Dengarkan katanya, lalu pilih gambar yang cocok.',
    parts: [say.word(word.text)],
    prompt: { kind: 'audio' },
    options: shuffle([word, ...others(pool, word, 2, (x) => x.pic)]).map((w) => picOption(w.pic, w.text.toLowerCase())),
    answer: word.pic,
  }
}

/** B _ L A -> pilih huruf yang hilang (selalu huruf vokal). */
export function completeWord(word) {
  const letters = word.text.split('')
  const idx = letters.findIndex((ch) => VOWELS.includes(ch))
  const missing = letters[idx]
  return {
    type: 'choice',
    intro: 'Ada huruf yang hilang. Pilih huruf yang tepat!',
    parts: [say.word(word.text)],
    prompt: { kind: 'cloze', pic: word.pic, letters: letters.map((ch, i) => (i === idx ? null : ch)), full: letters },
    options: shuffle([missing, ...others(VOWELS, missing, 2)]).map(letterOption),
    answer: missing,
  }
}

/** Baca kalimat -> pilih gambar yang cocok. */
export function sentenceToScene(sentence, pool = SENTENCES) {
  const key = (s) => s.scene.join('+')
  return {
    type: 'choice',
    intro: 'Baca kalimatnya, lalu pilih gambar yang cocok.',
    parts: [],
    prompt: { kind: 'sentence', text: sentence.text },
    options: shuffle([sentence, ...others(pool, sentence, 2, key)]).map((s) => sceneOption(s.scene)),
    answer: key(sentence),
  }
}

/** Kuis pemahaman cerita. */
export function storyQuestion(q) {
  return {
    type: 'choice',
    intro: q.question,
    parts: [],
    prompt: { kind: 'question', text: q.question },
    options: q.options.map(sceneOption),
    answer: q.options[q.answer].join('+'),
  }
}

/** Tiga gambar + tiga huruf awal untuk dicocokkan. */
export function matchSet(items) {
  return {
    type: 'match',
    intro: 'Tekan gambar, lalu tekan huruf awalnya.',
    parts: [],
    pairs: items.map((x) => ({ pic: x.pic, letter: x.letter, word: x.word })),
    letters: shuffle(items.map((x) => x.letter)),
  }
}

// ---------- latihan tiap level ----------
export function buildPractice(level, stage) {
  const items = stage.items
  switch (level.kind) {
    case 'letter':
      return sample(items, 5).map((x) => pictureToLetter(x))
    case 'syllable':
      return shuffle(items).map(buildSyllable)
    case 'word':
      return shuffle(items).map((w) => pictureToWord(w))
    case 'longword':
      return shuffle(items).map((w) => arrangeWord(w))
    case 'sentence':
      return shuffle(items).map((s) => sentenceToScene(s))
    case 'story':
      return stage.story.quiz.map(storyQuestion)
    default:
      return []
  }
}

// ---------- mini game ----------
const letterItems = (letters) => letters.map((l) => LETTER[l])

export const GAME_BUILDERS = {
  'tebak-huruf': () => sample(CLEAR_SOUND_LETTERS, 5).map((l) => soundToLetter(l)),
  'cocokkan-gambar': () => {
    const picked = sample(ALPHABET.filter((l) => !['Q', 'X'].includes(l.letter)), 9)
    return [picked.slice(0, 3), picked.slice(3, 6), picked.slice(6, 9)].map(matchSet)
  },
  'susun-suku-kata': () => sample(GAME_WORDS.filter((w) => w.syl[0] !== w.syl[1]), 5).map((w) => arrangeWord(w, GAME_WORDS)),
  'dengarkan-dan-pilih': () => sample(GAME_WORDS, 5).map((w) => wordToPicture(w)),
  'lengkapi-kata': () => sample(GAME_WORDS, 5).map(completeWord),
  petualangan: () => {
    const [l1, l2] = letterItems(sample(CLEAR_SOUND_LETTERS, 2))
    const [w1, w2] = sample(SIMPLE_WORDS, 2)
    return [
      soundToLetter(l1.letter),
      pictureToLetter(l2),
      soundToSyllable(pick(ALL_SYLLABLES)),
      pictureToWord(w1),
      wordToPicture(w2),
      sentenceToScene(pick(SENTENCES)),
    ]
  },
}

export const buildGameRounds = (gameId) => GAME_BUILDERS[gameId]?.() ?? []
