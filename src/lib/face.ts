import type { Expression, UploadedImage } from '../types'

type BlendshapeScores = Record<string, number>

const score = (scores: BlendshapeScores, key: string) => scores[key] ?? 0

export function classifyExpression(scores: BlendshapeScores): Expression {
  const smile = (score(scores, 'mouthSmileLeft') + score(scores, 'mouthSmileRight')) / 2
  const wink = Math.max(score(scores, 'eyeBlinkLeft'), score(scores, 'eyeBlinkRight'))
  const surprise = (score(scores, 'jawOpen') + score(scores, 'browInnerUp')) / 2
  const love = (score(scores, 'eyeSquintLeft') + score(scores, 'eyeSquintRight') + smile) / 3

  if (wink >= 0.72 && smile < 0.7) return 'wink'
  if (surprise >= 0.62) return 'surprised'
  if (love >= 0.64 && smile >= 0.55) return 'love'
  if (smile >= 0.58) return 'happy'
  return 'calm'
}

export function chooseMatchingImage(images: Pick<UploadedImage, 'id' | 'expression' | 'createdAt'>[], expression: Expression) {
  return (
    images
      .filter((image) => image.expression === expression)
      .sort((a, b) => b.createdAt - a.createdAt)[0] ?? null
  )
}

export function normalizedBoxFromLandmarks(landmarks: Array<{ x: number; y: number }>) {
  const xs = landmarks.map((point) => point.x)
  const ys = landmarks.map((point) => point.y)
  const left = Math.min(...xs)
  const top = Math.min(...ys)
  return {
    x: left,
    y: top,
    width: Math.max(...xs) - left,
    height: Math.max(...ys) - top,
  }
}
