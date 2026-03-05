# FitCheckAI — Design Plan (Screen-by-Screen)

> Informed by competitor research. Do NOT build until reviewed and approved.

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#09090B` | Page background (true dark, not gray-dark) |
| `card` | `#141416` | Card/surface background |
| `card-hover` | `#1C1C1F` | Card hover/active state |
| `border` | `#27272A` | Borders, dividers |
| `accent` | `#8B5CF6` | Primary purple — buttons, links, brand |
| `accent-hover` | `#7C3AED` | Hover state for purple |
| `accent-glow` | `rgba(139,92,246,0.25)` | Glow/shadow behind accent elements |
| `text` | `#FAFAFA` | Primary text |
| `muted` | `#A1A1AA` | Secondary text |
| `fire` | `#F59E0B` | Score 9-10, gold tier |
| `green` | `#22C55E` | Score 7-8.9, positive items |
| `yellow` | `#EAB308` | Score 4-6.9, mid tier |
| `red` | `#EF4444` | Score 1-3.9, needs work |

### Typography
- **Display:** Space Grotesk 700/800 — scores, hero headlines
- **Body:** Inter 400/500/600 — everything else
- Scale: 14px body, 48-96px scores, 20-28px section headers

### Radius & Spacing
- Cards: `16px` radius
- Buttons: `12px` radius
- Pills/tags: `full` (rounded)
- Card padding: `24px`
- Section spacing: `32px`

### Micro-Interactions
- All transitions: `200ms ease-out` (fast, responsive)
- Button press: `scale(0.97)` on active
- Cards: subtle `translateY(-2px)` on hover
- Score bars: animate width from 0 on mount (`800ms ease-out`, staggered 100ms each)

---

## Screen 1: Landing Page

**Purpose:** Hook visitors, explain the concept in 3 seconds, get them to upload.

**Layout:**
```
┌─────────────────────────┐
│                         │
│      FITCHECK AI        │  ← Space Grotesk 800, white
│    Rate Your Fit.       │  ← Space Grotesk 700, purple
│  AI-powered outfit      │  ← Inter 400, muted
│  ratings in seconds.    │
│                         │
│  ┌───────────────────┐  │
│  │   Upload Your Fit  │  │  ← Primary CTA button, purple
│  └───────────────────┘  │
│                         │
│  ── Example Result ──   │
│  ┌───────────────────┐  │
│  │  8.2  🔥🔥        │  │  ← Mini result card preview
│  │  Clean Casual      │  │     (static, shows what you get)
│  │  ████████░░ Color  │  │
│  │  ███████░░░ Fit    │  │
│  └───────────────────┘  │
│                         │
│  How It Works           │
│  1. Upload  2. AI Rates │
│  3. Share Your Score    │
│                         │
│  2 free checks / day    │  ← Scarcity note
└─────────────────────────┘
```

**Key decisions:**
- ONE primary CTA above the fold
- Example result card shows the value proposition instantly (Photoroom's "instant value" lesson)
- "2 free checks/day" creates urgency (BeReal's scarcity lesson)
- No scroll needed to understand what the app does
- Subtle purple gradient on background (top to bottom, very low opacity)

---

## Screen 2: Upload

**Purpose:** Get the photo as fast as possible. Zero friction.

**Layout:**
```
┌─────────────────────────┐
│  ← Back                 │
│                         │
│  ┌───────────────────┐  │
│  │                   │  │
│  │   📷              │  │  ← Drop zone, dashed border
│  │   Drop your fit   │  │     Becomes photo preview
│  │   or tap to       │  │     on selection
│  │   upload          │  │
│  │                   │  │
│  │   JPG, PNG, WEBP  │  │  ← Muted hint text
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │   Rate My Fit →   │  │  ← Only appears after photo
│  └───────────────────┘  │     selected. Purple CTA.
│                         │
│  🔒 Photos are never   │  ← Privacy note, muted
│     stored              │
│                         │
│  1/2 checks remaining  │  ← Usage indicator
└─────────────────────────┘
```

**Key decisions:**
- Drop zone uses animated dashed border (marching ants) on drag-over
- Photo preview replaces the drop zone (don't show both)
- "Rate My Fit" button only appears after photo selected (clear flow)
- Privacy note addresses concern before it's raised
- Remaining checks shown to reinforce scarcity
- File input accepts image/* — no format confusion

---

## Screen 3: Loading / Analysis

**Purpose:** Build anticipation. This is the "opening the pack" moment.

**Layout:**
```
┌─────────────────────────┐
│                         │
│                         │
│  ┌───────────────────┐  │
│  │                   │  │
│  │   [User's photo]  │  │  ← Photo displayed, slightly
│  │    ───── scan ──  │  │     dimmed, with scan line
│  │                   │  │     moving top to bottom
│  └───────────────────┘  │
│                         │
│  Analyzing your fit...  │  ← Crossfading status messages
│                         │     "Checking color coordination"
│  ████████░░░░░ 67%     │     "Rating fit & proportions"
│                         │     "Calculating your score..."
│                         │
└─────────────────────────┘
```

**Key decisions:**
- Show the user's actual photo (they want to see it, adds personal connection)
- Scan line animation moves vertically over the photo — feels like AI is "studying" it
- Status text crossfades between analysis steps (not a spinner — makes it feel like real work)
- Progress bar fills based on elapsed time (smooth, not jumpy)
- NO back button — committed to the process
- If API is fast (<3s), add minimum display time of 3s so the reveal still feels earned

**Status text rotation (every 2s):**
1. "Scanning your outfit..."
2. "Checking color coordination..."
3. "Rating fit & proportions..."
4. "Analyzing style cohesion..."
5. "Calculating your score..."

---

## Screen 4: Results (THE MONEY SCREEN)

**Purpose:** Deliver the dopamine hit. Make the score feel like an event. Make sharing irresistible.

### Phase 1: Score Reveal (first 3 seconds)

```
┌─────────────────────────┐
│                         │
│                         │
│                         │
│         ╭─────╮         │
│        │       │        │  ← Score ring (SVG circle)
│        │  8.2  │        │     Stroke animates from 0 to
│        │       │        │     score position over 1.2s
│         ╰─────╯         │
│                         │
│        🔥🔥 Clean       │  ← Rating label fades in
│                         │     at 1.5s mark
│      Clean Casual       │  ← Style vibe pill at 2s
│                         │
│                         │
└─────────────────────────┘
```

**Score reveal sequence:**
1. **0.0s:** Score ring begins drawing (stroke-dasharray animation)
2. **0.0-1.2s:** Number counts up from 0 to final score
3. **1.2s:** Number lands, subtle bounce, ring complete
4. **1.5s:** Fire emojis + rating label fade in below
5. **2.0s:** Style vibe pill slides up
6. **2.5s:** Details begin fading in below (scroll prompt appears)

**Score ring:**
- SVG circle with `stroke-dasharray` animated via CSS
- Stroke color matches score tier (gold/green/yellow/red)
- For 9+: subtle gold shimmer/glow effect on the ring
- Ring fills proportionally (8.2/10 = 82% of circle)

### Phase 2: Details (scrollable, fade in at 2.5s)

```
┌─────────────────────────┐
│  Breakdown              │
│  ┌───────────────────┐  │
│  │ Color      8/10   │  │
│  │ ████████░░        │  │  ← Bars animate from left
│  │ Fit        7/10   │  │     100ms stagger between each
│  │ ███████░░░        │  │
│  │ Style      8/10   │  │
│  │ ████████░░        │  │
│  │ Accessory  6/10   │  │
│  │ ██████░░░░        │  │
│  │ Confidence 8/10   │  │
│  │ ████████░░        │  │
│  └───────────────────┘  │
│                         │
│  What's Fire 🔥         │
│  ┌───────────────────┐  │
│  │ ✓ Neutral palette │  │
│  │   flows together  │  │
│  │ ✓ Proportions on  │  │
│  │   point           │  │
│  └───────────────────┘  │
│                         │
│  Level Up ⚡             │
│  ┌───────────────────┐  │
│  │ → Add a watch     │  │
│  │ → Try leather     │  │
│  │   boots           │  │
│  └───────────────────┘  │
│                         │
│  Works For              │
│  ┌───────────────────┐  │
│  │ ✓ date night      │  │
│  │ ✓ school          │  │
│  │ ✕ job interview   │  │
│  │ ✓ hanging out     │  │
│  │ ✕ formal event    │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │  Share Your Score  │  │  ← Purple CTA
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │  Rate Another Fit  │  │  ← Secondary button
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

**Key decisions:**
- Score ring is the ONLY thing on screen for 2.5 seconds (let it breathe)
- Breakdown bars stagger animate (Spotify Wrapped's one-at-a-time approach, but faster)
- Cards use dark surface (`#141416`) with subtle border (`#27272A`)
- "What's Fire" uses green checkmarks, "Level Up" uses amber arrows
- Occasion pills are green (match) or gray (no match)
- Share button is primary CTA — positioned above "Rate Another"
- The whole results page should work as a screenshot (looks good even without the share card)

---

## Screen 5: Paywall (shown after 2 free checks)

**Purpose:** Convert free users to paid. Blur-gate approach (inspired by Umax).

**Layout:**
```
┌─────────────────────────┐
│                         │
│      ╭─────╮            │
│     │  ?.?  │           │  ← Score ring visible but
│      ╰─────╯            │     number is blurred/hidden
│                         │
│  Your score is ready    │
│                         │
│  ┌───────────────────┐  │
│  │ 🔓 Unlock Pro     │  │
│  │                   │  │
│  │ ∞ Unlimited fits  │  │
│  │ 📊 Full breakdown │  │
│  │ 🎨 Premium cards  │  │
│  │ 📈 Style history  │  │
│  │                   │  │
│  │ $4.99/week        │  │
│  │                   │  │
│  │ [Start Free Trial]│  │  ← Purple CTA
│  └───────────────────┘  │
│                         │
│  or                     │
│                         │
│  Come back tomorrow     │  ← Muted text, links to
│  for 2 more free checks │     landing page
│                         │
└─────────────────────────┘
```

**Key decisions:**
- Show blurred score (they can see SOMETHING is there — curiosity converts)
- Clear value props with emoji icons (quick scanning)
- "Start Free Trial" as CTA (lower commitment than "Buy")
- Always offer the free path ("come back tomorrow") — reduces paywall frustration
- This is POST-analysis, not pre-analysis. They've already uploaded and waited. Sunk cost increases conversion

**Note:** For V1 launch, this can be email capture instead of payment. Collect emails for launch list, then switch to Stripe when ready.

---

## Share Card Design (1080x1920 PNG)

**Purpose:** The card people post to their Instagram story. This is the #1 growth lever.

```
┌──────────────────────────┐
│                          │
│     FITCHECK AI          │  ← Brand name, purple, top
│                          │
│        ╭──────╮          │
│       │        │         │
│       │  8.2   │         │  ← Large score ring
│       │        │         │     Color = score tier
│        ╰──────╯          │
│                          │
│     🔥🔥 Clean           │  ← Rating label
│                          │
│    ┌ Clean Casual ┐      │  ← Style vibe pill
│                          │
│  ─────────────────────   │
│                          │
│  Color       ████████░░  │  ← Category bars
│  Fit         ███████░░░  │
│  Style       ████████░░  │
│  Accessories ██████░░░░  │
│  Confidence  ████████░░  │
│                          │
│  ─────────────────────   │
│                          │
│  ✓ Neutral palette       │  ← Top 2 "What's Fire"
│    flows together        │
│  ✓ Proportions on point  │
│                          │
│                          │
│  Rate your fit →         │  ← CTA / URL at bottom
│  fitcheckai.com          │
│                          │
└──────────────────────────┘
```

**Key decisions:**
- Background: `#09090B` (matches app)
- Subtle gradient overlay at top (purple, 10% opacity)
- Score ring is the dominant visual element
- Category bars use tier-appropriate colors
- Only top 2 "What's Fire" items (keep it brief for a story)
- Brand URL at bottom is the only "ad" — subtle but functional
- No noise textures or complex effects — clean and fast to generate
- For 9+ scores: gold color scheme variant (gold ring, gold text, gold bars)
- Card should look like it was DESIGNED, not generated. Clean typography, balanced spacing

---

## Animation Summary

| Element | Animation | Duration | Delay |
|---------|-----------|----------|-------|
| Score ring stroke | `stroke-dashoffset` 0→score | 1200ms | 0ms |
| Score number | Count up 0→score | 1200ms | 0ms |
| Score bounce | `scale(1.05)→scale(1)` | 300ms | 1200ms |
| Fire emojis | `opacity 0→1, translateY(8→0)` | 400ms | 1500ms |
| Rating label | `opacity 0→1` | 400ms | 1500ms |
| Style vibe pill | `opacity 0→1, translateY(8→0)` | 400ms | 2000ms |
| Detail cards | `opacity 0→1, translateY(16→0)` | 500ms | 2500ms + 150ms stagger |
| Breakdown bars | `width 0→score%` | 800ms | 2500ms + 100ms stagger per bar |
| Action buttons | `opacity 0→1` | 400ms | 3000ms |

---

## Build Priority

1. **Results screen** — This is the product. Get this right first.
2. **Share card** — This is the growth engine. Second priority.
3. **Loading screen** — The anticipation builder. Third.
4. **Upload screen** — Clean it up but it works.
5. **Landing page** — Polish last (users from TikTok/IG go straight to upload).
6. **Paywall** — Implement after user base exists.

---

## What We're NOT Doing (Intentional Cuts)

- No story-format multi-screen reveal (too complex for V1, revisit in V2)
- No sound effects (web audio is unreliable on mobile)
- No radar/spider chart on share card (bars are cleaner and faster to generate)
- No user accounts or style history (V2 feature)
- No fit battle or social features (V2)
- No seasonal themes (V2)
- No custom fonts on canvas share card (system fonts only — avoids loading issues)

---

*Ready for review. Do not build until approved.*
