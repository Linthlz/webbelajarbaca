import { useMemo } from 'react'
import RoundRunner from './RoundRunner.jsx'
import { buildGameRounds } from '../../utils/rounds.js'

/** GAME 4 — Dengarkan dan Pilih: dengar kata, pilih gambarnya. */
export default function ListenAndChoose({ onFinish, backTo, tone }) {
  const rounds = useMemo(() => buildGameRounds('dengarkan-dan-pilih'), [])
  return <RoundRunner rounds={rounds} onFinish={onFinish} backTo={backTo} tone={tone} />
}
