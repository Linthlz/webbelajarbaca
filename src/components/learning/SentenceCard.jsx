import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import TappableSentence from './TappableSentence.jsx'
import { Scene } from '../common/Pic.jsx'
import { useSpeech } from '../../hooks/useSpeech.js'

/**
 * Level 5 & 6 — ilustrasi + kalimat berhuruf besar.
 * Setiap kata bisa ditekan; tombol "Dengarkan Kalimat" membacakan seluruh kalimat.
 * Dipakai juga sebagai halaman cerita (ilustrasi berganti mengikuti cerita).
 */
export default function SentenceCard({ item, title }) {
  const { speak, say, canPlay, speakingId } = useSpeech()
  const parts = [say.sentence(item.text)]
  const playable = canPlay(parts)
  return (
    <div className="flex flex-col items-center gap-5">
      {title && <p className="rounded-full bg-grape-soft px-4 py-1 font-display text-lg font-extrabold text-grape-dark">{title}</p>}
      <motion.div
        key={item.text}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card flex min-h-[11rem] w-full items-center justify-center bg-sky-soft/60 px-4 py-4"
      >
        <Scene scene={item.scene} size="h-28 w-28 sm:h-36 sm:w-36" />
      </motion.div>
      <TappableSentence text={item.text} />
      <button
        type="button"
        disabled={!playable}
        onClick={() => speak(parts, 'kartu')}
        className={`inline-flex min-h-[60px] items-center gap-3 rounded-3xl border-b-[6px] px-6 font-display text-xl font-extrabold transition-transform active:translate-y-1 ${
          playable ? 'border-sky-dark bg-sky text-white' : 'cursor-not-allowed border-slate-300 bg-slate-100 text-slate-400 line-through'
        }`}
      >
        <Volume2 size={28} strokeWidth={2.5} className={speakingId === 'kartu' ? 'animate-wiggle' : ''} />
        Dengarkan Kalimat
      </button>
    </div>
  )
}
