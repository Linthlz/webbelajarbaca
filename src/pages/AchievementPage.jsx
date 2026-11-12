import { motion } from 'framer-motion'
import Pic from '../components/common/Pic.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import AudioButton from '../components/common/AudioButton.jsx'
import { BADGES } from '../data/rewards.js'
import { LEVELS } from '../data/levels.js'
import { useLearning } from '../context/LearningContext.jsx'
import { levelProgress } from '../utils/progress.js'
import { say } from '../utils/speechEngine.js'

/** Koleksi Bintang: jumlah bintang, lencana, dan progres tiap level. */
export default function AchievementPage() {
  const { progress } = useLearning()
  const earned = BADGES.filter((b) => progress.badges.includes(b.id)).length
  const summary = [say.text(`Kamu punya ${progress.stars} bintang dan ${earned} lencana. Hebat!`)]

  return (
    <div className="flex flex-col gap-5">
      <section className="card flex items-center gap-4 bg-sun-soft p-5">
        <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>
          <Pic name="bintang" className="h-24 w-24" decorative />
        </motion.div>
        <div className="flex-1">
          <h1 className="text-3xl">Koleksi Bintang</h1>
          <p className="font-display text-5xl font-extrabold leading-none" aria-label={`${progress.stars} bintang`}>
            {progress.stars}
          </p>
        </div>
        <AudioButton parts={summary} id="instruksi" label="Dengarkan jumlah bintang" />
      </section>

      <section>
        <h2 className="mb-3 text-2xl">
          Lencana ({earned}/{BADGES.length})
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGES.map((badge) => {
            const has = progress.badges.includes(badge.id)
            return (
              <li key={badge.id} className={`card flex flex-col items-center gap-1 p-3 text-center ${has ? '' : 'bg-white/50'}`}>
                <Pic name={has ? badge.pic : 'gembok'} className={`h-16 w-16 ${has ? '' : 'opacity-40 grayscale'}`} decorative />
                <span className={`font-display text-lg font-extrabold leading-tight ${has ? '' : 'text-ink/40'}`}>{badge.title}</span>
                <span className="text-xs font-bold text-ink/50">{has ? 'Sudah didapat' : badge.hint}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="card p-4">
        <h2 className="mb-3 text-2xl">Progres Level</h2>
        <ul className="flex flex-col gap-3">
          {LEVELS.map((level) => (
            <li key={level.id} className="flex items-center gap-3">
              <Pic name={level.pic} className="h-10 w-10" decorative />
              <div className="flex-1">
                <p className="font-display text-base font-extrabold">
                  Level {level.id} · {level.title}
                </p>
                <ProgressBar value={levelProgress(progress, level)} tone={level.tone} label={`Progres level ${level.id}`} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
