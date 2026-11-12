import { Link, Outlet } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import NavBar from './NavBar.jsx'
import { StarCount } from './StarReward.jsx'
import { assetUrl } from '../../data/pictures.js'
import { useLearning } from '../../context/LearningContext.jsx'

/** Kerangka halaman utama (dengan menu bawah). */
export function TabLayout() {
  const { progress } = useLearning()
  return (
    <div className="mx-auto min-h-[100dvh] max-w-3xl px-4 pb-28 pt-4">
      <header className="mb-4 flex items-center justify-between">
        <Link to="/beranda" aria-label="Beranda" className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4 shadow-card">
          <img src={assetUrl('mascot/pipi.svg')} alt="" className="h-11 w-11" />
          <span className="font-display text-lg font-extrabold leading-none">Beranda</span>
        </Link>
        <StarCount value={progress.stars} />
      </header>
      <Outlet />
      <NavBar />
    </div>
  )
}

/** Bilah atas untuk layar aktivitas: tombol kembali + isi bebas (progres, judul). */
export function ActivityBar({ backTo, children, right }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        to={backTo}
        aria-label="Kembali"
        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-b-4 border-slate-200 bg-white text-ink active:translate-y-0.5 active:border-b-2"
      >
        <ArrowLeft size={28} strokeWidth={3} />
      </Link>
      <div className="min-w-0 flex-1">{children}</div>
      {right}
    </div>
  )
}
