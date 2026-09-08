import type { BaseSpec, GradientStop } from "../../types.js"

export type CloudPillSpec = {
  /** Total height of the pill. */
  height: number
  /** Distance from the pill's edge to the logomark. */
  paddingLeft: number
  /** Distance from the end of the date to the pill's edge. */
  paddingRight: number
  fillGradient: GradientStop[]
  /** Thickness of the inset highlight and ring. */
  hairline: number
  /** Lit edge along the very top of the pill. */
  highlightColor: string
  /** Faint ring all the way around, standing the pill off the background. */
  ringColor: string
  /** The pill's cast shadow. */
  shadowOffsetY: number
  shadowBlur: number
  shadowSpread: number
  shadowColor: string
}

export type CloudChangelogContentSpec = {
  /** Visible height of the logomark. */
  logoHeight: number
  logoColor: string
  /** Space between the logomark and the wordmark. */
  gap: number

  /** The constant wordmark next to the logomark. */
  wordmark: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  color: string

  /** The rule between the wordmark and the date. */
  dividerWidth: number
  dividerHeight: number
  /** Space either side of the rule. */
  dividerMargin: number
  dividerColor: string

  dateFontFamily: string
  dateFontSize: number
  dateFontWeight: number
  dateLetterSpacing: number
  dateColor: string
}

export type CloudChangelogSpec = BaseSpec & {
  pill: CloudPillSpec
  content: CloudChangelogContentSpec
}

/**
 * Design spec for the Cloud changelog banner: a pill holding the logomark, the
 * Cloud wordmark, and the entry's date.
 *
 * Sizes are in pixels at the reference resolution of 2400x1260 — twice the
 * 1200x630 the design was authored at, so the banner is delivered at retina
 * density by default. Override `width` and everything scales proportionally.
 */
export const CLOUD_CHANGELOG_SPEC: CloudChangelogSpec = {
  width: 2400,
  height: 1260,

  background: "#18181C",

  pill: {
    height: 264,
    paddingLeft: 88,
    paddingRight: 112,
    // Lit along the top, settling into the background by the bottom edge.
    fillGradient: [
      [0, "#4E4D53"],
      [0.42, "#2B2A2F"],
      [1, "#1C1B21"],
    ],
    hairline: 2,
    highlightColor: "rgba(255, 255, 255, 0.16)",
    ringColor: "rgba(255, 255, 255, 0.05)",
    shadowOffsetY: 60,
    shadowBlur: 120,
    // The design tightens the shadow with a -40 spread, which satori cannot
    // draw — see the note in `template.ts`. The blur is pulled in to compensate
    // for the pool the missing spread would otherwise let spill.
    shadowSpread: 0,
    shadowColor: "rgba(0, 0, 0, 0.85)",
  },

  content: {
    logoHeight: 130,
    logoColor: "#E8E7EC",
    gap: 56,

    wordmark: "Cloud",
    fontSize: 132,
    fontWeight: 500,
    // -0.03em at the reference size.
    letterSpacing: -3.96,
    color: "#E8E7EC",

    dividerWidth: 2,
    dividerHeight: 112,
    dividerMargin: 64,
    dividerColor: "rgba(255, 255, 255, 0.12)",

    // The date is set in mono so entries line up with each other whatever the
    // month, and read as data rather than as part of the wordmark.
    dateFontFamily: "Roboto Mono",
    dateFontSize: 88,
    dateFontWeight: 400,
    // -0.01em at the reference size.
    dateLetterSpacing: -0.88,
    dateColor: "#A8A7B0",
  },
}
