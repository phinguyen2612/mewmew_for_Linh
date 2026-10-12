import { FaceLandmarker, FilesetResolver, type FaceLandmarkerResult } from '@mediapipe/tasks-vision'

const wasmRoot = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm'
const modelAssetPath = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

let instancePromise: Promise<FaceLandmarker> | null = null

export function getFaceLandmarker() {
  if (!instancePromise) {
    instancePromise = FilesetResolver.forVisionTasks(wasmRoot).then((vision) =>
      FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numFaces: 2,
        outputFaceBlendshapes: true,
      }),
    )
  }
  return instancePromise
}

export function resetFaceLandmarker() {
  instancePromise = null
}

export type { FaceLandmarkerResult }
