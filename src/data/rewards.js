export const BADGES = [
  { id: 'bintang-pertama', title: 'Bintang Pertama', pic: 'bintang', hint: 'Selesaikan satu latihan' },
  { id: 'level-1', title: 'Jagoan Huruf', pic: 'medali', hint: 'Selesaikan Level 1' },
  { id: 'level-2', title: 'Jagoan Suku Kata', pic: 'medali', hint: 'Selesaikan Level 2' },
  { id: 'level-3', title: 'Pembaca Kata', pic: 'medali-emas', hint: 'Selesaikan Level 3' },
  { id: 'level-4', title: 'Penyusun Kata', pic: 'medali-emas', hint: 'Selesaikan Level 4' },
  { id: 'level-5', title: 'Pembaca Kalimat', pic: 'piala', hint: 'Selesaikan Level 5' },
  { id: 'level-6', title: 'Pembaca Cerita', pic: 'mahkota', hint: 'Selesaikan Level 6' },
  { id: 'pemain', title: 'Jago Bermain', pic: 'gamepad', hint: 'Mainkan semua permainan' },
  { id: 'bintang-30', title: '30 Bintang', pic: 'berkilau', hint: 'Kumpulkan 30 bintang' },
  { id: 'lulus', title: 'Petualang Hebat', pic: 'roket', hint: 'Selesaikan semua level' },
]

export const getBadge = (id) => BADGES.find((b) => b.id === id)

export const PRAISES = ['Hebat! Jawaban kamu benar!', 'Kamu berhasil!', 'Hebat sekali!', 'Benar! Pintar sekali!']
export const TRY_AGAIN = 'Belum tepat, ayo coba sekali lagi!'
export const FINISH_CHEERS = ['Wah, kamu semakin pintar membaca!', 'Hebat sekali! Kamu berhasil!']
