import { motion } from 'framer-motion'

/**
 * Pipi si anak ayam — maskot Petualangan Membaca (ilustrasi SVG buatan sendiri).
 * mood: 'idle' | 'wave' | 'cheer' | 'oops'
 */
export default function Mascot({ mood = 'idle', size = 140, bubble, className = '' }) {
  const cheering = mood === 'cheer'
  const waving = mood === 'wave' || cheering
  const oops = mood === 'oops'

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {bubble && (
        <motion.div
          key={bubble}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative mb-2 max-w-[16rem] rounded-3xl border-2 border-ink/10 bg-white px-4 py-2 text-center font-display text-lg font-bold leading-snug shadow-card"
        >
          {bubble}
          <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-ink/10 bg-white" />
        </motion.div>
      )}
      <motion.svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        role="img"
        aria-label="Pipi si anak ayam"
        animate={cheering ? { y: [0, -14, 0] } : oops ? { rotate: [0, -6, 6, 0] } : { y: [0, -4, 0] }}
        transition={{ duration: cheering ? 0.6 : oops ? 0.5 : 2.4, repeat: oops ? 0 : Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="60" cy="110" rx="30" ry="5" fill="#2C3A57" opacity=".12" />
        <path d="M48 100v8m-6 0h12M72 100v8m-6 0h12" stroke="#FF9F43" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="60" cy="66" rx="38" ry="38" fill="#FFD23F" />
        <ellipse cx="60" cy="78" rx="24" ry="20" fill="#FFE98A" />
        <path d="M56 26c-2-8 2-13 6-14 0 5 3 7 2 14" fill="#FFD23F" stroke="#F2B200" strokeWidth="2" strokeLinecap="round" />
        {/* sayap kiri */}
        <ellipse cx="24" cy="70" rx="9" ry="15" fill="#FFBE1A" transform={cheering ? 'rotate(150 28 62)' : 'rotate(18 24 70)'} />
        {/* sayap kanan melambai */}
        <motion.g
          style={{ transformOrigin: '90px 64px' }}
          animate={waving ? { rotate: [-120, -160, -120] } : { rotate: 0 }}
          transition={{ duration: 0.5, repeat: waving ? Infinity : 0, ease: 'easeInOut' }}
        >
          <ellipse cx="96" cy="70" rx="9" ry="15" fill="#FFBE1A" transform="rotate(-18 96 70)" />
        </motion.g>
        {/* mata */}
        {cheering ? (
          <g fill="none" stroke="#2C3A57" strokeWidth="4" strokeLinecap="round">
            <path d="M40 58q6-8 12 0" />
            <path d="M68 58q6-8 12 0" />
          </g>
        ) : (
          <g>
            <circle cx="46" cy="56" r="7" fill="#2C3A57" />
            <circle cx="74" cy="56" r="7" fill="#2C3A57" />
            <circle cx="48" cy="54" r="2.4" fill="#fff" />
            <circle cx="76" cy="54" r="2.4" fill="#fff" />
          </g>
        )}
        {/* paruh */}
        {cheering ? (
          <path d="M51 65h18l-9 12z" fill="#FF9F43" stroke="#DE7C1D" strokeWidth="2" strokeLinejoin="round" />
        ) : (
          <path d="M52 66h16l-8 9z" fill="#FF9F43" stroke="#DE7C1D" strokeWidth="2" strokeLinejoin="round" />
        )}
        <circle cx="36" cy="68" r="5" fill="#FF7B6B" opacity=".45" />
        <circle cx="84" cy="68" r="5" fill="#FF7B6B" opacity=".45" />
      </motion.svg>
    </div>
  )
}
