import { useState } from 'react'
import { motion } from 'framer-motion'
import AudioButton from '../common/AudioButton.jsx'
import Pic from '../common/Pic.jsx'
import { useSpeech } from '../../hooks/useSpeech.js'

const SPARKS = [0, 60, 120, 180, 240, 300]

/**
 * Level 1 — satu huruf sangat besar + gambar benda berawalan huruf itu.
 * Menekan huruf membunyikan FONEM-nya (mis. "beh"), bukan nama hurufnya.
 * Nama huruf tersedia di tombol terpisah.
 */
export default function LetterCard({ item }) {
  const { speak, say, canPlay } = useSpeech()
  const [burst, setBurst] = useState(0)
  const sound = [say.phoneme(item.letter)]
  const playable = canPlay(sound)

  const tapLetter = () => {
    setBurst((b) => b + 1)
    if (playable) speak(sound, 'huruf')
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <motion.button
          type="button"
          onClick={tapLetter}
          aria-label={`Huruf ${item.letter}. Tekan untuk mendengar bunyinya`}
          whileTap={{ scale: 0.94 }}
          className="card flex h-56 w-64 items-center justify-center gap-3 !border-b-[10px] !border-coral-dark/30 bg-white sm:h-64 sm:w-80"
        >
          <span className="font-display text-[9rem] font-extrabold leading-none text-coral-dark sm:text-[11rem]">{item.letter}</span>
          <span className="font-display text-[6rem] font-extrabold leading-none text-coral sm:text-[7rem]">{item.lower}</span>
        </motion.button>
        {/* percikan bintang saat huruf ditekan */}
        {burst > 0 &&
          SPARKS.map((deg) => (
            <motion.span
              key={`${burst}-${deg}`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-sun"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos((deg * Math.PI) / 180) * 150, y: Math.sin((deg * Math.PI) / 180) * 130, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              aria-hidden="true"
            />
          ))}
      </div>

      <div className="flex items-center gap-3">
        <AudioButton parts={sound} id="huruf" size="lg" label={`Dengarkan bunyi huruf ${item.letter}`} onPlay={() => setBurst((b) => b + 1)} />
        <div className="text-left">
          <p className="font-display text-xl font-extrabold leading-tight">Bunyi {item.ipa}</p>
          <div className="mt-1 flex items-center gap-2">
            <AudioButton parts={[say.letterName(item.letter)]} id="nama-huruf" size="sm" label={`Dengarkan nama huruf ${item.letter}`} />
            <span className="text-sm font-bold text-ink/60">nama huruf: “{item.name}”</span>
          </div>
        </div>
      </div>

      <div className="card flex items-center gap-4 px-5 py-3">
        <Pic name={item.pic} className="h-20 w-20" />
        <p className="font-display text-4xl font-extrabold">
          <span className="text-coral-dark">{item.word[0]}</span>
          {item.word.slice(1)}
        </p>
        <AudioButton parts={[say.phoneme(item.letter), say.word(item.word)]} id="kata-contoh" size="md" label={`Dengarkan kata ${item.word}`} />
      </div>
    </div>
  )
}
