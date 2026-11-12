import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, RotateCcw } from 'lucide-react'
import Button from './Button.jsx'
import Confetti from './Confetti.jsx'
import Mascot from './Mascot.jsx'
import Pic from './Pic.jsx'
import AudioButton from './AudioButton.jsx'
import { getBadge, FINISH_CHEERS } from '../../data/rewards.js'
import { pick } from '../../utils/random.js'
import { say } from '../../utils/speechEngine.js'
import { useAutoSpeak } from '../../hooks/useAutoSpeak.js'

/** Jumlah bintang kecil di pojok layar. */
export function StarCount({ value, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-sun-soft px-3 py-1 font-display text-xl font-extrabold ${className}`} aria-label={`${value} bintang`}>
      <Pic name="bintang" className="h-7 w-7" decorative />
      {value}
    </span>
  )
}

/**
 * Layar perayaan setelah latihan / permainan selesai:
 * konfeti, ucapan maskot, bintang yang didapat, dan badge baru.
 */
export default function StarReward({ reward, onReplay, nextTo, onNext, nextLabel = 'Lanjut' }) {
  const cheer = useMemo(() => pick(FINISH_CHEERS), [])
  const badges = (reward?.newBadges || []).map(getBadge).filter(Boolean)
  const parts = useMemo(
    () => [say.text(cheer), ...(badges.length ? [say.text(`Kamu mendapat lencana ${badges[0].title}!`)] : [])],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cheer],
  )
  useAutoSpeak(parts, [parts], 'perayaan', 500)

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center gap-5 px-5 py-8 text-center">
      <Confetti />
      <Mascot mood="cheer" size={150} bubble={cheer} />
      <div className="flex items-center gap-2" aria-label={`Kamu mendapat ${reward?.starsEarned || 0} bintang`}>
        {Array.from({ length: reward?.starsEarned || 0 }, (_, i) => (
          <motion.div key={i} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + i * 0.25, type: 'spring', stiffness: 260, damping: 12 }}>
            <Pic name="bintang" className="h-20 w-20" decorative />
          </motion.div>
        ))}
      </div>
      {badges.map((b) => (
        <motion.div key={b.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }} className="card flex items-center gap-3 px-5 py-3">
          <Pic name={b.pic} className="h-14 w-14" decorative />
          <div className="text-left">
            <p className="text-sm font-bold text-ink/60">Lencana baru</p>
            <p className="font-display text-xl font-extrabold">{b.title}</p>
          </div>
        </motion.div>
      ))}
      <div className="mt-2 flex w-full items-center justify-center gap-2">
        <AudioButton parts={parts} id="perayaan" label="Ulangi ucapan" />
        {onReplay && (
          <Button variant="white" onClick={onReplay} aria-label="Ulangi lagi" className="!px-4">
            <RotateCcw size={26} strokeWidth={3} /> Ulangi
          </Button>
        )}
        <Button variant="mint" size="lg" to={nextTo} onClick={onNext} className="min-w-0 flex-1 !px-4 sm:flex-none sm:!px-8">
          {nextLabel} <ArrowRight size={30} strokeWidth={3} />
        </Button>
      </div>
    </div>
  )
}
