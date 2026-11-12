import { useMemo } from 'react'
import RoundRunner from './RoundRunner.jsx'
import { buildGameRounds } from '../../utils/rounds.js'

/** GAME 1 — Tebak Huruf: dengar bunyi huruf, pilih hurufnya. */
export default function GuessLetter({ onFinish, backTo, tone }) {
  const rounds = useMemo(() => buildGameRounds('tebak-huruf'), [])
  return <RoundRunner rounds={rounds} onFinish={onFinish} backTo={backTo} tone={tone} />
}
