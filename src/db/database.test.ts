import { beforeEach, describe, expect, it } from 'vitest'
import { clearDatabase, imageRepository } from './database'

describe('imageRepository', () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  it('saves and reads an uploaded image with its assigned expression', async () => {
    const saved = await imageRepository.add({
      name: 'mew.png',
      dataUrl: 'data:image/png;base64,abc',
      expression: 'happy',
      createdAt: 100,
    })

    const images = await imageRepository.list()

    expect(images).toHaveLength(1)
    expect(images[0]).toMatchObject({ id: saved.id, name: 'mew.png', expression: 'happy' })
  })

  it('updates an image label without changing the image data', async () => {
    const saved = await imageRepository.add({
      name: 'mew.png',
      dataUrl: 'data:image/png;base64,abc',
      expression: null,
      createdAt: 100,
    })

    await imageRepository.assignExpression(saved.id, 'surprised')
    const image = await imageRepository.get(saved.id)

    expect(image?.expression).toBe('surprised')
    expect(image?.dataUrl).toBe('data:image/png;base64,abc')
  })
})
