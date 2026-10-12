import { useCallback, useEffect, useMemo, useState } from 'react'
import { UploadPanel } from '../components/UploadPanel'
import { WebcamStage } from '../components/WebcamStage'
import { ProgressStepper } from '../components/ProgressStepper'
import { captureRepository, imageRepository } from '../db/database'
import type { Expression, SavedCapture, UploadedImage } from '../types'

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function StudioPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [notice, setNotice] = useState<string | null>(null)

  const refreshImages = useCallback(async () => setImages(await imageRepository.list()), [])
  useEffect(() => {
    let active = true
    void imageRepository.list().then((nextImages) => { if (active) setImages(nextImages) })
    return () => { active = false }
  }, [])

  const handleFiles = async (files: File[]) => {
    const remaining = Math.max(0, 12 - images.length)
    await Promise.all(files.slice(0, remaining).map(async (file) => {
      await imageRepository.add({ name: file.name, dataUrl: await fileToDataUrl(file), expression: null, createdAt: Date.now() })
    }))
    await refreshImages()
    if (files.length > remaining) setNotice('You can keep up to 12 photos in your set.')
  }

  const assignExpression = async (id: string, expression: Expression) => {
    await imageRepository.assignExpression(id, expression)
    await refreshImages()
  }

  const removeImage = async (id: string) => {
    await imageRepository.remove(id)
    await refreshImages()
  }

  const handleCapture = async (capture: Omit<SavedCapture, 'id' | 'createdAt'>) => {
    await captureRepository.add({ ...capture, createdAt: Date.now() })
    setNotice('Saved to your little gallery ✨')
  }

  const labeledCount = useMemo(() => images.filter((image) => image.expression).length, [images])
  const cameraStep = images.length > 0 ? (labeledCount > 0 ? 2 : 1) : 1

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">A tiny camera studio for Linh</p>
          <h1>Make your <span>mew</span> moment.</h1>
          <p className="hero-subtitle">Bring a few favorite faces, let the camera read the mood, and sprinkle a little you on top.</p>
        </div>
        <div className="hero-cat" aria-hidden="true"><span>ฅ^•ﻌ•^ฅ</span><small>mew!</small></div>
      </section>

      <ProgressStepper activeStep={cameraStep} />
      {notice && <button type="button" className="notice-banner" onClick={() => setNotice(null)}>{notice}<span aria-hidden="true">×</span></button>}

      <div className="studio-grid">
        <div className="panel-card"><UploadPanel images={images} onFiles={(files) => void handleFiles(files)} onAssign={(id, expression) => void assignExpression(id, expression)} onRemove={(id) => void removeImage(id)} /></div>
        <div className="panel-card"><WebcamStage images={images} onCapture={handleCapture} /></div>
      </div>
    </main>
  )
}
