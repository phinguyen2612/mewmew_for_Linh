import { Camera, CameraOff, CircleHelp, LoaderCircle, ScanFace, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { chooseMatchingImage, classifyExpression, normalizedBoxFromLandmarks } from '../lib/face'
import { getFaceLandmarker, type FaceLandmarkerResult } from '../services/faceLandmarker'
import { useMediaStream } from '../hooks/useMediaStream'
import type { FaceDetection, SavedCapture, UploadedImage } from '../types'
import { expressionLabel } from '../data/expressions'

interface WebcamStageProps {
  images: UploadedImage[]
  onCapture: (capture: Omit<SavedCapture, 'id' | 'createdAt'>) => Promise<void>
}

function readDetection(result: FaceLandmarkerResult): FaceDetection | null {
  const faceCount = result.faceLandmarks.length
  if (faceCount !== 1) return { box: { x: 0, y: 0, width: 0, height: 0 }, expression: 'calm', blendshapes: {}, faceCount }
  const blendshapes = Object.fromEntries((result.faceBlendshapes[0]?.categories ?? []).map((category) => [category.categoryName, category.score]))
  return {
    box: normalizedBoxFromLandmarks(result.faceLandmarks[0]),
    expression: classifyExpression(blendshapes),
    blendshapes,
    faceCount,
  }
}

export function WebcamStage({ images, onCapture }: WebcamStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number | null>(null)
  const [detection, setDetection] = useState<FaceDetection | null>(null)
  const [modelState, setModelState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureError, setCaptureError] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const { stream, error: cameraError, isStarting, start, stop } = useMediaStream()

  const activeImage = useMemo(() => {
    if (!detection || detection.faceCount !== 1) return null
    const match = chooseMatchingImage(images, detection.expression)
    return match ? images.find((image) => image.id === match.id) ?? null : null
  }, [detection, images])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return
    video.srcObject = stream
    void video.play()
  }, [stream])

  useEffect(() => {
    if (!stream) return
    let cancelled = false
    void Promise.resolve().then(() => {
      if (!cancelled) setModelState('loading')
      return getFaceLandmarker()
    }).then((landmarker) => {
      if (cancelled) return
      setModelState('ready')
      const detect = () => {
        const video = videoRef.current
        if (!cancelled && video && video.readyState >= 2) {
          const result = landmarker.detectForVideo(video, performance.now())
          setDetection(readDetection(result))
        }
        if (!cancelled) frameRef.current = window.setTimeout(() => requestAnimationFrame(detect), 100)
      }
      detect()
    }).catch(() => {
      if (!cancelled) setModelState('error')
    })
    return () => {
      cancelled = true
      if (frameRef.current) window.clearTimeout(frameRef.current)
    }
  }, [stream])

  const cameraMessage = cameraError ?? (modelState === 'error' ? 'The face model could not load. Check your connection and retry.' : null)
  const hasOneFace = detection?.faceCount === 1
  const guideMessage = !detection || detection.faceCount === 0 ? 'Move into the frame and we’ll find your face.' : detection.faceCount > 1 ? 'One face at a time, please.' : activeImage ? `${expressionLabel(detection.expression)} look found` : `Add a ${expressionLabel(detection.expression).toLowerCase()} photo to see it here.`

  const handleStart = async () => {
    if (stream) {
      stop()
      setDetection(null)
      setModelState('idle')
      return
    }
    await start()
  }

  const handleCapture = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !detection || !activeImage || !hasOneFace) return
    setIsCapturing(true)
    setCaptureError(null)
    try {
      const width = video.videoWidth || 1280
      const height = video.videoHeight || 720
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')
      const sticker = {
        left: (detection.box.x - detection.box.width * 0.325) * width,
        top: (detection.box.y - detection.box.height * 0.15) * height,
        width: detection.box.width * 1.65 * width,
        height: detection.box.height * 1.35 * height,
      }
      const image = new Image()
      image.src = activeImage.dataUrl
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('Image unavailable'))
      })
      context.save()
      context.translate(width, 0)
      context.scale(-1, 1)
      context.drawImage(video, 0, 0, width, height)
      context.drawImage(image, sticker.left, sticker.top, sticker.width, sticker.height)
      context.restore()
      await onCapture({ dataUrl: canvas.toDataURL('image/jpeg', 0.9), expression: detection.expression, sourceImageId: activeImage.id })
    } catch {
      setCaptureError('We could not save that frame. Please try once more.')
    } finally {
      setIsCapturing(false)
    }
  }

  const box = detection?.box
  const stickerStyle = box && hasOneFace ? {
    left: `${(box.x - box.width * 0.325) * 100}%`,
    top: `${(box.y - box.height * 0.15) * 100}%`,
    width: `${box.width * 165}%`,
    height: `${box.height * 135}%`,
  } : undefined

  return (
    <section className="space-y-4" aria-labelledby="camera-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Step 02 · Meet the camera</p>
          <h2 id="camera-heading" className="section-title">Let’s make a little magic</h2>
        </div>
        <span className={`status-dot ${modelState === 'ready' ? 'status-live' : ''}`}><span />{modelState === 'ready' ? 'Live' : 'Ready when you are'}</span>
      </div>

      <div className="camera-shell">
        <div className="camera-stage">
          <video ref={videoRef} className={`camera-video ${stream ? 'camera-video-live' : ''}`} playsInline muted aria-label="Webcam preview" />
          {!stream && <div className="camera-placeholder"><span className="camera-orb"><Camera size={30} /></span><p className="font-display text-xl font-bold text-ink">Your camera moment lives here</p><p className="max-w-xs text-sm text-plum/70">Nothing leaves your browser. We only use the camera after you say yes.</p></div>}
          {stream && <div className="camera-corners" aria-hidden="true" />}
          <AnimatePresence>
            {activeImage && stickerStyle && <motion.img key={activeImage.id} src={activeImage.dataUrl} alt="Selected expression overlay" className="face-sticker" style={stickerStyle} initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 250, damping: 18 }} />}
          </AnimatePresence>
          {stream && <div className="camera-badge"><ScanFace size={15} /> {modelState === 'loading' ? 'Warming up…' : guideMessage}</div>}
          {modelState === 'loading' && <div className="camera-loading"><LoaderCircle className="animate-spin" size={20} /> Loading face magic…</div>}
          {stream && detection && detection.faceCount === 1 && <div className="face-guide" style={{ left: `${box?.x ? box.x * 100 : 0}%`, top: `${box?.y ? box.y * 100 : 0}%`, width: `${box?.width ? box.width * 100 : 0}%`, height: `${box?.height ? box.height * 100 : 0}%` }} aria-hidden="true" />}
        </div>
        {cameraMessage && <div className="inline-alert"><CameraOff size={18} />{cameraMessage}</div>}
        {captureError && <div className="inline-alert"><CircleHelp size={18} />{captureError}</div>}
        <div className="camera-actions">
          <button type="button" className="secondary-button" onClick={() => void handleStart()} disabled={isStarting}>{stream ? <><CameraOff size={17} /> Stop camera</> : <><Camera size={17} /> {isStarting ? 'Opening camera…' : 'Start camera'}</>}</button>
          <button type="button" className="primary-button" onClick={() => void handleCapture()} disabled={!stream || !hasOneFace || !activeImage || isCapturing}>{isCapturing ? <><LoaderCircle className="animate-spin" size={17} /> Saving…</> : <><Sparkles size={17} /> Capture moment</>}</button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  )
}
