import { createContext, useContext } from 'react'
import { useProgress } from '../hooks/useProgress.js'

const LearningContext = createContext(null)

export function LearningProvider({ children }) {
  const value = useProgress()
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>
}

export function useLearning() {
  const ctx = useContext(LearningContext)
  if (!ctx) throw new Error('useLearning harus dipakai di dalam <LearningProvider>')
  return ctx
}
