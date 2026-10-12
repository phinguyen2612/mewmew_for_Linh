import { describe, expect, it } from 'vitest'
import { classifyExpression, chooseMatchingImage } from './face'

describe('classifyExpression', () => {
  it('classifies a smile as happy', () => {
    expect(
      classifyExpression({
        mouthSmileLeft: 0.86,
        mouthSmileRight: 0.82,
        jawOpen: 0.2,
      }),
    ).toBe('happy')
  })

  it('classifies a wide open mouth and raised brows as surprised', () => {
    expect(
      classifyExpression({
        jawOpen: 0.84,
        browInnerUp: 0.76,
        mouthSmileLeft: 0.08,
        mouthSmileRight: 0.06,
      }),
    ).toBe('surprised')
  })

  it('falls back to calm when no expression crosses a threshold', () => {
    expect(classifyExpression({ mouthSmileLeft: 0.1, mouthSmileRight: 0.12 })).toBe('calm')
  })

  it('classifies knitted brows and a pressed mouth as angry', () => {
    expect(
      classifyExpression({
        browDownLeft: 0.86,
        browDownRight: 0.82,
        mouthPressLeft: 0.8,
        mouthPressRight: 0.78,
      }),
    ).toBe('angry')
  })

  it('classifies a small pout as pouty', () => {
    expect(
      classifyExpression({
        mouthPucker: 0.82,
        mouthFunnel: 0.76,
        mouthSmileLeft: 0.12,
        mouthSmileRight: 0.1,
      }),
    ).toBe('pouty')
  })

  it('classifies a soft smile and squint as cute', () => {
    expect(
      classifyExpression({
        mouthSmileLeft: 0.62,
        mouthSmileRight: 0.64,
        eyeSquintLeft: 0.7,
        eyeSquintRight: 0.68,
      }),
    ).toBe('cute')
  })
})

describe('chooseMatchingImage', () => {
  it('returns the newest image assigned to the detected expression', () => {
    const result = chooseMatchingImage(
      [
        { id: 'one', expression: 'happy', createdAt: 1 },
        { id: 'two', expression: 'calm', createdAt: 2 },
        { id: 'three', expression: 'happy', createdAt: 3 },
      ],
      'happy',
    )

    expect(result?.id).toBe('three')
  })

  it('returns no image when the expression has not been assigned', () => {
    expect(chooseMatchingImage([{ id: 'one', expression: 'happy', createdAt: 1 }], 'wink')).toBeNull()
  })
})
