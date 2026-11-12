import { Users, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Mascot from '../components/common/Mascot.jsx'
import Pic from '../components/common/Pic.jsx'
import AudioButton from '../components/common/AudioButton.jsx'
import { useLearning } from '../context/LearningContext.jsx'
import { say } from '../utils/speechEngine.js'

const SPEEDS = [
  { value: 0.8, label: 'Pelan', pic: 'kura' },
  { value: 1, label: 'Sedang', pic: 'bebek' },
  { value: 1.2, label: 'Cepat', pic: 'kelinci' },
]

/** Profil Saya: nama anak, kecepatan suara, dan pintu ke area pendamping. */
export default function ProfilePage() {
  const { progress, setName, setSpeechRate } = useLearning()
  const sample = [say.text(`Halo, ${progress.name || 'Teman'}! Ini suara Pipi.`)]

  return (
    <div className="flex flex-col gap-5">
      <section className="card flex flex-col items-center gap-3 p-5">
        <Mascot mood="wave" size={110} />
        <h1 className="text-3xl">Profil Saya</h1>
        <label className="w-full max-w-sm">
          <span className="mb-1 block font-display text-lg font-extrabold">Namaku</span>
          <input
            type="text"
            value={progress.name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tulis nama di sini"
            autoComplete="off"
            className="w-full rounded-2xl border-2 border-ink/15 bg-cream px-4 py-3 text-center font-display text-2xl font-extrabold placeholder:text-ink/30 focus:border-sky"
          />
          <span className="mt-1 block text-center text-sm font-bold text-ink/50">Minta bantuan ayah, ibu, atau guru untuk menulis nama.</span>
        </label>
      </section>

      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl">Kecepatan Suara</h2>
          <AudioButton parts={sample} id="contoh-suara" label="Coba suara" />
        </div>
        <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Kecepatan suara">
          {SPEEDS.map((s) => {
            const active = progress.settings.speechRate === s.value
            return (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSpeechRate(s.value)}
                className={`tile flex-col gap-1 py-3 text-lg ${active ? '!border-sky-dark !bg-sky-soft' : ''}`}
              >
                <Pic name={s.pic} className="h-12 w-12" decorative />
                {s.label}
              </button>
            )
          })}
        </div>
      </section>

      <Link to="/pendamping" className="card flex items-center gap-3 p-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-grape-soft text-grape-dark">
          <Users size={26} strokeWidth={2.5} />
        </span>
        <span className="flex-1">
          <span className="block font-display text-lg font-extrabold">Untuk Orang Tua / Guru</span>
          <span className="block text-sm font-bold text-ink/60">Lihat laporan belajar anak</span>
        </span>
        <ChevronRight size={26} strokeWidth={3} className="text-ink/40" />
      </Link>
    </div>
  )
}
