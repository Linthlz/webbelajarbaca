import { Navigate, useParams } from 'react-router-dom'
import LevelMap from '../components/learning/LevelMap.jsx'
import StageList from '../components/learning/StageList.jsx'
import LessonPlayer from '../components/learning/LessonPlayer.jsx'
import AudioButton from '../components/common/AudioButton.jsx'
import { getLevel } from '../data/levels.js'
import { useLearning } from '../context/LearningContext.jsx'
import { isLevelUnlocked, isStageUnlocked } from '../utils/progress.js'
import { say } from '../utils/speechEngine.js'

const MAP_INTRO = [say.text('Pilih level untuk belajar. Mulai dari level satu, ya!')]

/** /belajar — peta pemilihan level; /belajar/:levelId — daftar tahap. */
export function LearningHome() {
  const { levelId } = useParams()
  const { progress } = useLearning()
  if (!levelId) {
    return (
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-3xl">Peta Belajar</h1>
          <AudioButton parts={MAP_INTRO} id="instruksi" label="Dengarkan instruksi" />
        </div>
        <LevelMap />
      </section>
    )
  }
  const level = getLevel(levelId)
  if (!level || !isLevelUnlocked(progress, level)) return <Navigate to="/belajar" replace />
  return <StageList level={level} />
}

/** /belajar/:levelId/:stageIdx — satu tahap belajar (layar penuh, tanpa menu). */
export default function LearningPage() {
  const { levelId, stageIdx } = useParams()
  const { progress } = useLearning()
  const level = getLevel(levelId)
  const idx = Number(stageIdx)
  if (!level || !Number.isInteger(idx) || !level.stages[idx] || !isStageUnlocked(progress, level, idx)) {
    return <Navigate to="/belajar" replace />
  }
  return <LessonPlayer key={`${level.id}-${idx}`} level={level} stageIdx={idx} />
}
