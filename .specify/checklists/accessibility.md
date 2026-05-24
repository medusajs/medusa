# Specification Quality Checklist: Accessibility (WCAG 2.2 AA)

**Purpose**: Validate that accessibility requirements are specified upfront, not retrofitted at QA. Targets WCAG 2.2 Level AA baseline.
**When to use**: Every user-facing feature with UI. Public-facing products MUST. Internal tools SHOULD.
**When to skip**: Pure backend / infra with no UI.

## Validation Items

### Perceivable

- [ ] CHK001 - Are color-contrast requirements explicit (≥4.5:1 body text, ≥3:1 large text and UI components)? [Completeness, WCAG 1.4.3, 1.4.11]
- [ ] CHK002 - Is the spec explicit that color alone MUST NOT convey meaning (state, error, required field)? [Coverage, WCAG 1.4.1]
- [ ] CHK003 - Are alt-text requirements specified for every image, icon-with-meaning, decorative image, complex graphic? [Completeness, WCAG 1.1.1]
- [ ] CHK004 - Are video / audio requirements specified (captions, transcripts, audio descriptions)? [Coverage, WCAG 1.2]
- [ ] CHK005 - Is zoom / reflow specified (200% zoom without horizontal scroll, 320 CSS px width)? [Gap, WCAG 1.4.10]

### Operable

- [ ] CHK006 - Is keyboard-only operation specified for every interactive element (tab order, focus visible, no traps)? [Coverage, WCAG 2.1.1, 2.1.2, 2.4.7]
- [ ] CHK007 - Are focus-visible requirements specified (custom indicator, contrast, never `outline:none` without replacement)? [Completeness, WCAG 2.4.7, 2.4.11]
- [ ] CHK008 - Are touch-target size requirements specified (≥24×24 CSS px minimum, ≥44×44 recommended)? [Completeness, WCAG 2.5.8]
- [ ] CHK009 - Are gesture / drag-only interactions specified to have keyboard alternatives? [Coverage, WCAG 2.5.7]
- [ ] CHK010 - Is timing-out behavior specified (warning, extension, no data loss)? [Edge Case, WCAG 2.2.1]

### Understandable

- [ ] CHK011 - Is page-language specified (`<html lang>`, per-section overrides)? [Completeness, WCAG 3.1.1, 3.1.2]
- [ ] CHK012 - Are form-error requirements specified (inline message, `aria-describedby`, role="alert")? [Coverage, WCAG 3.3.1, 3.3.3]
- [ ] CHK013 - Are field-label requirements specified (visible label, programmatic association, no placeholder-as-label)? [Clarity, WCAG 1.3.1, 3.3.2]
- [ ] CHK014 - Are autocomplete-attribute requirements specified for personal-info fields? [Gap, WCAG 1.3.5]

### Robust

- [ ] CHK015 - Are semantic-HTML requirements explicit (use `<button>` not `<div role="button">` unless justified)? [Clarity]
- [ ] CHK016 - Are ARIA-usage requirements bounded ("first rule of ARIA: don't use ARIA if a native element works")? [Consistency]
- [ ] CHK017 - Are dynamic-content announcement requirements specified (live regions, role="status", role="alert")? [Coverage, WCAG 4.1.3]
- [ ] CHK018 - Is screen-reader testing scope specified (which readers, OS, browsers)? [Gap]

### Forms-specific

- [ ] CHK019 - Are required-field indicators specified for both visual and AT users (asterisk + `aria-required` + visible "required")? [Completeness, WCAG 3.3.2]
- [ ] CHK020 - Are error-summary requirements specified (top-of-form summary with anchor links to fields)? [Gap]

### Motion & Sensory

- [ ] CHK021 - Are motion / animation requirements respect `prefers-reduced-motion`? [Coverage, WCAG 2.3.3]
- [ ] CHK022 - Are flashing-content requirements specified (≤3 flashes/sec, no red flash)? [Edge Case, WCAG 2.3.1]

### Process

- [ ] CHK023 - Is the testing approach specified (axe / Lighthouse / manual screen-reader pass / user testing)? [Measurability]
- [ ] CHK024 - Are accessibility acceptance criteria part of definition-of-done? [Traceability]

## Notes

- Reference: WCAG 2.2 (W3C Recommendation, Oct 2023; AAA additions are out of scope here).
- Pair with `frontend-specialist` agent's `frontend-design` skill — design tokens bake in contrast and focus styles.
