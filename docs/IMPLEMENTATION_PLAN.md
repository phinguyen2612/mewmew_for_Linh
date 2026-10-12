# MewMew for Linh — Implementation Plan

## Goal

Ship a functioning React + TypeScript + Vite app that completes the local webcam sticker workflow from upload through saved capture.

## Phase 1 — Foundation

- Configure Tailwind, Vitest, ESLint, Playwright, Vercel rewrites, and strict TypeScript.
- Define shared expression, uploaded-image, detection, and capture types.
- Initialize Git and keep all runtime data local to the browser.

## Phase 2 — Domain behavior (test first)

- Implement deterministic expression classification from MediaPipe blendshape scores.
- Implement expression selection and “best matching uploaded image” behavior.
- Implement Dexie persistence for image and capture records.
- Add unit tests for classifier boundaries and repository round trips.

## Phase 3 — Studio experience

- Build responsive shell, progress stepper, upload dropzone, image cards, and expression assignment controls.
- Build camera lifecycle hook with permission/error states.
- Build MediaPipe adapter and throttled detection loop.
- Build animated face overlay, one-face guard, capture compositing, and save flow.

## Phase 4 — Gallery and quality

- Add gallery route with saved captures, delete, and clear actions.
- Add keyboard-accessible controls, empty/error states, reduced-motion support, and mobile layout.
- Add integration coverage for upload/assignment and a Playwright smoke test for the primary route.

## Phase 5 — Release verification

- Run lint, unit/integration tests, production build, and Playwright smoke tests.
- Inspect generated output and verify Vercel configuration.
- Run an independent review if an authenticated Claude Code CLI is available; fix confirmed critical issues and rerun the full suite.
