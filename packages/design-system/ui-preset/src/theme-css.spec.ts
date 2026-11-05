
import { describe, expect, it } from "vitest"

import { generateThemeCSS } from "./theme-css"

describe("generateThemeCSS", () => {
  it("generates CSS output", () => {
    const css = generateThemeCSS()

    expect(css.length).toBeGreaterThan(0)
    expect(css).toContain("@theme inline")
    expect(css).toContain("@layer base")
  })

  it("generates both dark mode selectors with dark theme values", () => {
    const css = generateThemeCSS()

    expect(css).toContain(".dark, [data-mode=\"dark\"]")
    expect(css).toContain("--fg-base: rgba(244, 244, 245, 1)")
    expect(css).toContain("--bg-component: rgba(39, 39, 42, 1)")
  })

  it("generates light theme color values", () => {
    const css = generateThemeCSS()

    expect(css).toContain(":root")
    expect(css).toContain("--tag-neutral-border: rgba(228, 228, 231, 1)")
    expect(css).toContain("--contrast-bg-base: rgba(24, 24, 27, 1)")
  })

  it("generates the transition-fg utility with transition properties", () => {
    const css = generateThemeCSS()

    expect(css).toContain("@utility transition-fg")
    expect(css).toContain("transition-property:")
    expect(css).toContain("transition-timing-function:")
    expect(css).toContain("transition-duration:")
  })
})
