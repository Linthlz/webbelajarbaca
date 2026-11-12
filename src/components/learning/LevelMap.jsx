import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Pic from '../common/Pic.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import { LEVELS } from '../../data/levels.js'
import { TONES } from '../../utils/theme.js'
import { useLearning } from '../../context/LearningContext.jsx'
import { isLevelComplete, isLevelUnlocked, levelProgress } from '../../utils/progress.js'
import { speakText } from '../../utils/speechEngine.js'

const LOCKED_MESSAGE = 'Level ini masih terkunci. Selesaikan level sebelumnya dulu, ya!'

function Footsteps() {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-ink/20" />
      ))}
    </div>
  )
}

/** Peta petualangan: enam level berurutan. Level berikutnya terbuka setelah level sebelumnya selesai. */
export default function LevelMap() {
  const { progress } = useLearning()
  const [nudged, setNudged] = useState(null)

  return (
    <ol className="flex flex-col">
      {LEVELS.map((level, i) => {
        const unlocked = isLevelUnlocked(progress, level)
        const complete = isLevelComplete(progress, level)
        const tone = TONES[level.tone]
        const side = i % 2 === 0 ? 'self-start' : 'self-end'
        const inner = (
          <>
            <span className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-b-[6px] ${unlocked ? `${tone.bg} ${tone.border}` : 'border-slate-300 bg-slate-200'}`}>
              <Pic name={unlocked ? level.pic : 'gembok'} className={`h-12 w-12 ${unlocked ? '' : 'opacity-70'}`} decorative />
              {complete && (
                <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-mint text-white">
                  <Check size={18} strokeWidth={4} />
                </span>
              )}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className={`block font-display text-sm font-extrabold ${unlocked ? tone.text : 'text-ink/40'}`}>LEVEL {level.id}</span>
              <span className={`block font-display text-xl font-extrabold leading-tight ${unlocked ? '' : 'text-ink/40'}`}>{level.title}</span>
              {unlocked && <ProgressBar value={levelProgress(progress, level)} tone={level.tone} label={`Progres level ${level.id}`} className="mt-2" />}
            </span>
          </>
        )
        return (
          <li key={level.id} className="flex flex-col">
            {i > 0 && <Footsteps />}
            {unlocked ? (
              <Link to={`/belajar/${level.id}`} className={`card flex w-[92%] items-center gap-4 p-3 transition-transform active:translate-y-1 sm:w-[78%] ${side}`}>
                {inner}
              </Link>
            ) : (
              <motion.button
                type="button"
                aria-label={`Level ${level.id} ${level.title}, terkunci`}
                onClick={() => {
                  setNudged(level.id)
                  speakText(LOCKED_MESSAGE, 'terkunci')
                  setTimeout(() => setNudged(null), 500)
                }}
                animate={nudged === level.id ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`card flex w-[92%] items-center gap-4 bg-white/60 p-3 sm:w-[78%] ${side}`}
              >
                {inner}
              </motion.button>
            )}
          </li>
        )
      })}
    </ol>
  )
}
