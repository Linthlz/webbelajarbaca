import { Link } from 'react-router-dom'

const VARIANTS = {
  mint: 'bg-mint border-mint-dark text-white',
  sun: 'bg-sun border-sun-dark text-ink',
  sky: 'bg-sky border-sky-dark text-white',
  coral: 'bg-coral border-coral-dark text-white',
  grape: 'bg-grape border-grape-dark text-white',
  tangerine: 'bg-tangerine border-tangerine-dark text-white',
  white: 'bg-white border-slate-200 text-ink',
}

const SIZES = {
  sm: 'min-h-[44px] px-4 text-base rounded-2xl border-b-4',
  md: 'min-h-[56px] px-6 text-xl rounded-3xl border-b-[6px]',
  lg: 'min-h-[72px] px-8 text-2xl rounded-[1.75rem] border-b-[8px]',
  icon: 'h-14 w-14 rounded-full border-b-[5px]',
}

/** Tombol besar yang mudah ditekan anak. Beri `to` untuk menjadikannya tautan. */
export default function Button({ variant = 'mint', size = 'md', to, className = '', children, disabled, ...rest }) {
  const cls = [
    'inline-flex items-center justify-center gap-2 font-display font-extrabold tracking-wide [&>svg]:shrink-0',
    'transition-transform active:translate-y-1 active:border-b-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0',
    VARIANTS[variant],
    SIZES[size],
    className,
  ].join(' ')
  if (to && !disabled) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
