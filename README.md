# Codex of Algorithms

A single-file React game about the history of algorithms/AI. This repo adds a tiny Vite harness to run it locally.

## Run locally

```powershell
# From this folder
npm install
npm run dev
# Open the printed localhost URL
```

## Build

```powershell
npm run build
npm run preview
```

## Notes
- Styling uses Tailwind via CDN in `index.html` for simplicity.
- Component source is `codex-of-algorithms.js`. Entry is `src/main.jsx`.
- Requires a modern browser for Web Audio API and YouTube iframe.

### Images
- Dev server serves static files from `public/`. Put your card images under `public/assets/images`.
- If you currently have images in `dist/assets/images` from a prior build, copy them over for dev:

```powershell
# From repo root
mkdir -Force public\assets\images | Out-Null
Copy-Item -Path "dist\assets\images\*" -Destination "public\assets\images" -Recurse -Force
```
