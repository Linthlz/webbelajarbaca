import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import RoundRunner from '../components/games/RoundRunner.jsx'
import { LearningProvider } from '../context/LearningContext.jsx'
import { installSpeechMock } from './setup.js'
import { say } from '../utils/speechEngine.js'
import { STORAGE_KEY } from '../utils/progress.js'

const renderApp = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LearningProvider>
        <App />
      </LearningProvider>
    </MemoryRouter>,
  )

const click = (el) => fireEvent.click(el)
const lanjut = async () => click(await screen.findByRole('button', { name: 'Lanjut' }))

describe('navigasi', () => {
  it('landing → peta level; level 2 masih terkunci', async () => {
    installSpeechMock()
    renderApp('/')
    expect(screen.getByText('Yuk, Belajar Membaca!')).toBeTruthy()
    expect(screen.queryByText('Lanjutkan Petualangan')).toBeNull()
    click(screen.getByText('MULAI BELAJAR'))
    expect(await screen.findByText('Peta Belajar')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Level 2 .* terkunci/ })).toBeTruthy()
    click(screen.getByRole('link', { name: /Mengenal Huruf/ }))
    expect(await screen.findByRole('link', { name: /Tahap 1: A – E/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Tahap 2, terkunci' })).toBeTruthy()
  })

  it('menu utama membuka keempat halaman', async () => {
    installSpeechMock()
    renderApp('/beranda')
    click(screen.getByRole('link', { name: 'Bermain' }))
    expect(await screen.findByText('Ayo Bermain!')).toBeTruthy()
    click(screen.getByRole('link', { name: 'Bintang' }))
    expect(await screen.findByText('Koleksi Bintang')).toBeTruthy()
    click(screen.getByRole('link', { name: 'Profil' }))
    expect(await screen.findByText('Profil Saya')).toBeTruthy()
    click(screen.getByRole('link', { name: 'Belajar' }))
    expect(await screen.findByText('Peta Belajar')).toBeTruthy()
  })

  it('tanpa dukungan suara: ada pemberitahuan dan tombol audio tidak bisa ditekan', async () => {
    renderApp('/')
    expect(await screen.findByText('Suara tidak tersedia')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Dengarkan sapaan Pipi' })).toBeNull()
    expect(screen.getAllByRole('img', { name: 'Suara tidak tersedia' }).length).toBeGreaterThan(0)
  })
})

describe('RoundRunner', () => {
  const rounds = [
    {
      type: 'choice', intro: 'Pilih huruf B', parts: [say.phoneme('B')], prompt: { kind: 'audio' }, answer: 'B',
      options: ['A', 'B', 'C'].map((l) => ({ id: l, kind: 'letter', value: l, label: `huruf ${l}` })),
    },
    { type: 'arrange', intro: 'Susun bola', parts: [say.word('bola')], prompt: { kind: 'pic', pic: 'bola' }, pieces: ['LA', 'MA', 'BO'], answer: ['BO', 'LA'], pieceSound: 'syllable' },
    { type: 'match', intro: 'Cocokkan', parts: [], pairs: [{ pic: 'apel', letter: 'A', word: 'Apel' }, { pic: 'bola', letter: 'B', word: 'Bola' }], letters: ['B', 'A'] },
  ]

  it('salah boleh mencoba lagi tanpa hukuman; nilai = benar pada percobaan pertama', async () => {
    const synth = installSpeechMock()
    const { initSpeech } = await import('../utils/speechEngine.js')
    initSpeech()
    const onFinish = vi.fn()
    render(
      <MemoryRouter>
        <RoundRunner rounds={rounds} onFinish={onFinish} backTo="/" />
      </MemoryRouter>,
    )
    // ronde 1: salah dulu, lalu benar
    click(screen.getByRole('button', { name: 'huruf A' }))
    expect(await screen.findByText('Ayo coba lagi!')).toBeTruthy()
    click(screen.getByRole('button', { name: 'huruf B' }))
    await lanjut()
    // ronde 2: susun salah, lalu benar
    click(await screen.findByRole('button', { name: 'Potongan LA' }))
    click(screen.getByRole('button', { name: 'Potongan BO' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Kotak 1 kosong' })).toBeTruthy(), { timeout: 2000 })
    click(screen.getByRole('button', { name: 'Potongan BO' }))
    click(screen.getByRole('button', { name: 'Potongan LA' }))
    await lanjut()
    // ronde 3: cocokkan, langsung benar
    click(await screen.findByRole('button', { name: 'Gambar apel' }))
    click(screen.getByRole('button', { name: 'huruf A' }))
    click(screen.getByRole('button', { name: 'Gambar bola' }))
    click(screen.getByRole('button', { name: 'huruf B' }))
    await lanjut()
    expect(onFinish).toHaveBeenCalledWith({ firstTry: 1, total: 3 })
    await act(() => new Promise((r) => setTimeout(r, 100)))
    expect(synth.spoken).toContain('Belum tepat, ayo coba sekali lagi!')
  })
})

describe('game dari awal sampai hadiah', () => {
  it('Tebak Huruf: selesai → bintang bertambah dan tersimpan', async () => {
    const synth = installSpeechMock()
    renderApp('/bermain/tebak-huruf')
    click(await screen.findByRole('button', { name: /MULAI/ }))
    for (let i = 0; i < 5; i++) {
      // tekan semua pilihan sampai tombol Lanjut muncul (salah tidak dihukum)
      const options = await screen.findAllByRole('button', { name: /^huruf / })
      for (const o of options) {
        if (screen.queryByRole('button', { name: 'Lanjut' })) break
        click(o)
      }
      await lanjut()
    }
    expect(await screen.findByLabelText('Kamu mendapat 3 bintang')).toBeTruthy()
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    expect(saved.stars).toBe(3)
    expect(saved.games['tebak-huruf'].plays).toBe(1)
    expect(saved.badges).toContain('bintang-pertama')
    await act(() => new Promise((r) => setTimeout(r, 700)))
    expect(synth.speak).toHaveBeenCalled()
  })
})
