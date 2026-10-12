import { ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import type { Expression, UploadedImage } from '../types'
import { EXPRESSION_OPTIONS } from '../data/expressions'

interface UploadPanelProps {
  images: UploadedImage[]
  onFiles: (files: File[]) => void
  onAssign: (id: string, expression: Expression) => void
  onRemove: (id: string) => void
}

export function UploadPanel({ images, onFiles, onAssign, onRemove }: UploadPanelProps) {
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) onFiles(Array.from(event.target.files))
    event.target.value = ''
  }

  return (
    <section className="space-y-4" aria-labelledby="upload-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Step 01 · Build your set</p>
          <h2 id="upload-heading" className="section-title">Bring your best faces</h2>
        </div>
        <span className="count-pill">{images.length}/12 photos</span>
      </div>

      <label className="upload-dropzone group">
        <input className="sr-only" type="file" accept="image/*" multiple onChange={handleInput} />
        <span className="upload-icon"><UploadCloud size={24} /></span>
        <span className="font-bold text-ink">Drop photos here or browse</span>
        <span className="text-sm text-plum/70">JPG, PNG, or WEBP · labels stay on this device</span>
      </label>

      {images.length === 0 ? (
        <div className="empty-note"><ImagePlus size={18} /> Add 2–4 photos for the most playful results.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <article key={image.id} className="image-card">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-lavender">
                <img src={image.dataUrl} alt={image.name} className="h-full w-full object-cover" />
                <button type="button" className="icon-button absolute right-2 top-2" aria-label={`Remove ${image.name}`} onClick={() => onRemove(image.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="mt-2 truncate text-sm font-bold text-ink" title={image.name}>{image.name}</p>
              <label className="mt-1 block text-xs font-semibold uppercase tracking-wide text-plum/60" htmlFor={`expression-${image.id}`}>Expression</label>
              <select id={`expression-${image.id}`} aria-label={`Expression for ${image.name}`} className="select-control" value={image.expression ?? ''} onChange={(event) => onAssign(image.id, event.target.value as Expression)}>
                <option value="" disabled>Choose one</option>
                {EXPRESSION_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.emoji} {option.label}</option>)}
              </select>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
