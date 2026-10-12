import { useCallback, useEffect, useState } from 'react'

export function useMediaStream() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is not supported in this browser.')
      return null
    }

    setIsStarting(true)
    setError(null)
    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      setStream(nextStream)
      return nextStream
    } catch {
      setError('We could not open your camera. Check browser permissions and try again.')
      return null
    } finally {
      setIsStarting(false)
    }
  }, [])

  const stop = useCallback(() => {
    setStream((current) => {
      current?.getTracks().forEach((track) => track.stop())
      return null
    })
  }, [])

  useEffect(() => stop, [stop])

  return { stream, error, isStarting, start, stop }
}
