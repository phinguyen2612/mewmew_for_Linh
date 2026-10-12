export type Expression = 'happy' | 'surprised' | 'angry' | 'pouty' | 'cute' | 'wink' | 'love' | 'calm'

export interface UploadedImage {
  id: string
  name: string
  dataUrl: string
  expression: Expression | null
  createdAt: number
}

export interface SavedCapture {
  id: string
  dataUrl: string
  expression: Expression
  sourceImageId: string | null
  createdAt: number
}

export interface FaceBox {
  x: number
  y: number
  width: number
  height: number
}

export interface FaceDetection {
  box: FaceBox
  expression: Expression
  blendshapes: Record<string, number>
  faceCount: number
}
