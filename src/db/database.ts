import Dexie, { type EntityTable } from 'dexie'
import type { Expression, SavedCapture, UploadedImage } from '../types'

class MewMewDatabase extends Dexie {
  images!: EntityTable<UploadedImage, 'id'>
  captures!: EntityTable<SavedCapture, 'id'>

  constructor() {
    super('mewmew-for-linh')
    this.version(1).stores({
      images: 'id, expression, createdAt',
      captures: 'id, expression, createdAt',
    })
  }
}

export const db = new MewMewDatabase()

export const imageRepository = {
  async add(image: Omit<UploadedImage, 'id'>) {
    const record = { ...image, id: crypto.randomUUID() }
    await db.images.add(record)
    return record
  },
  list: () => db.images.orderBy('createdAt').reverse().toArray(),
  get: (id: string) => db.images.get(id),
  assignExpression: (id: string, expression: Expression | null) => db.images.update(id, { expression }),
  remove: (id: string) => db.images.delete(id),
}

export const captureRepository = {
  add: async (capture: Omit<SavedCapture, 'id'>) => {
    const record = { ...capture, id: crypto.randomUUID() }
    await db.captures.add(record)
    return record
  },
  list: () => db.captures.orderBy('createdAt').reverse().toArray(),
  remove: (id: string) => db.captures.delete(id),
  clear: () => db.captures.clear(),
}

export const clearDatabase = async () => {
  await db.images.clear()
  await db.captures.clear()
}
