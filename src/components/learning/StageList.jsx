import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import AudioButton from '../common/AudioButton.jsx'
import Pic from '../common/Pic.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import { TONES } from '../../utils/theme.js'
import { useLearning } from '../../context/LearningContext.jsx'
import { isStageDone, isStageUnlocked, levelProgress } from '../../utils/progress.js'
import { say, speakText } from '../../utils/speechEngine.js'
import { useAutoSpeak } from '../../hooks/useAutoSpeak.js'

/** Daftar tahap dalam satu level. Tahap yang sudah selesai boleh diulang kapan saja. */
export default function StageList({ level }) {
  const { progress } = useLearning()
  const [nudged, setNudged] = useState(null)
  const tone = TONES[level.tone]
  const intro = useMemo(() => [say.text(level.intro)], [level.intro])
  useAutoSpeak(intro, [level.id])

  return (
    <section>
      <div className={`flex items-center gap-3 rounded-[2rem] p-4 ${tone.soft}`}>
        <Link to="/belajar" aria-label="Kembali ke peta" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-b-4 border-slate-200 bg-white">
          <ArrowLeft size={28} strokeWidth={3} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className={`font-display text-sm font-extrabold ${tone.text}`}>LEVEL {level.id}</p>
          <h1 className="text-2xl">{level.title}</h1>
          <ProgressBar value={levelProgress(progress, level)} tone={level.tone} label={`Progres level ${level.id}`} className="mt-2" />
        </div>
        <AudioButton parts={intro} id="instruksi" size="md" label="Dengarkan instruksi" />
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {level.stages.map((stage, i) => {
          const unlocked = isStageUnlocked(progress, level, i)
          const done = isStageDone(progress, level.id, i)
          const face = (
            <>
              {done && <Pic name="bintang" className="absolute -right-2 -top-2 h-10 w-10" decorative />}
              {!unlocked ? (
                <Pic name="gembok" className="h-16 w-16 opacity-60" decorative />
              ) : stage.pic ? (
                <Pic name={stage.pic} className="h-16 w-16" decorative />
              ) : (
                <span className={`font-display text-5xl font-extrabold ${tone.text}`}>{stage.text}</span>
              )}
              <span className={`font-display text-lg font-extrabold leading-tight ${unlocked ? '' : 'text-ink/40'}`}>{stage.label}</span>
            </>
          )
          const cls = 'card relative flex min-h-[9rem] w-full flex-col items-center justify-center gap-2 p-3 text-center'
          return (
            <li key={i}>
              {unlocked ? (
                <Link to={`/belajar/${level.id}/${i}`} aria-label={`Tahap ${i + 1}: ${stage.label}${done ? ', sudah selesai' : ''}`} className={`${cls} transition-transform active:translate-y-1`}>
                  {face}
                </Link>
              ) : (
                <motion.button
                  type="button"
                  aria-label={`Tahap ${i + 1}, terkunci`}
                  onClick={() => {
                    setNudged(i)
                    speakText('Selesaikan tahap sebelumnya dulu, ya!', 'terkunci')
                    setTimeout(() => setNudged(null), 500)
                  }}
                  animate={nudged === i ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`${cls} bg-white/60`}
                >
                  {face}
                </motion.button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
