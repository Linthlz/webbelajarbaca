# Petualangan Membaca

Website belajar membaca untuk anak SD (6–10 tahun) yang belum bisa membaca sama sekali:
dari mengenal bunyi huruf, menggabungkan suku kata, membaca kata dan kalimat, sampai cerita pendek.
Semua instruksi dibacakan dengan suara bahasa Indonesia, jadi anak tidak perlu bisa membaca untuk memakainya.

## Menjalankan

Butuh Node.js 20.19 atau lebih baru (disarankan 22).

```bash
npm install
npm run dev        # buka alamat yang muncul, biasanya http://localhost:5173
```

Perintah lain:

```bash
npm run build      # hasil siap unggah ada di folder dist/
npm run preview    # mencoba hasil build
npm test           # 17 tes otomatis (logika soal, progres, suara, alur halaman)
```

Hasil build bisa ditaruh di hosting statis mana pun (Netlify, Vercel, GitHub Pages) tanpa pengaturan
tambahan, karena memakai `HashRouter` dan `base: './'`.

## Isi aplikasi

| Bagian | Isi |
| --- | --- |
| Halaman awal | Maskot Pipi, tombol **MULAI BELAJAR**, dan **Lanjutkan Petualangan** bila sudah ada progres |
| Beranda | Sapaan nama anak, bintang, progres, tombol lanjut, peta petualangan 6 level |
| Belajar | 6 level, 20 tahap. Tiap tahap: kartu contoh → latihan → hadiah. Level terbuka berurutan |
| Bermain | 6 mini game, masing-masing dengan instruksi suara dan contoh bergambar |
| Koleksi Bintang | Jumlah bintang, 10 lencana, progres tiap level |
| Profil Saya | Nama anak, kecepatan suara (pelan / sedang / cepat) |
| Area pendamping | Laporan untuk orang tua/guru (dari Profil, dijaga soal penjumlahan): tahap selesai, nilai tiap game, aktivitas terakhir, status suara, hapus progres |

### Enam level

1. **Mengenal Huruf** — A–Z dalam 5 kelompok kecil. Menekan huruf membunyikan *fonem*-nya; nama huruf ada di tombol terpisah. Latihan: cocokkan gambar dengan huruf awal.
2. **Mengenal Suku Kata** — B, C, D, M, P, S × a-i-u-e-o. Dua huruf bergerak mendekat menjadi suku kata ("beh… a… ba"). Latihan: susun dua huruf.
3. **Membaca Kata** — 12 kata dua suku kata (BO-LA, BU-KU, …). Latihan: pilih kata yang cocok dengan gambar.
4. **Kata Lebih Panjang** — 8 kata 2–4 suku kata (SE-PE-DA, SE-KO-LAH, KE-LU-AR-GA, …). Latihan: susun suku kata.
5. **Membaca Kalimat** — 8 kalimat; tiap kata bisa ditekan. Latihan: pilih gambar yang cocok.
6. **Membaca Cerita** — 2 cerita 4 halaman dengan ilustrasi yang berganti + kuis pemahaman.

### Enam mini game

Tebak Huruf · Cocokkan Gambar (tap-to-match) · Susun Suku Kata · Dengarkan dan Pilih · Lengkapi Kata · Petualangan Membaca (Pipi maju satu langkah tiap jawaban benar).

### Aturan yang dipegang

- Jawaban salah tidak pernah dihukum: bintang tidak berkurang, anak langsung boleh mencoba lagi.
- Tidak ada batas waktu; anak sendiri yang menekan tombol lanjut.
- Bintang: 3 untuk tahap/game yang baru pertama kali selesai, 1 setiap mengulang.
- Nilai yang dicatat untuk pendamping = jumlah soal yang benar pada percobaan pertama.

## Suara

Semua audio lewat satu mesin di `src/utils/speechEngine.js` (dipakai melalui hook `useSpeech` dan komponen `AudioButton`):

- `speakText`, `speakLetter`, `speakSyllable`, `speakWord`, `speakSentence`, `stopSpeech`, `repeatSpeech`
- hanya satu suara pada satu waktu; suara berhenti saat pindah halaman
- tombol beranimasi selama suaranya diputar
- bahasa `id-ID`, kecepatan diperlambat untuk anak dan bisa diatur di Profil

**Bunyi huruf vs nama huruf.** Fonik mengajarkan bunyi, jadi B dibunyikan "beh", bukan "bé".
Ejaan bunyi tiap huruf ada di `src/data/alphabet.js` (kolom `sound`) dan bisa disetel bila suara di
perangkat Anda membacanya kurang pas. Mesin suara hanya bisa *mendekati* bunyi fonem tunggal — hasilnya
bergantung pada suara yang terpasang di perangkat.

**Mengganti dengan rekaman suara manusia.** Taruh file audio di `public/assets/audio/` dan daftarkan di
`manifest.json` (petunjuk dan format kunci ada di `public/assets/audio/README.md`). Kunci yang terdaftar
otomatis menggantikan suara mesin, tanpa mengubah kode. Yang paling layak direkam lebih dulu: 26 bunyi huruf.

**Bila suara tidak tersedia.** Jika browser tidak mendukung SpeechSynthesis atau perangkat tidak punya
suara bahasa Indonesia, muncul pemberitahuan di atas layar, semua tombol suara tampil dicoret dan tidak
bisa ditekan, dan soal yang hanya bisa dikerjakan dengan mendengar bisa dilewati.
Suara Indonesia biasanya sudah ada di Chrome/Edge desktop, Android, dan iOS/macOS; di Windows/Linux
tertentu perlu dipasang dulu lewat pengaturan Text-to-Speech.

Catatan: browser baru mengizinkan suara setelah anak menekan sesuatu, jadi di halaman pertama sapaan
diputar lewat tombol suara, bukan otomatis.

## Penyimpanan

Progres disimpan di LocalStorage perangkat (kunci `petualangan-membaca:progres:v1`), tanpa akun:
nama, bintang, tahap yang selesai, lencana, nilai tiap game, aktivitas terakhir, kecepatan suara.
Progres tidak berpindah antar-perangkat atau antar-browser.

## Struktur

```
public/assets/        gambar (fruits, animals, objects, people, rewards, mascot, backgrounds) + audio/
src/
  data/               alphabet, syllables, words, sentences, stories, levels, games, rewards, pictures
  utils/              speechEngine (suara), rounds (pembuat soal), progress (logika progres), theme, random
  hooks/              useSpeech, useProgress, useAutoSpeak
  context/            LearningContext
  components/common/  Button, AudioButton, ProgressBar, Mascot, StarReward, Confetti, NavBar, AppShell, AudioNotice, Pic
  components/learning/ LetterCard, SyllableCard, WordCard, SentenceCard, TappableSentence, LessonPlayer, LevelMap, StageList
  components/games/   RoundRunner + ChoiceRound / ArrangeRound / MatchRound, GameIntro, dan 6 game
  pages/              Landing, Dashboard, Learning, Game, Achievement, Profile, Parent
  test/               tes otomatis
```

Menambah materi cukup lewat folder `data/`: tambah kata di `words.js` atau kalimat di `sentences.js`,
dan daftarkan gambarnya di `pictures.js`.

## Aset dan lisensi

Semua aset tersimpan lokal di project (tidak ada tautan gambar eksternal). Rinciannya di `public/assets/LICENSES.md`:
ikon OpenMoji (CC BY-SA 4.0 — wajib mencantumkan atribusi bila dipublikasikan), font Baloo 2 dan Nunito (OFL),
ikon Lucide (ISC), serta maskot, latar, dan tiga gambar (meja, quran, xilofon) yang dibuat khusus.

## Penyesuaian dari rancangan awal

- "KE-LO-MPOK" tidak dipakai karena pemenggalan yang benar adalah KE-LOM-POK dan sulit digambarkan; diganti KE-LU-AR-GA.
- "KE-PA-LA" diganti SE-PA-TU, KE-RE-TA, dan PE-SA-WAT karena tidak ada gambar kepala yang jelas bedanya dari "wajah".
- Folder `public/assets/alphabet/` hanya berisi catatan: huruf digambar dengan font agar tajam di semua ukuran.
