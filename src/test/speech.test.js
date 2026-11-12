import { describe, expect, it, vi } from 'vitest'
import { installSpeechMock } from './setup.js'
import { initSpeech, getState, speak, say, canPlay, stopSpeech, repeatSpeech, speakLetter } from '../utils/speechEngine.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

describe('mesin suara', () => {
  it('siap bila ada suara id-ID, memakai lang id-ID, dan tidak memutar dua suara sekaligus', async () => {
    const synth = installSpeechMock()
    initSpeech()
    expect(getState().status).toBe('ready')

    speak(say.text('Halo teman-teman'), 'a')
    speak(say.blend('B', 'A'), 'b') // menggantikan ucapan pertama sebelum sempat berbunyi
    expect(getState().speakingId).toBe('b')
    await wait(1500)
    expect(synth.spoken).toEqual(['beh', 'a', 'ba']) // "Halo…" dibatalkan
    expect(synth.cancel).toHaveBeenCalled()
    expect(synth.speak.mock.calls[0][0].lang).toBe('id-ID')
    expect(getState().speakingId).toBeNull()
  })

  it('membedakan bunyi huruf dan nama huruf', async () => {
    const synth = installSpeechMock()
    initSpeech()
    speakLetter('M')
    await wait(150)
    speakLetter('M', { mode: 'name' })
    await wait(150)
    expect(synth.spoken).toEqual(['meh', 'ém'])
  })

  it('stop dan ulangi', async () => {
    const synth = installSpeechMock()
    initSpeech()
    speak(say.word('bola'), 'x')
    stopSpeech()
    await wait(120)
    expect(synth.spoken).toEqual([])
    repeatSpeech()
    await wait(120)
    expect(synth.spoken).toEqual(['bola'])
  })

  it('browser tanpa SpeechSynthesis: status unsupported dan tidak bisa diputar', () => {
    initSpeech()
    expect(getState().status).toBe('unsupported')
    expect(canPlay(say.text('halo'))).toBe(false)
    expect(speak(say.text('halo'))).toBe(false)
  })

  it('tanpa suara bahasa Indonesia: status no-voice', async () => {
    vi.useFakeTimers()
    installSpeechMock({ voices: [{ lang: 'en-US', name: 'English' }] })
    initSpeech()
    expect(getState().status).toBe('checking')
    vi.advanceTimersByTime(2600)
    expect(getState().status).toBe('no-voice')
    expect(canPlay(say.text('halo'))).toBe(false)
    vi.useRealTimers()
  })
})
