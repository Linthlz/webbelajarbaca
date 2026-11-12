import { PICTURES } from '../../data/pictures.js'

/** Satu gambar dari daftar PICTURES. */
export default function Pic({ name, className = 'h-24 w-24', decorative = false }) {
  const p = PICTURES[name]
  if (!p) return null
  return <img src={p.src} alt={decorative ? '' : p.label} className={`object-contain ${className}`} draggable={false} />
}

/** Beberapa gambar berdampingan sebagai ilustrasi kalimat / cerita. */
export function Scene({ scene, size = 'h-24 w-24', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {scene.map((name, i) => (
        <Pic key={`${name}-${i}`} name={name} className={size} />
      ))}
    </div>
  )
}
