# Rekaman suara manusia (opsional)

Secara bawaan semua suara dibacakan oleh Web Speech API (suara `id-ID` milik perangkat).
Untuk mengganti dengan rekaman suara manusia, taruh file audio (mp3/ogg/wav) di folder ini
lalu daftarkan di `manifest.json`. Kunci yang terdaftar otomatis dipakai menggantikan TTS,
tanpa perlu mengubah kode.

```json
{
  "phoneme/b": "phoneme/b.mp3",
  "letter/b": "letter/b.mp3",
  "syllable/ba": "syllable/ba.mp3",
  "word/bola": "word/bola.mp3",
  "text/hebat-jawaban-kamu-benar": "text/hebat.mp3"
}
```

| Awalan kunci | Isi | Contoh |
| --- | --- | --- |
| `phoneme/<huruf>` | bunyi (fonem) huruf | `phoneme/m` = "mmm" |
| `letter/<huruf>` | nama huruf | `letter/m` = "em" |
| `syllable/<suku>` | suku kata | `syllable/ba` |
| `word/<kata>` | satu kata | `word/sepeda` |
| `text/<slug>` | kalimat/instruksi; slug = huruf kecil, spasi jadi `-`, tanpa tanda baca | `text/ini-bola` |

Prioritas pertama yang paling terasa manfaatnya: 26 file `phoneme/*`, karena mesin TTS
hanya bisa mendekati bunyi fonem tunggal.
