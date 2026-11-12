import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Prompt from './Prompt.jsx'
import { say, speak } from '../../utils/speechEngine.js'
import { SYLLABLE_BG } from '../../utils/theme.js'

/**
 * Ronde menyusun: tekan potongan (huruf / suku kata) untuk mengisi kotak dari kiri ke kanan.
 * Tekan kotak yang sudah terisi untuk mengembalikan potongannya.
 */
export default function ArrangeRound({ round, onCorrect, onWrong, locked }) {
  const [slots, setSlots] = useState(() => round.answer.map(() => null)) // berisi indeks potongan
  const [state, setState] = useState('idle') // idle | right | wrong
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const busy = locked || state !== 'idle'
  const used = (pieceIdx) => slots.includes(pieceIdx)
  const pieceParts = (piece) => (round.pieceSound === 'phoneme' ? say.phoneme(piece) : say.syllable(piece))

  const place = (pieceIdx) => {
    if (busy || used(pieceIdx)) return
    const empty = slots.indexOf(null)
    if (empty === -1) return
    const next = [...slots]
    next[empty] = pieceIdx
    setSlots(next)
    if (next.includes(null)) {
      speak(pieceParts(round.pieces[pieceIdx]), 'ubin')
      return
    }
    const ok = next.every((idx, i) => round.pieces[idx] === round.answer[i])
    if (ok) {
      setState('right')
      onCorrect()
    } else {
      setState('wrong')
      onWrong()
      timer.current = setTimeout(() => {
        setSlots(round.answer.map(() => null))
        setState('idle')
      }, 1100)
    }
  }

  const remove = (slotIdx) => {
    if (busy || slots[slotIdx] === null) return
    const next = [...slots]
    next[slotIdx] = null
    setSlots(next)
  }

  const big = round.pieceSound === 'phoneme'
  const text = big ? 'text-6xl' : 'text-3xl sm:text-4xl'

  return (
    <div className="flex flex-col items-center gap-6">
      <Prompt round={round} />
      <motion.div
        className="flex items-center justify-center gap-2"
        animate={state === 'wrong' ? { x: [0, -10, 10, -6, 6, 0] } : state === 'right' ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.45 }}
        aria-label="Kotak jawaban"
      >
        {slots.map((pieceIdx, i) => (
          <button
            key={i}
            type="button"
            aria-label={pieceIdx === null ? `Kotak ${i + 1} kosong` : `Kotak ${i + 1}: ${round.pieces[pieceIdx]}`}
            onClick={() => remove(i)}
            className={`flex h-20 min-w-[4.5rem] items-center justify-center rounded-2xl border-4 px-3 font-display font-extrabold ${text} ${
              pieceIdx === null
                ? 'border-dashed border-sky bg-sky-soft'
                : state === 'right'
                  ? 'border-mint-dark bg-mint-soft text-mint-dark'
                  : `border-ink/10 ${SYLLABLE_BG[i % SYLLABLE_BG.length]}`
            }`}
          >
            {pieceIdx === null ? '' : round.pieces[pieceIdx]}
          </button>
        ))}
      </motion.div>
      <div className="flex flex-wrap items-center justify-center gap-3" aria-label="Pilihan potongan">
        {round.pieces.map((piece, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Potongan ${piece}`}
            disabled={used(idx)}
            onClick={() => place(idx)}
            className={`tile h-20 min-w-[5rem] px-4 ${text} ${used(idx) ? 'invisible' : 'hover:bg-sun-soft'}`}
          >
            {piece}
          </button>
        ))}
      </div>
    </div>
  )
}
