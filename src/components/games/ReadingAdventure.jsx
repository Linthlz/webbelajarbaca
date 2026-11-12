import { useMemo } from 'react'
import { motion } from 'framer-motion'
import RoundRunner from './RoundRunner.jsx'
import Pic from '../common/Pic.jsx'
import { assetUrl } from '../../data/pictures.js'
import { buildGameRounds } from '../../utils/rounds.js'

/** Lintasan petualangan: Pipi maju satu langkah setiap jawaban benar. */
function AdventureTrack({ done, total }) {
  const pct = (done / total) * 100
  return (
    <div className="relative h-12" role="progressbar" aria-label="Perjalanan Pipi" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}>
      <div className="absolute inset-x-5 top-1/2 h-2 -translate-y-1/2 rounded-full bg-ink/10" />
      <div className="absolute inset-x-5 top-1/2 flex -translate-y-1/2 justify-between">
        {Array.from({ length: total + 1 }, (_, i) => (
          <span key={i} className={`h-4 w-4 rounded-full border-2 border-white ${i <= done ? 'bg-grape' : 'bg-ink/20'}`} />
        ))}
      </div>
      <div className="absolute inset-x-5 top-0 h-full">
        <motion.img
          src={assetUrl('mascot/pipi.svg')}
          alt=""
          className="absolute top-0 h-12 w-12 -translate-x-1/2"
          initial={false}
          animate={{ left: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        />
      </div>
      <Pic name="bendera" className="absolute -right-1 -top-1 h-8 w-8" decorative />
    </div>
  )
}

/**
 * GAME 6 — Petualangan Membaca.
 * Enam rintangan berurutan dari mudah ke sulit: bunyi huruf, huruf awal, suku kata,
 * kata, mendengarkan kata, lalu kalimat. Jawaban benar membuat Pipi maju.
 */
export default function ReadingAdventure({ onFinish, backTo }) {
  const rounds = useMemo(() => buildGameRounds('petualangan'), [])
  return (
    <RoundRunner
      rounds={rounds}
      onFinish={onFinish}
      backTo={backTo}
      tone="grape"
      renderProgress={(done, total) => <AdventureTrack done={done} total={total} />}
    />
  )
}
