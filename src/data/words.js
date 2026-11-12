const W = (syl, pic) => {
  const text = syl.join('')
  return { id: text.toLowerCase(), text, syl, pic: pic || text.toLowerCase() }
}

// Level 3 — kata dua suku kata terbuka (konsonan-vokal).
export const SIMPLE_WORDS = [
  W(['BO', 'LA']), W(['BU', 'KU']), W(['BA', 'JU']), W(['SA', 'PI']),
  W(['MA', 'MA']), W(['PA', 'PA']), W(['KU', 'DA']), W(['RO', 'TI']),
  W(['SU', 'SU']), W(['TO', 'PI']), W(['GI', 'GI']), W(['MA', 'TA']),
]

// Level 4 — kata 2–4 suku kata, sebagian dengan suku kata tertutup.
export const LONGER_WORDS = [
  W(['ME', 'JA']), W(['SE', 'PE', 'DA']), W(['SE', 'PA', 'TU']), W(['KE', 'RE', 'TA']),
  W(['SE', 'KO', 'LAH']), W(['PE', 'LA', 'JAR']), W(['PE', 'SA', 'WAT']), W(['KE', 'LU', 'AR', 'GA']),
]

// Kata tambahan untuk permainan.
export const EXTRA_WORDS = [
  W(['MA', 'DU']), W(['SA', 'PU']), W(['KA', 'KI']), W(['NA', 'SI']), W(['DA', 'DU']), W(['YO', 'YO']),
]

export const GAME_WORDS = [...SIMPLE_WORDS, ...EXTRA_WORDS]
export const ALL_WORDS = [...SIMPLE_WORDS, ...LONGER_WORDS, ...EXTRA_WORDS]
