import { useMemo } from 'react'
import { Play } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Mascot from '../components/common/Mascot.jsx'
import AudioButton from '../components/common/AudioButton.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import Pic from '../components/common/Pic.jsx'
import LevelMap from '../components/learning/LevelMap.jsx'
import { useLearning } from '../context/LearningContext.jsx'
import { nextLesson, overallProgress } from '../utils/progress.js'
import { getLevel } from '../data/levels.js'
import { say } from '../utils/speechEngine.js'

/** Dashboard anak: sapaan, semangat dari maskot, progres, bintang, dan peta petualangan. */
export default function DashboardPage() {
  const { progress } = useLearning()
  const name = progress.name || 'Teman'
  const next = nextLesson(progress)
  const pct = overallProgress(progress)

  const cheer =
    pct === 0 ? 'Ayo mulai petualangan kita!' : pct < 1 ? 'Kamu semakin pintar. Ayo lanjut!' : 'Hore! Semua level sudah selesai!'
  const greeting = useMemo(() => [say.text(`Halo, ${name}!`), say.text(cheer)], [name, cheer])
  const nextLevel = next && getLevel(next.levelId)

  return (
    <div className="flex flex-col gap-5">
      <section className="card flex items-center gap-3 bg-sun-soft p-4">
        <Mascot mood="wave" size={84} />
        <div className="min-w-0 flex-1">
          <h1 className="break-words text-2xl sm:text-3xl">Halo, {name}!</h1>
          <p className="text-base font-bold leading-snug text-ink/80 sm:text-lg">{cheer}</p>
        </div>
        <AudioButton parts={greeting} id="sapaan" label="Dengarkan sapaan" />
      </section>

      <section className="grid grid-cols-[auto,1fr] items-center gap-4 rounded-[2rem] bg-white p-4 shadow-card">
        <div className="flex flex-col items-center rounded-3xl bg-sun-soft px-4 py-2">
          <Pic name="bintang" className="h-12 w-12" decorative />
          <span className="font-display text-3xl font-extrabold leading-none" aria-label={`${progress.stars} bintang`}>
            {progress.stars}
          </span>
        </div>
        <div>
          <p className="mb-1 font-display text-lg font-extrabold">Perjalananku: {Math.round(pct * 100)}%</p>
          <ProgressBar value={pct} tone="mint" label="Progres belajar keseluruhan" />
        </div>
      </section>

      <Button to={next ? `/belajar/${next.levelId}/${next.stageIdx}` : '/belajar'} variant="mint" size="lg" className="w-full whitespace-nowrap !px-4 !text-xl sm:!text-2xl">
        <Play size={30} strokeWidth={3} fill="currentColor" />
        {next ? (pct === 0 ? 'Mulai Belajar' : 'Lanjutkan Belajar') : 'Ulangi Pelajaran'}
        {nextLevel && <span className="rounded-full bg-white/25 px-3 py-0.5 text-base">Level {nextLevel.id}</span>}
      </Button>

      <section>
        <h2 className="mb-3 text-2xl">Peta Petualangan</h2>
        <LevelMap />
      </section>
    </div>
  )
}
