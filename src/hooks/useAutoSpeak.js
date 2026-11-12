import { useEffect } from 'react'
import { speak } from '../utils/speechEngine.js'

/**
 * Bacakan instruksi otomatis saat layar/soal berganti.
 * Diberi jeda singkat supaya tidak bertabrakan dengan penghentian suara saat pindah halaman.
 * Catatan: browser baru mengizinkan suara setelah anak menekan sesuatu di halaman.
 */
export function useAutoSpeak(parts, deps, id = 'instruksi', delay = 400) {
  useEffect(() => {
    if (!parts || (Array.isArray(parts) && !parts.length)) return undefined
    const t = setTimeout(() => speak(parts, id), delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
