# Independent review prompt

Review this repository as a production-minded frontend engineer. Focus on the end-to-end workflow: upload an image, assign an expression label, start the webcam, detect exactly one face, classify expression, select the matching image, track it over the face, capture a composite, and save it locally.

Check for:

1. Runtime failures in browsers without camera permission, without a face, or with multiple faces.
2. Incorrect MediaPipe coordinate transforms, stale animation frames, or leaked camera/model resources.
3. Data loss or broken refresh behavior in Dexie persistence.
4. Accessibility problems in upload, expression selection, camera controls, and gallery actions.
5. Build, lint, test, and Vercel routing readiness.

Only report actionable findings with severity (critical / important / minor), file and line, why it matters, and a concrete fix. Do not invent issues unsupported by the code.
