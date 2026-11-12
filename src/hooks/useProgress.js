import { useCallback, useMemo, useRef, useState } from 'react'
import {
  loadProgress,
  saveProgress,
  blankProgress,
  applyStageComplete,
  applyGameComplete,
} from '../utils/progress.js'
import { setRateScale } from '../utils/speechEngine.js'

/** Progres belajar anak, tersimpan otomatis di LocalStorage (tanpa akun). */
export function useProgress() {
  const [progress, setProgress] = useState(() => {
    const p = loadProgress()
    setRateScale(p.settings.speechRate)
    return p
  })
  const ref = useRef(progress)

  const commit = useCallback((next) => {
    ref.current = next
    setProgress(next)
    saveProgress(next)
  }, [])

  const actions = useMemo(
    () => ({
      setName: (name) => commit({ ...ref.current, name: String(name).slice(0, 20) }),
      setLastActivity: (activity) => commit({ ...ref.current, lastActivity: { ...activity, at: Date.now() } }),
      setSpeechRate: (speechRate) => {
        setRateScale(speechRate)
        commit({ ...ref.current, settings: { ...ref.current.settings, speechRate } })
      },
      completeStage: (levelId, stageIdx, result) => {
        const { state, reward } = applyStageComplete(ref.current, levelId, stageIdx, result)
        commit(state)
        return reward
      },
      completeGame: (gameId, result) => {
        const { state, reward } = applyGameComplete(ref.current, gameId, result)
        commit(state)
        return reward
      },
      resetProgress: () => {
        setRateScale(1)
        commit(blankProgress())
      },
    }),
    [commit],
  )

  return { progress, ...actions }
}
