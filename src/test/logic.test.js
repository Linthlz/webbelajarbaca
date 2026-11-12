import { describe, expect, it } from 'vitest'
import { LEVELS, TOTAL_STAGES } from '../data/levels.js'
import { GAMES } from '../data/games.js'
import { ALPHABET } from '../data/alphabet.js'
import { ALL_WORDS } from '../data/words.js'
import { SENTENCES } from '../data/sentences.js'
import { STORIES } from '../data/stories.js'
import { PICTURES } from '../data/pictures.js'
import { buildGameRounds, buildPractice } from '../utils/rounds.js'
import {
  blankProgress, applyStageComplete, applyGameComplete, isLevelUnlocked, isStageUnlocked,
  nextLesson, loadProgress, saveProgress, overallProgress,
} from '../utils/progress.js'

function checkRound(r) {
  expect(r.intro).toBeTruthy()
  if (r.type === 'choice') {
    const ids = r.options.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length) // tidak ada pilihan kembar
    expect(ids).toContain(r.answer)
    expect(ids.length).toBeGreaterThanOrEqual(2)
  } else if (r.type === 'arrange') {
    const pool = [...r.pieces]
    r.answer.forEach((a) => {
      const i = pool.indexOf(a)
      expect(i).toBeGreaterThanOrEqual(0)
      pool.splice(i, 1)
    })
    expect(r.pieces.slice(0, r.answer.length)).not.toEqual(r.answer)
  } else if (r.type === 'match') {
    expect(r.letters.slice().sort()).toEqual(r.pairs.map((p) => p.letter).sort())
  } else throw new Error('jenis ronde tidak dikenal')
}

describe('data', () => {
  it('semua gambar yang dipakai terdaftar', () => {
    const used = [
      ...ALPHABET.map((l) => l.pic), ...ALL_WORDS.map((w) => w.pic), ...SENTENCES.flatMap((s) => s.scene),
      ...STORIES.flatMap((s) => [...s.cover, ...s.pages.flatMap((p) => p.scene), ...s.quiz.flatMap((q) => q.options.flat())]),
      ...LEVELS.map((l) => l.pic), ...GAMES.map((g) => g.pic),
    ]
    used.forEach((name) => expect(PICTURES[name], name).toBeTruthy())
  })
  it('ada 26 huruf dan 6 level', () => {
    expect(ALPHABET).toHaveLength(26)
    expect(LEVELS).toHaveLength(6)
    expect(GAMES).toHaveLength(6)
  })
})

describe('pembuat soal', () => {
  it('latihan setiap tahap selalu sah', () => {
    for (let n = 0; n < 30; n++)
      LEVELS.forEach((level) => level.stages.forEach((stage) => {
        const rounds = buildPractice(level, stage)
        expect(rounds.length).toBeGreaterThan(0)
        rounds.forEach(checkRound)
      }))
  })
  it('soal setiap game selalu sah', () => {
    for (let n = 0; n < 50; n++)
      GAMES.forEach((g) => {
        const rounds = buildGameRounds(g.id)
        expect(rounds.length).toBeGreaterThanOrEqual(3)
        rounds.forEach(checkRound)
      })
  })
})

describe('progres', () => {
  it('level terbuka bertahap dan bintang tidak pernah berkurang', () => {
    let s = blankProgress()
    expect(isLevelUnlocked(s, LEVELS[0])).toBe(true)
    expect(isLevelUnlocked(s, LEVELS[1])).toBe(false)
    expect(isStageUnlocked(s, LEVELS[0], 1)).toBe(false)
    expect(nextLesson(s)).toEqual({ levelId: 1, stageIdx: 0 })

    let stars = 0
    LEVELS[0].stages.forEach((_, i) => {
      const out = applyStageComplete(s, 1, i, { firstTry: 2, total: 5 })
      expect(out.reward.starsEarned).toBe(3)
      expect(out.state.stars).toBeGreaterThan(stars)
      stars = out.state.stars
      s = out.state
    })
    expect(isLevelUnlocked(s, LEVELS[1])).toBe(true)
    expect(isLevelUnlocked(s, LEVELS[2])).toBe(false)
    expect(s.badges).toContain('level-1')
    expect(s.badges).toContain('bintang-pertama')
    expect(nextLesson(s)).toEqual({ levelId: 2, stageIdx: 0 })

    const again = applyStageComplete(s, 1, 0, { firstTry: 0, total: 5 })
    expect(again.reward.starsEarned).toBe(1)
    expect(again.state.stars).toBe(s.stars + 1)
    expect(again.state.stages['1-0'].best).toBe(2) // nilai terbaik tidak turun
  })

  it('menamatkan semua level dan game memberi semua lencana', () => {
    let s = blankProgress()
    LEVELS.forEach((l) => l.stages.forEach((_, i) => (s = applyStageComplete(s, l.id, i, { firstTry: 1, total: 1 }).state)))
    GAMES.forEach((g) => (s = applyGameComplete(s, g.id, { firstTry: 3, total: 5 }).state))
    expect(overallProgress(s)).toBe(1)
    expect(Object.keys(s.stages)).toHaveLength(TOTAL_STAGES)
    expect(nextLesson(s)).toBeNull()
    ;['level-6', 'lulus', 'pemain', 'bintang-30'].forEach((b) => expect(s.badges).toContain(b))
  })

  it('tersimpan dan terbaca kembali dari LocalStorage', () => {
    const s = applyGameComplete({ ...blankProgress(), name: 'Budi' }, 'tebak-huruf', { firstTry: 4, total: 5 }).state
    saveProgress(s)
    const back = loadProgress()
    expect(back.name).toBe('Budi')
    expect(back.games['tebak-huruf'].best).toBe(4)
    window.localStorage.setItem('petualangan-membaca:progres:v1', '{rusak')
    expect(loadProgress().stars).toBe(0) // data rusak tidak membuat aplikasi macet
  })
})
