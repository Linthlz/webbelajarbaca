import { useSyncExternalStore } from 'react'
import {
  subscribe,
  getState,
  speak,
  say,
  canPlay,
  speakText,
  speakLetter,
  speakSyllable,
  speakWord,
  speakSentence,
  stopSpeech,
  repeatSpeech,
  recheckSpeech,
} from '../utils/speechEngine.js'

/**
 * Hook suara. Semua komponen berbagi satu mesin suara yang sama.
 *
 * status: 'checking' | 'ready' | 'unsupported' (browser tanpa SpeechSynthesis) | 'no-voice' (tak ada suara id-ID)
 */
export function useSpeech() {
  const state = useSyncExternalStore(subscribe, getState, getState)
  return {
    status: state.status,
    available: state.status === 'ready',
    isSpeaking: state.speakingId !== null,
    speakingId: state.speakingId,
    say,
    speak,
    canPlay,
    speakText,
    speakLetter,
    speakSyllable,
    speakWord,
    speakSentence,
    stopSpeech,
    repeatSpeech,
    recheckSpeech,
  }
}
