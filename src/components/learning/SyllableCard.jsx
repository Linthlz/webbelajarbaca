import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import AudioButton from '../common/AudioButton.jsx'
import { say } from '../../utils/speechEngine.js'

/**
 * Level 2 — dua huruf bergerak mendekat lalu menjadi satu suku kata: B + A = BA.
 * Suara: "beh… a… ba". Tombol suara memutar ulang animasi dan suaranya.
 */
export default function SyllableCard({ item }) {
  const [run, setRun] = useState(0)
  const parts = say.blend(item.c, item.v)

  return (
    <div className="flex flex-col items-center gap-6">
      <div key={run} className="flex h-32 items-center justify-center" aria-hidden="true">
        <motion.span
          className="flex h-28 w-24 items-center justify-center rounded-3xl bg-sky-soft font-display text-8xl font-extrabold text-sky-dark"
          initial={{ x: -70 }}
          animate={{ x: 0 }}
          transition={{ delay: 1, duration: 1, ease: 'easeInOut' }}
        >
          {item.c}
        </motion.span>
        <motion.span className="mx-1 text-ink/40" initial={{ opacity: 1, width: 36 }} animate={{ opacity: 0, width: 0 }} transition={{ delay: 1, duration: 0.8 }}>
          <Plus size={36} strokeWidth={4} />
        </motion.span>
        <motion.span
          className="flex h-28 w-24 items-center justify-center rounded-3xl bg-coral-soft font-display text-8xl font-extrabold text-coral-dark"
          initial={{ x: 70 }}
          animate={{ x: 0 }}
          transition={{ delay: 1, duration: 1, ease: 'easeInOut' }}
        >
          {item.v}
        </motion.span>
      </div>

      <motion.div
        key={`hasil-${run}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.1, type: 'spring', stiffness: 220, damping: 12 }}
        className="card flex h-36 min-w-[14rem] items-center justify-center !border-b-[10px] !border-tangerine-dark/30 px-8"
        aria-label={`Suku kata ${item.text}`}
      >
        <span className="font-display text-[7rem] font-extrabold leading-none">
          <span className="text-sky-dark">{item.c}</span>
          <span className="text-coral-dark">{item.v}</span>
        </span>
      </motion.div>

      <AudioButton parts={parts} id="kartu" size="lg" label={`Dengarkan lagi suku kata ${item.text}`} onPlay={() => setRun((r) => r + 1)} />
    </div>
  )
}
