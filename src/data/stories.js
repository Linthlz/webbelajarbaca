export const STORIES = [
  {
    id: 'budi-bola',
    title: 'Budi dan Bola',
    cover: ['budi', 'bola'],
    pages: [
      { text: 'Ini Budi.', scene: ['budi'] },
      { text: 'Budi punya bola.', scene: ['budi', 'bola'] },
      { text: 'Budi bermain bola.', scene: ['budi', 'bola', 'berkilau'] },
      { text: 'Budi senang.', scene: ['budi', 'senang'] },
    ],
    quiz: [
      { question: 'Budi punya apa?', options: [['bola'], ['buku'], ['roti']], answer: 0 },
      { question: 'Budi senang atau sedih?', options: [['sedih'], ['senang']], answer: 1 },
    ],
  },
  {
    id: 'siti-kucing',
    title: 'Siti dan Kucing',
    cover: ['siti', 'kucing'],
    pages: [
      { text: 'Ini Siti.', scene: ['siti'] },
      { text: 'Siti punya kucing.', scene: ['siti', 'kucing'] },
      { text: 'Kucing minum susu.', scene: ['kucing', 'susu'] },
      { text: 'Siti sayang kucing.', scene: ['siti', 'hati', 'kucing'] },
    ],
    quiz: [
      { question: 'Siti punya apa?', options: [['sapi'], ['kucing'], ['kuda']], answer: 1 },
      { question: 'Kucing minum apa?', options: [['susu'], ['madu'], ['nasi']], answer: 0 },
    ],
  },
]
