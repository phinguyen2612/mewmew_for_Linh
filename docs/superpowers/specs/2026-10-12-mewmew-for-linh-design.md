# MewMew for Linh — Design Spec

## Intent

Create a playful, local-first browser studio for Linh to upload expressive images and use them as live face overlays from a webcam. The experience should feel gentle and approachable while remaining functional on a normal laptop without a backend.

## Decisions

- Use React + TypeScript + Vite for a static-deployable app.
- Use MediaPipe Tasks Vision FaceLandmarker for client-side face detection and blendshapes.
- Use Dexie/IndexedDB for durable local images and captures.
- Use a small pure classifier with deterministic thresholds and a calm fallback.
- Use a single-camera studio route and a gallery route, with React Router handling navigation.
- Use Tailwind for layout tokens and a small CSS layer for visual polish.

## Success criteria

The core path works end-to-end with a real browser camera: upload, assign, detect one face, classify, overlay, track, capture, and save. Denied camera access, missing faces, multiple faces, and model failures are visible and recoverable.

## Test strategy

Pure face classification and persistence logic are unit tested. React Testing Library covers the upload/assignment workflow. Playwright covers the route smoke path and static deployment behavior; physical camera behavior remains manually verifiable on localhost because browsers do not expose real camera hardware to CI reliably.
