import { useState } from 'react'
import { motion } from 'framer-motion'
import Prompt from './Prompt.jsx'
import Pic, { Scene } from '../common/Pic.jsx'
import { SYLLABLE_COLORS } from '../../utils/theme.js'

function OptionFace({ option }) {
  switch (option.kind) {
    case 'letter':
      return <span className="text-6xl sm:text-7xl">{option.value}</span>
    case 'text':
      return <span className="text-4xl sm:text-5xl">{option.value}</span>
    case 'syllables':
      return (
        <span className="text-3xl sm:text-4xl">
          {option.value.map((s, i) => (
            <span key={i} className={SYLLABLE_COLORS[i % SYLLABLE_COLORS.length]}>
              {s}
            </span>
          ))}
        </span>
      )
    case 'pic':
      return <Pic name={option.value} className="h-20 w-20 sm:h-24 sm:w-24" decorative />
    case 'scene':
      return <Scene scene={option.value} size="h-11 w-11 sm:h-20 sm:w-20" />
    default:
      return null
  }
}

/** Ronde pilihan: satu soal, beberapa ubin jawaban besar. */
export default function ChoiceRound({ round, onCorrect, onWrong, locked }) {
  const [wrong, setWrong] = useState([])
  const [solved, setSolved] = useState(false)

  const choose = (option) => {
    if (locked || solved || wrong.includes(option.id)) return
    if (option.id === round.answer) {
      setSolved(true)
      onCorrect()
    } else {
      setWrong((w) => [...w, option.id])
      onWrong()
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Prompt round={round} solved={solved} />
      <div className={`grid w-full gap-3 ${round.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {round.options.map((option) => {
          const isWrong = wrong.includes(option.id)
          const isRight = solved && option.id === round.answer
          return (
            <motion.button
              key={option.id}
              type="button"
              aria-label={option.label}
              aria-disabled={isWrong || undefined}
              onClick={() => choose(option)}
              animate={isWrong ? { x: [0, -10, 10, -6, 6, 0] } : isRight ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.45 }}
              className={`tile min-h-[104px] px-2 py-3 sm:min-h-[128px] ${
                isRight ? '!border-mint-dark !bg-mint-soft' : isWrong ? 'opacity-35' : 'hover:bg-sky-soft'
              }`}
            >
              <OptionFace option={option} />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
