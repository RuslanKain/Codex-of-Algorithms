# Codex of Algorithms — How the game works (repo analysis)

Scope: analysis only (no running/building). This is based on reading the repo contents as cloned into the OpenClaw workspace.

## 1) What this project is
**Codex of Algorithms** is a single-player, story-driven **React card game** about the history of algorithms/AI. You progress chapter-by-chapter through eras by playing cards and answering challenges, while managing resources and (in Chapter 1) a **Paradox Meter**.

The repo is intentionally lightweight:
- **React + Vite** for local dev/build
- **Tailwind via CDN** in `index.html` (no Tailwind build pipeline)
- Rich content is mostly encoded directly in a single large component file.

## 2) How to run (as intended by the repo)
From `README.md`:
- Dev: `npm install` → `npm run dev`
- Build: `npm run build` → `npm run preview`

Key note from the README: images are expected under `public/assets/images` and served by Vite.

## 3) Repository map (important files)
- `index.html`
  - Loads Tailwind CDN and mounts the React app.
- `src/main.jsx`
  - React entry point. Renders the main game component from `codex-of-algorithms.jsx`.
- `codex-of-algorithms.jsx`
  - **Primary implementation**: game state, UI, content (chapters/cards), saving, cutscenes, tutorial, challenge system, paradox system, audio.
- `codex-of-algorithms.js`
  - Appears to be an earlier or alternate variant of the same main component (older/less feature-complete). In this harness, it’s not imported by `src/main.jsx`.
- `enhanced-chapters.js`
  - Contains “Enhanced Baghdad Chapter + New Renaissance Chapter” definitions and some narrative manager utilities. In the current harness it is **not imported** from `src/main.jsx` (so it likely isn’t active unless manually wired in).
- `public/assets/images/…`
  - Art assets (many filenames include spaces). The game uses these for cutscene backdrops and card art.
- `story.txt` / `story.docx`
  - Narrative source/reference material. `story.txt` also contains an “agent brief” style chapter script and explicit asset mapping.

## 4) Core gameplay model
### 4.1 Resources
The game tracks a resource bag `res` with keys:
- `knowledge`, `influence`, `compute`, `data`, `ethics`

Start values (in code):
- `START_RES = { knowledge: 8, influence: 4, compute: 0, data: 3, ethics: 0 }`

Resources are used for **card costs** and increased by **card gains** and **challenge rewards**.

Key helpers:
- `canPay(res, cost)` — checks whether the player can afford a cost.
- `pay(res, cost)` — subtract cost (clamped to non-negative).
- `addRes(res, gain)` — adds gains.

Difficulty affects costs:
- Each card’s cost is scaled with `scaleCost(card.cost, costMul)` where `costMul` comes from `DIFFICULTY_PRESETS[settings.difficulty]`.

### 4.2 Card types
Card objects include `id`, `type`, `name`, `art`, and some combination of:
- `cost`
- `gain` (immediate resource gain)
- `passive` (for figures)
- `meta` + `prompt` (for challenges)

Types created by helpers:
- `tech` — “technology” / concept cards with costs + gains.
- `figure` — historical figure cards; have a fixed cost of 3 and a `passive` gain that triggers on end of turn.
- `event` — story/context cards that can grant small gains.
- `challenge` — quiz/puzzle cards; when played they open a modal and you resolve success/failure.

### 4.3 Chapters and progression
Chapters are in `CHAPTERS` (in `codex-of-algorithms.jsx`). Each chapter contains:
- `id`, `title`, `years`, `scene`
- `required` list of card IDs
- `deck` (the chapter’s cards)
- styling (`bg`) and a `portrait` backdrop

Progression:
- Playing a **required** card increases progress by **+20**.
- Playing a **non-required** (non-challenge) card increases progress by **+10**.
- Resolving a challenge successfully increases progress by **+15**.
- Chapter completion is computed as:
  - `chapterComplete = chapter.required.every(id => played[id])`

When complete (or progress ≥ 100) the game triggers a chapter-complete cutscene and advances `chapterIdx`.

### 4.4 Deck/hand/discard loop
State variables:
- `deck`, `hand`, `discard`

`draw(n)`:
- draws from `deck`, shuffling discard into deck when deck is empty.

`playCard(card)`:
- if challenge: pay cost and open challenge modal.
- else: pay cost, apply gains, mark card as played, move from hand → discard, then draw 1.

`endTurn()`:
- applies passives from all played **figure** cards
- increments turn
- draws 1

### 4.5 Challenges / quizzes
Challenge cards (`type: "challenge"`) open `ChallengeModal`.

Resolution:
- **Success**: add reward resources, +15 progress, **reduce paradox by 2**.
- **Failure**: increase paradox (via `bumpParadox(8)` from `resolveChallenge`, plus additional bumping from `onWrong` handlers in some cases).

The challenge system supports multiple kinds (observed in chapter content and modal code):
- `mcq` (multiple choice)
- `drag` (reorder/drag list)
- `cloud`, `pseudo`, `figure`, etc. (appear in later chapters)

Challenge attempt logic is difficulty-dependent:
- Easy: up to 2 attempts, hints after the first wrong attempt
- Medium: 1 attempt
- Hard: 0 attempts (immediate fail on wrong)

### 4.6 Paradox system (Chapter 1)
`paradox` is a 0–100 meter.
- Wrong answers and certain failures increase paradox.
- At `paradox >= 100`, the game triggers a **Paradox Collapse** cutscene and **restarts Chapter 1**.

Visual effects:
- When paradox crosses thresholds:
  - >= 30: minor flash
  - >= 60: major flash
  - >= 100: failure cutscene + major flash

Chapter 1 also shows a dedicated Paradox UI panel.

## 5) Narrative delivery (cutscenes + backstory)
The game uses a `Cutscene` overlay that displays `title`, `text`, `backdrop`.

Special handling for Chapter 1 (`initChapter`):
- It constructs a **backstory cutscene sequence** (Neo‑Cairo → chrono-gate → Baghdad arrival) and then an arrival sequence.
- It decides whether to show the backstory depending on:
  - `forceBackstory`, existing save, and `backstorySeen` localStorage flag.
- It also uses an `awaitingDifficulty` / `showDifficulty` flow to insert a difficulty selection moment.

Asset backdrops are strings like:
- ``url('/assets/images/arrival_tigris_baghdad.png')``

**Important implementation detail**: many filenames include spaces and mixed case (e.g. `Cyborgs et néons dans la ville.png`). Those must match exactly under `public/assets/images`.

## 6) Tutorial + Guide
There is an “enhanced tutorial system” in `codex-of-algorithms.jsx`:
- `TUTORIAL_STEPS` defines guided steps with optional `highlight` selectors.
- Progression can be automatic via `tutorialEvent({type: ...})` calls on actions such as draw, play card, open challenge, resolve challenge, end turn.
- Completion is stored in `localStorage('codex_tutorial_completed')`.

There’s also a `GuideModal` accessible via the top bar.

## 7) Save/Load
Save is browser-local:
- `LS_KEY = "algocodex_save"`

`save()` stores:
- chapterIdx, turn, res, hand, deck, discard, played, progress, settings

`load()` restores those values if the version matches.

## 8) Audio
The game supports:
- External music URL audio via `<audio ref>`
- A built-in **SynthwaveEngine** (WebAudio)
- A `YouTubeDock` mini-player that embeds a playlist and supports keyboard shortcuts.

## 9) Images and asset loading
The UI includes `SmartImage` with `assetCandidates(card)` to try multiple possible asset paths for a card.

Assets are expected in:
- `public/assets/images/*`

The README contains guidance for copying prior build assets into `public/assets/images` for dev.

## 10) Deeper static issues / risks found (no testing)
### 10.1 Duplicate card IDs in Chapter 1 deck (high impact)
In `codex-of-algorithms.jsx`, Chapter 1’s `deck` includes repeated cards with the *same* IDs (e.g., multiple `cTech('hindu-arabic', ...)`, `cTech('algebra', ...)`, etc.).

Why it matters:
- Card identity and progression uses `played[id]` and `required.includes(id)`.
- Duplicates can cause confusing UI and state (multiple cards that all count as the same card).

### 10.2 Mixed/legacy code paths: `codex-of-algorithms.js` vs `.jsx`
`src/main.jsx` imports `codex-of-algorithms.jsx`, not `codex-of-algorithms.js`.

The `.js` file appears to be an older baseline (814 LOC vs 2190 LOC) missing:
- paradox system
- enhanced tutorial bubble system
- richer YouTubeDock
- assetCandidates mapping

This is fine if intentional, but it increases maintenance burden and can confuse contributors.

### 10.3 Tailwind CDN dependency
`index.html` loads Tailwind via CDN. That’s convenient, but:
- it requires internet access for styling
- offline builds / certain deployment environments will render unstyled

### 10.4 Asset-path strategy is inconsistent (likely missing images in dev)
In `assetCandidates(card)`:
- explicit mapping adds both `/assets/images/...` and `/dist/assets/images/...`.
- the “known files you mentioned” block appends **only** `/dist/assets/images/<file>` candidates.

If you are running via Vite dev server, `/dist/assets/images` typically won’t exist.
So the known-list images will fail unless also present under `/public/assets/images`.

### 10.5 `SmartImage` ignores passed styling props (minor)
`Card` calls `<SmartImage card={card} className=... style=... />`, but `SmartImage`’s signature is `function SmartImage({ card })` and it does not accept/forward `className` or `style`. So those props have no effect.

This doesn’t break functionality, but it’s a “looks like it should work” footgun.

### 10.6 YouTubeDock: message handler lacks origin/source verification (security)
`YouTubeDock` does `window.addEventListener('message', handler)` and then attempts `JSON.parse(ev.data)` without checking `ev.origin` or that `ev.source` is the embedded iframe.

This can allow *any* window message to influence player state toggles (at least to the extent of updating React state; some commands are gated by `playerReady`). It’s not catastrophic, but it’s worth hardening.

### 10.7 Console logging left in production paths
There are several `console.log(...)` statements in the YouTubeDock code path (player errors, readiness, iframe load). Not a blocker, but noisy.

### 10.8 Tooling constraints in some environments
The repo assumes you can run `npm install` and fetch packages. In locked-down containers, installs may fail without network.

## 11) Suggested next tasks (pre-testing)
High-leverage cleanup before we start runtime testing:
1) **De-duplicate Chapter 1 deck IDs** (make every card’s `id` unique, or intentionally allow duplicates with unique instance IDs).
2) Decide whether `codex-of-algorithms.js` should be removed, or clearly marked as legacy.
3) Fix assetCandidates “known list” to also check `/assets/images/<file>` (not just `/dist/...`).
4) Update `SmartImage` to accept `{ className, style }` and forward them to `<img>`.
5) Harden `YouTubeDock` `message` handler to verify `event.origin` and `event.source`.

## 12) Testing results (initial)
### 12.1 Install + dev server
- `npm install` initially ran with `NODE_ENV=production`, so **devDependencies were skipped** and `vite` was missing.
- Re-ran install with `NODE_ENV=development npm install` to include dev dependencies.

Dev server:
- Started Vite via `node node_modules/vite/bin/vite.js` because calling `vite` from npm scripts returned `Permission denied` in this container.
- Dev server responded OK at `http://localhost:5173/` (HTTP 200) and served the expected HTML shell.

### 12.2 Production build
- `vite build` succeeded.
- Output bundle size (from build log): `dist/assets/index-*.js` ~349 kB (gzip ~112 kB).

### 12.3 Security audit
- `npm audit` reports **0 vulnerabilities** (after the dev-deps install).

### 12.4 Screenshots / visual testing
- I could not capture browser screenshots via the OpenClaw `browser` tool in this environment because no supported browser is available on the host.
- If you want automated screenshots in-container, the next step is to add a headless browser harness (e.g., Playwright/Puppeteer) and use it to load `http://localhost:5173/` and take snapshots.

## 13) Next runtime tests to run (once screenshots are available)
- Load the app and confirm:
  - first-run landing modal
  - backstory cutscene queue
  - tutorial highlight system
  - Chapter 1 paradox flashes and failure restart
- Verify asset resolution (no missing `/assets/images/*`)
- Save/load flows (localStorage)
- Challenge grading and attempt limits by difficulty

---

*Generated from static reading plus limited runtime checks (npm install/build + HTTP fetch) of: `README.md`, `index.html`, `package.json`, `src/main.jsx`, `codex-of-algorithms.jsx`, `codex-of-algorithms.js`, `enhanced-chapters.js`, and `story.txt`.*
