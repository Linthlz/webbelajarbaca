import { useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Button from '../components/common/Button.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import { ActivityBar } from '../components/common/AppShell.jsx'
import { LEVELS, getLevel } from '../data/levels.js'
import { GAMES, getGame } from '../data/games.js'
import { BADGES } from '../data/rewards.js'
import { useLearning } from '../context/LearningContext.jsx'
import { useSpeech } from '../hooks/useSpeech.js'
import { overallProgress, stagesDone, stageKey } from '../utils/progress.js'

const AUDIO_STATUS = {
  ready: 'Aktif — suara bahasa Indonesia tersedia di perangkat ini.',
  checking: 'Sedang memeriksa suara…',
  unsupported: 'Tidak tersedia — browser ini tidak mendukung pembacaan suara (SpeechSynthesis).',
  'no-voice': 'Tidak tersedia — suara bahasa Indonesia belum terpasang di perangkat ini.',
}

const formatDate = (ts) =>
  ts ? new Date(ts).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

/** Gerbang sederhana supaya anak tidak tidak sengaja masuk: soal penjumlahan untuk orang dewasa. */
function Gate({ onPass }) {
  const [a, b] = useMemo(() => [6 + Math.floor(Math.random() * 4), 5 + Math.floor(Math.random() * 4)], [])
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  return (
    <form
      className="card mx-auto mt-10 flex max-w-sm flex-col items-center gap-4 p-6 text-center"
      onSubmit={(e) => {
        e.preventDefault()
        if (Number(value) === a + b) onPass()
        else setError(true)
      }}
    >
      <h1 className="text-2xl">Area Orang Tua / Guru</h1>
      <label className="w-full">
        <span className="mb-2 block text-lg font-bold">
          Berapa {a} + {b}?
        </span>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          aria-label="Jawaban"
          className="w-full rounded-2xl border-2 border-ink/15 bg-cream px-4 py-3 text-center font-display text-3xl font-extrabold focus:border-sky"
        />
      </label>
      {error && (
        <p role="alert" className="font-bold text-coral-dark">
          Jawaban belum tepat.
        </p>
      )}
      <Button type="submit" variant="grape" className="w-full">
        Masuk
      </Button>
    </form>
  )
}

/** Laporan pendamping: ringkasan progres tanpa mengganggu tampilan anak. */
export default function ParentPage() {
  const { progress, resetProgress } = useLearning()
  const { status } = useSpeech()
  const [open, setOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const last = progress.lastActivity
  const lastText = !last
    ? 'Belum ada aktivitas'
    : last.kind === 'level'
      ? `Level ${last.levelId} (${getLevel(last.levelId)?.title}) — tahap ${last.stageIdx + 1}`
      : `Permainan ${getGame(last.gameId)?.title}`

  return (
    <div className="mx-auto min-h-[100dvh] max-w-3xl px-4 pb-10 pt-4">
      <ActivityBar backTo="/profil">
        <h1 className="text-2xl">Laporan Belajar</h1>
      </ActivityBar>
      {!open ? (
        <Gate onPass={() => setOpen(true)} />
      ) : (
        <div className="mt-5 flex flex-col gap-5">
          <section className="card grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
            {[
              ['Nama anak', progress.name || '(belum diisi)'],
              ['Bintang', progress.stars],
              ['Lencana', `${progress.badges.length}/${BADGES.length}`],
              ['Selesai', `${Math.round(overallProgress(progress) * 100)}%`],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-sm font-bold text-ink/60">{k}</p>
                <p className="font-display text-2xl font-extrabold">{v}</p>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-4">
              <p className="text-sm font-bold text-ink/60">Aktivitas terakhir</p>
              <p className="font-bold">
                {lastText} · {formatDate(last?.at)}
              </p>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-1 text-xl">Level belajar</h2>
            <p className="mb-3 text-sm font-bold text-ink/60">“Benar sekali coba” = soal latihan yang dijawab benar pada percobaan pertama (hasil terbaik).</p>
            <ul className="flex flex-col gap-4">
              {LEVELS.map((level) => {
                const done = stagesDone(progress, level)
                const records = level.stages.map((_, i) => progress.stages[stageKey(level.id, i)]).filter(Boolean)
                const best = records.reduce((n, r) => n + r.best, 0)
                const total = records.reduce((n, r) => n + r.total, 0)
                return (
                  <li key={level.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="font-display text-lg font-extrabold">
                        Level {level.id} · {level.title}
                      </p>
                      <p className="text-sm font-bold text-ink/70">
                        {done}/{level.stages.length} tahap{total > 0 && ` · benar sekali coba ${best}/${total}`}
                      </p>
                    </div>
                    <ProgressBar value={done / level.stages.length} tone={level.tone} label={`Progres level ${level.id}`} />
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="card overflow-x-auto p-5">
            <h2 className="mb-3 text-xl">Permainan</h2>
            <table className="w-full min-w-[26rem] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink/10 text-ink/60">
                  <th className="py-2 pr-2">Permainan</th>
                  <th className="py-2 pr-2">Dimainkan</th>
                  <th className="py-2 pr-2">Nilai terakhir</th>
                  <th className="py-2 pr-2">Nilai terbaik</th>
                  <th className="py-2">Terakhir main</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                {GAMES.map((game) => {
                  const g = progress.games[game.id]
                  return (
                    <tr key={game.id} className="border-b border-ink/5">
                      <td className="py-2 pr-2">{game.title}</td>
                      <td className="py-2 pr-2">{g ? `${g.plays}×` : '—'}</td>
                      <td className="py-2 pr-2">{g ? `${g.last}/${g.total}` : '—'}</td>
                      <td className="py-2 pr-2">{g ? `${g.best}/${g.total}` : '—'}</td>
                      <td className="py-2">{formatDate(g?.at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          <section className="card p-5">
            <h2 className="mb-2 text-xl">Suara</h2>
            <p className="font-bold">{AUDIO_STATUS[status]}</p>
            <p className="mt-2 text-sm font-bold text-ink/60">
              Bunyi huruf (fonem) dibacakan mesin suara perangkat sebagai pendekatan, mis. B → “beh”. Dampingi anak pada Level 1–2 dan contohkan bunyinya bila perlu.
            </p>
          </section>

          <section className="card p-5">
            <h2 className="mb-2 text-xl">Tips mendampingi</h2>
            <ul className="list-disc space-y-1 pl-5 font-bold text-ink/80">
              <li>Cukup 10–15 menit sehari, tetapi rutin.</li>
              <li>Minta anak menirukan bunyi dengan suara keras.</li>
              <li>Tahap yang sudah selesai boleh diulang; bintang tidak pernah berkurang.</li>
            </ul>
          </section>

          <section className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h2 className="text-xl">Hapus progres</h2>
              <p className="text-sm font-bold text-ink/60">Menghapus nama, bintang, lencana, dan semua nilai di perangkat ini.</p>
            </div>
            {confirmReset ? (
              <div className="flex gap-2">
                <Button variant="white" size="sm" onClick={() => setConfirmReset(false)}>
                  Batal
                </Button>
                <Button
                  variant="coral"
                  size="sm"
                  onClick={() => {
                    resetProgress()
                    setConfirmReset(false)
                  }}
                >
                  Ya, hapus semua
                </Button>
              </div>
            ) : (
              <Button variant="white" size="sm" onClick={() => setConfirmReset(true)}>
                <Trash2 size={18} strokeWidth={2.5} /> Hapus progres
              </Button>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
