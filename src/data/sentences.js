// scene = daftar gambar yang ditampilkan berdampingan sebagai ilustrasi kalimat.
const S = (text, scene) => ({ id: text.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-$/, ''), text, scene })

export const SENTENCES = [
  S('Ini bola.', ['bola']),
  S('Ini buku.', ['buku']),
  S('Ini sapi.', ['sapi']),
  S('Ini topi.', ['topi']),
  S('Ibu memasak.', ['ibu-memasak']),
  S('Budi makan roti.', ['budi', 'roti']),
  S('Siti minum susu.', ['siti', 'susu']),
  S('Papa baca buku.', ['papa', 'buku']),
]
