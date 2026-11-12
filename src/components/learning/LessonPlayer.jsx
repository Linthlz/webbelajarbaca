import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react'
import LetterCard from './LetterCard.jsx'
import SyllableCard from './SyllableCard.jsx'
import WordCard from './WordCard.jsx'
import SentenceCard from './SentenceCard.jsx'
import RoundRunner from '../games/RoundRunner.jsx'
import AudioButton from '../common/AudioButton.jsx'
import Button from '../common/Button.jsx'
import StarReward from '../common/StarReward.jsx'
import { ActivityBar } from '../common/AppShell.jsx'
import { useLearning } from '../../context/LearningContext.jsx'
import { useAutoSpeak } from '../../hooks/useAutoSpeak.js'
import { say } from '../../utils/speechEngine.js'
import { buildPractice } from '../../utils/rounds.js'
import { LEVELS } from '../../data/levels.js'

/** Suara yang dibacakan otomatis untuk setiap kartu belajar. */
function cardParts(kind, item) {
  switch (kind) {
    case 'letter':
      return [say.letterName(item.letter), say.text('bunyinya', { pause: 200 }), say.phoneme(item.letter), say.word(item.word)]
    case 'syllable':
      return say.blend(item.c, item.v)
    case 'word':
    case 'longword':
      return say.wordSlow(item.syl)
    default:
      return [say.sentence(item.text)]
  }
}

function Card({ level, stage, item }) {
  switch (level.kind) {
    case 'letter':
      return <LetterCard item={item} />
    case 'syllable':
      return <SyllableCard item={item} />
    case 'word':
    case 'longword':
      return <WordCard item={item} />
    case 'story':
      return <SentenceCard item={item} title={stage.story.title} />
    default:
      return <SentenceCard item={item} />
  }
}

/**
 * Satu tahap belajar: kartu contoh dulu (belajar), baru latihan, lalu perayaan.
 * Anak bebas maju-mundur dan mengulang; tidak ada batas waktu.
 */
export default function LessonPlayer({ level, stageIdx }) {
  const stage = level.stages[stageIdx]
  const { completeStage, setLastActivity } = useLearning()
  const [phase, setPhase] = useState('learn') // learn | practice | done
  const [idx, setIdx] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [reward, setReward] = useState(null)
  const backTo = `/belajar/${level.id}`

  useEffect(() => {
    setLastActivity({ kind: 'level', levelId: level.id, stageIdx })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const item = stage.items[idx]
  const parts = useMemo(() => cardParts(level.kind, item), [level.kind, item])
  const instruction = useMemo(() => [say.text(level.intro), ...parts], [level.intro, parts])
  useAutoSpeak(phase === 'learn' ? parts : null, [phase, idx, attempt], 'kartu')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rounds = useMemo(() => buildPractice(level, stage), [level, stage, attempt])

  if (phase === 'practice') {
    return (
      <RoundRunner
        key={attempt}
        rounds={rounds}
        backTo={backTo}
        tone={level.tone}
        onFinish={(result) => {
          setReward(completeStage(level.id, stageIdx, result))
          setPhase('done')
        }}
      />
    )
  }

  if (phase === 'done') {
    const hasNextStage = stageIdx + 1 < level.stages.length
    const isLastLevel = LEVELS[LEVELS.length - 1].id === level.id
    return (
      <StarReward
        reward={reward}
        onReplay={() => {
          setAttempt((a) => a + 1)
          setIdx(0)
          setPhase('learn')
        }}
        nextTo={hasNextStage ? `/belajar/${level.id}/${stageIdx + 1}` : isLastLevel ? '/bintang' : '/belajar'}
      />
    )
  }

  const last = idx === stage.items.length - 1
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-4 pb-6 pt-4">
      <ActivityBar backTo={backTo} right={<AudioButton parts={instruction} id="kartu" size="md" label="Ulangi instruksi" />}>
        <div className="flex items-center justify-center gap-2" aria-label={`Kartu ${idx + 1} dari ${stage.items.length}`}>
          {stage.items.map((_, i) => (
            <span key={i} className={`h-3 rounded-full transition-all ${i === idx ? 'w-8 bg-ink' : i < idx ? 'w-3 bg-mint' : 'w-3 bg-ink/15'}`} />
          ))}
        </div>
      </ActivityBar>

      <div className="flex flex-1 items-center justify-center py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${attempt}-${idx}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Card level={level} stage={stage} item={item} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="white" size="icon" disabled={idx === 0} onClick={() => setIdx(idx - 1)} aria-label="Sebelumnya">
          <ArrowLeft size={28} strokeWidth={3} />
        </Button>
        {last ? (
          <Button variant="mint" size="lg" onClick={() => setPhase('practice')} className="flex-1 sm:flex-none">
            <Pencil size={28} strokeWidth={3} /> Ayo Latihan!
          </Button>
        ) : (
          <Button variant="sun" size="lg" onClick={() => setIdx(idx + 1)} className="flex-1 whitespace-nowrap !px-4 !text-xl sm:flex-none sm:!px-8 sm:!text-2xl" aria-label="Berikutnya">
            {level.kind === 'letter' ? 'Huruf Berikutnya' : 'Berikutnya'} <ArrowRight size={30} strokeWidth={3} />
          </Button>
        )}
      </div>
    </div>
  )
}
