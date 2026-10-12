import { ArrowLeft, Download, ImageOff, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { captureRepository } from '../db/database'
import { expressionLabel } from '../data/expressions'
import type { SavedCapture } from '../types'

export function GalleryPage() {
  const [captures, setCaptures] = useState<SavedCapture[]>([])
  const refresh = useCallback(async () => setCaptures(await captureRepository.list()), [])
  useEffect(() => {
    let active = true
    void captureRepository.list().then((nextCaptures) => { if (active) setCaptures(nextCaptures) })
    return () => { active = false }
  }, [])

  const remove = async (id: string) => { await captureRepository.remove(id); await refresh() }
  const clear = async () => { await captureRepository.clear(); await refresh() }

  return (
    <main className="app-shell">
      <div className="page-heading"><div><p className="eyebrow">Your saved moments</p><h1 className="page-title">The little gallery</h1></div><Link className="secondary-button" to="/"><ArrowLeft size={17} /> Back to studio</Link></div>
      {captures.length === 0 ? <div className="gallery-empty"><ImageOff size={32} /><h2 className="section-title">No captures yet</h2><p>When you catch a good one, it will land here.</p><Link className="primary-button inline-flex" to="/">Make a moment</Link></div> : <><div className="gallery-toolbar"><span>{captures.length} saved {captures.length === 1 ? 'moment' : 'moments'}</span><button type="button" className="text-button" onClick={() => void clear()}>Clear gallery</button></div><div className="gallery-grid">{captures.map((capture) => <article className="capture-card" key={capture.id}><img src={capture.dataUrl} alt={`${expressionLabel(capture.expression)} capture`} /><div className="capture-meta"><span>{expressionLabel(capture.expression)}</span><div className="flex gap-1"><a className="icon-button" href={capture.dataUrl} download={`mewmew-${capture.expression}.jpg`} aria-label="Download capture"><Download size={15} /></a><button type="button" className="icon-button" onClick={() => void remove(capture.id)} aria-label="Remove capture"><Trash2 size={15} /></button></div></div></article>)}</div></>}
    </main>
  )
}
