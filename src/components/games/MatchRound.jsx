import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Pic from '../common/Pic.jsx'
import { say, speak } from '../../utils/speechEngine.js'

/** Ronde mencocokkan (tap-to-match): tekan gambar, lalu tekan huruf awalnya. */
export default function MatchRound({ round, onCorrect, onWrong, locked }) {
  const [selected, setSelected] = useState(null) // indeks gambar
  const [done, setDone] = useState([]) // huruf yang sudah cocok
  const [shake, setShake] = useState(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const pickPicture = (i) => {
    if (locked || done.includes(round.pairs[i].letter)) return
    setSelected(i)
    speak(say.word(round.pairs[i].word), 'ubin')
  }

  const pickLetter = (letter) => {
    if (locked || done.includes(letter)) return
    if (selected === null) {
      // belum memilih gambar: goyangkan gambar sebagai petunjuk
      setShake('pics')
      timer.current = setTimeout(() => setShake(null), 500)
      return
    }
    if (round.pairs[selected].letter === letter) {
      const next = [...done, letter]
      setDone(next)
      setSelected(null)
      if (next.length === round.pairs.length) onCorrect()
      else speak(say.phoneme(letter), 'ubin')
    } else {
      setShake(letter)
      timer.current = setTimeout(() => setShake(null), 500)
      onWrong()
    }
  }

  const wobble = { x: [0, -8, 8, -5, 5, 0] }

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.div className="grid w-full grid-cols-3 gap-3" animate={shake === 'pics' ? wobble : {}} transition={{ duration: 0.4 }}>
        {round.pairs.map((pair, i) => {
          const matched = done.includes(pair.letter)
          return (
            <button
              key={pair.letter}
              type="button"
              aria-label={`Gambar ${pair.word.toLowerCase()}`}
              aria-pressed={selected === i}
              onClick={() => pickPicture(i)}
              className={`tile relative min-h-[112px] py-2 ${
                matched ? '!border-mint-dark !bg-mint-soft' : selected === i ? '!border-sky-dark !bg-sky-soft ring-4 ring-sky/40' : ''
              }`}
            >
              <Pic name={pair.pic} className="h-20 w-20 sm:h-24 sm:w-24" decorative />
              {matched && (
                <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-mint text-white">
                  <Check size={22} strokeWidth={4} />
                </span>
              )}
            </button>
          )
        })}
      </motion.div>
      <div className="grid w-full grid-cols-3 gap-3">
        {round.letters.map((letter) => {
          const matched = done.includes(letter)
          return (
            <motion.button
              key={letter}
              type="button"
              aria-label={`huruf ${letter}`}
              onClick={() => pickLetter(letter)}
              animate={shake === letter ? wobble : {}}
              transition={{ duration: 0.4 }}
              className={`tile min-h-[96px] text-6xl ${matched ? '!border-mint-dark !bg-mint-soft text-mint-dark' : 'hover:bg-sun-soft'}`}
            >
              {letter}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
