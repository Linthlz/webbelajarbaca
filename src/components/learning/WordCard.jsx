import AudioButton from '../common/AudioButton.jsx'
import Pic from '../common/Pic.jsx'
import { useSpeech } from '../../hooks/useSpeech.js'
import { SYLLABLE_BG, SYLLABLE_COLORS } from '../../utils/theme.js'

/**
 * Level 3 & 4 — gambar + kata yang dipisah per suku kata (BO-LA).
 * Setiap suku kata bisa ditekan; tombol suara membacakan pelan lalu utuh: "bo… la… bola".
 */
export default function WordCard({ item }) {
  const { speak, say, speakingId, canPlay } = useSpeech()
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="card flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
        <Pic name={item.pic} className="h-36 w-36 sm:h-44 sm:w-44" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2" aria-label={`Kata ${item.text}`}>
        {item.syl.map((s, i) => {
          const id = `suku-${i}`
          const part = say.syllable(s)
          return (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="font-display text-4xl font-extrabold text-ink/30">-</span>}
              <button
                type="button"
                disabled={!canPlay(part)}
                onClick={() => speak(part, id)}
                aria-label={`Suku kata ${s}`}
                className={`rounded-3xl border-b-[6px] px-4 py-2 font-display text-5xl font-extrabold leading-none transition-transform active:translate-y-1 sm:text-6xl ${SYLLABLE_BG[i % 4]} ${SYLLABLE_COLORS[i % 4]} ${
                  speakingId === id ? 'border-sun-dark ring-4 ring-sun' : 'border-ink/10'
                }`}
              >
                {s}
              </button>
            </span>
          )
        })}
      </div>
      <AudioButton parts={say.wordSlow(item.syl)} id="kartu" size="lg" label={`Dengarkan kata ${item.text}`} />
    </div>
  )
}
