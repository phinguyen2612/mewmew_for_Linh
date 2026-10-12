import { test, expect } from '@playwright/test'

test('studio presents the upload and camera workflow', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Make your mew moment.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bring your best faces' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Start camera/ })).toBeVisible()
})

test('gallery route is available for saved moments', async ({ page }) => {
  await page.goto('/gallery')
  await expect(page.getByRole('heading', { name: 'The little gallery' })).toBeVisible()
  await expect(page.getByText('No captures yet')).toBeVisible()
})
