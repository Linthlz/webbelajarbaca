import { useId } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSpeech } from '../../hooks/useSpeech.js'

const SIZES = {
  sm: { box: 'h-11 w-11', icon: 22 },
  md: { box: 'h-14 w-14', icon: 28 },
  lg: { box: 'h-20 w-20', icon: 40 },
  xl: { box: 'h-28 w-28', icon: 56 },
}

/**
 * Tombol suara serbaguna.
 *   parts : hasil dari say.* (lihat utils/speechEngine.js) — satu atau beberapa bagian.
 * Saat suara tidak tersedia di perangkat, tombol tampil dicoret dan nonaktif
 * (tidak pura-pura berfungsi).
 */
export default function AudioButton({ parts, id, size = 'md', label = 'Dengarkan', className = '', children, onPlay }) {
  const autoId = useId()
  const speechId = id || autoId
  const { speak, canPlay, speakingId, status } = useSpeech()
  const playable = canPlay(parts)
  const active = speakingId === speechId
  const s = SIZES[size]

  if (!playable) {
    return (
      <span
        role="img"
        aria-label={status === 'checking' ? 'Menyiapkan suara' : 'Suara tidak tersedia'}
        title={status === 'checking' ? 'Menyiapkan suara…' : 'Suara tidak tersedia di perangkat ini'}
        className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400 ${s.box} ${className}`}
      >
        <VolumeX size={s.icon} strokeWidth={2.5} />
      </span>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={() => {
        speak(parts, speechId)
        onPlay?.()
      }}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full border-b-[5px] border-sky-dark bg-sky text-white transition-transform active:translate-y-1 active:border-b-2 ${s.box} ${className}`}
    >
      {active && <span className="absolute inset-0 animate-soundwave rounded-full bg-sky" aria-hidden="true" />}
      <Volume2 size={s.icon} strokeWidth={2.5} className={`relative ${active ? 'animate-wiggle' : ''}`} />
      {children}
    </button>
  )
}
