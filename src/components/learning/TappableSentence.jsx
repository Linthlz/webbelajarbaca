import { useSpeech } from '../../hooks/useSpeech.js'

/** Kalimat berhuruf besar; setiap kata bisa ditekan untuk mendengar pengucapannya. */
export default function TappableSentence({ text, className = '' }) {
  const { speak, say, speakingId, canPlay } = useSpeech()
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <p className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-2 ${className}`} aria-label={text}>
      {words.map((word, i) => {
        const clean = word.replace(/[^\p{L}]/gu, '')
        const id = `kata-${i}-${clean}`
        const part = say.word(clean)
        const playable = canPlay(part)
        return (
          <button
            key={id}
            type="button"
            disabled={!playable}
            aria-label={playable ? `Dengarkan kata ${clean}` : clean}
            onClick={() => speak(part, id)}
            className={`rounded-2xl border-b-4 px-3 py-1 font-display text-4xl font-extrabold leading-tight transition-colors sm:text-5xl ${
              speakingId === id ? 'border-sun-dark bg-sun' : 'border-transparent bg-sun-soft/70 hover:bg-sun-soft'
            } disabled:cursor-default disabled:bg-transparent`}
          >
            {word}
          </button>
        )
      })}
    </p>
  )
}
