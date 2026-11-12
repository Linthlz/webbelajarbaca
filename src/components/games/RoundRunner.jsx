import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, VolumeX } from 'lucide-react'
import ChoiceRound from './ChoiceRound.jsx'
import ArrangeRound from './ArrangeRound.jsx'
import MatchRound from './MatchRound.jsx'
import AudioButton from '../common/AudioButton.jsx'
import Button from '../common/Button.jsx'
import Mascot from '../common/Mascot.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import { ActivityBar } from '../common/AppShell.jsx'
import { say, speak } from '../../utils/speechEngine.js'
import { useSpeech } from '../../hooks/useSpeech.js'
import { PRAISES, TRY_AGAIN } from '../../data/rewards.js'
import { pick } from '../../utils/random.js'

const BODIES = { choice: ChoiceRound, arrange: ArrangeRound, match: MatchRound }

/**
 * Menjalankan serangkaian ronde satu per satu.
 * - instruksi dibacakan otomatis dan bisa diulang kapan saja
 * - jawaban salah: tidak ada hukuman, anak boleh mencoba lagi
 * - jawaban benar: pujian + tombol lanjut (anak yang menentukan temponya, tanpa batas waktu)
 * onFinish({ firstTry, total }) — firstTry = jumlah soal yang benar pada percobaan pertama.
 */
export default function RoundRunner({ rounds, onFinish, backTo, tone = 'mint', renderProgress }) {
  const [idx, setIdx] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [praise, setPraise] = useState('')
  const missed = useRef(false)
  const firstTry = useRef(0)
  const timer = useRef(null)
  const finished = useRef(false)
  const round = rounds[idx]
  const { canPlay, status } = useSpeech()
  // Soal dengar tidak bisa dikerjakan tanpa suara: tampilkan keterangan jelas dan izinkan melewati.
  const blocked = round.prompt?.kind === 'audio' && status !== 'checking' && !canPlay(round.parts)

  const instruction = useMemo(() => [say.text(round.intro), ...round.parts], [round])

  useEffect(() => {
    missed.current = false
    const prev = rounds[idx - 1]
    // Instruksi lengkap hanya saat jenis soal berganti; selanjutnya cukup suara soalnya.
    const parts = prev && prev.intro === round.intro && round.parts.length ? round.parts : instruction
    const t = setTimeout(() => speak(parts, 'instruksi'), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleCorrect = () => {
    clearTimeout(timer.current)
    if (!missed.current) firstTry.current += 1
    const p = pick(PRAISES)
    setPraise(p)
    setFeedback('correct')
    speak(say.text(p), 'umpan-balik')
  }

  const handleWrong = () => {
    missed.current = true
    setFeedback('wrong')
    speak(say.text(TRY_AGAIN), 'umpan-balik')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setFeedback((f) => (f === 'wrong' ? null : f)), 2200)
  }

  const next = () => {
    if (idx + 1 < rounds.length) {
      setFeedback(null)
      setIdx(idx + 1)
    } else if (!finished.current) {
      finished.current = true // ketukan ganda tidak boleh menghitung hadiah dua kali
      onFinish({ firstTry: firstTry.current, total: rounds.length })
    }
  }

  const skip = () => {
    missed.current = true
    next()
  }

  const Body = BODIES[round.type]
  const doneCount = idx + (feedback === 'correct' ? 1 : 0)

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-4 pb-44 pt-4">
      <ActivityBar backTo={backTo}>
        {renderProgress ? renderProgress(doneCount, rounds.length) : <ProgressBar value={doneCount / rounds.length} tone={tone} label="Progres latihan" />}
      </ActivityBar>

      <div className="mt-4 flex items-center gap-3 rounded-3xl bg-white/70 px-3 py-2">
        <AudioButton parts={instruction} id="instruksi" size="md" label="Ulangi instruksi" />
        <p className="font-display text-lg font-bold leading-snug text-ink/80">{round.intro}</p>
      </div>

      <div className="flex flex-1 flex-col justify-center py-6">
        {blocked ? (
          <div className="card mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-8 text-center">
            <VolumeX size={56} strokeWidth={2.5} className="text-coral-dark" />
            <p className="font-display text-xl font-extrabold">Soal ini perlu suara, tetapi suara belum tersedia di perangkat ini.</p>
            <Button variant="sky" onClick={skip}>
              Lewati soal <ArrowRight size={26} strokeWidth={3} />
            </Button>
          </div>
        ) : (
          <Body key={idx} round={round} onCorrect={handleCorrect} onWrong={handleWrong} locked={feedback === 'correct'} />
        )}
      </div>

        {feedback && (
          <motion.div
            key={feedback}
            role="status"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className={`fixed inset-x-0 bottom-0 z-30 border-t-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 ${
              feedback === 'correct' ? 'border-mint bg-mint-soft' : 'pointer-events-none border-coral bg-coral-soft/95'
            }`}
          >
            <div className="mx-auto flex max-w-2xl items-center gap-3">
              <Mascot mood={feedback === 'correct' ? 'cheer' : 'oops'} size={84} />
              <p className="flex-1 font-display text-2xl font-extrabold leading-tight">{feedback === 'correct' ? praise : 'Ayo coba lagi!'}</p>
              {feedback === 'correct' && (
                <Button variant="mint" size="lg" onClick={next} aria-label="Lanjut">
                  <ArrowRight size={36} strokeWidth={3.5} />
                </Button>
              )}
            </div>
          </motion.div>
        )}
    </div>
  )
}
