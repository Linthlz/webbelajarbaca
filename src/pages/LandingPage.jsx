import { motion } from 'framer-motion'
import { Play, Map as MapIcon } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Mascot from '../components/common/Mascot.jsx'
import AudioButton from '../components/common/AudioButton.jsx'
import { assetUrl } from '../data/pictures.js'
import { useLearning } from '../context/LearningContext.jsx'
import { hasAnyProgress } from '../utils/progress.js'
import { say } from '../utils/speechEngine.js'

const GREETING = [say.text('Halo! Aku Pipi. Yuk, belajar membaca! Tekan tombol hijau untuk mulai.')]

export default function LandingPage() {
  const { progress } = useLearning()
  const returning = hasAnyProgress(progress)

  return (
    <main
      className="flex min-h-[100dvh] flex-col items-center bg-cover bg-bottom px-5 pb-10 pt-6"
      style={{ backgroundImage: `url(${assetUrl('backgrounds/bukit.svg')})` }}
    >
      <header className="flex items-center gap-2 rounded-full bg-white/90 py-1.5 pl-2 pr-5 shadow-card">
        <img src={assetUrl('mascot/pipi.svg')} alt="" className="h-10 w-10" />
        <span className="font-display text-xl font-extrabold">Petualangan Membaca</span>
      </header>

      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
          <Mascot mood="wave" size={190} bubble={returning && progress.name ? `Halo, ${progress.name}!` : 'Halo!'} />
        </motion.div>
        <h1 className="text-5xl sm:text-6xl">Yuk, Belajar Membaca!</h1>
        <p className="max-w-xs text-xl font-bold text-ink/80">Ayo kenali huruf, bermain, dan belajar membaca bersama!</p>

        <div className="mt-2 flex w-full flex-col items-center gap-3">
          <div className="flex w-full items-center gap-3">
            <AudioButton parts={GREETING} id="sapaan" size="lg" label="Dengarkan sapaan Pipi" />
            <Button to="/belajar" variant="mint" size="lg" className="flex-1 whitespace-nowrap !px-4 !text-xl sm:!text-2xl">
              <Play size={30} strokeWidth={3} fill="currentColor" /> MULAI BELAJAR
            </Button>
          </div>
          {returning && (
            <Button to="/beranda" variant="sun" size="md" className="w-full">
              <MapIcon size={26} strokeWidth={3} /> Lanjutkan Petualangan
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
