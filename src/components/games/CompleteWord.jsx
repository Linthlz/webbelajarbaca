import { useMemo } from 'react'
import RoundRunner from './RoundRunner.jsx'
import { buildGameRounds } from '../../utils/rounds.js'

/** GAME 5 — Lengkapi Kata: pilih huruf yang hilang. */
export default function CompleteWord({ onFinish, backTo, tone }) {
  const rounds = useMemo(() => buildGameRounds('lengkapi-kata'), [])
  return <RoundRunner rounds={rounds} onFinish={onFinish} backTo={backTo} tone={tone} />
}
