# MewMew for Linh — Architecture

## Product shape

MewMew is a local-first browser studio for turning a small set of uploaded photos into an expressive webcam overlay. The primary workflow is deliberately linear: upload photos, assign each an expression label, grant camera access, detect one face, classify the current expression, select the matching photo, track it over the face, capture a composite, and save it to the local gallery.

## Runtime architecture

```text
React Router
  ├─ Studio route
  │   ├─ UploadPanel        → Dexie image library
  │   ├─ ExpressionBoard    → selected label state
  │   └─ WebcamStage        → camera + MediaPipe + overlay + capture
  └─ Gallery route          → Dexie capture records

MediaPipe Tasks Vision
  → FaceLandmarker
  → one-face guard + blendshape classifier
  → normalized face box
  → animated overlay positioning
```

## Boundaries

- `src/types`: stable domain contracts shared by UI, persistence, and vision code.
- `src/data`: product labels and display metadata only; no browser side effects.
- `src/lib/face.ts`: pure classification and geometry helpers. It is unit-testable without a webcam.
- `src/services/faceLandmarker.ts`: the only MediaPipe integration boundary. It lazy-loads the model from the public CDN and exposes a small typed service.
- `src/db/database.ts`: Dexie schema and persistence operations for uploaded images and captured results.
- `src/hooks/useMediaStream.ts`: browser camera lifecycle and cleanup.
- `src/components`: focused visual units. Components receive domain data/callbacks and do not own database details.
- `src/pages`: route-level orchestration for the studio and gallery.

## Data flow

1. A `File` is converted to a data URL and stored as an `UploadedImage` record. Data URLs keep the app fully local and let the gallery work after refresh.
2. The user assigns one expression label to each uploaded image. A label is persisted with that record.
3. Starting the camera requests a single video stream and lazily initializes `FaceLandmarker`.
4. The detection loop throttles work to roughly 10 frames/second, rejects zero or multiple faces, computes a normalized bounding box, and classifies from MediaPipe blendshapes.
5. The active overlay is the newest uploaded image with the current detected label; it is positioned from the normalized face box and smoothly animated with Motion.
6. Capture composites the mirrored camera frame and overlay onto a canvas, then stores the resulting data URL in Dexie.

## Failure handling

- Camera denied/unavailable: show a recoverable inline message and preserve the upload library.
- Model loading failure: show a retry action and keep the camera preview visible.
- No face: show a guide state and hide the overlay.
- More than one face: show a clear “one face only” state and hide the overlay.
- Capture before a valid face: disable the action.
- Storage failure: surface a non-blocking error toast and keep the capture data in memory until the user retries.

## Deployment

Vite produces a static bundle. `vercel.json` rewrites all routes to `index.html` so the React Router gallery path works on refresh. MediaPipe’s model is fetched at runtime over HTTPS; camera access requires HTTPS (or localhost).
