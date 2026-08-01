# Sun Date App — Architectural Plan

## Flow Diagram

```
┌─────────────────┐
│   Screen 1:     │
│   Welcome /     │
│   Landing       │
│  (warm greeting)│
└────────┬────────┘
         │ click "Start"
         ▼
┌─────────────────┐
│   Screen 2:     │
│   Memory /      │
│   Teaser        │
│  (The Middle    │
│   joke + warm   │
│   memory)       │
└────────┬────────┘
         │ click "Continue"
         ▼
┌─────────────────────────────────┐
│   Screen 3: The Ask             │
│  "RJ, will you go on a sun      │
│   date with me tomorrow,        │
│   August 2?"                    │
│  [Yes]  [No] ← dodges cursor    │
└──────────┬──────────────────────┘
           │ Yes clicked
           ▼
┌─────────────────┐
│   Screen 4:     │
│   Celebration   │
│  (confetti +    │
│   sweet message)│
└─────────────────┘

           │ No clicked / caught
           ▼
┌─────────────────┐
│   Screen 3b:    │
│   Silly Excuse  │
│  (joke message, │
│   back to Ask)  │
└─────────────────┘
```

---

## Proposed File Tree

```
project1/
├── index.html          # Single entry point; contains all screen markup
├── css/
│   └── styles.css      # All layout, theme, animations, responsive rules
├── js/
│   └── app.js          # Screen navigation, dodge logic, confetti, state
└── assets/
    └── (optional)      # No photo needed per your request
```

**Why this structure:**
- **Single `index.html`** with JS-driven screen show/hide keeps navigation trivial (no page reloads, no URL routing, no cross-file state passing).
- **Separate `css/` and `js/`** files keep concerns clean and are still trivial to host — just drop the folder on any static host or open `index.html` locally.
- Zero build step, zero dependencies, zero external API calls.

---

## State & Navigation Approach

**Single-page, JS show/hide.** Each "screen" is a `<section>` or `<div>` inside `index.html`. Only one is visible at a time.

**State variables (in `app.js`):**
- `currentScreen` — tracks which screen is active
- `dodgeCount` — increments each time the "No" button dodges; drives "Yes" growth
- `noClickCount` — tracks how many times "No" was actually clicked (for silly excuse rotation)

**Navigation function:**
```js
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}
```

**Why not multi-file?** Multi-file would require `localStorage` or URL params to pass state (like dodge count) between pages. Single-file keeps everything in memory and makes the playful interactions much simpler to implement.

---

## Micro-Interaction Plan

| Interaction | Screen | Behavior | Extra State |
|-------------|--------|----------|-------------|
| **Dodging "No" button** | Screen 3 (The Ask) | On `mouseenter` / `mousemove` near the button, it teleports to a random position within the viewport. Uses `getBoundingClientRect()` distance check. | `dodgeCount` |
| **Growing "Yes" button** | Screen 3 (The Ask) | Each dodge increments `dodgeCount`; "Yes" button `transform: scale()` grows by a factor (capped at ~2x). | `dodgeCount` |
| **Silly excuses** | Screen 3b (Excuse overlay) | If "No" is clicked, show a random playful message from an array, then return to Ask screen. | `noClickCount` (for variety) |
| **Confetti / sun-burst** | Screen 4 (Celebration) | On "Yes" click, spawn 50–100 small divs with random colors/positions, animate outward with CSS transitions, then fade out. | None |
| **Hover wiggle** | All screens | CSS `@keyframes wiggle` on all `<button>` elements — subtle rotate/scale on hover. | None |
| **Fake "thinking" moment** | Between Screen 2 → 3 | After clicking "Continue" on the memory screen, show a 1.5–2s "Hmm... let me think of the perfect question..." overlay before revealing the Ask. | None |

**Implementation notes:**
- Dodge logic: use `document.addEventListener('mousemove')` on Screen 3, calculate distance from cursor to "No" button center. If within threshold (e.g., 150px), move button.
- Confetti: pure CSS + vanilla JS. Create elements, assign random `--x`, `--y`, `--rotation` CSS variables, animate with `transition` or `@keyframes`.
- No external libraries needed.

---

## Content Placeholders (Personalized for RJ)

| Placeholder | Location | Filled Value |
|-------------|----------|--------------|
| `{{HER_NAME}}` | Screen 1, 2, 3, 4 | **RJ** |
| `{{MEMORY}}` | Screen 2 | *A joke/reference from "The Middle" — you can fill in the specific line or scene* |
| `{{DATE_IDEA}}` | Screen 3 | **tomorrow, August 2** (you can add a specific time/place) |
| `{{EXCUSE_1}}` through `{{EXCUSE_N}}` | `app.js` array | Playful strings like "Nice try! That doesn't count." |

---

## Visual Direction

**Theme: "Sun Date" — warm, golden, playful**

- **Colors:** 
  - Background: soft warm gradient (`#fff7e6` to `#ffe4b5`)
  - Primary: sunny yellow (`#ffb347`)
  - Accent: coral/rose (`#ff6b6b`) for the "Yes" button
  - Text: warm dark brown (`#4a3728`) instead of pure black
- **Typography:** System font stack (`'Segoe UI', system-ui, sans-serif`) — no external font loads, keeps it dependency-free and fast.
- **Sun motif:** CSS-only animated sun in the corner of Screen 1 and 4 (a circle with rotating rays using `box-shadow` or pseudo-elements).
- **Buttons:** Large, rounded (`border-radius: 50px`), soft shadows, slight bounce on hover via CSS `@keyframes`.
- **Responsive:** Flexbox centering, `max-width: 600px` container, works on mobile (dodge logic uses `touchmove` fallback or just disables dodge on touch devices).

---

## Numbered Implementation Checklist

1. **Create project folder structure** — `project1/`, `css/`, `js/`, `assets/`
2. **Build `index.html` skeleton** — create 4 screen sections (`#screen-welcome`, `#screen-memory`, `#screen-ask`, `#screen-celebration`) plus an excuse overlay (`#screen-excuse`). Add placeholder comments for personal content.
3. **Build `css/styles.css`** — set up CSS variables for colors, base reset, `.screen` class with `display: none` / `.active { display: flex }`, sun gradient background, button base styles.
4. **Add sun motif CSS** — animated sun element for welcome and celebration screens.
5. **Add button animations CSS** — `@keyframes wiggle`, hover bounce, transition rules for "Yes" growth.
6. **Build `js/app.js`** — implement `showScreen()` navigation, wire up all "Continue" / "Yes" / "No" click handlers.
7. **Implement fake loading** — on Screen 2 "Continue" click, show loading overlay for 1.5–2s, then transition to Screen 3.
8. **Implement "No" dodge logic** — `mousemove` listener on Screen 3, distance check, random repositioning of "No" button within viewport bounds.
9. **Implement "Yes" growth** — on each dodge, increment `dodgeCount` and apply `transform: scale(1 + dodgeCount * 0.15)` to "Yes" button (cap at 2.0).
10. **Implement silly excuses** — array of 5–8 playful strings, random selection on "No" click, show excuse overlay, auto-return to Ask after 2s or on click.
11. **Implement confetti** — on "Yes" click, spawn 80 small colored divs, animate outward with random trajectories, clean up after animation.
12. **Add content placeholders** — ensure all `{{...}}` tokens are present and documented in HTML comments.
13. **Test locally** — open `index.html` in browser, walk through full flow, test dodge on desktop, verify mobile layout.
14. **Deploy** — zip the folder or push to GitHub Pages / Netlify drag-and-drop.

---

## Open Questions (Resolved)

All previous open questions have been answered:
1. ✅ Her name: **RJ**
2. ✅ Memory: **The Middle** series joke (specific line TBD by you)
3. ✅ Date: **tomorrow, August 2** (specific time/place TBD by you)
4. ✅ No photo needed
5. ✅ Warm color palette confirmed

**Remaining detail to fill in:** The exact joke/reference line from *The Middle* for Screen 2, and the specific time/place for the date idea in Screen 3. These can be hard-coded by the Coding Agent once you provide them, or left as clear placeholders for you to edit later.
