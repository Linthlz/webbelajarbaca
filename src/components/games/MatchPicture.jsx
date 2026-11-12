import { useMemo } from 'react'
import RoundRunner from './RoundRunner.jsx'
import { buildGameRounds } from '../../utils/rounds.js'

/** GAME 2 — Cocokkan Huruf dengan Gambar (tap-to-match). */
export default function MatchPicture({ onFinish, backTo, tone }) {
  const rounds = useMemo(() => buildGameRounds('cocokkan-gambar'), [])
  return <RoundRunner rounds={rounds} onFinish={onFinish} backTo={backTo} tone={tone} />
}
