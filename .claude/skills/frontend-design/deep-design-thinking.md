---
name: frontend-design-thinking
description: Deep Design Thinking protocol for creating original, memorable UI designs. Anti-cliché methodology, topological hypotheses, and self-audit framework. Loaded by frontend-specialist before any design task.
---

# Deep Design Thinking Protocol

**⛔ DO NOT start designing until you complete this full protocol.**

---

## Step 1: Context Analysis (Internal Thinking — Don't Show User)

Answer in your `<thinking>`:

```
🔍 CONTEXT ANALYSIS:
├── Sector? → What emotions should it evoke?
├── Target audience? → Age, tech-savviness, expectations?
├── Competitors? → What should I NOT do?
└── Soul of this site? → One word.

🎨 DESIGN IDENTITY:
├── What will make this design UNFORGETTABLE?
├── What unexpected element can I use?
├── How do I avoid standard layouts?
└── Will I remember this design in a year?

📐 LAYOUT HYPOTHESIS:
├── How can the Hero be DIFFERENT? (Asymmetry? Overlay? Split?)
├── Where can I break the grid?
└── Can the Navigation be unconventional?

🎭 EMOTION MAPPING:
├── Primary emotion: [Trust/Energy/Calm/Luxury/Fun]
├── Color implication: [based on emotion, NOT default blue]
├── Typography character: [Serif=Classic, Sans=Modern, Display=Bold]
└── Animation mood: [Subtle=Professional, Dynamic=Energetic]
```

---

## Step 2: Modern Cliché Scan (ANTI-SAFE HARBOR)

Check yourself against these traps. If ANY are true → change your approach:

- "Am I defaulting to Left Text / Right Visual because it feels balanced?" → **Betray it.**
- "Am I using Bento Grids to organize safely?" → **Break the grid.**
- "Am I using safe SaaS fonts and 'standard' color pairs?" → **Disrupt the palette.**

### 🚫 FORBIDDEN DEFAULTS (unless user explicitly requests)

1. **The Standard Hero Split** (Left Content / Right Image) — most overused layout
2. **Bento Grids** — use only for genuinely complex data displays
3. **Mesh/Aurora Gradients** — floating colored blobs = AI cliché
4. **Glassmorphism** — blur + thin border ≠ premium
5. **Purple/Violet/Indigo** as primary color — #1 AI design cliché
6. **Generic Copy** — "Orchestrate", "Empower", "Elevate", "Seamless" are banned
7. **Safe border-radius (4-8px)** — go extreme: 0-2px (sharp) or 16-32px (friendly)
8. **Any UI library** without asking user first (shadcn, Radix, Chakra, MUI)

### Alternative Topologies to Use

- **Massive Typographic Hero**: Headline 300px+, visual built behind/inside letters
- **Center-Staggered**: Each element (H1, P, CTA) has different horizontal alignment
- **Layered Depth (Z-axis)**: Overlapping visuals, partially obscuring text
- **Vertical Narrative**: No "above the fold" hero, story flows immediately
- **Extreme Asymmetry (90/10)**: Everything on one edge, 90% negative space

---

## Step 3: Dynamic User Questions

**After self-analysis, ask SPECIFIC questions — not generic ones.**

```
❌ WRONG (Generic):
- "What colors do you prefer?"
- "What kind of design do you want?"

✅ CORRECT (Based on context):
- "For [Sector], [Color1] or [Color2] are typical.
   Does one fit your vision, or should we diverge?"
- "Your competitors use [X layout].
   To differentiate, we could try [Y]. What do you think?"
- "[Target audience] usually expects [Z].
   Should we include it or go more minimal?"
```

**MUST ask** if unspecified: Color palette · Style · Layout · UI library approach

---

## Step 4: Design Commitment (PRESENT TO USER BEFORE CODE)

Declare your choices. Do NOT skip this step.

```markdown
🎨 DESIGN COMMITMENT: [RADICAL STYLE NAME]

- **Topological Choice:** (How I avoided standard layouts)
- **Geometry:** (Sharp/Rounded/Organic — with reasoning)
- **Typography:** (Serif/Sans/Display — with pairing logic)
- **Palette:** (Colors + emotion justification — NO PURPLE)
- **Effects/Motion:** (Animation approach + GPU-only properties)
- **Layout Uniqueness:** (What makes this impossible to mistake for a template)
- **Risk Factor:** (What I did that might be "too far")
- **Cliché Liquidation:** (Which safe-harbor elements I explicitly killed)
```

**Rules**: Commit fully to one style. Don't mix 5 styles. If you pick "Futuristic HUD", don't add soft rounded corners.

---

## Step 5: Mandatory Animation & Depth

**STATIC DESIGN IS FAILURE.** UI must feel alive.

### Required Layers

- **Reveal**: Scroll-triggered staggered entrance animations on sections
- **Micro-interactions**: Every clickable/hoverable element gives physical feedback (scale, translate, glow-pulse)
- **Spring Physics**: Animations must feel organic, not linear

### Required Depth

- Overlapping elements, parallax layers, grain textures
- NOT just flat colors + box shadows

### Optimization — MUST

- **MUST** Use only GPU-accelerated properties (`transform`, `opacity`)
- **MUST** Support `prefers-reduced-motion`
- **SHOULD** Use `will-change` strategically for heavy animations

---

## Step 6: Maestro Auditor (FINAL GATEKEEPER — Before Delivery)

**Automatic Rejection Triggers** — if ANY are true, start over:

| Trigger | Why It Fails | Fix |
|---------|-------------|-----|
| The "Safe Split" | 50/50, 60/40, 70/30 grid | Switch to 90/10, stacked, or overlapping |
| The "Glass Trap" | `backdrop-blur` without raw borders | Remove blur. Use solid colors + raw borders |
| The "Glow Trap" | Soft gradients to "pop" | High-contrast solid colors or grain textures |
| The "Bento Trap" | Safe rounded grid boxes | Fragment the grid. Break alignment. |
| The "Blue Trap" | Default blue/teal as primary | Switch to acid green, signal orange, deep red |

### UX Verification

- [ ] **Miller's Law** — info chunked into 5-9 groups?
- [ ] **Von Restorff** — key element visually distinct?
- [ ] **Cognitive Load** — not overwhelming? Enough whitespace?
- [ ] **Trust Signals** — logos, testimonials, security badges?
- [ ] **Emotion-Color Match** — color evokes intended feeling?

### Brutal Honesty Tests

| Test | FAIL | PASS |
|------|------|------|
| Template Test | "Could be a Vercel template" | "Unique to THIS brand" |
| Memory Test | "It's professional" | "I'd stop scrolling on Dribbble" |
| Describe Test | Uses "clean" or "minimal" | "Brutalist with aurora accents and staggered reveals" |
| Animation Test | Just fade-in / opacity | Purposeful motion with spring physics |

> 🔴 **MAESTRO RULE: "If I can find this layout in a Tailwind UI template, I have failed."**

---

## Design Trinity (Every Design Must Achieve)

1. ✅ **Bold Geometry** — extreme corners, not safe 4-8px
2. ✅ **Memorable Palette** — no purple, no default blue
3. ✅ **Fluid Animation** — spring physics, micro-interactions, depth
