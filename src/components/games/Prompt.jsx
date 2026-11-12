import AudioButton from '../common/AudioButton.jsx'
import Pic from '../common/Pic.jsx'
import TappableSentence from '../learning/TappableSentence.jsx'
import { say } from '../../utils/speechEngine.js'

/** Bagian "soal" dari sebuah ronde: suara, gambar, kata rumpang, kalimat, atau pertanyaan. */
export default function Prompt({ round, solved = false }) {
  const { prompt, parts } = round
  switch (prompt.kind) {
    case 'audio':
      return (
        <div className="flex flex-col items-center gap-2">
          <AudioButton parts={parts} id="soal" size="xl" label="Dengarkan soal" />
        </div>
      )
    case 'pic':
      return (
        <div className="flex items-center justify-center gap-4">
          <div className="card flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
            <Pic name={prompt.pic} className="h-28 w-28 sm:h-36 sm:w-36" />
          </div>
          <AudioButton parts={parts} id="soal" size="md" label="Dengarkan nama gambar" />
        </div>
      )
    case 'cloze':
      return (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="card flex h-28 w-28 items-center justify-center">
              <Pic name={prompt.pic} className="h-20 w-20" />
            </div>
            <AudioButton parts={parts} id="soal" size="md" label="Dengarkan kata" />
          </div>
          <div className="flex items-end gap-2" aria-label="Kata dengan satu huruf hilang">
            {prompt.letters.map((ch, i) =>
              ch ? (
                <span key={i} className="font-display text-6xl font-extrabold leading-none">
                  {ch}
                </span>
              ) : (
                <span
                  key={i}
                  className={`flex h-16 w-14 items-center justify-center rounded-2xl border-4 border-dashed font-display text-6xl font-extrabold leading-none ${
                    solved ? 'border-mint bg-mint-soft text-mint-dark' : 'border-sky bg-sky-soft text-transparent'
                  }`}
                >
                  {solved ? prompt.full[i] : '_'}
                </span>
              ),
            )}
          </div>
        </div>
      )
    case 'sentence':
      return (
        <div className="card flex flex-col items-center gap-3 px-4 py-5">
          <TappableSentence text={prompt.text} />
          <AudioButton parts={[say.sentence(prompt.text)]} id="soal" size="md" label="Dengarkan kalimat" />
        </div>
      )
    case 'question':
      return (
        <div className="card flex items-center justify-center gap-4 px-5 py-5">
          <p className="font-display text-3xl font-extrabold leading-tight">{prompt.text}</p>
          <AudioButton parts={[say.sentence(prompt.text)]} id="soal" size="md" label="Dengarkan pertanyaan" />
        </div>
      )
    default:
      return null
  }
}
