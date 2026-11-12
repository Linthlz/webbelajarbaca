const FILLS = {
  mint: 'bg-mint',
  sun: 'bg-sun',
  sky: 'bg-sky',
  coral: 'bg-coral',
  grape: 'bg-grape',
  tangerine: 'bg-tangerine',
}

/** value: 0–1 */
export default function ProgressBar({ value = 0, tone = 'mint', label = 'Progres', className = '' }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-4 w-full overflow-hidden rounded-full bg-ink/10 ${className}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-500 ${FILLS[tone] || FILLS.mint}`} style={{ width: `${pct}%` }}>
        <div className="mx-2 mt-[3px] h-[4px] rounded-full bg-white/40" />
      </div>
    </div>
  )
}
