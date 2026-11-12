import { useMemo } from 'react'
import RoundRunner from './RoundRunner.jsx'
import { buildGameRounds } from '../../utils/rounds.js'

/** GAME 3 — Susun Suku Kata: lihat gambar, susun suku katanya. */
export default function ArrangeSyllable({ onFinish, backTo, tone }) {
  const rounds = useMemo(() => buildGameRounds('susun-suku-kata'), [])
  return <RoundRunner rounds={rounds} onFinish={onFinish} backTo={backTo} tone={tone} />
}
