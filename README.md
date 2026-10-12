# MewMew for Linh

MewMew is a local-first React studio for matching uploaded expression photos to a live webcam face, tracking the overlay, capturing the result, and saving it to a private browser gallery.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL in a browser. Camera access requires `localhost` or HTTPS.

## Commands

```bash
npm run lint       # ESLint
npm test           # Vitest unit + component integration tests
npm run test:e2e   # Playwright browser smoke tests
npm run build      # strict TypeScript check + production bundle
```

## Core workflow

1. Upload one or more photos and assign each an expression label.
2. Start the camera and allow browser permission.
3. MediaPipe Tasks Vision detects exactly one face and classifies the expression.
4. The matching uploaded image follows the face in the preview.
5. Capture the composed frame; it is saved to IndexedDB and shown in `/gallery`.

All images and captures remain in the browser via Dexie/IndexedDB. The MediaPipe model is loaded on demand from the Google-hosted model asset and jsDelivr WASM runtime.

## Deployment

The app is a static Vite build. `vercel.json` rewrites client-side routes to `index.html`, so `/gallery` works after a refresh on Vercel.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md), and [docs/CLAUDE_REVIEW_PROMPT.md](docs/CLAUDE_REVIEW_PROMPT.md) for the system boundaries, implementation plan, and review checklist.
