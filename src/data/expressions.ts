import type { Expression } from '../types'

export const EXPRESSION_OPTIONS: Array<{
  id: Expression
  label: string
  emoji: string
  description: string
}> = [
  { id: 'happy', label: 'Happy', emoji: '😊', description: 'Bright smile' },
  { id: 'surprised', label: 'Surprised', emoji: '😲', description: 'Big reaction' },
  { id: 'wink', label: 'Wink', emoji: '😉', description: 'Playful blink' },
  { id: 'love', label: 'Love', emoji: '🥰', description: 'Soft and sweet' },
  { id: 'calm', label: 'Calm', emoji: '😌', description: 'A gentle look' },
]

export const expressionLabel = (expression: Expression) =>
  EXPRESSION_OPTIONS.find((option) => option.id === expression)?.label ?? expression
