import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { __resetForTests } from '../utils/speechEngine.js'

/** SpeechSynthesis tiruan: mencatat ucapan dan langsung "selesai" berbicara. */
export function installSpeechMock({ voices = [{ lang: 'id-ID', name: 'Tes Indonesia', default: true }] } = {}) {
  const spoken = []
  class Utterance {
    constructor(text) {
      this.text = text
    }
  }
  const synth = {
    spoken,
    cancel: vi.fn(),
    getVoices: () => voices,
    addEventListener: vi.fn(),
    speak: vi.fn((u) => {
      spoken.push(u.text)
      setTimeout(() => u.onend?.(), 0)
    }),
  }
  window.speechSynthesis = synth
  window.SpeechSynthesisUtterance = Utterance
  return synth
}

export function removeSpeech() {
  delete window.speechSynthesis
  delete window.SpeechSynthesisUtterance
}

beforeEach(() => {
  window.localStorage.clear()
  window.scrollTo = () => {}
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }))
  __resetForTests()
})

afterEach(() => {
  cleanup()
  removeSpeech()
})
