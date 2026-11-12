/**
 * Mesin suara Petualangan Membaca.
 *
 * - Satu pintu untuk semua audio, sehingga tidak pernah ada dua suara berbarengan.
 * - Sumber suara per "bagian" (part):
 *     1. rekaman manusia bila kuncinya terdaftar di public/assets/audio/manifest.json
 *     2. kalau tidak ada, Web Speech API (SpeechSynthesis) dengan suara id-ID
 * - Bila SpeechSynthesis atau suara bahasa Indonesia tidak ada, status menjadi
 *   'unsupported' / 'no-voice' dan tombol audio dinonaktifkan (lihat AudioButton).
 */
import { LETTER } from '../data/alphabet.js'

const listeners = new Set()
let state = { status: 'checking', speakingId: null, recordings: 0 }
let voice = null
let token = 0
let last = null
let recorded = {}
let audioEl = null
let currentUtterance = null // disimpan agar tidak di-garbage-collect di tengah ucapan (bug Chrome)
let rateScale = 1
let started = false

const hasSynth = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined'

function set(patch) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

export const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
export const getState = () => state

function pickVoice() {
  const voices = window.speechSynthesis.getVoices() || []
  const indo = voices.filter((v) => /^id([-_]|$)/i.test(v.lang || ''))
  return indo.find((v) => v.default) || indo[0] || null
}

function checkVoices(final) {
  if (!hasSynth()) return set({ status: 'unsupported' })
  voice = pickVoice()
  if (voice) set({ status: 'ready' })
  else if (final) set({ status: 'no-voice' })
}

/** Dipanggil sekali saat aplikasi dibuka. */
export function initSpeech() {
  if (started) return
  started = true
  loadManifest()
  if (!hasSynth()) return set({ status: 'unsupported' })
  checkVoices(false)
  // Daftar suara sering baru tersedia beberapa saat setelah halaman dibuka.
  window.speechSynthesis.addEventListener?.('voiceschanged', () => checkVoices(false))
  setTimeout(() => state.status === 'checking' && checkVoices(true), 2500)
}

/** Periksa ulang ketersediaan suara (tombol "Periksa lagi"). */
export function recheckSpeech() {
  if (!hasSynth()) return set({ status: 'unsupported' })
  set({ status: 'checking' })
  checkVoices(false)
  setTimeout(() => state.status === 'checking' && checkVoices(true), 1500)
}

async function loadManifest() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}assets/audio/manifest.json`)
    if (!res.ok) return
    const json = await res.json()
    if (json && typeof json === 'object') {
      recorded = json
      set({ recordings: Object.keys(json).length })
    }
  } catch {
    /* tidak ada rekaman — pakai TTS */
  }
}

export function setRateScale(value) {
  rateScale = Math.min(1.3, Math.max(0.6, Number(value) || 1))
}

// ---------- pembuat "bagian" ucapan ----------
export const slug = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const say = {
  text: (text, opt = {}) => ({ key: `text/${slug(text)}`, text, rate: opt.rate ?? 0.9, pause: opt.pause ?? 250 }),
  /** Bunyi (fonem) huruf, mis. B -> "beh". */
  phoneme: (letter) => {
    const l = LETTER[String(letter).toUpperCase()]
    return { key: `phoneme/${l.lower}`, text: l.sound, rate: 0.7, pause: 380 }
  },
  /** Nama huruf, mis. B -> "bé". */
  letterName: (letter) => {
    const l = LETTER[String(letter).toUpperCase()]
    return { key: `letter/${l.lower}`, text: l.name, rate: 0.8, pause: 300 }
  },
  syllable: (s) => ({ key: `syllable/${s.toLowerCase()}`, text: s.toLowerCase(), rate: 0.7, pause: 350 }),
  word: (w) => ({ key: `word/${slug(w)}`, text: String(w).toLowerCase(), rate: 0.75, pause: 250 }),
  sentence: (s) => ({ key: `text/${slug(s)}`, text: s, rate: 0.8, pause: 250 }),
  /** Kata dibaca pelan per suku kata lalu utuh: "bo… la… bola". */
  wordSlow: (syllables) => [...syllables.map(say.syllable), say.word(syllables.join(''))],
  /** Penggabungan huruf: "beh… a… ba". */
  blend: (c, v) => [say.phoneme(c), say.phoneme(v), say.syllable(c + v)],
}

const hasRecording = (part) => Boolean(recorded[part.key])

/** Apakah bagian-bagian ini benar-benar bisa dibunyikan di perangkat ini? */
export function canPlay(parts) {
  if (state.status === 'ready') return true
  const list = [].concat(parts || [])
  return list.length > 0 && list.every(hasRecording)
}

// ---------- pemutaran ----------
export function stopSpeech() {
  token += 1
  if (hasSynth()) window.speechSynthesis.cancel()
  if (audioEl) {
    audioEl.pause()
    audioEl = null
  }
  currentUtterance = null
  if (state.speakingId !== null) set({ speakingId: null })
}

function playPart(part, done) {
  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    done()
  }
  if (hasRecording(part)) {
    audioEl = new Audio(`${import.meta.env.BASE_URL}assets/audio/${recorded[part.key]}`)
    audioEl.onended = finish
    audioEl.onerror = finish
    const p = audioEl.play()
    if (p?.catch) p.catch(finish)
    return
  }
  if (state.status !== 'ready') return finish()
  const u = new window.SpeechSynthesisUtterance(part.text)
  u.lang = 'id-ID'
  if (voice) u.voice = voice
  u.rate = (part.rate ?? 0.85) * rateScale
  u.pitch = 1.05
  u.onend = finish
  u.onerror = finish
  currentUtterance = u
  window.speechSynthesis.speak(u)
}

/**
 * Bunyikan satu atau beberapa bagian secara berurutan.
 * Selalu menghentikan suara sebelumnya terlebih dahulu.
 * @returns {boolean} false bila tidak ada yang bisa dibunyikan.
 */
export function speak(parts, id = 'global') {
  const list = [].concat(parts || []).filter(Boolean)
  stopSpeech()
  if (!list.length) return false
  last = { parts: list, id }
  if (!canPlay(list) && !list.some(hasRecording)) return false
  const mine = ++token
  let i = 0
  set({ speakingId: id })
  const next = () => {
    if (mine !== token) return
    if (i >= list.length) {
      currentUtterance = null
      return set({ speakingId: null })
    }
    const part = list[i++]
    playPart(part, () => setTimeout(next, i >= list.length ? 0 : part.pause ?? 200))
  }
  // jeda singkat: beberapa browser mengabaikan speak() yang dipanggil tepat setelah cancel()
  setTimeout(next, 60)
  return true
}

/** Ulangi suara terakhir. */
export const repeatSpeech = () => (last ? speak(last.parts, last.id) : false)

// ---------- fungsi praktis ----------
export const speakText = (text, id) => speak(say.text(text), id)
/** mode 'phoneme' (bawaan) membunyikan fonem; mode 'name' menyebut nama huruf. */
export const speakLetter = (letter, { mode = 'phoneme' } = {}, id) =>
  speak(mode === 'name' ? say.letterName(letter) : say.phoneme(letter), id)
export const speakSyllable = (syllable, id) => speak(say.syllable(syllable), id)
export const speakWord = (word, id) => speak(say.word(word), id)
export const speakSentence = (sentence, id) => speak(say.sentence(sentence), id)

/** Hanya untuk pengujian. */
export function __resetForTests() {
  token += 1
  state = { status: 'checking', speakingId: null, recordings: 0 }
  voice = null
  last = null
  recorded = {}
  audioEl = null
  started = false
  rateScale = 1
}
