import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import GuessLetter from '../components/games/GuessLetter.jsx'
import MatchPicture from '../components/games/MatchPicture.jsx'
import ArrangeSyllable from '../components/games/ArrangeSyllable.jsx'
import ListenAndChoose from '../components/games/ListenAndChoose.jsx'
import CompleteWord from '../components/games/CompleteWord.jsx'
import ReadingAdventure from '../components/games/ReadingAdventure.jsx'
import GameIntro from '../components/games/GameIntro.jsx'
import StarReward from '../components/common/StarReward.jsx'
import AudioButton from '../components/common/AudioButton.jsx'
import Pic from '../components/common/Pic.jsx'
import { GAMES, getGame } from '../data/games.js'
import { TONES } from '../utils/theme.js'
import { useLearning } from '../context/LearningContext.jsx'
import { say } from '../utils/speechEngine.js'

const COMPONENTS = {
  'tebak-huruf': GuessLetter,
  'cocokkan-gambar': MatchPicture,
  'susun-suku-kata': ArrangeSyllable,
  'dengarkan-dan-pilih': ListenAndChoose,
  'lengkapi-kata': CompleteWord,
  petualangan: ReadingAdventure,
}

const LIST_INTRO = [say.text('Ayo bermain! Pilih permainan yang kamu suka.')]

/** /bermain — daftar enam permainan. */
export function GameList() {
  const { progress } = useLearning()
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-3xl">Ayo Bermain!</h1>
        <AudioButton parts={LIST_INTRO} id="instruksi" label="Dengarkan instruksi" />
      </div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {GAMES.map((game) => {
          const tone = TONES[game.tone]
          const score = progress.games[game.id]
          return (
            <li key={game.id}>
              <Link
                to={`/bermain/${game.id}`}
                className={`relative flex min-h-[11rem] flex-col items-center justify-center gap-2 rounded-[2rem] border-b-[8px] p-3 text-center transition-transform active:translate-y-1 active:border-b-2 ${tone.soft} ${tone.border}`}
              >
                <Pic name={game.pic} className="h-20 w-20" decorative />
                <span className="font-display text-xl font-extrabold leading-tight">{game.title}</span>
                {score && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-0.5 font-display text-sm font-extrabold" aria-label={`Nilai terbaik ${score.best} dari ${score.total}`}>
                    <Pic name="bintang" className="h-5 w-5" decorative /> {score.best}/{score.total}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** /bermain/:gameId — pembuka (instruksi + contoh) → permainan → perayaan. */
export default function GamePage() {
  const { gameId } = useParams()
  // key: berpindah game selalu mulai dari layar pembuka
  return <GameSession key={gameId} gameId={gameId} />
}

function GameSession({ gameId }) {
  const game = getGame(gameId)
  const { completeGame, setLastActivity } = useLearning()
  const [phase, setPhase] = useState('intro') // intro | play | done
  const [attempt, setAttempt] = useState(0)
  const [reward, setReward] = useState(null)

  useEffect(() => {
    if (game) setLastActivity({ kind: 'game', gameId: game.id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId])

  if (!game) return <Navigate to="/bermain" replace />
  const Game = COMPONENTS[game.id]

  if (phase === 'intro') return <GameIntro game={game} backTo="/bermain" onStart={() => setPhase('play')} />
  if (phase === 'done') {
    return (
      <StarReward
        reward={reward}
        onReplay={() => {
          setAttempt((a) => a + 1)
          setPhase('play')
        }}
        nextTo="/bermain"
      />
    )
  }
  return (
    <Game
      key={attempt}
      backTo="/bermain"
      tone={game.tone}
      onFinish={(result) => {
        setReward(completeGame(game.id, result))
        setPhase('done')
      }}
    />
  )
}
