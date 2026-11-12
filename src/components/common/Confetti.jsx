import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#FFC533', '#45B4F2', '#FF7B6B', '#37C98B', '#9A7BF2', '#FF9F43']

/** Hujan konfeti ringan (tanpa pustaka tambahan). */
export default function Confetti({ count = 40 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.6,
        rotate: Math.random() * 720 - 360,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
        size: 8 + Math.random() * 8,
      })),
    [count],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block"
          style={{ left: `${p.left}%`, width: p.size, height: p.round ? p.size : p.size * 1.6, background: p.color, borderRadius: p.round ? 999 : 3 }}
          initial={{ y: '-10vh', rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', rotate: p.rotate, opacity: [1, 1, 0.8] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}
