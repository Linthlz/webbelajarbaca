import { VolumeX, RefreshCw } from 'lucide-react'
import { useSpeech } from '../../hooks/useSpeech.js'

/** Pemberitahuan jelas ketika suara tidak bisa diputar di perangkat ini. */
export default function AudioNotice() {
  const { status, recheckSpeech } = useSpeech()
  if (status === 'ready' || status === 'checking') return null
  const message =
    status === 'unsupported'
      ? 'Browser ini tidak bisa membacakan suara. Coba buka dengan Chrome, Edge, atau Safari versi terbaru.'
      : 'Suara bahasa Indonesia belum terpasang di perangkat ini. Pasang suara "Bahasa Indonesia" di pengaturan Text-to-Speech perangkat, lalu periksa lagi.'
  return (
    <div role="alert" className="flex items-center gap-3 bg-coral-soft px-4 py-3 text-sm font-bold text-ink">
      <VolumeX className="shrink-0 text-coral-dark" size={28} strokeWidth={2.5} />
      <p className="flex-1 leading-snug">
        <span className="block font-display text-base font-extrabold">Suara tidak tersedia</span>
        {message}
      </p>
      {status === 'no-voice' && (
        <button type="button" onClick={recheckSpeech} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 font-display font-extrabold text-coral-dark">
          <RefreshCw size={18} strokeWidth={3} /> Periksa lagi
        </button>
      )}
    </div>
  )
}
