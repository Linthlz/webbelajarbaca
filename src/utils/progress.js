// Logika progres murni (tanpa React) supaya mudah diuji.
import { LEVELS, TOTAL_STAGES } from '../data/levels.js'
import { GAMES } from '../data/games.js'

export const STORAGE_KEY = 'petualangan-membaca:progres:v1'

export const blankProgress = () => ({
  name: '',
  stars: 0,
  stages: {}, // "level-tahap" -> { times, best, total, at }
  games: {}, // id game -> { plays, best, last, total, at }
  badges: [],
  lastActivity: null, // { kind:'level', levelId, stageIdx } | { kind:'game', gameId }
  settings: { speechRate: 1 },
})

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return blankProgress()
    const data = JSON.parse(raw)
    const blank = blankProgress()
    return { ...blank, ...data, settings: { ...blank.settings, ...(data.settings || {}) } }
  } catch {
    return blankProgress()
  }
}

export function saveProgress(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* penyimpanan penuh / mode privat — progres tetap jalan selama halaman terbuka */
  }
}

export const stageKey = (levelId, stageIdx) => `${levelId}-${stageIdx}`
export const isStageDone = (s, levelId, stageIdx) => Boolean(s.stages[stageKey(levelId, stageIdx)])
export const stagesDone = (s, level) => level.stages.filter((_, i) => isStageDone(s, level.id, i)).length
export const levelProgress = (s, level) => stagesDone(s, level) / level.stages.length
export const isLevelComplete = (s, level) => stagesDone(s, level) === level.stages.length
export const isLevelUnlocked = (s, level) => {
  const idx = LEVELS.findIndex((l) => l.id === level.id)
  return idx === 0 || isLevelComplete(s, LEVELS[idx - 1])
}
export const isStageUnlocked = (s, level, stageIdx) =>
  isLevelUnlocked(s, level) && (stageIdx === 0 || isStageDone(s, level.id, stageIdx - 1))
export const overallProgress = (s) => Object.keys(s.stages).length / TOTAL_STAGES
export const hasAnyProgress = (s) => Object.keys(s.stages).length > 0 || Object.keys(s.games).length > 0

/** Tahap berikutnya yang belum selesai, atau null bila semua level tamat. */
export function nextLesson(s) {
  for (const level of LEVELS) {
    const stageIdx = level.stages.findIndex((_, i) => !isStageDone(s, level.id, i))
    if (stageIdx !== -1) return { levelId: level.id, stageIdx }
  }
  return null
}

function withBadges(state) {
  const badges = [...state.badges]
  const newBadges = []
  const add = (id, cond) => {
    if (cond && !badges.includes(id)) {
      badges.push(id)
      newBadges.push(id)
    }
  }
  add('bintang-pertama', state.stars >= 1)
  LEVELS.forEach((l) => add(`level-${l.id}`, isLevelComplete(state, l)))
  add('pemain', GAMES.every((g) => state.games[g.id]))
  add('bintang-30', state.stars >= 30)
  add('lulus', LEVELS.every((l) => isLevelComplete(state, l)))
  return { state: { ...state, badges }, newBadges }
}

/** Bintang tidak pernah berkurang: 3 untuk pertama kali, 1 untuk mengulang. */
export function applyStageComplete(s, levelId, stageIdx, { firstTry = 0, total = 0 } = {}) {
  const key = stageKey(levelId, stageIdx)
  const prev = s.stages[key]
  const starsEarned = prev ? 1 : 3
  const draft = {
    ...s,
    stars: s.stars + starsEarned,
    stages: {
      ...s.stages,
      [key]: { times: (prev?.times || 0) + 1, best: Math.max(prev?.best || 0, firstTry), total, at: Date.now() },
    },
  }
  const { state, newBadges } = withBadges(draft)
  return { state, reward: { starsEarned, newBadges } }
}

export function applyGameComplete(s, gameId, { firstTry = 0, total = 0 } = {}) {
  const prev = s.games[gameId]
  const starsEarned = prev ? 1 : 3
  const draft = {
    ...s,
    stars: s.stars + starsEarned,
    games: {
      ...s.games,
      [gameId]: { plays: (prev?.plays || 0) + 1, best: Math.max(prev?.best || 0, firstTry), last: firstTry, total, at: Date.now() },
    },
  }
  const { state, newBadges } = withBadges(draft)
  return { state, reward: { starsEarned, newBadges } }
}
