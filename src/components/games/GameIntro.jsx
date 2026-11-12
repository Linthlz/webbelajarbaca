import { useMemo } from 'react'
import { ArrowRight, Check, Play, Volume2 } from 'lucide-react'
import AudioButton from '../common/AudioButton.jsx'
import Button from '../common/Button.jsx'
import Mascot from '../common/Mascot.jsx'
import Pic from '../common/Pic.jsx'
import { ActivityBar } from '../common/AppShell.jsx'
import { say } from '../../utils/speechEngine.js'
import { useAutoSpeak } from '../../hooks/useAutoSpeak.js'
import { TONES } from '../../utils/theme.js'

function ExampleToken({ token }) {
  switch (token.t) {
    case 'sound':
      return (
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sky text-white">
          <Volume2 size={34} strokeWidth={2.5} />
        </span>
      )
    case 'arrow':
      return <ArrowRight size={30} strokeWidth={3} className="text-ink/40" />
    case 'letter':
      return <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 bg-white font-display text-4xl font-extrabold">{token.v}</span>
    case 'text':
      return <span className="flex h-16 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 bg-white px-3 font-display text-3xl font-extrabold">{token.v}</span>
    case 'pic':
      return <Pic name={token.v} className="h-16 w-16" />
    case 'mascot':
      return <Mascot size={64} />
    case 'check':
      return (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint text-white">
          <Check size={24} strokeWidth={4} />
        </span>
      )
    default:
      return null
  }
}

/** Layar pembuka game: instruksi suara + contoh bergambar sebelum anak mulai. */
export default function GameIntro({ game, onStart, backTo }) {
  const parts = useMemo(() => [say.text(game.title), say.text(game.instruction)], [game])
  useAutoSpeak(parts, [game.id])
  const tone = TONES[game.tone]

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col px-4 pb-8 pt-4">
      <ActivityBar backTo={backTo}>
        <h1 className="truncate text-2xl">{game.title}</h1>
      </ActivityBar>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <Mascot mood="wave" size={120} bubble={game.instruction} />
        <div className={`flex w-full flex-col items-center gap-2 rounded-[2rem] px-4 py-5 ${tone.soft}`}>
          <p className="font-display text-lg font-extrabold text-ink/70">Contoh</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {game.example.map((token, i) => (
              <ExampleToken key={i} token={token} />
            ))}
          </div>
        </div>
        <div className="flex w-full items-center justify-center gap-4">
          <AudioButton parts={parts} id="instruksi" size="lg" label="Ulangi instruksi" />
          <Button variant="mint" size="lg" onClick={onStart} className="flex-1 sm:flex-none">
            <Play size={30} strokeWidth={3} fill="currentColor" /> MULAI
          </Button>
        </div>
      </div>
    </div>
  )
}
