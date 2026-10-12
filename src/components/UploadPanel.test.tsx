import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { UploadPanel } from './UploadPanel'

describe('UploadPanel', () => {
  it('lets a user assign an expression label to an uploaded image', async () => {
    const user = userEvent.setup()
    const onAssign = vi.fn()
    const image = {
      id: 'image-1',
      name: 'mew.png',
      dataUrl: 'data:image/png;base64,abc',
      expression: null as null,
      createdAt: 1,
    }

    render(<UploadPanel images={[image]} onFiles={vi.fn()} onAssign={onAssign} onRemove={vi.fn()} />)

    await user.selectOptions(screen.getByLabelText('Expression for mew.png'), 'happy')

    expect(onAssign).toHaveBeenCalledWith('image-1', 'happy')
  })
})
