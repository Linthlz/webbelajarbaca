export function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const sample = (list, n) => shuffle(list).slice(0, n)
export const pick = (list) => list[Math.floor(Math.random() * list.length)]

/** Acak, tetapi jangan sampai urutannya sama dengan jawaban (supaya soal menyusun tidak "sudah jadi"). */
export function shuffleNot(list, answer) {
  for (let i = 0; i < 8; i++) {
    const s = shuffle(list)
    if (answer.some((a, idx) => s[idx] !== a)) return s
  }
  return [...list].reverse()
}
